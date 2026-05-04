import { getDbPool } from "@/db/client";
import type { ClubQueryRow, ClubRecord } from "@/db/types";
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
