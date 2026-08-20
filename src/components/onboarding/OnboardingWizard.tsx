"use client";

import { useState } from "react";
import { useTutorProfile, AgeRange, SexOption, LevelKey } from "@/context/TutorProfileContext";
import { LANGUAGES } from "@/lib/languageCodes";
import { AGE_RANGES, SEX_OPTIONS, LEVELS, GOALS, TUTORS, LEVEL_TO_STAGE, IconOption } from "@/lib/onboardingOptions";
import PlacementStep from "./PlacementStep";
import GeneratingPlan from "./GeneratingPlan";
import { IconCheck, IconChevronLeft } from "@/components/icons/Icon";

interface Draft {
  targetLanguage: string;
  nativeLanguage: string;
  ageRange: AgeRange;
  sex: SexOption;
  currentLevel: LevelKey;
  planGoal: string;
  placementScore: number | null;
  avatarName: string;
  accent: string;
}

const STEP_COPY = [
  { eyebrow: "Paso 1 de 8", title: "¿Qué idioma quieres aprender?", sub: "Estos son los idiomas donde nuestros agentes de IA rinden al máximo." },
  { eyebrow: "Paso 2 de 8", title: "¿Cuál es tu lengua materna?", sub: "Así las correcciones te las explicamos en tu propio idioma." },
  { eyebrow: "Paso 3 de 8", title: "¿Cuál es tu rango de edad?", sub: "Ajustamos el tono y el vocabulario a tu etapa." },
  { eyebrow: "Paso 4 de 8", title: "¿Con qué sexo te identificas?", sub: "Es opcional — solo lo usamos para ejemplos más naturales." },
  { eyebrow: "Paso 5 de 8", title: "¿Cómo describirías tu nivel hoy?", sub: "Sé honesto — lo vamos a confirmar en el paso siguiente." },
  { eyebrow: "Paso 6 de 8", title: "¿Para qué quieres aprenderlo?", sub: "Con esto armamos tu plan y tus primeros escenarios de práctica." },
  { eyebrow: "Paso 7 de 8", title: "Un chequeo rápido de vocabulario", sub: "Toca las palabras que reconozcas — no hay respuestas malas." },
  { eyebrow: "Paso 8 de 8", title: "Elige a tu tutor", sub: "Vas a poder cambiarlo cuando quieras desde tu panel." },
];

const TOTAL_STEPS = 8;

