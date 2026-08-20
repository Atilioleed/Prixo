import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/adminAuth";
import { getProviderStatuses } from "@/lib/ai/providers";
import { emailConfigured } from "@/lib/email";
import { slackConfigured } from "@/lib/slack";
import { dbConfigured } from "@/db/client";

export async function GET() {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const googleConfigured = !!process.env.AUTH_GOOGLE_ID && !!process.env.AUTH_GOOGLE_SECRET;

  return NextResponse.json({
    aiProviders: getProviderStatuses(),
    email: { configured: emailConfigured() },
    googleAuth: { configured: googleConfigured },
    googleCalendar: { configured: googleConfigured },
    slack: { configured: slackConfigured() },
    database: { configured: dbConfigured() },
  });
}
