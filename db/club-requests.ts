import { getDbPool } from "@/db/client";

export type ClubCreationRequest = {
  id: number;
  initiatorUserId: number;
  initiatorEmail: string;
  initiatorName: string;
  name: string;
  description: string | null;
  color: string | null;
  icon: string | null;
  email: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
};

export async function getAllClubCreationRequests(): Promise<
  ClubCreationRequest[]
> {
  const pool = getDbPool();
  const result = await pool.query<{
    request_id: number;
    initiator_user_id: number;
    initiator_email: string;
    initiator_name: string;
    name: string;
    description: string | null;
    main_color: string | null;
    icon_name: string | null;
    email: string;
    status: string;
    created_at: string;
  }>(`
    SELECT
      r.request_id,
      r.initiator_user_id,
      u.email AS initiator_email,
      u.display_name AS initiator_name,
      r.name,
      r.description,
      r.main_color,
      r.icon_name,
      r.email,
      r.status,
      r.created_at
    FROM "club_creation_request" r
    JOIN "user" u ON u.user_id = r.initiator_user_id
    ORDER BY r.created_at DESC;
  `);

  return result.rows.map((row) => ({
    id: row.request_id,
    initiatorUserId: row.initiator_user_id,
    initiatorEmail: row.initiator_email,
    initiatorName: row.initiator_name,
    name: row.name,
    description: row.description,
    color: row.main_color,
    icon: row.icon_name,
    email: row.email,
    status: row.status as "pending" | "approved" | "rejected",
    // reviewerMessage removed from schema
    createdAt: row.created_at,
  }));
}

export async function submitClubCreationRequest(data: {
  userId: number;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  email: string;
}): Promise<void> {
  const pool = getDbPool();

  const existing = await pool.query(
    `SELECT request_id FROM "club_creation_request"
     WHERE initiator_user_id = $1 AND LOWER(name) = LOWER($2) AND status = 'pending' LIMIT 1`,
    [data.userId, data.name],
  );
  if (existing.rows.length > 0) {
    throw new Error(
      "You already have a pending request for a club with this name.",
    );
  }

  const idRes = await pool.query<{ next_id: number }>(
    `SELECT COALESCE(MAX(request_id),0)+1 AS next_id FROM "club_creation_request";`,
  );
  const newReqId = idRes.rows[0].next_id;
  await pool.query(
    `INSERT INTO "club_creation_request" (request_id, initiator_user_id, name, description, main_color, icon_name, email)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      newReqId,
      data.userId,
      data.name.trim(),
      data.description?.trim() || null,
      data.color || null,
      data.icon || null,
      data.email.trim().toLowerCase(),
    ],
  );
}

export async function approveClubCreationRequest(
  requestId: number,
  reviewerId: number,
): Promise<void> {
  const pool = getDbPool();

  const result = await pool.query<{
    initiator_user_id: number;
    name: string;
    description: string | null;
    main_color: string | null;
    icon_name: string | null;
    email: string;
  }>(
    `SELECT initiator_user_id, name, description, main_color, icon_name, email
     FROM "club_creation_request" WHERE request_id = $1 AND status = 'pending'`,
    [requestId],
  );

  const req = result.rows[0];
  if (!req) throw new Error("Request not found or already reviewed.");

  const clubIdRes = await pool.query<{ next_id: number }>(
    `SELECT COALESCE(MAX(club_id),0)+1 AS next_id FROM "club";`,
  );
  const newClubId = clubIdRes.rows[0].next_id;
  await pool.query(
    `INSERT INTO "club" (club_id, owner_id, name, description, main_color, icon_name, email, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, 'active')`,
    [
      newClubId,
      req.initiator_user_id,
      req.name,
      req.description,
      req.main_color,
      req.icon_name,
      req.email,
    ],
  );

  await pool.query(
    `UPDATE "club_creation_request"
     SET status = 'approved', reviewed_at = NOW()
     WHERE request_id = $1`,
    [requestId],
  );
}

export async function rejectClubCreationRequest(
  requestId: number,
  reviewerId: number,
  reviewerMessage?: string,
): Promise<void> {
  const pool = getDbPool();
  await pool.query(
    `UPDATE "club_creation_request"
     SET status = 'rejected', reviewed_at = NOW()
     WHERE request_id = $1`,
    [requestId],
  );
}

export async function getUserClubCreationRequests(
  userId: number,
): Promise<ClubCreationRequest[]> {
  const pool = getDbPool();
  const result = await pool.query<{
    request_id: number;
    initiator_user_id: number;
    initiator_email: string;
    initiator_name: string;
    name: string;
    description: string | null;
    main_color: string | null;
    icon_name: string | null;
    email: string;
    status: string;
    created_at: string;
  }>(
    `
    SELECT
      r.request_id,
      r.initiator_user_id,
      u.email AS initiator_email,
      u.display_name AS initiator_name,
      r.name,
      r.description,
      r.main_color,
      r.icon_name,
      r.email,
      r.status,
      r.created_at
    FROM "club_creation_request" r
    JOIN "user" u ON u.user_id = r.initiator_user_id
    WHERE r.initiator_user_id = $1
    ORDER BY r.created_at DESC;
  `,
    [userId],
  );

  return result.rows.map((row) => ({
    id: row.request_id,
    initiatorUserId: row.initiator_user_id,
    initiatorEmail: row.initiator_email,
    initiatorName: row.initiator_name,
    name: row.name,
    description: row.description,
    color: row.main_color,
    icon: row.icon_name,
    email: row.email,
    status: row.status as "pending" | "approved" | "rejected",
    // reviewerMessage removed from schema
    createdAt: row.created_at,
  }));
}
