import { JoinRequestsTableClient } from "@/components/JoinRequestsTableClient";
import { getAllJoinRequests } from "@/db/admin";

export default async function JoinRequestsPage() {
  const requests = await getAllJoinRequests();

  return <JoinRequestsTableClient initialRequests={requests} />;
}
