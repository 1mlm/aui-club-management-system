import { getDbPool } from "@/db/client";
import type { ClubQueryRow, ClubRecord, PostQueryRow, PostRecord } from "@/db/types";
import { validateClubColor, validateClubIcon } from "@/db/validators";

const LIST_CLUBS_QUERY = `
  SELECT
    c.club_id AS id,
    c.owner_id AS owner_id,
    c.name AS name,
    c.description AS description,
    c.main_color AS color,
    c.icon_name AS icon
  FROM club c
  WHERE c.status = 'active'
  ORDER BY c.club_id ASC;
`;

const GET_CLUB_BY_ID = `
  SELECT
    c.club_id AS id,
    c.owner_id AS owner_id,
    c.name AS name,
    c.description AS description,
    c.main_color AS color,
    c.icon_name AS icon
  FROM club c
  WHERE c.club_id = $1 AND c.status = 'active';
`;

const GET_CLUB_MEMBERS = `
  SELECT
    m.membership_id,
    m.user_id,
    u.email,
    u.display_name,
    m.membership_role,
    m.membership_status,
    m.joined_at
  FROM membership m
  JOIN users u ON u.user_id = m.user_id
  WHERE m.club_id = $1
    AND m.membership_status IN ('active', 'pending', 'banned')
  ORDER BY 
    CASE WHEN m.membership_role = 'board_member' THEN 1 ELSE 2 END,
    m.joined_at ASC;
`;

const GET_CLUB_POSTS = `
  SELECT
    p.post_id AS id,
    p.club_id,
    p.user_id,
    p.title,
    p.content,
    p.created_at,
    p.updated_at,
    p.is_deleted,
    u.display_name AS author_display_name
  FROM post p
  JOIN users u ON u.user_id = p.user_id
  WHERE p.club_id = $1 AND p.is_deleted = FALSE
  ORDER BY p.created_at DESC;
`;

export async function listClubs(): Promise<ClubRecord[]> {
  const pool = getDbPool();
  const result = await pool.query<ClubQueryRow>(LIST_CLUBS_QUERY);

  return result.rows.map((row) => ({
    id: row.id,
    owner_id: row.owner_id,
    name: row.name,
    description: row.description,
    color: validateClubColor(row.color),
    icon: validateClubIcon(row.icon),
  }));
}

export async function getClubById(id: number): Promise<ClubRecord | null> {
  const pool = getDbPool();
  const result = await pool.query<ClubQueryRow>(GET_CLUB_BY_ID, [id]);

  if (result.rows.length === 0) return null;
  const row = result.rows[0];

  return {
    id: row.id,
    owner_id: row.owner_id,
    name: row.name,
    description: row.description,
    color: validateClubColor(row.color),
    icon: validateClubIcon(row.icon),
  };
}

export async function getClubMembers(clubId: number): Promise<any[]> {
  const pool = getDbPool();
  const result = await pool.query(GET_CLUB_MEMBERS, [clubId]);
  return result.rows.map(row => ({
      ...row,
      id: row.user_id
  }));
}

export async function getClubPosts(clubId: number): Promise<PostRecord[]> {
  const pool = getDbPool();
  const result = await pool.query<PostQueryRow>(GET_CLUB_POSTS, [clubId]);

  return result.rows.map((row) => ({
    id: row.id,
    club_id: row.club_id,
    user_id: row.user_id,
    title: row.title,
    content: row.content,
    created_at: row.created_at,
    updated_at: row.updated_at,
    is_deleted: row.is_deleted,
    author_display_name: row.author_display_name,
  }));
}
