import { getDbPool } from "@/db/client";
import type { ClubJoinRequest, ClubQueryRow, ClubRecord, FeedPost, MyClub, MyJoinRequest, PostQueryRow, PostRecord } from "@/db/types";
import { validateClubColor, validateClubIcon } from "@/db/validators";

const LIST_CLUBS_QUERY = `
  SELECT
    c.club_id AS id,
    c.owner_id AS owner_id,
    c.name AS name,
    c.description AS description,
    c.main_color AS color,
    c.icon_name AS icon,
    COUNT(m.membership_id) FILTER (WHERE m.membership_status = 'active') AS member_count
  FROM club c
  LEFT JOIN membership m ON m.club_id = c.club_id
  WHERE c.status = 'active'
  GROUP BY c.club_id
  ORDER BY c.club_id ASC;
`;

const GET_CLUB_BY_ID = `
  SELECT
    c.club_id AS id,
    c.owner_id AS owner_id,
    c.name AS name,
    c.description AS description,
    c.main_color AS color,
    c.icon_name AS icon,
    COUNT(m.membership_id) FILTER (WHERE m.membership_status = 'active') AS member_count
  FROM club c
  LEFT JOIN membership m ON m.club_id = c.club_id
  WHERE c.club_id = $1 AND c.status = 'active'
  GROUP BY c.club_id;
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
    member_count: Number(row.member_count) || 0,
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
    member_count: Number(row.member_count) || 0,
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

const GET_MY_CLUBS = `
  SELECT
    c.club_id AS id,
    c.name,
    c.main_color AS color,
    c.icon_name AS icon,
    CASE
      WHEN c.owner_id = $1 THEN 'owner'
      WHEN m.membership_role = 'board_member' THEN 'board_member'
      ELSE 'member'
    END AS role
  FROM club c
  LEFT JOIN membership m ON m.club_id = c.club_id AND m.user_id = $1 AND m.membership_status = 'active'
  WHERE c.status = 'active'
    AND (
      c.owner_id = $1
      OR (m.membership_id IS NOT NULL)
    )
  ORDER BY role ASC, c.name ASC;
`;

const GET_RECENT_FEED = `
  SELECT
    p.post_id AS id,
    p.club_id,
    c.name AS club_name,
    c.main_color AS club_color,
    c.icon_name AS club_icon,
    p.title,
    p.content,
    p.created_at,
    u.display_name AS author_display_name
  FROM post p
  JOIN club c ON c.club_id = p.club_id
  JOIN users u ON u.user_id = p.user_id
  WHERE p.is_deleted = FALSE
    AND c.status = 'active'
    AND (
      c.owner_id = $1
      OR EXISTS (
        SELECT 1 FROM membership m
        WHERE m.club_id = p.club_id AND m.user_id = $1 AND m.membership_status = 'active'
      )
    )
  ORDER BY p.created_at DESC
  LIMIT $2;
`;

const GET_CLUB_JOIN_REQUESTS = `
  SELECT
    jr.request_id AS id,
    jr.initiator_user_id AS user_id,
    u.email AS user_email,
    u.display_name AS user_display_name,
    jr.message,
    jr.created_at,
    jr.status
  FROM joinrequest jr
  JOIN users u ON u.user_id = jr.initiator_user_id
  WHERE jr.target_club_id = $1 AND jr.status = 'pending'
  ORDER BY jr.created_at ASC;
`;

const GET_USER_JOIN_REQUEST_FOR_CLUB = `
  SELECT status FROM joinrequest
  WHERE initiator_user_id = $1 AND target_club_id = $2
  ORDER BY created_at DESC
  LIMIT 1;
`;

const GET_MY_JOIN_REQUESTS = `
  SELECT
    jr.request_id AS id,
    jr.target_club_id AS club_id,
    c.name AS club_name,
    jr.status,
    jr.created_at
  FROM joinrequest jr
  JOIN club c ON c.club_id = jr.target_club_id
  WHERE jr.initiator_user_id = $1
  ORDER BY jr.created_at DESC;
`;

export async function getMyClubs(userId: number): Promise<MyClub[]> {
  const pool = getDbPool();
  const result = await pool.query<{ id: number; name: string; color: string | null; icon: string | null; role: string }>(
    GET_MY_CLUBS,
    [userId]
  );
  return result.rows.map((row) => ({
    id: row.id,
    name: row.name,
    color: validateClubColor(row.color),
    icon: validateClubIcon(row.icon),
    role: row.role as MyClub["role"],
  }));
}

export async function getRecentFeed(userId: number, limit = 10): Promise<FeedPost[]> {
  const pool = getDbPool();
  const result = await pool.query<{
    id: number; club_id: number; club_name: string; club_color: string | null;
    club_icon: string | null; title: string; content: string;
    created_at: Date | string; author_display_name: string;
  }>(GET_RECENT_FEED, [userId, limit]);
  return result.rows.map((row) => ({
    id: row.id,
    club_id: row.club_id,
    club_name: row.club_name,
    club_color: validateClubColor(row.club_color),
    club_icon: validateClubIcon(row.club_icon),
    title: row.title,
    content: row.content,
    created_at: row.created_at,
    author_display_name: row.author_display_name,
  }));
}

export async function getClubJoinRequests(clubId: number): Promise<ClubJoinRequest[]> {
  const pool = getDbPool();
  const result = await pool.query<ClubJoinRequest>(GET_CLUB_JOIN_REQUESTS, [clubId]);
  return result.rows;
}

export async function getUserJoinRequestForClub(userId: number, clubId: number): Promise<{ status: string } | null> {
  const pool = getDbPool();
  const result = await pool.query<{ status: string }>(GET_USER_JOIN_REQUEST_FOR_CLUB, [userId, clubId]);
  return result.rows[0] ?? null;
}

export async function getMyJoinRequests(userId: number): Promise<MyJoinRequest[]> {
  const pool = getDbPool();
  const result = await pool.query<MyJoinRequest>(GET_MY_JOIN_REQUESTS, [userId]);
  return result.rows;
}
