import { getAnalytics } from "@/db/analytics";
import { getClubColorStyles } from "@/util/clubStyles";
import { ALLOWED_ICON_MAP } from "@/db/catalog";
import { Icon } from "@/shadcn/cpns/Icon";
import { ICON_MAP } from "@/lib/icon-map";
import type { ClubColor, ClubIconKey } from "@/db/catalog";

export const dynamic = "force-dynamic";

function StatCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="rounded-xl border p-5 bg-card flex flex-col gap-2">
      <div className="flex items-center gap-2 text-muted-foreground text-sm">
        {icon}
        <span>{label}</span>
      </div>
      <p className="text-3xl font-bold">{value.toLocaleString()}</p>
    </div>
  );
}

export default async function AnalyticsPage() {
  const data = await getAnalytics();

  const maxMembers = Math.max(...data.clubsByMembers.map((c) => c.member_count), 1);
  const maxPosts = Math.max(...data.clubsByPosts.map((c) => c.post_count), 1);

  const totalJoin = data.joinRequestStats.pending + data.joinRequestStats.approved + data.joinRequestStats.rejected + data.joinRequestStats.waitlisted;
  const totalCcr = data.clubCreationStats.pending + data.clubCreationStats.approved + data.clubCreationStats.rejected;

  const ACTION_LABELS: Record<string, string> = {
    post_created: "Post created",
    post_deleted: "Post deleted",
    post_pinned: "Post pinned",
    post_unpinned: "Post unpinned",
    join_approved: "Join approved",
    join_rejected: "Join rejected",
    join_waitlisted: "Join waitlisted",
    club_created: "Club approved",
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-xl font-semibold">Analytics</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Platform-wide statistics and activity log.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Users" value={data.totalUsers} icon={<Icon icon={ICON_MAP.nav.users} className="size-4" />} />
        <StatCard label="Active Clubs" value={data.totalClubs} icon={<Icon icon={ICON_MAP.nav.clubs} className="size-4" />} />
        <StatCard label="Posts" value={data.totalPosts} icon={<Icon icon={ICON_MAP.nav.queries} className="size-4" />} />
        <StatCard label="Memberships" value={data.totalMembers} icon={<Icon icon={ICON_MAP.nav.joinRequests} className="size-4" />} />
      </div>

      {/* Top clubs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* By members */}
        <div className="rounded-xl border p-5 bg-card space-y-4">
          <h2 className="text-base font-semibold">Top Clubs by Members</h2>
          <div className="space-y-3">
            {data.clubsByMembers.map((club) => {
              const styles = getClubColorStyles((club.color as ClubColor) ?? undefined);
              const iconComp = club.icon ? ALLOWED_ICON_MAP[club.icon as ClubIconKey] : ALLOWED_ICON_MAP.KNOWLEDGE;
              const pct = Math.round((club.member_count / maxMembers) * 100);
              return (
                <div key={club.club_id} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="flex size-5 items-center justify-center rounded-full shrink-0"
                        style={{ backgroundColor: styles.bg, border: `1.5px solid ${styles.border}` }}>
                        <Icon icon={iconComp} className="size-3" style={{ color: styles.text }} strokeWidth={2} />
                      </span>
                      <span className="font-medium truncate max-w-32">{club.name}</span>
                    </div>
                    <span className="text-muted-foreground tabular-nums">{club.member_count}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: styles.text }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* By posts */}
        <div className="rounded-xl border p-5 bg-card space-y-4">
          <h2 className="text-base font-semibold">Top Clubs by Posts</h2>
          <div className="space-y-3">
            {data.clubsByPosts.map((club) => {
              const styles = getClubColorStyles((club.color as ClubColor) ?? undefined);
              const iconComp = club.icon ? ALLOWED_ICON_MAP[club.icon as ClubIconKey] : ALLOWED_ICON_MAP.KNOWLEDGE;
              const pct = Math.round((club.post_count / maxPosts) * 100);
              return (
                <div key={club.club_id} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="flex size-5 items-center justify-center rounded-full shrink-0"
                        style={{ backgroundColor: styles.bg, border: `1.5px solid ${styles.border}` }}>
                        <Icon icon={iconComp} className="size-3" style={{ color: styles.text }} strokeWidth={2} />
                      </span>
                      <span className="font-medium truncate max-w-32">{club.name}</span>
                    </div>
                    <span className="text-muted-foreground tabular-nums">{club.post_count}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: styles.text }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Request stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border p-5 bg-card space-y-3">
          <h2 className="text-base font-semibold">Join Requests ({totalJoin})</h2>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full text-sm bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 font-medium">
              {data.joinRequestStats.pending} pending
            </span>
            <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-medium">
              {data.joinRequestStats.approved} approved
            </span>
            <span className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 font-medium">
              {data.joinRequestStats.rejected} rejected
            </span>
            <span className="px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 font-medium">
              {data.joinRequestStats.waitlisted} waitlisted
            </span>
          </div>
        </div>

        <div className="rounded-xl border p-5 bg-card space-y-3">
          <h2 className="text-base font-semibold">Club Creation Requests ({totalCcr})</h2>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full text-sm bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 font-medium">
              {data.clubCreationStats.pending} pending
            </span>
            <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-medium">
              {data.clubCreationStats.approved} approved
            </span>
            <span className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 font-medium">
              {data.clubCreationStats.rejected} rejected
            </span>
          </div>
        </div>
      </div>

      {/* Activity log */}
      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="p-5 border-b">
          <h2 className="text-base font-semibold">Recent Activity</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Last 20 actions across the platform.</p>
        </div>
        {data.recentActivity.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground text-sm">
            No activity recorded yet. Actions like post creation, approvals, and rejections will appear here.
          </div>
        ) : (
          <div className="divide-y">
            {data.recentActivity.map((entry) => (
              <div key={entry.log_id} className="flex items-center justify-between px-5 py-3 text-sm hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-medium truncate">{ACTION_LABELS[entry.action] ?? entry.action}</span>
                  {entry.detail && (
                    <span className="text-muted-foreground truncate max-w-48 hidden md:block">
                      {entry.detail}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 shrink-0 text-muted-foreground ml-4">
                  {entry.club_name && (
                    <span className="hidden sm:block truncate max-w-28">{entry.club_name}</span>
                  )}
                  {entry.actor_name && (
                    <span className="hidden md:block truncate max-w-28">{entry.actor_name}</span>
                  )}
                  <span className="text-xs whitespace-nowrap">
                    {new Date(entry.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
