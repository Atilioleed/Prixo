import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { sendEmail, emailConfigured } from "@/lib/email";
import { buildEmail } from "@/lib/emailTemplateStore";

interface ConfirmBody {
  date: string;
  time: string;
}

export async function POST(req: NextRequest) {
  const session = await auth();
  const to = session?.user?.email;
  if (!to) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  }

  if (!emailConfigured()) {
    return NextResponse.json({ sent: false, reason: "RESEND_API_KEY no configurada en el servidor." });
  }

  let body: ConfirmBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo de solicitud inválido." }, { status: 400 });
  }

  if (!body.date || !body.time) {
    return NextResponse.json({ error: "Faltan date o time." }, { status: 400 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://prixo.vercel.app";
  const { subject, html } = await buildEmail(
    "clase-agendada",
    { name: session.user?.name ?? "", date: body.date, time: body.time },
    siteUrl
  );

  const result = await sendEmail({ to, subject, html });

  return NextResponse.json(result);
}
