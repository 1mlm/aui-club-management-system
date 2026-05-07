import { Suspense } from "react";
import { ClubBrowser } from "@/components/ClubBrowser";
import { listClubs } from "@/db/queries";

export default async function Page() {
  const clubs = await listClubs();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b pb-4">
        <h1 className="text-2xl font-bold tracking-tight">Clubs Dashboard</h1>
        <span className="text-xs font-semibold text-muted-foreground tabular-nums bg-muted px-2 py-1 rounded-lg">
          {clubs.length} Clubs
        </span>
      </div>
      <Suspense fallback={null}>
        <ClubBrowser clubs={clubs} />
      </Suspense>
    </div>
  );
}
