import type { AdminClub, AdminJoinRequest, AdminUser } from "@/db/admin-types";
import { getDbPool } from "@/db/client";

export type { AdminClub, AdminJoinRequest, AdminUser } from "@/db/admin-types";

export async function getAllUsers(): Promise<AdminUser[]> {
  const pool = getDbPool();
  const result = await pool.query<{
    user_id: number;
    email: string;
    display_name: string;
    is_system_admin: boolean;
    created_at: string;
  }>(
    `
    SELECT
      u.user_id,
      u.email,
      u.display_name,
      u.is_system_admin,
      u.created_at
    FROM users u
    ORDER BY u.created_at DESC;
  `,
  );

  return result.rows.map((row) => ({
    id: row.user_id,
    email: row.email,
    displayName: row.display_name,
    isSystemAdmin: row.is_system_admin,
    createdAt: row.created_at,
  }));
}

export async function getAllClubs(): Promise<AdminClub[]> {
  const pool = getDbPool();
  const result = await pool.query<{
    club_id: number;
    name: string;
    owner_email: string;
    status: string;
    created_at: string;
  }>(
    `
    SELECT
      c.club_id,
      c.name,
      u.email AS owner_email,
      c.status,
      c.created_at
    FROM club c
    INNER JOIN users u ON u.user_id = c.owner_id
    ORDER BY c.created_at DESC;
  `,
  );

  return result.rows.map((row) => ({
    id: row.club_id,
    name: row.name,
    ownerEmail: row.owner_email,
    status: row.status,
    createdAt: row.created_at,
  }));
}

export async function getAllJoinRequests(): Promise<AdminJoinRequest[]> {
  const pool = getDbPool();
  const result = await pool.query<{
    request_id: number;
    user_email: string;
    club_name: string;
    status: string;
    created_at: string;
  }>(
    `
    SELECT
      jr.request_id,
      u.email AS user_email,
      c.name AS club_name,
      jr.status,
      jr.created_at
    FROM joinrequest jr
    INNER JOIN users u ON u.user_id = jr.initiator_user_id
    INNER JOIN club c ON c.club_id = jr.target_club_id
    ORDER BY jr.created_at DESC;
  `,
  );

  return result.rows.map((row) => ({
    id: row.request_id,
    userEmail: row.user_email,
    clubName: row.club_name,
    status: row.status,
    createdAt: row.created_at,
  }));
}

export async function updateUserAdminStatus(
  userId: number,
  isAdmin: boolean,
): Promise<void> {
  const pool = getDbPool();
  await pool.query(
    `UPDATE users SET is_system_admin = $1 WHERE user_id = $2;`,
    [isAdmin, userId],
  );
}

export async function updateUserDisplayName(
  userId: number,
  displayName: string,
): Promise<void> {
  const pool = getDbPool();
  const displayNameParts = displayName.split(/\s+/);
  const fname = displayNameParts
    .slice(0, Math.max(displayNameParts.length - 1, 1))
    .join(" ");
  const lname =
    displayNameParts.length > 1
      ? (displayNameParts.at(-1) ?? displayName)
      : displayName;

  await pool.query(
    `UPDATE users SET display_name = $1, fname = $2, lname = $3 WHERE user_id = $4;`,
    [displayName, fname, lname, userId],
  );
}

export async function deleteUser(userId: number): Promise<void> {
  const pool = getDbPool();
  // Hard delete: remove all dependent records first
  await pool.query(`DELETE FROM membership WHERE user_id = $1;`, [userId]);
  await pool.query(`DELETE FROM post WHERE user_id = $1;`, [userId]);
  await pool.query(`DELETE FROM joinrequest WHERE initiator_user_id = $1;`, [
    userId,
  ]);
  await pool.query(`DELETE FROM joinrequest WHERE reviewer_user_id = $1;`, [
    userId,
  ]);
  await pool.query(`DELETE FROM users WHERE user_id = $1;`, [userId]);
}

export async function updateClubStatus(
  clubId: number,
  status: string,
): Promise<void> {
  const pool = getDbPool();
  await pool.query(`UPDATE club SET status = $1 WHERE club_id = $2;`, [
    status,
    clubId,
  ]);
}

export async function approveJoinRequest(requestId: number): Promise<void> {
  const pool = getDbPool();
  const result = await pool.query<{
    initiator_user_id: number;
    target_club_id: number;
  }>(
    `SELECT initiator_user_id, target_club_id FROM joinrequest WHERE request_id = $1;`,
    [requestId],
  );

  const row = result.rows[0];
  if (!row) return;

  // Update request status
  await pool.query(
    `UPDATE joinrequest SET status = 'approved', reviewed_at = NOW() WHERE request_id = $1;`,
    [requestId],
  );

  // Add membership if not exists
  await pool.query(
    `
    INSERT INTO membership (user_id, club_id, membership_status, membership_role)
    VALUES ($1, $2, 'active', 'member')
    ON CONFLICT (user_id, club_id) DO UPDATE SET membership_status = 'active';
  `,
    [row.initiator_user_id, row.target_club_id],
  );
}

export async function rejectJoinRequest(requestId: number): Promise<void> {
  const pool = getDbPool();
  await pool.query(
    `UPDATE joinrequest SET status = 'rejected', reviewed_at = NOW() WHERE request_id = $1;`,
    [requestId],
  );
}
