import { getAllClubs } from "@/db/admin";
import { ClubsTableClient } from "@/components/ClubsTableClient";

export default async function ClubsPage() {
  const clubs = await getAllClubs();

  return (
    <ClubsTableClient initialClubs={clubs} />
  );
}
