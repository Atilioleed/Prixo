import { auth } from "@/auth";

export function isAdminEmail(email: string | null | undefined): boolean {
  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return !!email && adminEmails.includes(email.toLowerCase());
}

/** Resolves the session only if the caller is an admin; null otherwise. */
export async function requireAdminSession() {
  const session = await auth();
  if (!isAdminEmail(session?.user?.email)) return null;
  return session;
}
