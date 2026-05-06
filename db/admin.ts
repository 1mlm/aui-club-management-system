import type { AdminClub, AdminJoinRequest, AdminUser } from "@/db/admin-types";
import { getDbPool } from "@/db/client";
import bcrypt from "bcryptjs";

const PASSWORD_SALT_ROUNDS = 12;

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
    main_color: string;
    icon_name: string;
  }>(
    `
    SELECT
      c.club_id,
      c.name,
      u.email as owner_email,
    c.status,
    c.created_at,
    c.main_color,
    c.icon_name
  FROM club c
  JOIN users u ON c.owner_id = u.user_id
  ORDER BY c.created_at DESC;
  `,
  );

  return result.rows.map((row) => ({
    id: row.club_id,
    name: row.name,
    ownerEmail: row.owner_email,
    status: row.status,
    createdAt: row.created_at,
    mainColor: row.main_color,
    iconName: row.icon_name,
  }));
}

export async function getAllJoinRequests(): Promise<AdminJoinRequest[]> {
  const pool = getDbPool();
  const result = await pool.query<{
    request_id: number;
    user_id: number;
    user_email: string;
    user_display_name: string;
    club_name: string;
    status: string;
    created_at: string;
  }>(
    `
    SELECT
      jr.request_id,
      u.user_id,
      u.email AS user_email,
      u.display_name AS user_display_name,
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
    userId: row.user_id,
    userEmail: row.user_email,
    userDisplayName: row.user_display_name,
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

export async function adminCreateUser(
  email: string,
  displayName: string,
  passwordRaw: string
): Promise<AdminUser> {
  const pool = getDbPool();
  const passwordHash = await bcrypt.hash(passwordRaw, PASSWORD_SALT_ROUNDS);
  
  const displayNameParts = displayName.split(/\s+/);
  const fname = displayNameParts.slice(0, Math.max(displayNameParts.length - 1, 1)).join(" ");
  const lname = displayNameParts.length > 1 ? (displayNameParts.at(-1) ?? displayName) : displayName;

  const result = await pool.query<{ user_id: number; created_at: string }>(
    `
    INSERT INTO users (email, fname, lname, display_name, password_hash, is_system_admin, created_at)
    VALUES ($1, $2, $3, $4, $5, FALSE, NOW())
    RETURNING user_id, created_at;
    `,
    [email, fname, lname, displayName, passwordHash]
  );
  
  const row = result.rows[0];
  if (!row) throw new Error("Failed to create user");

  return {
    id: row.user_id,
    email,
    displayName,
    isSystemAdmin: false,
    createdAt: row.created_at,
  };
}

export async function adminCreateClub(
  name: string,
  ownerEmail: string,
  description: string,
  mainColor: string,
  iconName: string
): Promise<AdminClub> {
  const pool = getDbPool();
  
  const userResult = await pool.query<{ user_id: number }>(
    `SELECT user_id FROM users WHERE email = $1`, [ownerEmail]
  );
  const userRow = userResult.rows[0];
  if (!userRow) throw new Error("User not found with email: " + ownerEmail);

  const result = await pool.query<{ club_id: number; created_at: string }>(
    `
    INSERT INTO club (owner_id, name, description, email, created_at, status, main_color, icon_name)
    VALUES ($1, $2, $3, $4, NOW(), 'active', $5, $6)
    RETURNING club_id, created_at;
    `,
    [
      userRow.user_id, 
      name, 
      description, 
      `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}@aui.ma`,
      mainColor,
      iconName
    ]
  );
  const clubRow = result.rows[0];
  if (!clubRow) throw new Error("Failed to create club");

  await pool.query(
    `
    INSERT INTO membership (user_id, club_id, membership_status, membership_role)
    VALUES ($1, $2, 'active', 'board_member')
    `,
    [userRow.user_id, clubRow.club_id]
  );

  return {
    id: clubRow.club_id,
    name,
    ownerEmail,
    status: "active",
    createdAt: clubRow.created_at,
    mainColor,
    iconName,
  };
}

export async function adminDeleteClub(clubId: number): Promise<void> {
  const pool = getDbPool();
  await pool.query(`DELETE FROM membership WHERE club_id = $1`, [clubId]);
  await pool.query(`DELETE FROM post WHERE club_id = $1`, [clubId]);
  await pool.query(`DELETE FROM joinrequest WHERE target_club_id = $1`, [clubId]);
  await pool.query(`DELETE FROM club WHERE club_id = $1`, [clubId]);
}
