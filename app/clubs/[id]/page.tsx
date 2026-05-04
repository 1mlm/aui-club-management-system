import { notFound } from "next/navigation";
import { getClubById, getClubMembers } from "@/db/queries";
import { ALLOWED_ICON_MAP } from "@/db/catalog";
import { Icon } from "@/shadcn/cpns/Icon";
import { getClubColorStyles } from "@/util/clubStyles";
import { ClubMembersClient } from "./ClubMembersClient";
import { EditClubClient } from "./EditClubClient";
import { cookies } from "next/headers";
import { getUserById } from "@/db/auth";
import { AUTH_COOKIE_NAME } from "@/db/auth-cookie";

export default async function ClubDetailsPage({ params }: { params: { id: string } }) {
  const clubId = parseInt(params.id, 10);
  if (isNaN(clubId)) return notFound();

  const club = await getClubById(clubId);
  if (!club) return notFound();

  const members = await getClubMembers(clubId);
  
  const cookieStore = await cookies();
  const rawUserId = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  const userId = rawUserId ? Number(rawUserId) : Number.NaN;
  const currentUser = Number.isFinite(userId) ? await getUserById(userId) : null;
  
  let role = "none";
  if (currentUser) {
      if (currentUser.id === club.owner_id || currentUser.isSystemAdmin) {
          role = "owner";
      } else {
          const membership = members.find(m => m.user_id === currentUser.id);
          if (membership) {
               role = membership.membership_role; // 'board_member' or 'member'
          }
      }
  }

  const colorStyles = getClubColorStyles(club.color ?? undefined);
  const icon = club.icon ? ALLOWED_ICON_MAP[club.icon] : ALLOWED_ICON_MAP.KNOWLEDGE;

  return (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row items-center md:items-start gap-6 p-6 rounded-2xl border" style={{
           backgroundColor: colorStyles.bg,
           borderColor: colorStyles.border
       }}>
           <div className="size-24 rounded-full border-4 flex items-center justify-center shrink-0"
             style={{ backgroundColor: colorStyles.bg, borderColor: colorStyles.border, boxShadow: `0 0 20px ${colorStyles.shadow}` }}
           >
               <Icon icon={icon} className="size-10" style={{ color: colorStyles.text }} strokeWidth={1.5} />
           </div>
           
           <div className="flex-1 text-center md:text-left flex flex-col md:flex-row md:items-center justify-between gap-4">
               <div>
                 <h1 className="text-3xl font-bold">{club.name}</h1>
                 <p className="mt-2 text-muted-foreground max-w-2xl">{club.description || "No description provided."}</p>
               </div>
               <EditClubClient club={club} canManage={role === 'owner' || role === 'board_member'} />
           </div>
       </div>

       <div className="pt-4">
           <ClubMembersClient initialMembers={members} clubId={club.id} currentUserRole={role} />
       </div>

       <div className="pt-8 border-t mt-8">
           <h2 className="text-xl font-semibold mb-4 text-foreground/80 flex items-center gap-2">
             <Icon icon={ALLOWED_ICON_MAP.KNOWLEDGE} className="size-5" /> Recent Announcements
           </h2>
           <div className="rounded-xl border border-dashed p-10 flex flex-col items-center justify-center text-center">
               <p className="text-muted-foreground/50">No announcements have been posted yet.</p>
           </div>
       </div>
    </div>
  )
}
