import { ClubBrowser } from "@/components/ClubBrowser";
import { listClubs } from "@/db/queries";

export default async function Page() {
  const clubs = await listClubs();

  return (
    <div className="flex flex-col justify-center items-center w-screen h-screen px-5 md:px-0">
      <ClubBrowser clubs={clubs} />
    </div>
  );
}
