import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { sendEmail, emailConfigured } from "@/lib/email";

interface ConfirmBody {
  date: string;
  time: string;
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
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

  const date = escapeHtml(body.date);
  const time = escapeHtml(body.time);

  const result = await sendEmail({
    to,
    subject: "Tu clase en Prixo está agendada",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #1a1400;">Clase confirmada</h2>
        <p>Tu sesión de práctica quedó agendada para el <strong>${date}</strong> a las <strong>${time}</strong>.</p>
        <p style="color: #666; font-size: 13px;">Prixo — Tu idioma, un paso a la vez.</p>
      </div>
    `,
  });

  return NextResponse.json(result);
}
