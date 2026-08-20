import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { buildAuthUrl, googleCalendarConfigured } from "@/lib/googleCalendar";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  if (!googleCalendarConfigured()) {
    return NextResponse.redirect(new URL("/app?calendar=not-configured", req.url));
  }

  const redirectUri = new URL("/api/connectors/google-calendar/callback", req.url).toString();
  const state = crypto.randomUUID();

  const res = NextResponse.redirect(buildAuthUrl(redirectUri, state));
  res.cookies.set("gcal_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });
  return res;
}
