"use client";

import { useEffect, useState } from "react";
import { IconCheck, IconClose } from "@/components/icons/Icon";
import type { PublicQuestion } from "@/lib/tests";

interface TestData {
  id: string;
  title: string;
  passingScore: number;
  questions: PublicQuestion[];
}

interface Props {
  language: string;
  ageRange: string;
  level: string;
  onClose: () => void;
  /** Called once the student passes for real — parent advances the stage. */
  onPassed: () => void;
}

type Phase = "loading" | "answering" | "submitting" | "result";

export default function TestModal({ language, ageRange, level, onClose, onPassed }: Props) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [test, setTest] = useState<TestData | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<{ score: number; passed: boolean; correctCount: number; total: number } | null>(null);

  useEffect(() => {
    const params = new URLSearchParams({ language, ageRange, level, kind: "final" });
    fetch(`/api/tests?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setTest(data.test);
        setPhase("answering");
      })
      .catch(() => setPhase("answering"));
  }, [language, ageRange, level]);

  async function submit() {
    if (!test) return;
    setPhase("submitting");
    try {
      const res = await fetch(`/api/tests/${test.id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      const data = await res.json();
      setResult(data);
      setPhase("result");
      if (data.passed) onPassed();
    } catch {
      setPhase("answering");
    }
  }

  const allAnswered = test ? test.questions.every((q) => answers[q.id] !== undefined) : false;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="panel panel-bracketed max-w-[560px] w-full p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {phase === "loading" && (
          <div className="text-center py-10 text-[13px] text-text-faint">Cargando examen…</div>
        )}

        {phase !== "loading" && !test && (
          <div className="text-center py-6">
            <h3 className="font-display text-xl font-bold mb-2 text-text">Todavía no hay examen real</h3>
            <p className="text-sm text-text-soft mb-6">
              Esta etapa no tiene un examen cargado en Panel admin → Pruebas y
              evaluaciones todavía. Por ahora puedes simular la aprobación (modo demo) —
              cuando el equipo publique el examen real, este botón te va a pedir
              rendirlo de verdad.
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={onClose}
                className="border border-line text-text-soft px-4 py-2.5 rounded-[10px] font-semibold text-sm hover:border-line-bright"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  onPassed();
                  onClose();
                }}
                className="border-none px-5 py-2.5 rounded-[10px] bg-amber text-[#1a1400] font-semibold text-sm"
              >
                Simular aprobación
              </button>
            </div>
          </div>
        )}

        {(phase === "answering" || phase === "submitting") && test && (
          <>
            <div className="data-label text-amber mb-1.5">Examen final</div>
            <h3 className="font-display text-xl font-bold mb-5 text-text">{test.title}</h3>
            <div className="flex flex-col gap-4">
              {test.questions.map((q, qi) => (
                <div key={q.id}>
                  <div className="text-[13px] font-semibold text-text mb-2">
                    {qi + 1}. {q.prompt}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {q.options.map((opt, oi) => (
                      <label
                        key={oi}
                        className={`flex items-center gap-2.5 border rounded-[8px] px-3 py-2 text-[12.5px] cursor-pointer ${
                          answers[q.id] === oi
                            ? "border-amber bg-amber-tint text-text"
                            : "border-line text-text-soft hover:border-line-bright"
                        }`}
                      >
                        <input
                          type="radio"
                          name={q.id}
                          checked={answers[q.id] === oi}
                          onChange={() => setAnswers((a) => ({ ...a, [q.id]: oi }))}
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={submit}
              disabled={!allAnswered || phase === "submitting"}
              className="w-full mt-6 border-none px-4 py-3 rounded-[10px] bg-amber text-[#1a1400] font-semibold text-sm disabled:opacity-40"
            >
              {phase === "submitting" ? "Corrigiendo…" : "Entregar examen"}
            </button>
          </>
        )}

        {phase === "result" && result && (
          <div className="text-center py-6">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 border ${
                result.passed ? "bg-cyan-tint border-cyan-dim/40" : "bg-red-tint border-red/30"
              }`}
            >
              {result.passed ? (
                <IconCheck size={22} className="text-cyan" strokeWidth={2.2} />
              ) : (
                <IconClose size={22} className="text-red" strokeWidth={2.2} />
              )}
            </div>
            <h3 className="font-display text-xl font-bold mb-2 text-text">
              {result.passed ? "¡Aprobado!" : "No aprobado todavía"}
            </h3>
            <p className="text-sm text-text-soft mb-1">
              {result.correctCount} de {result.total} correctas — {result.score}%
            </p>
            <p className="text-xs text-text-faint mb-6">
              {result.passed
                ? "Avanzaste a la siguiente etapa del temario."
                : `Necesitas ${test?.passingScore ?? 70}% para aprobar. Repasa con tu tutor e inténtalo de nuevo.`}
            </p>
            <button
              onClick={onClose}
              className="border-none px-5 py-2.5 rounded-[10px] bg-amber text-[#1a1400] font-semibold text-sm"
            >
              Listo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
