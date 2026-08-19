import type { Metadata } from "next";
import LandingClient from "@/components/landing/LandingClient";

export const metadata: Metadata = {
  // The root layout's title.template doesn't apply to page.tsx at the exact
  // "/" segment (only to nested routes) — so this page spells out the full
  // brand-suffixed title itself instead of relying on inheritance.
  title: "Tutor de idiomas con IA para niños, viajeros y profesionales | Prixo",
  description:
    "Aprende inglés, español, francés, alemán, portugués o italiano con un tutor de IA que se prepara para tu viaje, tu negociación o tu entrevista real. Chat, voz y videollamada con corrección sin fricción.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return <LandingClient />;
}
