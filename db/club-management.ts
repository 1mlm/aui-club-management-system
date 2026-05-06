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

export async function createPost(clubId: number, userId: number, title: string, content: string) {
  const pool = getDbPool();
  await pool.query(
    "INSERT INTO post (club_id, user_id, title, content) VALUES ($1, $2, $3, $4)",
    [clubId, userId, title.trim(), content.trim()]
  );
}

export async function requestJoinClub(clubId: number, userId: number, message?: string) {
  const pool = getDbPool();
  await pool.query(
    `INSERT INTO joinrequest (initiator_user_id, target_club_id, message, status)
     VALUES ($1, $2, $3, 'pending')
     ON CONFLICT DO NOTHING`,
    [userId, clubId, message ?? null]
  );
}

export async function leaveClub(clubId: number, userId: number) {
  const pool = getDbPool();
  await pool.query(
    "UPDATE membership SET membership_status = 'left', left_at = NOW() WHERE club_id = $1 AND user_id = $2",
    [clubId, userId]
  );
}

export async function approveClubJoinRequest(requestId: number) {
  const pool = getDbPool();
  const result = await pool.query<{ initiator_user_id: number; target_club_id: number }>(
    "SELECT initiator_user_id, target_club_id FROM joinrequest WHERE request_id = $1",
    [requestId]
  );
  const row = result.rows[0];
  if (!row) return;

  await pool.query(
    "UPDATE joinrequest SET status = 'approved', reviewed_at = NOW() WHERE request_id = $1",
    [requestId]
  );
  await pool.query(
    `INSERT INTO membership (user_id, club_id, membership_status, membership_role)
     VALUES ($1, $2, 'active', 'member')
     ON CONFLICT (user_id, club_id) DO UPDATE SET membership_status = 'active', left_at = NULL`,
    [row.initiator_user_id, row.target_club_id]
  );
}

export async function rejectClubJoinRequest(requestId: number) {
  const pool = getDbPool();
  await pool.query(
    "UPDATE joinrequest SET status = 'rejected', reviewed_at = NOW() WHERE request_id = $1",
    [requestId]
  );
}

export async function waitlistJoinRequest(requestId: number) {
  const pool = getDbPool();
  await pool.query(
    "UPDATE joinrequest SET status = 'waitlisted', reviewed_at = NOW() WHERE request_id = $1",
    [requestId]
  );
}

export async function promoteFromWaitlist(requestId: number) {
  const pool = getDbPool();
  const result = await pool.query<{ initiator_user_id: number; target_club_id: number }>(
    "SELECT initiator_user_id, target_club_id FROM joinrequest WHERE request_id = $1",
    [requestId]
  );
  const row = result.rows[0];
  if (!row) return;
  await pool.query(
    "UPDATE joinrequest SET status = 'approved', reviewed_at = NOW() WHERE request_id = $1",
    [requestId]
  );
  await pool.query(
    `INSERT INTO membership (user_id, club_id, membership_status, membership_role)
     VALUES ($1, $2, 'active', 'member')
     ON CONFLICT (user_id, club_id) DO UPDATE SET membership_status = 'active', left_at = NULL`,
    [row.initiator_user_id, row.target_club_id]
  );
}

export async function deletePost(postId: number): Promise<void> {
  const pool = getDbPool();
  await pool.query("UPDATE post SET is_deleted = TRUE WHERE post_id = $1", [postId]);
  try {
    await pool.query(
      "INSERT INTO activity_log (action, detail) VALUES ('post_deleted', $1)",
      [String(postId)]
    );
  } catch {}
}

export async function editPost(postId: number, title: string, content: string): Promise<void> {
  const pool = getDbPool();
  await pool.query(
    "UPDATE post SET title = $1, content = $2, updated_at = NOW() WHERE post_id = $3",
    [title.trim(), content.trim(), postId]
  );
}

export async function togglePinPost(postId: number, pin: boolean): Promise<void> {
  const pool = getDbPool();
  await pool.query("UPDATE post SET is_pinned = $1 WHERE post_id = $2", [pin, postId]);
  try {
    await pool.query(
      "INSERT INTO activity_log (action, detail) VALUES ($1, $2)",
      [pin ? 'post_pinned' : 'post_unpinned', String(postId)]
    );
  } catch {}
}

export async function togglePostLike(postId: number, userId: number): Promise<{ liked: boolean; count: number }> {
  const pool = getDbPool();
  const existing = await pool.query(
    "SELECT like_id FROM post_like WHERE post_id = $1 AND user_id = $2",
    [postId, userId]
  );
  let liked: boolean;
  if (existing.rows.length > 0) {
    await pool.query("DELETE FROM post_like WHERE post_id = $1 AND user_id = $2", [postId, userId]);
    await pool.query("UPDATE post SET like_count = GREATEST(0, like_count - 1) WHERE post_id = $1", [postId]);
    liked = false;
  } else {
    await pool.query("INSERT INTO post_like (post_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING", [postId, userId]);
    await pool.query("UPDATE post SET like_count = like_count + 1 WHERE post_id = $1", [postId]);
    liked = true;
  }
  const countResult = await pool.query<{ like_count: number }>(
    "SELECT like_count FROM post WHERE post_id = $1",
    [postId]
  );
  return { liked, count: Number(countResult.rows[0]?.like_count ?? 0) };
}
