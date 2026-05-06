import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/db/auth-cookie";
import { getMyClubs } from "@/db/queries";

export async function GET() {
  const cookieStore = await cookies();
  const rawUserId = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  const userId = rawUserId ? Number(rawUserId) : Number.NaN;

  if (!Number.isFinite(userId)) {
    return NextResponse.json({ clubs: [] });
  }

  const clubs = await getMyClubs(userId);
  return NextResponse.json({ clubs });
}
