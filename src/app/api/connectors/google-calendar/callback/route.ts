import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { exchangeCodeForTokens, saveTokens } from "@/lib/googleCalendar";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const expectedState = req.cookies.get("gcal_oauth_state")?.value;

  if (!code || !state || !expectedState || state !== expectedState) {
    return NextResponse.redirect(new URL("/app?calendar=error", req.url));
  }

  const redirectUri = new URL("/api/connectors/google-calendar/callback", req.url).toString();
  const tokens = await exchangeCodeForTokens(code, redirectUri);

  if (!tokens.access_token) {
    return NextResponse.redirect(new URL("/app?calendar=error", req.url));
  }

  await saveTokens(session.user.email, tokens);

  const res = NextResponse.redirect(new URL("/app?calendar=connected", req.url));
  res.cookies.delete("gcal_oauth_state");
  return res;
}
