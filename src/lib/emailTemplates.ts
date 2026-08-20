// Branded transactional email templates for Prixo.
//
// Email clients (Outlook especially) support only a small, old subset of
// CSS — no flexbox/grid, unreliable custom fonts, unreliable gradients. So
// unlike the app's dark "Mission Dossier" UI, these use a plain table
// layout, inline styles only, and a light background — the safe, standard
// approach for transactional email that still reads as "Prixo" via the
// amber accent, the logo mark, and the voice.
//
// Templates are plain data (DEFAULT_TEMPLATES) with {{token}} placeholders,
// not hardcoded per-email functions — that's what lets Panel admin ->
// Plantillas de correo edit them (stored as overrides in the database) and
// have this same file render both the live default and a saved edit.

export type TemplateKey = "clase-agendada" | "recordatorio" | "bienvenida" | "clave-actualizada";

export interface TemplateFields {
  subject: string;
  title: string;
  /** May contain {{name}}, {{date}}, {{time}} tokens — substituted at render time. */
  bodyHtml: string;
  ctaLabel: string;
  /** Relative path, combined with siteUrl at render time. */
  ctaPath: string;
}

const AMBER = "#ffb020";
const INK = "#1a1400";
const TEXT = "#20242c";
const TEXT_SOFT = "#5c6579";
const BORDER = "#e7e3d8";
const BG = "#f7f5ef";

export function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

