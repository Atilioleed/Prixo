"use client";

import { useEffect, useState } from "react";
import ScreenHead from "@/components/ScreenHead";
import Pill from "@/components/Pill";
import { IconDownload } from "@/components/icons/Icon";

interface Material {
  title: string;
  level: string;
  type: string;
  file: string;
}

interface DbMaterial {
  id: string;
  title: string;
  level: string;
  type: string;
}

const MATERIALS: Material[] = [
  {
    title: "Mi familia y mis colores favoritos",
    level: "A1",
    type: "Vocabulario · Niños",
    file: "/materials/ingles-para-ninos-familia.md",
  },
  {
    title: "Vocabulario — en el supermercado",
    level: "A1",
    type: "Vocabulario",
    file: "/materials/vocabulario-supermercado.md",
  },
  {
    title: "Pasado simple — verbos irregulares",
    level: "A2",
    type: "Gramática",
    file: "/materials/pasado-simple-irregulares.md",
  },
  {
    title: "Presente perfecto — cuándo usarlo",
    level: "B1",
    type: "Gramática",
    file: "/materials/presente-perfecto.md",
  },
  {
    title: "Viajar sin traductor — aeropuerto y hotel",
    level: "B1",
    type: "Lección · Viajeros",
    file: "/materials/viajero-aeropuerto-hotel.md",
  },
  {
    title: "Business English — reuniones",
    level: "B2",
    type: "Lección",
    file: "/materials/business-english-reuniones.md",
  },
  {
    title: "Entrevista de trabajo en inglés",
    level: "B2",
    type: "Lección · Profesionales",
    file: "/materials/entrevista-de-trabajo.md",
  },
  {
    title: "Negociación avanzada con proveedores",
    level: "C1",
    type: "Lección · Negociadores",
    file: "/materials/negociacion-avanzada.md",
  },
];

export default function Materials() {
  const [dbMaterials, setDbMaterials] = useState<DbMaterial[]>([]);

  useEffect(() => {
    fetch("/api/materials")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data.materials)) setDbMaterials(data.materials);
      })
      .catch(() => {});
  }, []);

  const combined = [
    ...MATERIALS,
    ...dbMaterials.map((m) => ({
      title: m.title,
      level: m.level,
      type: m.type,
      file: `/api/materials/${m.id}/download`,
    })),
  ];

  return (
    <>
      <ScreenHead
        title="Material de apoyo para descargar"
        description="Lecciones, vocabulario y gramática generados a partir de tu nivel y tus errores frecuentes en el chat. Descárgalos para repasar sin conexión."
      />

      <div className="panel panel-bracketed divide-y divide-line">
        {combined.map((m, i) => (
          <div key={m.file} className="flex items-center gap-4 px-5 py-4">
            <div className="tabular text-text-faint text-[11px] w-6 shrink-0">
              {String(i + 1).padStart(2, "0")}
            </div>
            <Pill variant="a1">{m.level}</Pill>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-[13.5px] text-text truncate">{m.title}</div>
              <div className="text-[11px] text-text-faint">{m.type}</div>
            </div>
            <a
              href={m.file}
              download
              className="flex items-center gap-1.5 shrink-0 border border-line rounded-[8px] px-3 py-2 text-text-soft hover:border-amber hover:text-amber text-[12px] font-semibold"
            >
              <IconDownload size={13} />
              Descargar
            </a>
          </div>
        ))}
      </div>

      <div className="mt-5 border border-dashed border-line rounded-[10px] p-4 text-xs text-text-faint leading-relaxed">
        Estos {combined.length} documentos son contenido real, listo para descargar y
        usar — uno por nivel y por perfil (niños, viajeros, profesionales, negociadores).
        Esta lista se amplía cuando el equipo publica nuevo material desde el Panel
        admin → Documentos de aprendizaje.
      </div>
    </>
  );
}
