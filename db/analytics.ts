import { getDbPool } from "@/db/client";
import type { ActivityLogEntry } from "@/db/types";

export type AnalyticsData = {
  totalUsers: number;
  totalClubs: number;
  totalPosts: number;
  totalMembers: number;
  clubsByMembers: {
    club_id: number;
    name: string;
    member_count: number;
    color: string | null;
    icon: string | null;
  }[];
  clubsByPosts: {
    club_id: number;
    name: string;
    post_count: number;
    color: string | null;
    icon: string | null;
  }[];
  joinRequestStats: {
    pending: number;
    approved: number;
    rejected: number;
    waitlisted: number;
  };
  clubCreationStats: { pending: number; approved: number; rejected: number };
  recentActivity: ActivityLogEntry[];
};

export async function getAnalytics(): Promise<AnalyticsData> {
  const pool = getDbPool();

  const [
    countsResult,
    byMembersResult,
    byPostsResult,
    joinStatsResult,
    ccrStatsResult,
    activityResult,
  ] = await Promise.all([
    pool.query(`
      SELECT
        (SELECT COUNT(*) FROM "user") AS total_users,
        (SELECT COUNT(*) FROM "club" WHERE status = 'active') AS total_clubs,
        (SELECT COUNT(*) FROM "post" WHERE is_deleted = FALSE) AS total_posts,
        (SELECT COUNT(*) FROM membership) AS total_members
    `),
    pool.query(`
      SELECT c.club_id, c.name, c.main_color AS color, c.icon_name AS icon,
             COUNT(m.membership_id) AS member_count
      FROM "club" c
      LEFT JOIN membership m ON m.club_id = c.club_id
      WHERE c.status = 'active'
      GROUP BY c.club_id, c.name, c.main_color, c.icon_name
      ORDER BY member_count DESC
      LIMIT 10
    `),
    pool.query(`
            SELECT c.club_id, c.name, c.main_color AS color, c.icon_name AS icon,
              COUNT(p.post_id) AS post_count
            FROM "club" c
            LEFT JOIN "post" p ON p.club_id = c.club_id AND p.is_deleted = FALSE
            WHERE c.status = 'active'
      GROUP BY c.club_id, c.name, c.main_color, c.icon_name
      ORDER BY post_count DESC
      LIMIT 10
    `),
    pool.query(`
      SELECT
        COUNT(*) FILTER (WHERE status = 'pending')    AS pending,
        COUNT(*) FILTER (WHERE status = 'approved')   AS approved,
        COUNT(*) FILTER (WHERE status = 'rejected')   AS rejected,
        COUNT(*) FILTER (WHERE status = 'waitlisted') AS waitlisted
      FROM "joinrequest"
    `),
    pool.query(`
      SELECT
        COUNT(*) FILTER (WHERE status = 'pending')  AS pending,
        COUNT(*) FILTER (WHERE status = 'approved') AS approved,
        COUNT(*) FILTER (WHERE status = 'rejected') AS rejected
      FROM "club_creation_request"
    `),
    pool.query(`
      SELECT 0 AS log_id, NULL::text AS actor_name, NULL::text AS club_name, NULL::text AS action, NULL::text AS detail, NOW() AS created_at
      WHERE false
    `),
  ]);

  const counts = countsResult.rows[0];
  const joinStats = joinStatsResult.rows[0];
  const ccrStats = ccrStatsResult.rows[0];

  return {
    totalUsers: Number(counts.total_users),
    totalClubs: Number(counts.total_clubs),
    totalPosts: Number(counts.total_posts),
    totalMembers: Number(counts.total_members),
    clubsByMembers: byMembersResult.rows.map((r) => ({
      club_id: r.club_id,
      name: r.name,
      member_count: Number(r.member_count),
      color: r.color,
      icon: r.icon,
    })),
    clubsByPosts: byPostsResult.rows.map((r) => ({
      club_id: r.club_id,
      name: r.name,
      post_count: Number(r.post_count),
      color: r.color,
      icon: r.icon,
    })),
    joinRequestStats: {
      pending: Number(joinStats.pending),
      approved: Number(joinStats.approved),
      rejected: Number(joinStats.rejected),
      waitlisted: Number(joinStats.waitlisted),
    },
    clubCreationStats: {
      pending: Number(ccrStats.pending),
      approved: Number(ccrStats.approved),
      rejected: Number(ccrStats.rejected),
    },
    recentActivity: activityResult.rows,
  };
}