/** The shared shell every Prixo email is rendered inside — logo, card, footer. */
export function emailShell(opts: { preheader: string; title: string; bodyHtml: string; ctaLabel?: string; ctaUrl?: string }): string {
  const { preheader, title, bodyHtml, ctaLabel, ctaUrl } = opts;

  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
  </head>
  <body style="margin:0;padding:0;background:${BG};font-family:Helvetica,Arial,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BG};padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" style="max-width:480px;" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding-bottom:24px;" align="center">
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="width:28px;height:28px;border-radius:50%;background:${AMBER};text-align:center;vertical-align:middle;font-weight:bold;color:${INK};font-size:14px;line-height:28px;">P</td>
                    <td style="padding-left:8px;font-size:17px;font-weight:bold;color:${TEXT};">Prixo</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="background:#ffffff;border:1px solid ${BORDER};border-radius:14px;padding:32px;">
                <h1 style="margin:0 0 16px;font-size:20px;line-height:1.3;color:${TEXT};">${escapeHtml(title)}</h1>
                <div style="font-size:14.5px;line-height:1.6;color:${TEXT_SOFT};">${bodyHtml}</div>
                ${
                  ctaLabel && ctaUrl
                    ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:24px;">
                        <tr>
                          <td style="border-radius:10px;background:${AMBER};">
                            <a href="${escapeHtml(ctaUrl)}" style="display:inline-block;padding:12px 22px;font-size:14px;font-weight:bold;color:${INK};text-decoration:none;">${escapeHtml(ctaLabel)}</a>
                          </td>
                        </tr>
                      </table>`
                    : ""
                }
              </td>
            </tr>
            <tr>
              <td style="padding-top:20px;text-align:center;font-size:11.5px;color:#9a9488;letter-spacing:0.02em;">
                Prixo — Tu idioma, un paso a la vez.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export const DEFAULT_TEMPLATES: Record<TemplateKey, TemplateFields> = {
  "clase-agendada": {
    subject: "Tu clase en Prixo está agendada",
    title: "Clase confirmada",
    bodyHtml: `<p style="margin:0 0 12px;">Hola {{name}},</p>
      <p style="margin:0 0 12px;">Tu sesión de práctica quedó agendada para el <strong style="color:${TEXT};">{{date}}</strong> a las <strong style="color:${TEXT};">{{time}}</strong>.</p>
      <p style="margin:0;">Te esperamos — si necesitas reprogramarla, puedes hacerlo desde tu panel.</p>`,
    ctaLabel: "Ver mi panel",
    ctaPath: "/app",
  },
  recordatorio: {
    subject: "Recordatorio: tu clase en Prixo es pronto",
    title: "Tu clase se acerca",
    bodyHtml: `<p style="margin:0 0 12px;">Hola {{name}},</p>
      <p style="margin:0 0 12px;">Este es un recordatorio de tu sesión de práctica el <strong style="color:${TEXT};">{{date}}</strong> a las <strong style="color:${TEXT};">{{time}}</strong>.</p>
      <p style="margin:0;">Aprovecha para repasar el temario de tu etapa actual antes de entrar.</p>`,
    ctaLabel: "Entrar a mi clase",
    ctaPath: "/app?tab=chat",
  },
  bienvenida: {
    subject: "Bienvenido a Prixo",
    title: "Tu cuenta está lista",
    bodyHtml: `<p style="margin:0 0 12px;">Hola {{name}},</p>
      <p style="margin:0;">Ya puedes armar tu plan de estudio y empezar a practicar con tu tutor de IA.</p>`,
    ctaLabel: "Empezar",
    ctaPath: "/app",
  },
  "clave-actualizada": {
    subject: "Tu contraseña de Prixo fue actualizada",
    title: "Contraseña actualizada",
    bodyHtml: `<p style="margin:0 0 12px;">Hola {{name}},</p>
      <p style="margin:0 0 12px;">Confirmamos que tu contraseña se cambió correctamente.</p>
      <p style="margin:0;">Si no fuiste tú, escríbenos a soporte@prixo.app de inmediato.</p>`,
    ctaLabel: "Ir a mi cuenta",
    ctaPath: "/app",
  },
};

export const TEMPLATE_META: Record<
  TemplateKey,
  { name: string; trigger: string; sampleVars: Record<string, string>; active: boolean; activeNote: string }
> = {
  "clase-agendada": {
    name: "Clase agendada",
    trigger: "Se envía apenas el alumno confirma un horario en “Mis clases agendadas”.",
    sampleVars: { name: "Martina", date: "2026-09-02", time: "16:00" },
    active: true,
    activeNote: "Activo — conectado a Resend hoy.",
  },
  recordatorio: {
    name: "Recordatorio de clase",
    trigger: "Pensado para dispararse unas horas antes de la clase agendada.",
    sampleVars: { name: "Martina", date: "2026-09-02", time: "16:00" },
    active: false,
    activeNote: "Pendiente — falta un disparador programado (ej. Vercel Cron) que revise las clases próximas.",
  },
  bienvenida: {
    name: "Bienvenida a la cuenta",
    trigger: "Pensado para dispararse al crear una cuenta nueva.",
    sampleVars: { name: "Martina" },
    active: false,
    activeNote: "Pendiente — hoy el alta por correo es demo y no verifica nada; necesita cuentas reales.",
  },
  "clave-actualizada": {
    name: "Contraseña actualizada",
    trigger: "Pensado para dispararse cuando un alumno cambia su contraseña.",
    sampleVars: { name: "Martina" },
    active: false,
    activeNote: "Pendiente — los alumnos todavía no tienen contraseña propia (solo el acceso admin la tiene).",
  },
};

/** Substitutes {{token}} placeholders and wraps the result in the branded shell. */
export function renderTemplate(fields: TemplateFields, vars: Record<string, string>, siteUrl: string) {
  let body = fields.bodyHtml;
  for (const [key, value] of Object.entries(vars)) {
    body = body.replaceAll(`{{${key}}}`, escapeHtml(value));
  }
  return {
    subject: fields.subject,
    html: emailShell({
      preheader: fields.subject,
      title: fields.title,
      bodyHtml: body,
      ctaLabel: fields.ctaLabel,
      ctaUrl: fields.ctaPath ? `${siteUrl}${fields.ctaPath}` : undefined,
    }),
  };
}
