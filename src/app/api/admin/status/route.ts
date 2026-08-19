import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getProviderStatuses } from "@/lib/ai/providers";
import { emailConfigured } from "@/lib/email";

function isAdminEmail(email: string | null | undefined): boolean {
  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return !!email && adminEmails.includes(email.toLowerCase());
}

export async function GET() {
  const session = await auth();
  if (!isAdminEmail(session?.user?.email)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const googleConfigured = !!process.env.AUTH_GOOGLE_ID && !!process.env.AUTH_GOOGLE_SECRET;

  return NextResponse.json({
    aiProviders: getProviderStatuses(),
    email: { configured: emailConfigured() },
    googleAuth: { configured: googleConfigured },
  });
}
