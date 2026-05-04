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
