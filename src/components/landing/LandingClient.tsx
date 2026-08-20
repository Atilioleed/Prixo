"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import AnimatedPhonePreview from "@/components/landing/AnimatedPhonePreview";
import MissionClock from "@/components/MissionClock";
import ShareButton from "@/components/ShareButton";
import {
  IconChild,
  IconUser,
  IconCompass,
  IconBriefcase,
  IconTarget,
  IconOpenBook,
  IconMessageDots,
  IconVideo,
  IconCheck,
} from "@/components/icons/Icon";

const PROFILES = [
  { icon: IconChild, label: "Niños", accent: "text-pink" },
  { icon: IconUser, label: "Jóvenes", accent: "text-cyan" },
  { icon: IconCompass, label: "Viajeros", accent: "text-amber" },
  { icon: IconBriefcase, label: "Profesionales", accent: "text-seal-violet" },
  { icon: IconTarget, label: "Negociadores", accent: "text-seal-lime" },
];

const WAYPOINTS = [
  {
    call: "BRIEFING",
    icon: IconOpenBook,
    accent: "amber",
    title: "Estudio guiado a tu medida",
    text: "Cuéntale a la IA tu objetivo real — un negocio, un viaje, una entrevista — y arma un plan de corto y largo plazo, no un curso genérico.",
  },
  {
    call: "REHEARSAL",
    icon: IconMessageDots,
    accent: "pink",
    title: "Chat y voz sin fricción",
    text: "Practica escribiendo o hablando. Los errores se corrigen en una burbuja aparte, sin cortar el hilo de la conversación.",
  },
  {
    call: "LIVE-FIRE",
    icon: IconVideo,
    accent: "cyan",
    title: "Videollamada cara a cara",
    text: "Cuando estés listo, practica con el mismo tutor por videollamada — memoria compartida entre chat, voz y video.",
  },
];

const WAYPOINT_STYLES: Record<string, { icon: string; dot: string; box: string }> = {
  amber: { icon: "text-amber", dot: "bg-amber", box: "border-amber-dim/40 bg-amber-tint" },
  pink: { icon: "text-pink", dot: "bg-pink", box: "border-pink/30 bg-pink-tint" },
  cyan: { icon: "text-cyan", dot: "bg-cyan", box: "border-cyan-dim/40 bg-cyan-tint" },
};

const REASONS = [
  "Un mismo precio para toda la familia: niños, jóvenes y adultos en una sola cuenta.",
  "El tutor se prepara para tu situación real, con fecha límite si la tienes — no diálogos genéricos.",
  "Personalidad, voz y objetivo configurables, y esa identidad viaja entre chat, voz y videollamada.",
  "Arquitectura pensada para crecer a cualquier idioma sin rediseñar la experiencia.",
];

const MOTIVES = [
  { label: "Un viaje", detail: "Aeropuertos, hoteles y turismo sin traductor" },
  { label: "Un negocio", detail: "Negociar precios y cerrar tratos con proveedores" },
  { label: "Una entrevista", detail: "Prepararte para una posición puntual" },
  { label: "Citas", detail: "Conocer gente y socializar con confianza" },
  { label: "Reuniones", detail: "Trabajo diario y presentaciones" },
  { label: "El colegio o la universidad", detail: "Reforzar lo que ya estás estudiando" },
  { label: "Un examen o certificación", detail: "TOEFL, IELTS, DELE y similares" },
  { label: "Vivir en el extranjero", detail: "Mudarte o estudiar afuera con soltura" },
];

