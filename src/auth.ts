import NextAuth from "next-auth";
import type { Provider } from "next-auth/providers";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

const providers: Provider[] = [
  Credentials({
    id: "email-demo",
    name: "Correo electrónico",
    credentials: {
      email: { label: "Correo electrónico", type: "email" },
    },
    authorize(credentials) {
      const email = credentials?.email;
      if (typeof email !== "string" || !email.includes("@")) return null;
      return { id: email, email, name: email.split("@")[0] };
    },
  }),
];

if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  providers.push(Google);
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  trustHost: true,
});
