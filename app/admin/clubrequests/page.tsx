import { getAllClubCreationRequests } from "@/db/club-requests";
import { ClubCreationRequestsTableClient } from "@/components/ClubCreationRequestsTableClient";

export const dynamic = "force-dynamic";

export default async function ClubRequestsPage() {
  const requests = await getAllClubCreationRequests();
  return <ClubCreationRequestsTableClient initialRequests={requests} />;
}
