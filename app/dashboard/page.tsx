import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getUserById } from "@/db/auth";
import { AUTH_COOKIE_NAME } from "@/db/auth-cookie";
import { getMyClubs, getRecentFeed, getMyJoinRequests } from "@/db/queries";
import { ALLOWED_ICON_MAP } from "@/db/catalog";
import { Icon } from "@/shadcn/cpns/Icon";
import { ICON_MAP } from "@/lib/icon-map";
import { getClubColorStyles } from "@/util/clubStyles";
import type { ReactNode } from "react";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const rawUserId = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  const userId = rawUserId ? Number(rawUserId) : Number.NaN;

  if (!Number.isFinite(userId)) redirect("/auth");

  const currentUser = await getUserById(userId);
  if (!currentUser) redirect("/auth");

  const [myClubs, feed, myRequests] = await Promise.all([
    getMyClubs(userId),
    getRecentFeed(userId, 10),
    getMyJoinRequests(userId),
  ]);

  const pendingRequests = myRequests.filter((r) => r.status === "pending");

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {currentUser.displayName.split(" ")[0]}</h1>
        <p className="text-muted-foreground mt-1">
          {myClubs.length === 0
            ? "You haven't joined any clubs yet."
            : `You're in ${myClubs.length} ${myClubs.length === 1 ? "club" : "clubs"}.`}
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="My Clubs" value={myClubs.length} icon={<Icon icon={ICON_MAP.nav.clubs} className="size-5" />} />
        <StatCard label="Announcements" value={feed.length} icon={<Icon icon={ICON_MAP.misc.feed} className="size-5" />} />
        <StatCard label="Pending" value={pendingRequests.length} icon={<Icon icon={ICON_MAP.status.pending} className="size-5" />} />
        <StatCard
          label="Role"
          value={
            myClubs.some((c) => c.role === "owner")
              ? "Owner"
              : myClubs.some((c) => c.role === "board_member")
                ? "Board"
                : myClubs.length > 0
                  ? "Member"
                  : "—"
          }
          icon={<Icon icon={ICON_MAP.user.profile} className="size-5" />}
        />
      </div>

      {/* My Clubs */}
      {myClubs.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Icon icon={ICON_MAP.nav.clubs} className="size-5" /> My Clubs
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {myClubs.map((club) => {
              const colorStyles = getClubColorStyles(club.color ?? undefined);
              const icon = club.icon ? ALLOWED_ICON_MAP[club.icon] : ALLOWED_ICON_MAP.KNOWLEDGE;
              return (
                <Link
                  key={club.id}
                  href={`/clubs/${club.id}`}
                  className="flex items-center gap-3 p-4 rounded-xl border transition-all hover:-translate-y-0.5 hover:shadow-md"
                  style={{ borderColor: colorStyles.border, backgroundColor: colorStyles.bg }}
                >
                  <div
                    className="size-10 rounded-full border-2 flex items-center justify-center shrink-0"
                    style={{ borderColor: colorStyles.border }}
                  >
                    <Icon icon={icon} className="size-5" style={{ color: colorStyles.text }} strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{club.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {club.role === "board_member" ? "Board Member" : club.role}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Recent Feed */}
      {feed.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Icon icon={ICON_MAP.misc.feed} className="size-5" /> Recent Announcements
          </h2>
          <div className="space-y-3">
            {feed.map((post) => {
              const colorStyles = getClubColorStyles(post.club_color ?? undefined);
              const icon = post.club_icon ? ALLOWED_ICON_MAP[post.club_icon] : ALLOWED_ICON_MAP.KNOWLEDGE;
              return (
                <Link
                  key={post.id}
                  href={`/clubs/${post.club_id}`}
                  className="block rounded-xl border p-4 bg-card hover:bg-accent transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="size-8 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5"
                      style={{ borderColor: colorStyles.border, backgroundColor: colorStyles.bg }}
                    >
                      <Icon icon={icon} className="size-4" style={{ color: colorStyles.text }} strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <span className="text-xs font-medium text-muted-foreground">{post.club_name}</span>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(post.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="font-medium truncate">{post.title}</p>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">{post.content}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Pending Join Requests */}
      {pendingRequests.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Icon icon={ICON_MAP.status.pending} className="size-5" /> Pending Join Requests
          </h2>
          <div className="space-y-2">
            {pendingRequests.map((req) => (
              <div key={req.id} className="flex items-center justify-between rounded-xl border p-4 bg-card">
                <div>
                  <p className="font-medium">{req.club_name}</p>
                  <p className="text-xs text-muted-foreground">{new Date(req.created_at).toLocaleDateString()}</p>
                </div>
                <span className="text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-2 py-1 rounded-full font-medium">
                  Pending
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {myClubs.length === 0 && feed.length === 0 && (
        <div className="rounded-2xl border border-dashed p-16 flex flex-col items-center justify-center text-center">
          <Icon icon={ICON_MAP.nav.browse} className="size-12 text-muted-foreground/30 mb-4" />
          <p className="text-lg font-medium text-muted-foreground">No clubs yet</p>
          <p className="text-sm text-muted-foreground/60 mt-1 mb-4">Browse clubs and request to join one.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Icon icon={ICON_MAP.nav.browse} className="size-4" /> Browse Clubs
          </Link>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string | number; icon: ReactNode }) {
  return (
    <div className="rounded-xl border p-4 bg-card flex flex-col gap-2">
      <div className="flex items-center gap-2 text-muted-foreground text-sm">
        {icon}
        <span>{label}</span>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
