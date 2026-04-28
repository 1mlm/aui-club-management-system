import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getUserById } from "@/db/auth";
import { AUTH_COOKIE_NAME } from "@/db/auth-cookie";

export async function GET() {
  const cookieStore = await cookies();
  const rawUserId = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  const userId = rawUserId ? Number(rawUserId) : Number.NaN;
  const user = Number.isFinite(userId) ? await getUserById(userId) : null;

  return NextResponse.json({ user });
}
