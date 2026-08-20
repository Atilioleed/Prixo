"use client";

import { useEffect, useMemo, useState } from "react";
import ScreenHead from "@/components/ScreenHead";
import Pill from "@/components/Pill";
import { useTutorProfile } from "@/context/TutorProfileContext";
import { stagesFor } from "@/lib/curriculum";
import { IconDownload, IconLock, IconSearch } from "@/components/icons/Icon";

interface Material {
  title: string;
  level: string;
  type: string;
  language: string;
  file: string;
}

interface DbMaterial {
  id: string;
  title: string;
  level: string;
  type: string;
  language: string;
}

const LEVEL_ORDER = ["A1", "A2", "B1", "B2", "C1"];

const MATERIALS: Material[] = [
  {
    title: "Mi familia y mis colores favoritos",
    level: "A1",
    type: "Vocabulario · Niños",
    language: "Inglés",
    file: "/materials/ingles-para-ninos-familia.md",
  },
  {
    title: "Pasado simple — verbos irregulares",
    level: "A2",
    type: "Gramática",
    language: "Inglés",
    file: "/materials/pasado-simple-irregulares.md",
  },
  {
    title: "Presente perfecto — cuándo usarlo",
    level: "B1",
    type: "Gramática",
    language: "Inglés",
    file: "/materials/presente-perfecto.md",
  },
  {
    title: "Viajar sin traductor — aeropuerto y hotel",
    level: "B1",
    type: "Lección · Viajeros",
    language: "Inglés",
    file: "/materials/viajero-aeropuerto-hotel.md",
  },
  {
    title: "Business English — reuniones",
    level: "B2",
    type: "Lección",
    language: "Inglés",
    file: "/materials/business-english-reuniones.md",
  },
  {
    title: "Entrevista de trabajo en inglés",
    level: "B2",
    type: "Lección · Profesionales",
    language: "Inglés",
    file: "/materials/entrevista-de-trabajo.md",
  },
  {
    title: "Negociación avanzada con proveedores",
    level: "C1",
    type: "Lección · Negociadores",
    language: "Inglés",
    file: "/materials/negociacion-avanzada.md",
  },
];

export default function Materials() {
  const { profile, ready } = useTutorProfile();
  const [dbMaterials, setDbMaterials] = useState<DbMaterial[]>([]);
  const [search, setSearch] = useState("");
  const [languageFilter, setLanguageFilter] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/materials")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data.materials)) setDbMaterials(data.materials);
      })
      .catch(() => {});
  }, []);

  const combined: Material[] = useMemo(
    () => [
      ...MATERIALS,
      ...dbMaterials.map((m) => ({
        title: m.title,
        level: m.level,
        type: m.type,
        language: m.language,
        file: `/api/materials/${m.id}/download`,
      })),
    ],
    [dbMaterials]
  );

  const languages = useMemo(() => {
    const set = new Set(combined.map((m) => m.language));
    return Array.from(set).sort();
  }, [combined]);

  const activeLanguage = languageFilter ?? (languages.includes(profile.targetLanguage) ? profile.targetLanguage : languages[0]);

  // Progress is tracked per language (profile.progressByLanguage), so the
  // lock level reflects whichever language the student is browsing right
  // now — not always their main target language. Browsing a language they
  // haven't started yet correctly shows only A1 unlocked.
  const currentLevel = useMemo(() => {
    if (!ready) return "C1"; // don't lock anything while the profile is still loading
    const stages = stagesFor(profile.ageRange);
    const stageIndex = profile.progressByLanguage[activeLanguage] ?? 0;
    return stages[Math.min(stageIndex, stages.length - 1)].level;
  }, [ready, profile, activeLanguage]);
  const currentLevelIndex = LEVEL_ORDER.indexOf(currentLevel);

  const query = search.trim().toLowerCase();
  const filtered = combined.filter((m) => {
    if (m.language !== activeLanguage) return false;
    if (!query) return true;
    return m.title.toLowerCase().includes(query) || m.type.toLowerCase().includes(query);
  });

  const grouped = LEVEL_ORDER.map((level) => ({
    level,
    unlocked: LEVEL_ORDER.indexOf(level) <= currentLevelIndex,
    items: filtered.filter((m) => m.level === level),
  })).filter((g) => g.items.length > 0);

  const totalUnlocked = filtered.filter((m) => LEVEL_ORDER.indexOf(m.level) <= currentLevelIndex).length;

  return (
    <>
      <ScreenHead
        title="Material de apoyo para descargar"
        description="Lecciones, vocabulario y gramática generados a partir de tu nivel. Se van desbloqueando a medida que avanzas por el temario — descárgalos para repasar sin conexión."
      />

      <div className="flex flex-col sm:flex-row gap-2.5 mb-5">
        <div className="relative flex-1">
          <IconSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-faint" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por tema, ej. 'restaurante', 'presente perfecto'…"
            className="w-full border border-line rounded-[10px] pl-9 pr-3 py-2.5 text-[13px] bg-ground-raised-2 text-text outline-none focus:border-amber placeholder:text-text-faint"
          />
        </div>
        {languages.length > 1 && (
          <select
            value={activeLanguage}
            onChange={(e) => setLanguageFilter(e.target.value)}
            className="border border-line rounded-[10px] px-3 py-2.5 text-[13px] bg-ground-raised-2 text-text outline-none focus:border-amber"
          >
            {languages.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        )}
      </div>

      {grouped.length === 0 && (
        <div className="border border-dashed border-line rounded-[10px] p-6 text-center text-text-faint text-[12.5px]">
          No encontramos documentos con ese término. Prueba con otra palabra.
        </div>
      )}

      <div className="flex flex-col gap-5">
        {grouped.map((g) => (
          <div key={g.level}>
            <div className="flex items-center gap-2.5 mb-2.5">
              <span className="data-label text-amber">Nivel {g.level}</span>
              {!g.unlocked && (
                <span className="flex items-center gap-1 text-[10.5px] font-semibold text-text-faint">
                  <IconLock size={10} /> Se desbloquea al llegar a esta etapa del temario
                </span>
              )}
            </div>
            <div className={`panel panel-bracketed divide-y divide-line ${!g.unlocked ? "opacity-50" : ""}`}>
              {g.items.map((m) => (
                <div key={m.file} className="flex items-center gap-4 px-5 py-4">
                  <Pill variant="a1">{m.level}</Pill>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-[13.5px] text-text truncate">{m.title}</div>
                    <div className="text-[11px] text-text-faint">{m.type}</div>
                  </div>
                  {g.unlocked ? (
                    <a
                      href={m.file}
                      download
                      className="flex items-center gap-1.5 shrink-0 border border-line rounded-[8px] px-3 py-2 text-text-soft hover:border-amber hover:text-amber text-[12px] font-semibold"
                    >
                      <IconDownload size={13} />
                      Descargar
                    </a>
                  ) : (
                    <span className="flex items-center gap-1.5 shrink-0 border border-line rounded-[8px] px-3 py-2 text-text-faint text-[12px] font-semibold cursor-not-allowed">
                      <IconLock size={12} />
                      Bloqueado
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 border border-dashed border-line rounded-[10px] p-4 text-xs text-text-faint leading-relaxed">
        Tienes {totalUnlocked} documentos desbloqueados en {activeLanguage} (nivel actual:{" "}
        {currentLevel}). El resto se abre a medida que apruebas el examen final de cada etapa
        en el Temario.
      </div>
    </>
  );
}
