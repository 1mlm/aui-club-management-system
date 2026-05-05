import { notFound } from "next/navigation";
import { getClubById, getClubMembers, getClubPosts, getClubJoinRequests, getUserJoinRequestForClub } from "@/db/queries";
import { ALLOWED_ICON_MAP } from "@/db/catalog";
import { Icon } from "@/shadcn/cpns/Icon";
import { ICON_MAP } from "@/lib/icon-map";
import { getClubColorStyles } from "@/util/clubStyles";
import { ClubMembersClient } from "./ClubMembersClient";
import { EditClubClient } from "./EditClubClient";
import { CreatePostClient } from "./CreatePostClient";
import { JoinClubClient } from "./JoinClubClient";
import { ClubJoinRequestsClient } from "./ClubJoinRequestsClient";
import { cookies } from "next/headers";
import { getUserById } from "@/db/auth";
import { AUTH_COOKIE_NAME } from "@/db/auth-cookie";

export default async function ClubDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const p = await params;
  const clubId = parseInt(p.id, 10);
  if (isNaN(clubId)) return notFound();

  const club = await getClubById(clubId);
  if (!club) return notFound();

  const cookieStore = await cookies();
  const rawUserId = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  const userId = rawUserId ? Number(rawUserId) : Number.NaN;
  const currentUser = Number.isFinite(userId) ? await getUserById(userId) : null;

  const [members, posts] = await Promise.all([
    getClubMembers(clubId),
    getClubPosts(clubId),
  ]);

  let role = "none";
  if (currentUser) {
    if (currentUser.id === club.owner_id || currentUser.isSystemAdmin) {
      role = "owner";
    } else {
      const membership = members.find((m) => m.user_id === currentUser.id);
      if (membership) {
        role = membership.membership_role;
      }
    }
  }

  const canManage = role === "owner" || role === "board_member";

  const [pendingRequests, joinRequestStatus] = await Promise.all([
    canManage ? getClubJoinRequests(clubId) : Promise.resolve([]),
    currentUser && role === "none" ? getUserJoinRequestForClub(currentUser.id, clubId) : Promise.resolve(null),
  ]);

  const colorStyles = getClubColorStyles(club.color ?? undefined);
  const icon = club.icon ? ALLOWED_ICON_MAP[club.icon] : ALLOWED_ICON_MAP.KNOWLEDGE;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Club Header */}
      <div
        className="flex flex-col md:flex-row items-center md:items-start gap-6 p-6 rounded-2xl border"
        style={{ backgroundColor: colorStyles.bg, borderColor: colorStyles.border }}
      >
        <div
          className="size-24 rounded-full border-4 flex items-center justify-center shrink-0"
          style={{ backgroundColor: colorStyles.bg, borderColor: colorStyles.border, boxShadow: `0 0 20px ${colorStyles.shadow}` }}
        >
          <Icon icon={icon} className="size-10" style={{ color: colorStyles.text }} strokeWidth={1.5} />
        </div>

        <div className="flex-1 text-center md:text-left flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{club.name}</h1>
            <p className="mt-2 text-muted-foreground max-w-2xl">{club.description || "No description provided."}</p>
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground justify-center md:justify-start">
              <Icon icon={ICON_MAP.nav.users} className="size-4" />
              <span>{members.filter((m) => m.membership_status === "active").length} members</span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap justify-center md:justify-end">
            {currentUser && (
              <JoinClubClient
                clubId={club.id}
                userId={currentUser.id}
                currentRole={role}
                joinRequestStatus={joinRequestStatus?.status ?? null}
              />
            )}
            <EditClubClient club={club} canManage={canManage} />
          </div>
        </div>
      </div>

      {/* Pending Join Requests (board/owner only) */}
      {canManage && pendingRequests.length > 0 && (
        <ClubJoinRequestsClient initialRequests={pendingRequests} />
      )}

      {/* Members */}
      <div className="pt-2">
        <ClubMembersClient initialMembers={members} clubId={club.id} currentUserRole={role} />
      </div>

      {/* Announcements */}
      <div className="pt-8 border-t mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground/80 flex items-center gap-2">
            <Icon icon={ALLOWED_ICON_MAP.KNOWLEDGE} className="size-5" /> Announcements
          </h2>
          {canManage && currentUser && (
            <CreatePostClient clubId={club.id} userId={currentUser.id} />
          )}
        </div>

        {posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="rounded-xl border p-6 bg-card">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold">{post.title}</h3>
                  <span className="text-sm text-muted-foreground whitespace-nowrap ml-4">
                    {new Date(post.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-muted-foreground mb-3">{post.content}</p>
                <div className="text-sm text-muted-foreground">
                  Posted by {post.author_display_name}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed p-10 flex flex-col items-center justify-center text-center">
            <Icon icon={ALLOWED_ICON_MAP.KNOWLEDGE} className="size-10 text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground/50">No announcements have been posted yet.</p>
            {canManage && <p className="text-xs text-muted-foreground/40 mt-1">Use "New Announcement" above to post one.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
