import { eq } from "drizzle-orm";
import { getDb, dbConfigured } from "@/db/client";
import { googleCalendarTokens } from "@/db/schema";

// Separate OAuth grant from login — a student can log in with plain email
// and still connect their calendar independently (see
// src/app/api/connectors/google-calendar/*). Uses the same Google OAuth
// client as login (AUTH_GOOGLE_ID/SECRET) but its own scope and redirect.

const SCOPE = "https://www.googleapis.com/auth/calendar.events";
const TIMEZONE = "America/Santiago";
const EVENT_DURATION_MINUTES = 60;

export function googleCalendarConfigured(): boolean {
  return !!process.env.AUTH_GOOGLE_ID && !!process.env.AUTH_GOOGLE_SECRET;
}

export function buildAuthUrl(redirectUri: string, state: string): string {
  const params = new URLSearchParams({
    client_id: process.env.AUTH_GOOGLE_ID!,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: SCOPE,
    access_type: "offline",
    prompt: "consent",
    state,
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  error?: string;
  error_description?: string;
}

export async function exchangeCodeForTokens(code: string, redirectUri: string): Promise<TokenResponse> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.AUTH_GOOGLE_ID!,
      client_secret: process.env.AUTH_GOOGLE_SECRET!,
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
    }),
  });
  return res.json();
}

async function refreshAccessToken(refreshToken: string): Promise<TokenResponse> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.AUTH_GOOGLE_ID!,
      client_secret: process.env.AUTH_GOOGLE_SECRET!,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });
  return res.json();
}

export async function saveTokens(email: string, tokens: TokenResponse) {
  if (!dbConfigured() || !tokens.refresh_token) return;
  const expiresAt = new Date(Date.now() + tokens.expires_in * 1000);
  await getDb()
    .insert(googleCalendarTokens)
    .values({
      email,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt,
    })
    .onConflictDoUpdate({
      target: googleCalendarTokens.email,
      set: {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt,
        updatedAt: new Date(),
      },
    });
}

export async function isCalendarConnected(email: string): Promise<boolean> {
  if (!dbConfigured()) return false;
  const [row] = await getDb()
    .select({ email: googleCalendarTokens.email })
    .from(googleCalendarTokens)
    .where(eq(googleCalendarTokens.email, email));
  return !!row;
}

export async function disconnectCalendar(email: string) {
  if (!dbConfigured()) return;
  await getDb().delete(googleCalendarTokens).where(eq(googleCalendarTokens.email, email));
}

/** Returns a valid access token for this student, refreshing it if expired. Null if not connected or the grant was revoked. */
async function getValidAccessToken(email: string): Promise<string | null> {
  if (!dbConfigured()) return null;
  const [row] = await getDb()
    .select()
    .from(googleCalendarTokens)
    .where(eq(googleCalendarTokens.email, email));
  if (!row) return null;

  const stillValid = row.expiresAt.getTime() - Date.now() > 60_000;
  if (stillValid) return row.accessToken;

  const refreshed = await refreshAccessToken(row.refreshToken);
  if (!refreshed.access_token) {
    // Refresh token was revoked (e.g. student disconnected access from their Google account) — clean up.
    await getDb().delete(googleCalendarTokens).where(eq(googleCalendarTokens.email, email));
    return null;
  }

  const expiresAt = new Date(Date.now() + refreshed.expires_in * 1000);
  await getDb()
    .update(googleCalendarTokens)
    .set({ accessToken: refreshed.access_token, expiresAt, updatedAt: new Date() })
    .where(eq(googleCalendarTokens.email, email));

  return refreshed.access_token;
}

export async function createCalendarEvent(
  email: string,
  opts: { date: string; time: string; title: string }
): Promise<{ created: boolean; reason?: string }> {
  const accessToken = await getValidAccessToken(email);
  if (!accessToken) return { created: false, reason: "not-connected" };

  const startDateTime = `${opts.date}T${opts.time}:00`;
  const [h, m] = opts.time.split(":").map(Number);
  const endDate = new Date(`${opts.date}T00:00:00`);
  endDate.setHours(h, m + EVENT_DURATION_MINUTES);
  const endDateTime = `${opts.date}T${String(endDate.getHours()).padStart(2, "0")}:${String(endDate.getMinutes()).padStart(2, "0")}:00`;

  const res = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      summary: opts.title,
      description: "Clase de práctica agendada en Prixo.",
      start: { dateTime: startDateTime, timeZone: TIMEZONE },
      end: { dateTime: endDateTime, timeZone: TIMEZONE },
    }),
  });

  if (!res.ok) {
    return { created: false, reason: `google-api-error-${res.status}` };
  }
  return { created: true };
}
