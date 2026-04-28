import { getAllJoinRequests } from "@/db/admin";
import { JoinRequestsTableClient } from "@/components/JoinRequestsTableClient";

export default async function JoinRequestsPage() {
  const requests = await getAllJoinRequests();

  return (
    <JoinRequestsTableClient initialRequests={requests} />
  );
}
