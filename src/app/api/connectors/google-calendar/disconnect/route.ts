import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { disconnectCalendar } from "@/lib/googleCalendar";

export async function POST() {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  }

  await disconnectCalendar(email);
  return NextResponse.json({ ok: true });
}
