"use client";

import PhoneFrame from "@/components/PhoneFrame";
import Note from "@/components/Note";
import ScreenHead from "@/components/ScreenHead";
import Stage from "@/components/Stage";
import ChipRow from "@/components/ChipRow";
import { useTutorProfile, WhoKey } from "@/context/TutorProfileContext";
import { LANGUAGES } from "@/lib/languageCodes";
import { GOALS as PLAN_GOALS } from "@/lib/onboardingOptions";

const WHO_OPTIONS: { key: WhoKey; label: string }[] = [
  { key: "nino", label: "Niño (6–12)" },
  { key: "joven", label: "Joven (13–17)" },
  { key: "viajero", label: "Joven viajero" },
  { key: "profesional", label: "Profesional" },
  { key: "negociador", label: "Empresario / negociador" },
];

const AVATARS = ["Max", "Sofía", "Leo", "Nina"];
const ACCENTS = ["Americano", "Británico", "Neutro"];
const GOALS = PLAN_GOALS.map((g) => g.label);
const SCENARIOS = [
  "Negociar precio con proveedor",
  "Presentar propuesta a cliente",
  "Small talk antes de reunión",
];

export default function Personalize() {
  const { profile, update } = useTutorProfile();
  const { avatarName: avatar, accent, goal, scenario, formalCercano, pacienteExigente } = profile;

  return (
    <>
      <ScreenHead
        title="Personalizar tu asistente"
        description="Idioma, quién eres, y el tutor con el que vas a practicar: apariencia, voz, personalidad y objetivo. Esta configuración viaja entre el chat, la voz y la videollamada."
      />
      <Stage
        phone={
          <PhoneFrame>
            <div className="px-5 pt-[22px] pb-2 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full p-1 mb-3 bg-[conic-gradient(from_140deg,var(--seal-violet),var(--seal-lime),var(--red),var(--seal-violet))]">
                <div className="w-full h-full rounded-full bg-ground-raised-2 flex items-center justify-center text-text font-bold text-[30px]">
                  {avatar[0]}
                </div>
              </div>
              <div className="font-semibold text-base text-text">{avatar}</div>
              <div className="text-xs text-text-faint">Tutor de inglés · Voz cálida · Nivel B1</div>
            </div>
            <div className="px-5 pt-2.5 pb-5 flex flex-col gap-4 flex-1 overflow-y-auto">
              <div>
                <div className="data-label mb-2">Idioma que estás aprendiendo</div>
                <p className="text-[11px] text-text-faint mb-2 leading-relaxed">
                  Puedes cambiar de idioma cuando quieras — tu avance en el temario se
                  guarda por separado en cada uno, así que no pierdes lo que ya avanzaste.
                </p>
                <div className="grid grid-cols-3 gap-1.5">
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.label}
                      onClick={() => update({ targetLanguage: l.label })}
                      className={`border rounded-[8px] px-1.5 py-2 flex flex-col items-center gap-1 bg-ground-raised-2 ${
                        profile.targetLanguage === l.label
                          ? "border-amber bg-amber-tint"
                          : "border-line"
                      }`}
                    >
                      <span className="text-base">{l.flag}</span>
                      <span className="text-[10.5px] font-semibold text-text">{l.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="data-label mb-2">¿Quién eres?</div>
                <div className="flex flex-wrap gap-2">
                  {WHO_OPTIONS.map((w) => (
                    <button
                      key={w.key}
                      onClick={() => update({ who: w.key })}
                      className={`border rounded-[var(--radius-chip)] px-3 py-1.5 text-xs font-semibold ${
                        profile.who === w.key
                          ? "bg-amber text-[#1a1400] border-amber"
                          : "border-line text-text-soft bg-ground-raised-2"
                      }`}
                    >
                      {w.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="data-label mb-2">Apariencia del avatar</div>
                <ChipRow options={AVATARS} selected={avatar} onSelect={(v) => update({ avatarName: v })} />
              </div>
              <div>
                <div className="data-label mb-2">Acento de voz</div>
                <ChipRow options={ACCENTS} selected={accent} onSelect={(v) => update({ accent: v })} />
              </div>
              <div>
                <div className="data-label mb-2">Personalidad</div>
                <div className="flex items-center gap-2.5">
                  <span className="text-[10.5px] text-text-faint font-semibold w-[52px]">Formal</span>
                  <input
                    type="range"
                    className="flex-1"
                    value={formalCercano}
                    onChange={(e) => update({ formalCercano: Number(e.target.value) })}
                  />
                  <span className="text-[10.5px] text-text-faint font-semibold w-[52px] text-right">
                    Cercano
                  </span>
                </div>
                <div className="flex items-center gap-2.5 mt-1.5">
                  <span className="text-[10.5px] text-text-faint font-semibold w-[52px]">Paciente</span>
                  <input
                    type="range"
                    className="flex-1"
                    value={pacienteExigente}
                    onChange={(e) => update({ pacienteExigente: Number(e.target.value) })}
                  />
                  <span className="text-[10.5px] text-text-faint font-semibold w-[52px] text-right">
                    Exigente
                  </span>
                </div>
              </div>
              <div>
                <div className="data-label mb-2">Objetivo de aprendizaje</div>
                <ChipRow options={GOALS} selected={goal} onSelect={(v) => update({ goal: v })} />
              </div>
              <div>
                <div className="data-label mb-2">Escenario a practicar hoy</div>
                <ChipRow options={SCENARIOS} selected={scenario} onSelect={(v) => update({ scenario: v })} />
              </div>
            </div>
            <div className="px-5 pb-5">
              <button className="w-full border-none px-3.5 py-3.5 rounded-[10px] bg-amber text-[#1a1400] font-semibold text-[14.5px]">
                Guardar y empezar a hablar
              </button>
            </div>
          </PhoneFrame>
        }
        notes={
          <>
            <Note label="Identidad persistente">
              El avatar, la voz y la personalidad elegidos son los mismos en el chat de
              texto, en el modo voz y en la videollamada — se siente un solo tutor, no tres
              herramientas distintas.
            </Note>
            <Note label="Ajustable en el tiempo">
              El alumno puede volver a esta pantalla cuando quiera: subir la exigencia a
              medida que avanza de nivel, o cambiar de acento para practicar variantes
              distintas del idioma.
            </Note>
            <Note label="Perfiles familiares">
              En cuentas familiares, cada integrante (niño, joven, adulto) tiene su propio
              tutor personalizado dentro de la misma suscripción.
            </Note>
          </>
        }
      />
    </>
  );
}
