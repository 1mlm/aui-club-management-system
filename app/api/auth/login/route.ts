import { NextResponse } from "next/server";
import { loginUser } from "@/db/auth";
import { AUTH_COOKIE_NAME, authCookieOptions } from "@/db/auth-cookie";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body?.email ?? "");
    const password = String(body?.password ?? "");

    const user = await loginUser({ email, password });

    const response = NextResponse.json({ user });
    response.cookies.set(AUTH_COOKIE_NAME, String(user.id), authCookieOptions);
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Sign in failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
