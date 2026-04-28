import { ClubAppShell } from "@/components/ClubAppShell";
import { listClubs } from "@/db/queries";

export default async function Page() {
  const clubs = await listClubs();

  return <ClubAppShell clubs={clubs} />;
}