export default function LandingClient() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") router.replace("/app");
  }, [status, router]);

  return (
    <div className="text-text relative overflow-hidden">
      <div className="pointer-events-none absolute -top-32 -left-40 w-[560px] h-[560px] rounded-full opacity-[0.16] blur-[110px] animate-float" style={{ background: "var(--seal-violet)" }} />
      <div className="pointer-events-none absolute top-10 right-[-160px] w-[480px] h-[480px] rounded-full opacity-[0.14] blur-[110px] animate-float" style={{ background: "var(--pink)", animationDelay: "-2.5s" }} />
      <div className="pointer-events-none absolute top-[420px] left-1/3 w-[420px] h-[420px] rounded-full opacity-[0.12] blur-[110px] animate-float" style={{ background: "var(--cyan)", animationDelay: "-4s" }} />

      <header className="relative max-w-[1180px] mx-auto px-5 pt-6 flex items-center justify-between border-b border-line pb-5">
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_220deg,var(--seal-violet),var(--pink),var(--seal-lime),var(--seal-violet))] animate-seal-spin" />
            <div className="relative w-3 h-3 rounded-full bg-ground" />
          </div>
          <div className="leading-none">
            <div className="font-display font-bold text-[18px] text-text">Prixo</div>
            <MissionClock className="mt-0.5" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ShareButton />
          <Link
            href="/login"
            className="lift border border-line px-5 py-2.5 rounded-[8px] text-text font-semibold text-[13.5px] hover:border-amber hover:text-amber transition-colors"
          >
            Iniciar sesión
          </Link>
        </div>
      </header>

      <section className="relative max-w-[1180px] mx-auto px-5 pt-16 pb-20 grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-14 items-center">
        <div>
          <div className="data-label text-amber mb-3">Tutor de idiomas con inteligencia artificial</div>
          <h1 className="font-display text-[42px] sm:text-[56px] font-bold leading-[1.04] tracking-[-0.02em] mb-5 text-text">
            Tu idioma,
            <br />
            <span className="text-amber">un paso a la vez.</span>
          </h1>
          <p className="text-text-soft text-[17px] leading-relaxed max-w-lg mb-6">
            Un tutor de IA que se prepara para lo que a ti te importa: cerrar un
            trato en inglés con un proveedor en China, sobrevivir un viaje por
            Europa, o una entrevista de trabajo la semana que viene.
          </p>
          <div className="flex flex-wrap gap-3 mb-10">
            <Link
              href="/login"
              className="lift glow-amber border-none px-6 py-3.5 rounded-[10px] bg-amber text-[#1a1400] font-bold text-[15px]"
            >
              Comenzar gratis
            </Link>
            <a
              href="#como-funciona"
              className="lift border border-line px-6 py-3.5 rounded-[10px] bg-transparent text-text font-semibold text-[15px] hover:border-line-bright"
            >
              Ver cómo funciona
            </a>
          </div>
          <div className="flex flex-wrap gap-2">
            {PROFILES.map((p, i) => (
              <div
                key={p.label}
                className="lift animate-fade-up flex items-center gap-1.5 border border-line rounded-[8px] px-3 py-1.5 text-[12px] font-semibold text-text-soft hover:border-line-bright"
                style={{ "--stagger": i } as React.CSSProperties}
              >
                <p.icon size={13} className={p.accent} />
                {p.label}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <AnimatedPhonePreview />
          <div className="panel panel-bracketed px-[18px] py-4 w-full max-w-[340px]">
            <div className="data-label text-amber mb-1.5">Un solo tutor, tres canales</div>
            <div className="text-[13.5px] text-text-soft leading-[1.55]">
              Chat, voz y videollamada comparten la misma personalidad y memoria — no
              se siente como tres apps distintas.
            </div>
          </div>
        </div>
      </section>

      <section className="relative border-t border-line py-14">
        <div className="max-w-[880px] mx-auto px-5">
          <div className="data-label text-cyan mb-2">En resumen</div>
          <div className="panel panel-bracketed p-5">
            <ul className="flex flex-col gap-2 text-[14px] text-text-soft leading-relaxed">
              <li className="flex items-start gap-2.5">
                <IconCheck size={14} className="text-cyan shrink-0 mt-0.5" strokeWidth={2} />
                Un solo tutor de IA para chat, voz y videollamada — con memoria y personalidad compartidas.
              </li>
              <li className="flex items-start gap-2.5">
                <IconCheck size={14} className="text-cyan shrink-0 mt-0.5" strokeWidth={2} />
                Sirve para 5 perfiles (niños, jóvenes, viajeros, profesionales, negociadores) con un mismo precio.
              </li>
              <li className="flex items-start gap-2.5">
                <IconCheck size={14} className="text-cyan shrink-0 mt-0.5" strokeWidth={2} />
                El plan de estudio se arma según tu objetivo real, no un temario genérico.
              </li>
              <li className="flex items-start gap-2.5">
                <IconCheck size={14} className="text-cyan shrink-0 mt-0.5" strokeWidth={2} />
                Disponible hoy en inglés, español, francés, alemán, portugués e italiano.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section id="como-funciona" className="relative border-t border-line py-20">
        <div className="max-w-[880px] mx-auto px-5">
          <h2 className="font-display text-[30px] font-bold mb-14 max-w-xl">
            Tres etapas, un solo tutor
          </h2>
          <div className="relative pl-8 sm:pl-10">
            <div className="absolute left-[7px] sm:left-[9px] top-2 bottom-2 w-px bg-line" />
            <div className="flex flex-col gap-14">
              {WAYPOINTS.map((w, i) => {
                const s = WAYPOINT_STYLES[w.accent];
                return (
                  <div
                    key={w.call}
                    className="relative animate-fade-up"
                    style={{ "--stagger": i } as React.CSSProperties}
                  >
                    <div className={`absolute -left-8 sm:-left-10 top-1 w-4 h-4 rounded-full bg-ground border-2 flex items-center justify-center ${s.box.split(" ")[0]}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${s.dot} animate-pulse-dot`} />
                    </div>
                    <div className={`data-label mb-2 ${s.icon}`}>{w.call}</div>
                    <div className="flex items-start gap-4">
                      <div className={`lift w-11 h-11 rounded-[10px] border flex items-center justify-center shrink-0 ${s.box} ${s.icon}`}>
                        <w.icon size={20} />
                      </div>
                      <div>
                        <div className="font-display text-[20px] font-bold mb-1.5">{w.title}</div>
                        <p className="text-text-soft text-[14.5px] leading-relaxed max-w-md">{w.text}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="relative border-t border-line py-20">
        <div className="max-w-[880px] mx-auto px-5">
          <h2 className="font-display text-[30px] font-bold mb-3 max-w-xl">
            Pensado para cualquier objetivo, no solo para &quot;aprender inglés&quot;
          </h2>
          <p className="text-text-soft text-[14.5px] mb-10">
            Estas son las razones más comunes por las que la gente aprende un idioma —
            elige la tuya al crear tu cuenta y tu plan se arma en base a ella.
          </p>
          <div className="overflow-x-auto mb-10">
            <table className="w-full border-collapse text-[13.5px]">
              <thead>
                <tr>
                  <th className="text-left font-mono text-[10.5px] uppercase tracking-[0.05em] text-text-faint px-3 py-2.5 border-b-[1.5px] border-line">Motivo</th>
                  <th className="text-left font-mono text-[10.5px] uppercase tracking-[0.05em] text-text-faint px-3 py-2.5 border-b-[1.5px] border-line">Qué practicas</th>
                </tr>
              </thead>
              <tbody>
                {MOTIVES.map((m) => (
                  <tr key={m.label}>
                    <td className="px-3 py-2.5 border-b border-line font-semibold text-text">{m.label}</td>
                    <td className="px-3 py-2.5 border-b border-line text-text-soft">{m.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="panel divide-y divide-line">
            {REASONS.map((r, i) => (
              <div
                key={r}
                className="animate-fade-up flex items-start gap-3.5 px-5 py-4"
                style={{ "--stagger": i } as React.CSSProperties}
              >
                <IconCheck size={15} className="text-cyan shrink-0 mt-0.5" strokeWidth={2} />
                <span className="text-[14.5px] text-text leading-relaxed">{r}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative border-t border-line py-16 overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{ background: "radial-gradient(60% 140% at 50% 0%, var(--seal-violet-tint), transparent), radial-gradient(50% 100% at 85% 100%, var(--pink-tint), transparent)" }}
        />
        <div className="relative max-w-[880px] mx-auto px-5 text-center">
          <div className="data-label text-amber mb-3">T-MENOS TU FECHA LÍMITE</div>
          <h2 className="font-display text-[28px] sm:text-[34px] font-bold mb-4">
            Da el primer paso hoy
          </h2>
          <p className="text-text-soft max-w-xl mx-auto mb-7 text-[15px]">
            Crea tu cuenta en segundos con tu correo.
          </p>
          <Link
            href="/login"
            className="lift glow-amber inline-block border-none px-7 py-3.5 rounded-[10px] bg-amber text-[#1a1400] font-bold text-[15px]"
          >
            Comenzar gratis
          </Link>
        </div>
      </section>

      <section className="relative border-t border-line py-10">
        <div className="max-w-[880px] mx-auto px-5">
          <div className="data-label mb-3">¿Tienes dudas?</div>
          <div className="flex flex-wrap gap-4 text-[13.5px] font-semibold">
            <Link href="/faq" className="text-cyan hover:text-text">
              Ver preguntas frecuentes →
            </Link>
            <Link href="/privacidad" className="text-text-soft hover:text-text">
              Cómo cuidamos tus datos
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-8 flex flex-col items-center gap-3 border-t border-line pb-24 sm:pb-8">
        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[12.5px] font-semibold text-text-soft">
          <Link href="/privacidad" className="hover:text-text">Privacidad</Link>
          <Link href="/terminos" className="hover:text-text">Términos</Link>
          <Link href="/faq" className="hover:text-text">Preguntas frecuentes</Link>
        </nav>
        <div className="data-label text-center">
          Prixo — Tu idioma, un paso a la vez. MVP en desarrollo.
        </div>
      </footer>

      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-line bg-ground-raised/95 backdrop-blur px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        <Link
          href="/login"
          className="lift glow-amber flex items-center justify-center border-none px-5 py-3 rounded-[10px] bg-amber text-[#1a1400] font-bold text-[14.5px] w-full"
        >
          Comenzar gratis
        </Link>
      </div>
    </div>
  );
}
