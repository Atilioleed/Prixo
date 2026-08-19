import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import RegisterServiceWorker from "@/components/RegisterServiceWorker";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Prixo — Tu idioma, un paso a la vez.",
  description:
    "Prixo: tutor de IA personalizable, chat, voz y videollamada para aprender idiomas — un mismo producto y precio para cinco perfiles.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Prixo",
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0d13",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ground text-text font-sans">
        {/*
          THESIS: every screen is your personal mission dossier, not another AI-chat app shell.
          OWN-WORLD: charcoal-navy ground, amber/cyan instrument telemetry, the violet→lime mark kept as a wax-seal.
          STORY: visitor believes Prixo preps them for THEIR real deadline-bound situation, not a generic course, and starts a session.
          FIRST VIEWPORT: dark hero, live mission clock, dossier-tab nav, headline + CTA left, animated instrument preview right.
          FORM: field-ops briefing dossier (assigned index 6, seed a0d1098d), raised with collider-event-display telemetry grammar (declined challenger, donated instrument discipline).
          FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
        */}
        <Providers>{children}</Providers>
        <RegisterServiceWorker />
      </body>
    </html>
  );
}
