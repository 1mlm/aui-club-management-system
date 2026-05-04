import { ClubBrowser } from "@/components/ClubBrowser";
import { listClubs } from "@/db/queries";

export default async function Page() {
  const clubs = await listClubs();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Clubs Dashboard</h1>
        <span className="text-xs text-muted-foreground tabular-nums">
          {clubs.length} clubs
        </span>
      </div>
      <ClubBrowser clubs={clubs} />
    </div>
  );
}
