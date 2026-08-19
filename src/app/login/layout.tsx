import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Iniciar sesión",
  description:
    "Crea tu cuenta o inicia sesión en Prixo con Google o tu correo electrónico y empezá a practicar con tu tutor de idiomas con IA en minutos.",
  alternates: { canonical: "/login" },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
