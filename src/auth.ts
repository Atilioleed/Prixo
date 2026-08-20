import NextAuth from "next-auth";
import type { Provider } from "next-auth/providers";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { sendSlackAlert } from "@/lib/slack";

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
  Credentials({
    id: "admin-login",
    name: "Panel admin",
    credentials: {
      username: { label: "Usuario", type: "text" },
      password: { label: "Contraseña", type: "password" },
    },
    async authorize(credentials) {
      const username = credentials?.username;
      const password = credentials?.password;
      const expectedUsername = process.env.ADMIN_USERNAME;
      const passwordHash = process.env.ADMIN_PASSWORD_HASH;
      const loginEmail = process.env.ADMIN_LOGIN_EMAIL;
      if (
        typeof username !== "string" ||
        typeof password !== "string" ||
        !expectedUsername ||
        !passwordHash ||
        !loginEmail
      ) {
        return null;
      }
      if (username !== expectedUsername) return null;
      const valid = await bcrypt.compare(password, passwordHash);
      if (!valid) return null;
      void sendSlackAlert(`🔑 Inicio de sesión en Panel admin — usuario "${username}"`);
      return { id: loginEmail, email: loginEmail, name: "Admin" };
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
