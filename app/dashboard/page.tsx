import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/db/auth-cookie";
import { getUserById } from "@/db/auth";
import { getClubsByOwnerId, getClubsByMemberId, getPendingRequestsForOwner } from "@/db/queries";
import { DashboardClient } from "./DashboardClient";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const rawUserId = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  const userId = rawUserId ? Number(rawUserId) : NaN;

  if (!Number.isFinite(userId)) redirect("/auth");

  const user = await getUserById(userId);
  if (!user) redirect("/auth");

  const [ownedClubs, memberClubs, pendingRequests] = await Promise.all([
    getClubsByOwnerId(userId),
    getClubsByMemberId(userId),
    getPendingRequestsForOwner(userId),
  ]);

  return (
    <DashboardClient
      user={user}
      ownedClubs={ownedClubs}
      memberClubs={memberClubs}
      pendingRequests={pendingRequests}
    />
  );
}
