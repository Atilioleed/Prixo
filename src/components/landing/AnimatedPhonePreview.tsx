"use client";

import { useEffect, useState } from "react";
import PhoneFrame from "@/components/PhoneFrame";
import { IconBell, IconChat } from "@/components/icons/Icon";

const SLIDES = ["chat", "personalize", "dashboard"] as const;
type Slide = (typeof SLIDES)[number];

function ChatSlide() {
  return (
    <>
      <div className="flex items-center gap-2.5 px-[18px] py-3.5 border-b border-line">
        <div className="w-8 h-8 rounded-full bg-ground-raised-2 border border-cyan-dim/50 flex items-center justify-center">
          <IconChat size={14} className="text-cyan" />
        </div>
        <div>
          <div className="font-semibold text-sm text-text">Max — tu tutor</div>
          <div className="data-label text-cyan">En línea</div>
        </div>
      </div>
      <div className="flex-1 px-4 pt-4 flex flex-col gap-2.5">
        <div className="max-w-[85%] px-[13px] py-2.5 rounded-[10px] rounded-bl-[3px] text-[13px] leading-[1.4] bg-ground-raised-2 border border-line text-text self-start">
          Cuéntame: ¿con qué proveedor vas a negociar esta semana?
        </div>
        <div className="max-w-[85%] px-[13px] py-2.5 rounded-[10px] rounded-br-[3px] text-[13px] leading-[1.4] bg-amber text-[#1a1400] self-end font-medium">
          A supplier in Shenzhen, about pricing.
        </div>
        <div className="max-w-[85%] px-[13px] py-2.5 rounded-[10px] text-[12px] leading-[1.4] bg-cyan-tint border border-cyan-dim/40 text-cyan self-start">
          Perfecto — armemos frases para bajar precio sin sonar agresivo.
        </div>
      </div>
    </>
  );
}

function PersonalizeSlide() {
  return (
    <div className="px-5 pt-8 flex flex-col items-center">
      <div className="w-16 h-16 rounded-full p-[3px] mb-3 bg-[conic-gradient(from_140deg,var(--seal-violet),var(--seal-lime),var(--seal-violet))]">
        <div className="w-full h-full rounded-full bg-ground-raised-2 flex items-center justify-center text-text font-bold text-xl">
          M
        </div>
      </div>
      <div className="font-semibold text-sm text-text mb-4">Max · Negociador · Acento americano</div>
      <div className="w-full flex flex-col gap-3">
        <div>
          <div className="data-label text-text-faint mb-1.5">Objetivo</div>
          <div className="flex flex-wrap gap-1.5">
            {["Negociar un trato", "Viajes", "Entrevista"].map((g, i) => (
              <span
                key={g}
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-[var(--radius-chip)] border ${
                  i === 0 ? "bg-amber text-[#1a1400] border-amber" : "border-line text-text-soft"
                }`}
              >
                {g}
              </span>
            ))}
          </div>
        </div>
        <div>
          <div className="data-label text-text-faint mb-1.5">Personalidad</div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-text-faint">Paciente</span>
            <div className="flex-1 h-1 rounded-full bg-line relative">
              <div className="absolute inset-y-0 left-0 w-[70%] bg-cyan rounded-full" />
            </div>
            <span className="text-[10px] text-text-faint">Exigente</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardSlide() {
  return (
    <div className="p-[18px] flex flex-col gap-3.5">
      <div className="flex justify-between items-center">
        <div>
          <div className="text-sm font-semibold text-text">Hola, Martina</div>
          <div className="data-label text-text-faint">Nivel B1 · Negocios</div>
        </div>
        <div className="tabular text-[11px] text-amber">09 días</div>
      </div>
      <div className="panel panel-bracketed p-4 flex items-center gap-3.5">
        <div className="relative w-[54px] h-[54px] shrink-0">
          <svg width="54" height="54" viewBox="0 0 74 74" className="-rotate-90">
            <circle cx="37" cy="37" r="30" fill="none" stroke="var(--line)" strokeWidth="6" />
            <circle
              cx="37" cy="37" r="30" fill="none" stroke="var(--amber)" strokeWidth="6"
              strokeLinecap="round" strokeDasharray="188.5" strokeDashoffset="76"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center tabular text-[11px] text-text">
            60%
          </div>
        </div>
        <div>
          <div className="data-label text-text-faint">Meta de la semana</div>
          <div className="font-semibold text-[13px] text-text">Reunión del jueves</div>
        </div>
      </div>
      <div className="border border-line rounded-[10px] p-3 flex items-center gap-3 bg-ground-raised-2">
        <IconBell size={16} className="text-amber shrink-0" />
        <div className="text-[12px] text-text">
          <span className="font-semibold">Simulacro de negociación</span>{" "}
          <span className="text-text-faint">— T-3d</span>
        </div>
      </div>
    </div>
  );
}

export default function AnimatedPhonePreview() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, 3800);
    return () => clearInterval(id);
  }, []);

  const slide: Slide = SLIDES[index];

  return (
    <div className="animate-float">
      <PhoneFrame>
        <div key={slide} className="flex-1 flex flex-col animate-flicker-in">
          {slide === "chat" && <ChatSlide />}
          {slide === "personalize" && <PersonalizeSlide />}
          {slide === "dashboard" && <DashboardSlide />}
        </div>
      </PhoneFrame>
      <div className="flex justify-center gap-1.5 mt-4">
        {SLIDES.map((s, i) => (
          <button
            key={s}
            onClick={() => setIndex(i)}
            aria-label={`Ver pantalla ${i + 1}`}
            className={`h-1 rounded-full transition-all ${
              i === index ? "w-6 bg-amber" : "w-1 bg-line"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