export default function OnboardingWizard({ onDone }: { onDone: () => void }) {
  const { profile, update } = useTutorProfile();
  const [step, setStep] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [draft, setDraft] = useState<Draft>({
    targetLanguage: profile.targetLanguage,
    nativeLanguage: profile.nativeLanguage,
    ageRange: profile.ageRange,
    sex: profile.sex,
    currentLevel: profile.currentLevel,
    planGoal: profile.planGoal,
    placementScore: null,
    avatarName: profile.avatarName,
    accent: profile.accent,
  });

  function patch(p: Partial<Draft>) {
    setDraft((d) => ({ ...d, ...p }));
  }

  function goNext() {
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 0));
  }

  function selectAndAdvance(p: Partial<Draft>) {
    patch(p);
    setTimeout(goNext, 220);
  }

  function finish() {
    // Deliberately NOT setting onboarded:true here — the parent shell gates on
    // profile.onboarded and would swap away from this wizard (and skip the
    // "generating your plan" screen entirely) the instant it flips true.
    update({
      targetLanguage: draft.targetLanguage,
      nativeLanguage: draft.nativeLanguage,
      ageRange: draft.ageRange,
      sex: draft.sex,
      currentLevel: draft.currentLevel,
      placementScore: draft.placementScore,
      planGoal: draft.planGoal,
      avatarName: draft.avatarName,
      accent: draft.accent,
      progressByLanguage: { ...profile.progressByLanguage, [draft.targetLanguage]: LEVEL_TO_STAGE[draft.currentLevel] },
    });
    setGenerating(true);
  }

  if (generating) {
    const stageProgress = { ...profile.progressByLanguage, [draft.targetLanguage]: LEVEL_TO_STAGE[draft.currentLevel] };
    return (
      <GeneratingPlan
        profile={{ ...profile, ...draft, progressByLanguage: stageProgress }}
        onComplete={() => {
          update({ onboarded: true });
          onDone();
        }}
      />
    );
  }

  const copy = STEP_COPY[step];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="max-w-[560px] w-full mx-auto px-5 pt-10 pb-4">
        <div className="flex items-center gap-2.5 mb-8">
          <div className="relative w-8 h-8 rounded-full overflow-hidden flex items-center justify-center shrink-0">
            <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_220deg,var(--seal-violet),var(--pink),var(--seal-lime),var(--seal-violet))] animate-seal-spin" />
            <div className="relative w-3 h-3 rounded-full bg-ground" />
          </div>
          <span className="font-display font-bold text-[17px] text-text">Prixo</span>
        </div>

        <div className="flex gap-1.5 mb-8">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div key={i} className="flex-1 h-[3px] rounded-full bg-line overflow-hidden">
              <div
                className="h-full bg-amber transition-all duration-300"
                style={{ width: i < step ? "100%" : i === step ? "50%" : "0%" }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-[560px] w-full mx-auto px-5 pb-16 flex-1">
        <div key={step} className="animate-fade-up">
          <div className="data-label text-amber mb-2">{copy.eyebrow}</div>
          <h1 className="font-display text-[26px] sm:text-[30px] font-bold mb-2 text-text text-balance">
            {copy.title}
          </h1>
          <p className="text-text-soft text-[14px] mb-7">{copy.sub}</p>

          {step === 0 && (
            <FlagGrid
              options={LANGUAGES}
              selected={draft.targetLanguage}
              onSelect={(label) => selectAndAdvance({ targetLanguage: label })}
            />
          )}

          {step === 1 && (
            <FlagGrid
              options={LANGUAGES}
              selected={draft.nativeLanguage}
              onSelect={(label) => selectAndAdvance({ nativeLanguage: label })}
            />
          )}

          {step === 2 && (
            <IconGrid
              options={AGE_RANGES}
              selected={draft.ageRange}
              onSelect={(v) => selectAndAdvance({ ageRange: v })}
            />
          )}

          {step === 3 && (
            <IconGrid
              options={SEX_OPTIONS}
              selected={draft.sex}
              onSelect={(v) => selectAndAdvance({ sex: v })}
            />
          )}

          {step === 4 && (
            <IconGrid
              options={LEVELS}
              selected={draft.currentLevel}
              onSelect={(v) => selectAndAdvance({ currentLevel: v })}
            />
          )}

          {step === 5 && (
            <IconGrid
              options={GOALS}
              selected={draft.planGoal}
              onSelect={(v) => selectAndAdvance({ planGoal: v })}
              cols={2}
            />
          )}

          {step === 6 && (
            <PlacementStep
              language={draft.targetLanguage}
              onContinue={(score) => {
                patch({ placementScore: score });
                goNext();
              }}
            />
          )}

          {step === 7 && (
            <div className="grid grid-cols-2 gap-3">
              {TUTORS.map((t, i) => {
                const active = draft.avatarName === t.name;
                return (
                  <button
                    key={t.name}
                    onClick={() => patch({ avatarName: t.name, accent: t.accent })}
                    className={`lift animate-fade-up flex flex-col items-center gap-2 border rounded-[14px] px-4 py-5 ${
                      active ? "border-amber bg-amber-tint" : "border-line bg-ground-raised-2"
                    }`}
                    style={{ "--stagger": i } as React.CSSProperties}
                  >
                    <div
                      className={`w-14 h-14 rounded-full p-0.5 bg-[conic-gradient(from_140deg,var(--seal-violet),var(--seal-lime),var(--pink),var(--seal-violet))]`}
                    >
                      <div className="w-full h-full rounded-full bg-ground-raised-2 flex items-center justify-center text-text font-bold text-lg">
                        {t.name[0]}
                      </div>
                    </div>
                    <div className="font-semibold text-[14px] text-text">{t.name}</div>
                    <div className="text-[11px] text-text-faint text-center leading-snug">
                      {t.accent} · {t.blurb}
                    </div>
                    {active && <IconCheck size={14} className="text-amber" strokeWidth={2.5} />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {(step > 0 || step === 7) && (
        <div className="max-w-[560px] w-full mx-auto px-5 pb-10 flex items-center justify-between gap-3">
          {step > 0 ? (
            <button
              onClick={goBack}
              className="flex items-center gap-1 text-text-faint hover:text-text text-[13px] font-semibold"
            >
              <IconChevronLeft size={14} /> Atrás
            </button>
          ) : (
            <span />
          )}
          {step === 7 && (
            <button
              onClick={finish}
              className="lift glow-amber border-none px-6 py-3 rounded-[10px] bg-amber text-[#1a1400] font-bold text-[14px]"
            >
              Confirmar y armar mi plan
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function FlagGrid({
  options,
  selected,
  onSelect,
}: {
  options: { label: string; flag: string }[];
  selected: string;
  onSelect: (label: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {options.map((l, i) => {
        const active = selected === l.label;
        return (
          <button
            key={l.label}
            onClick={() => onSelect(l.label)}
            className={`lift animate-fade-up flex items-center gap-2.5 border rounded-[12px] px-4 py-3.5 ${
              active ? "border-amber bg-amber-tint" : "border-line bg-ground-raised-2"
            }`}
            style={{ "--stagger": i } as React.CSSProperties}
          >
            <span className="text-xl">{l.flag}</span>
            <span className="text-[14px] font-semibold text-text">{l.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function IconGrid<T extends string>({
  options,
  selected,
  onSelect,
  cols = 2,
}: {
  options: IconOption<T>[];
  selected: T;
  onSelect: (v: T) => void;
  cols?: 1 | 2;
}) {
  return (
    <div className={`grid ${cols === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"} gap-3`}>
      {options.map((o, i) => {
        const active = selected === o.value;
        return (
          <button
            key={o.value}
            onClick={() => onSelect(o.value)}
            className={`lift animate-fade-up flex items-center gap-3 border rounded-[12px] px-4 py-3.5 text-left ${
              active ? "border-amber bg-amber-tint" : "border-line bg-ground-raised-2"
            }`}
            style={{ "--stagger": i } as React.CSSProperties}
          >
            <div
              className={`w-9 h-9 rounded-[9px] border flex items-center justify-center shrink-0 ${
                active ? "border-amber text-amber bg-ground-raised-2" : "border-line text-cyan bg-ground-raised-2"
              }`}
            >
              <o.icon size={16} />
            </div>
            <div className="min-w-0">
              <div className="text-[13.5px] font-semibold text-text truncate">{o.label}</div>
              {o.sub && <div className="text-[11px] text-text-faint truncate">{o.sub}</div>}
            </div>
          </button>
        );
      })}
    </div>
  );
}
