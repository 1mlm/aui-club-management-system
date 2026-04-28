import { ClubsTableClient } from "@/components/ClubsTableClient";
import { getAllClubs } from "@/db/admin";

export default async function ClubsPage() {
  const clubs = await getAllClubs();

  return <ClubsTableClient initialClubs={clubs} />;
}
