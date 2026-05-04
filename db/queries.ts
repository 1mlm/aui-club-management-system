import { getDbPool } from "@/db/client";
import type { ClubQueryRow, ClubRecord } from "@/db/types";
import { validateClubColor, validateClubIcon } from "@/db/validators";

export type OwnedClub = ClubRecord & {
  memberCount: number;
  pendingRequests: number;
};

export type MemberClub = ClubRecord & {
  membershipRole: "board_member" | "member";
};

export type PendingJoinRequest = {
  id: number;
  clubId: number;
  clubName: string;
  requesterName: string;
  requesterEmail: string;
  message: string | null;
  createdAt: string;
};

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

const GET_CLUBS_BY_OWNER_ID = `
  SELECT
    c.club_id AS id,
    c.owner_id,
    c.name,
    c.description,
    c.main_color AS color,
    c.icon_name AS icon,
    COALESCE(mc.active_count, 0)::int AS member_count,
    COALESCE(rc.pending_count, 0)::int AS pending_requests
  FROM club c
  LEFT JOIN (
    SELECT club_id, COUNT(*)::int AS active_count
    FROM membership WHERE membership_status = 'active' GROUP BY club_id
  ) mc ON mc.club_id = c.club_id
  LEFT JOIN (
    SELECT target_club_id, COUNT(*)::int AS pending_count
    FROM joinrequest WHERE status = 'pending' GROUP BY target_club_id
  ) rc ON rc.target_club_id = c.club_id
  WHERE c.owner_id = $1 AND c.status = 'active'
  ORDER BY c.club_id ASC;
`;

const GET_CLUBS_BY_MEMBER_ID = `
  SELECT
    c.club_id AS id,
    c.owner_id,
    c.name,
    c.description,
    c.main_color AS color,
    c.icon_name AS icon,
    m.membership_role
  FROM membership m
  JOIN club c ON c.club_id = m.club_id
  WHERE m.user_id = $1
    AND m.membership_status = 'active'
    AND c.status = 'active'
  ORDER BY m.joined_at ASC;
`;

const GET_PENDING_REQUESTS_FOR_OWNER = `
  SELECT
    jr.request_id AS id,
    jr.target_club_id AS club_id,
    c.name AS club_name,
    u.display_name AS requester_name,
    u.email AS requester_email,
    jr.message,
    jr.created_at
  FROM joinrequest jr
  JOIN users u ON u.user_id = jr.initiator_user_id
  JOIN club c ON c.club_id = jr.target_club_id
  WHERE c.owner_id = $1
    AND jr.status = 'pending'
    AND c.status = 'active'
  ORDER BY jr.created_at ASC;
`;

const GET_USER_JOIN_REQUEST_STATUS = `
  SELECT status FROM joinrequest
  WHERE initiator_user_id = $1 AND target_club_id = $2
  ORDER BY created_at DESC
  LIMIT 1;
`;

export async function getClubsByOwnerId(userId: number): Promise<OwnedClub[]> {
  const pool = getDbPool();
  const result = await pool.query<ClubQueryRow & { member_count: number; pending_requests: number }>(
    GET_CLUBS_BY_OWNER_ID, [userId]
  );
  return result.rows.map(row => ({
    id: row.id,
    owner_id: row.owner_id,
    name: row.name,
    description: row.description,
    color: validateClubColor(row.color),
    icon: validateClubIcon(row.icon),
    memberCount: row.member_count,
    pendingRequests: row.pending_requests,
  }));
}

export async function getClubsByMemberId(userId: number): Promise<MemberClub[]> {
  const pool = getDbPool();
  const result = await pool.query<ClubQueryRow & { membership_role: string }>(
    GET_CLUBS_BY_MEMBER_ID, [userId]
  );
  return result.rows.map(row => ({
    id: row.id,
    owner_id: row.owner_id,
    name: row.name,
    description: row.description,
    color: validateClubColor(row.color),
    icon: validateClubIcon(row.icon),
    membershipRole: (row.membership_role === "board_member" ? "board_member" : "member") as "board_member" | "member",
  }));
}

export async function getPendingRequestsForOwner(userId: number): Promise<PendingJoinRequest[]> {
  const pool = getDbPool();
  const result = await pool.query<{
    id: number;
    club_id: number;
    club_name: string;
    requester_name: string;
    requester_email: string;
    message: string | null;
    created_at: string;
  }>(GET_PENDING_REQUESTS_FOR_OWNER, [userId]);
  return result.rows.map(row => ({
    id: row.id,
    clubId: row.club_id,
    clubName: row.club_name,
    requesterName: row.requester_name,
    requesterEmail: row.requester_email,
    message: row.message,
    createdAt: row.created_at,
  }));
}

export async function getUserJoinRequestStatus(userId: number, clubId: number): Promise<string | null> {
  const pool = getDbPool();
  const result = await pool.query<{ status: string }>(
    GET_USER_JOIN_REQUEST_STATUS, [userId, clubId]
  );
  return result.rows[0]?.status ?? null;
}

export async function getClubMembers(clubId: number): Promise<any[]> {
  const pool = getDbPool();
  const result = await pool.query(GET_CLUB_MEMBERS, [clubId]);
  return result.rows.map(row => ({
      ...row,
      id: row.user_id
  }));
}
