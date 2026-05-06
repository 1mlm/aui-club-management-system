import { getAnalytics } from "@/db/analytics";
import { ICON_MAP } from "@/lib/icon-map";
import { Icon } from "@/shadcn/cpns/Icon";
import { AnalyticsClient } from "./AnalyticsClient";

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

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-xl font-semibold">Analytics</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Platform-wide statistics and activity log.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Users" value={data.totalUsers} icon={<Icon icon={ICON_MAP.nav.users} className="size-4" />} />
        <StatCard label="Active Clubs" value={data.totalClubs} icon={<Icon icon={ICON_MAP.nav.clubs} className="size-4" />} />
        <StatCard label="Posts" value={data.totalPosts} icon={<Icon icon={ICON_MAP.nav.queries} className="size-4" />} />
        <StatCard label="Memberships" value={data.totalMembers} icon={<Icon icon={ICON_MAP.nav.joinRequests} className="size-4" />} />
      </div>

      <AnalyticsClient data={data} />
    </div>
  );
}
