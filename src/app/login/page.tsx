"use client";

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { IconTarget, IconMessageDots, IconBell } from "@/components/icons/Icon";

const FEATURES = [
  { icon: IconTarget, text: "La IA te prepara según tu objetivo: negociar con un proveedor, un viaje, una entrevista." },
  { icon: IconMessageDots, text: "Practica por chat, voz o videollamada con un tutor que se adapta a ti." },
  { icon: IconBell, text: "Recordatorios y planificación de corto y largo plazo, generados automáticamente." },
];

export default function LoginPage() {
  const [availableProviders, setAvailableProviders] = useState<Set<string>>(new Set());
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/providers")
      .then((r) => r.json())
      .then((data) => setAvailableProviders(new Set(Object.keys(data ?? {}))))
      .catch(() => setAvailableProviders(new Set()));
  }, []);

  async function handleOAuth(provider: "google") {
    setSubmitting(provider);
    await signIn(provider, { callbackUrl: "/app" });
    setSubmitting(null);
  }

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;
    setSubmitting("email-demo");
    await signIn("email-demo", { email, callbackUrl: "/app" });
    setSubmitting(null);
  }

  const googleReady = availableProviders.has("google");

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between bg-ground-raised border-r border-line p-12 relative overflow-hidden">
        <div className="flex items-center gap-2.5 relative z-10">
          <div className="relative w-9 h-9 rounded-full overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_220deg,var(--seal-violet),var(--pink),var(--seal-lime),var(--seal-violet))] animate-seal-spin" />
            <div className="relative w-3.5 h-3.5 rounded-full bg-ground-raised" />
          </div>
          <div className="font-display font-bold text-2xl text-text">Prixo</div>
        </div>
        <div className="relative z-10">
          <div className="data-label text-amber mb-3">Dossier de acceso</div>
          <h1 className="font-display text-[40px] font-bold leading-[1.08] mb-4 text-text">
            Tu idioma,
            <br />un paso a la vez.
          </h1>
          <p className="text-text-soft max-w-md text-[15px] leading-relaxed mb-8">
            Un tutor de IA que se prepara para lo que a ti te importa: cerrar un
            trato en inglés con un proveedor en China, sobrevivir un viaje por
            Europa, o una entrevista de trabajo la semana que viene.
          </p>
          <div className="flex flex-col gap-4">
            {FEATURES.map((f, i) => (
              <div
                key={f.text}
                className="animate-fade-up flex items-start gap-3"
                style={{ "--stagger": i } as React.CSSProperties}
              >
                <div className="w-8 h-8 rounded-[8px] bg-ground-raised-2 border border-line flex items-center justify-center text-cyan shrink-0">
                  <f.icon size={15} />
                </div>
                <div className="text-sm text-text-soft leading-relaxed pt-1">{f.text}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="data-label relative z-10">Prixo — MVP en desarrollo</div>
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{
          backgroundImage: "linear-gradient(var(--line-bright) 1px, transparent 1px), linear-gradient(90deg, var(--line-bright) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }} />
      </div>

      <div className="flex items-center justify-center p-6 sm:p-12 bg-ground">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2.5 mb-8 justify-center">
            <div className="relative w-9 h-9 rounded-full overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_220deg,var(--seal-violet),var(--pink),var(--seal-lime),var(--seal-violet))] animate-seal-spin" />
              <div className="relative w-3.5 h-3.5 rounded-full bg-ground" />
            </div>
            <div className="font-display font-bold text-2xl text-text">Prixo</div>
          </div>

          <h2 className="font-display text-2xl font-bold mb-1.5 text-center lg:text-left text-text">
            Empecemos
          </h2>
          <p className="text-sm text-text-soft mb-7 text-center lg:text-left">
            Crea tu cuenta o inicia sesión para continuar.
          </p>

          <div className="flex flex-col gap-2.5 mb-5">
            <button
              onClick={() => handleOAuth("google")}
              disabled={!googleReady || submitting !== null}
              title={googleReady ? undefined : "Falta configurar AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET en .env.local"}
              className="lift w-full border border-line rounded-[10px] px-4 py-3 font-semibold text-sm bg-ground-raised-2 text-text flex items-center justify-center gap-2.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 hover:border-line-bright"
            >
              Continuar con Google
              {!googleReady && <span className="text-[10px] text-text-faint font-normal">(sin configurar)</span>}
            </button>
          </div>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-line" />
            <span className="data-label">o con tu correo</span>
            <div className="flex-1 h-px bg-line" />
          </div>

          <form onSubmit={handleEmail} className="flex flex-col gap-2.5">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              className="w-full border border-line rounded-[10px] px-4 py-3 text-sm outline-none focus:border-amber bg-ground-raised-2 text-text placeholder:text-text-faint"
            />
            <button
              type="submit"
              disabled={submitting !== null}
              className="lift glow-amber w-full border-none rounded-[10px] px-4 py-3 font-semibold text-sm bg-amber text-[#1a1400] disabled:opacity-60"
            >
              {submitting === "email-demo" ? "Entrando…" : "Continuar con correo"}
            </button>
          </form>
          <p className="text-[11px] text-text-faint mt-3 text-center lg:text-left leading-relaxed">
            Modo demo: el acceso por correo no verifica contraseña todavía — sirve
            para probar el producto, no es autenticación de producción.
          </p>
        </div>
      </div>
    </div>
  );
}
