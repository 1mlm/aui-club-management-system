import { getDbPool } from "@/db/client";

export async function updateClubInfo(clubId: number, data: { name?: string, description?: string, main_color?: string, icon_name?: string }) {
  const pool = getDbPool();
  const setClauses: string[] = [];
  const values: any[] = [];
  let index = 1;

  if (data.name !== undefined) {
    setClauses.push(`name = $${index++}`);
    values.push(data.name);
  }
  if (data.description !== undefined) {
    setClauses.push(`description = $${index++}`);
    values.push(data.description);
  }
  if (data.main_color !== undefined) {
    setClauses.push(`main_color = $${index++}`);
    values.push(data.main_color);
  }
  if (data.icon_name !== undefined) {
    setClauses.push(`icon_name = $${index++}`);
    values.push(data.icon_name);
  }

  if (setClauses.length === 0) return;

  values.push(clubId);
  const query = `UPDATE club SET ${setClauses.join(", ")} WHERE club_id = $${index}`;
  await pool.query(query, values);
}

export async function updateClubMemberStatus(clubId: number, userId: number, status: string) {
  const pool = getDbPool();
  await pool.query(
    "UPDATE membership SET membership_status = $1 WHERE club_id = $2 AND user_id = $3",
    [status, clubId, userId]
  );
}

export async function updateClubMemberRole(clubId: number, userId: number, role: string) {
  const pool = getDbPool();
  await pool.query(
    "UPDATE membership SET membership_role = $1 WHERE club_id = $2 AND user_id = $3",
    [role, clubId, userId]
  );
}

export async function createJoinRequest(userId: number, clubId: number, message?: string): Promise<void> {
  const pool = getDbPool();
  // Check if a pending request already exists to avoid duplicates
  const existing = await pool.query(
    `SELECT request_id FROM joinrequest WHERE initiator_user_id = $1 AND target_club_id = $2 AND status = 'pending' LIMIT 1`,
    [userId, clubId]
  );
  if (existing.rows.length > 0) throw new Error("You already have a pending request for this club.");
  await pool.query(
    `INSERT INTO joinrequest (initiator_user_id, target_club_id, request_type, status, message)
     VALUES ($1, $2, 'join', 'pending', $3)`,
    [userId, clubId, message ?? null]
  );
}
