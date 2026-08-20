import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { sendEmail, emailConfigured } from "@/lib/email";
import { buildEmail } from "@/lib/emailTemplateStore";
import { createCalendarEvent } from "@/lib/googleCalendar";

interface ConfirmBody {
  date: string;
  time: string;
  sendEmail: boolean;
}

export async function POST(req: NextRequest) {
  const session = await auth();
  const to = session?.user?.email;
  if (!to) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 });
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

  const calendarResult = await createCalendarEvent(to, {
    date: body.date,
    time: body.time,
    title: "Clase de práctica — Prixo",
  });

  if (!body.sendEmail) {
    return NextResponse.json({ sent: false, calendarCreated: calendarResult.created });
  }

  if (!emailConfigured()) {
    return NextResponse.json({
      sent: false,
      reason: "RESEND_API_KEY no configurada en el servidor.",
      calendarCreated: calendarResult.created,
    });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://prixo.vercel.app";
  const { subject, html } = await buildEmail(
    "clase-agendada",
    { name: session.user?.name ?? "", date: body.date, time: body.time },
    siteUrl
  );

  const emailResult = await sendEmail({ to, subject, html });

  return NextResponse.json({ ...emailResult, calendarCreated: calendarResult.created });
}
