import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { isCalendarConnected, googleCalendarConfigured } from "@/lib/googleCalendar";

export async function GET() {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  }

  if (!googleCalendarConfigured()) {
    return NextResponse.json({ connected: false, configured: false });
  }

  const connected = await isCalendarConnected(email);
  return NextResponse.json({ connected, configured: true });
}
