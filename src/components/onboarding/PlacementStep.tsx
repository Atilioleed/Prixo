"use client";

import { useState } from "react";
import { placementWordsFor, scorePlacement } from "@/lib/placementWords";
import { IconCheck } from "@/components/icons/Icon";

export default function PlacementStep({
  language,
  onContinue,
}: {
  language: string;
  onContinue: (score: number) => void;
}) {
  const [words] = useState(() => placementWordsFor(language));
  const [known, setKnown] = useState<Set<string>>(new Set());

  function toggle(word: string) {
    setKnown((prev) => {
      const next = new Set(prev);
      if (next.has(word)) next.delete(word);
      else next.add(word);
      return next;
    });
  }

  const { score, label } = scorePlacement(words, known);

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-5">
        {words.map((w, i) => {
          const active = known.has(w.word);
          return (
            <button
              key={w.word}
              onClick={() => toggle(w.word)}
              className={`lift animate-fade-up flex items-center justify-between gap-2 border rounded-[10px] px-3.5 py-3 text-[14px] font-semibold capitalize ${
                active ? "border-cyan bg-cyan-tint text-cyan" : "border-line bg-ground-raised-2 text-text"
              }`}
              style={{ "--stagger": i } as React.CSSProperties}
            >
              <span>{w.word}</span>
              {active && <IconCheck size={13} strokeWidth={2.5} />}
            </button>
          );
        })}
      </div>
      <div className="panel panel-bracketed px-4 py-3 mb-6 flex items-center justify-between flex-wrap gap-2">
        <span className="text-[12.5px] text-text-soft">
          Reconociste {known.size} de {words.length} palabras
        </span>
        <span className="data-label text-amber">Nivel sugerido: {label}</span>
      </div>
      <button
        onClick={() => onContinue(score)}
        className="lift glow-amber w-full border-none px-5 py-3.5 rounded-[10px] bg-amber text-[#1a1400] font-bold text-[14.5px]"
      >
        Continuar
      </button>
    </div>
  );
}
