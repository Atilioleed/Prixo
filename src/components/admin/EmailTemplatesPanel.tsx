"use client";

import { useEffect, useState } from "react";
import { renderTemplate, type TemplateFields } from "@/lib/emailTemplates";

interface TemplateRow {
  key: string;
  name: string;
  trigger: string;
  sampleVars: Record<string, string>;
  active: boolean;
  activeNote: string;
  fields: TemplateFields;
  isCustomized: boolean;
}

const SAMPLE_SITE_URL = "https://prixo.cl";

export default function EmailTemplatesPanel() {
  const [templates, setTemplates] = useState<TemplateRow[] | null>(null);
  const [dbReady, setDbReady] = useState(true);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [draft, setDraft] = useState<TemplateFields | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function load() {
    fetch("/api/admin/email-templates")
      .then((r) => r.json())
      .then((data) => {
        if (data.templates) {
          setTemplates(data.templates);
          setDbReady(data.dbConfigured);
        }
      })
      .catch(() => {});
  }

  useEffect(load, []);

  function startEdit(t: TemplateRow) {
    setEditingKey(t.key);
    setDraft({ ...t.fields });
    setError(null);
  }

  async function save() {
    if (!editingKey || !draft) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/email-templates/${editingKey}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "No se pudo guardar.");
        return;
      }
      setEditingKey(null);
      setDraft(null);
      load();
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setSaving(false);
    }
  }

  async function revert(key: string) {
    setSaving(true);
    try {
      await fetch(`/api/admin/email-templates/${key}`, { method: "DELETE" });
      load();
    } finally {
      setSaving(false);
    }
  }

  if (!templates) {
    return <div className="text-[12.5px] text-text-faint">Cargando…</div>;
  }

  return (
    <div>
      <h3 className="text-[19px] font-bold mb-1 text-text">Plantillas de correo</h3>
      <div className="text-[12.5px] text-text-soft mb-[18px]">
        Así se ven los correos que Prixo envía, con tu marca (logo, color ámbar). Edítalas
        aquí abajo — se guardan en la base de datos y se usan la próxima vez que se envíe
        ese correo. Puedes usar <span className="font-mono text-amber">{"{{name}}"}</span>,{" "}
        <span className="font-mono text-amber">{"{{date}}"}</span> y{" "}
        <span className="font-mono text-amber">{"{{time}}"}</span> donde corresponda.
      </div>

      {!dbReady && (
        <div className="panel panel-bracketed p-4 mb-4 text-[12.5px] text-amber bg-amber-tint">
          Todavía no hay base de datos conectada — estás viendo las plantillas
          predeterminadas, pero los cambios no se pueden guardar hasta conectar una.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((t) => {
          const preview = renderTemplate(t.fields, t.sampleVars, SAMPLE_SITE_URL);
          const isEditing = editingKey === t.key;
          return (
            <div key={t.key} className="panel overflow-hidden">
              <div className="p-3.5 border-b border-line flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-semibold text-[13px] text-text">{t.name}</div>
                  <div className="text-[11px] text-text-faint mt-0.5">{t.trigger}</div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span
                    className={`data-label px-2.5 py-1 rounded-[var(--radius-chip)] font-bold ${
                      t.active ? "bg-cyan-tint text-cyan" : "bg-ground-raised-2 text-text-faint"
                    }`}
                  >
                    {t.active ? "Activo" : "Pendiente"}
                  </span>
                  {t.isCustomized && (
                    <span className="data-label px-2.5 py-1 rounded-[var(--radius-chip)] font-bold bg-amber-tint text-amber">
                      Editado
                    </span>
                  )}
                </div>
              </div>
              <div className="text-[11px] text-text-soft px-3.5 pt-2.5 pb-1">{t.activeNote}</div>

              {!isEditing ? (
                <>
                  <div className="p-3">
                    <iframe
                      title={t.name}
                      srcDoc={preview.html}
                      sandbox=""
                      className="w-full h-[260px] rounded-[8px] border border-line bg-white"
                    />
                  </div>
                  <div className="px-3.5 pb-3.5 flex gap-2">
                    <button
                      onClick={() => startEdit(t)}
                      disabled={!dbReady}
                      className="lift text-[11.5px] font-semibold border border-line rounded-[8px] px-3 py-2 text-text-soft hover:border-amber hover:text-amber disabled:opacity-40"
                    >
                      Editar
                    </button>
                    {t.isCustomized && (
                      <button
                        onClick={() => revert(t.key)}
                        disabled={saving}
                        className="text-[11.5px] font-semibold text-text-faint hover:text-red"
                      >
                        Volver al predeterminado
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <div className="p-3.5 flex flex-col gap-2.5">
                  <label className="data-label">Asunto</label>
                  <input
                    value={draft?.subject ?? ""}
                    onChange={(e) => setDraft((d) => (d ? { ...d, subject: e.target.value } : d))}
                    className="w-full border border-line rounded-[8px] px-3 py-2 text-[13px] bg-ground-raised-2 text-text outline-none focus:border-amber"
                  />
                  <label className="data-label">Título dentro del correo</label>
                  <input
                    value={draft?.title ?? ""}
                    onChange={(e) => setDraft((d) => (d ? { ...d, title: e.target.value } : d))}
                    className="w-full border border-line rounded-[8px] px-3 py-2 text-[13px] bg-ground-raised-2 text-text outline-none focus:border-amber"
                  />
                  <label className="data-label">Cuerpo (HTML)</label>
                  <textarea
                    value={draft?.bodyHtml ?? ""}
                    onChange={(e) => setDraft((d) => (d ? { ...d, bodyHtml: e.target.value } : d))}
                    rows={6}
                    className="w-full border border-line rounded-[8px] px-3 py-2 text-[12px] font-mono bg-ground-raised-2 text-text outline-none focus:border-amber resize-none"
                  />
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="data-label">Texto del botón</label>
                      <input
                        value={draft?.ctaLabel ?? ""}
                        onChange={(e) => setDraft((d) => (d ? { ...d, ctaLabel: e.target.value } : d))}
                        className="w-full border border-line rounded-[8px] px-3 py-2 text-[13px] bg-ground-raised-2 text-text outline-none focus:border-amber mt-1"
                      />
                    </div>
                    <div>
                      <label className="data-label">Ruta del botón</label>
                      <input
                        value={draft?.ctaPath ?? ""}
                        onChange={(e) => setDraft((d) => (d ? { ...d, ctaPath: e.target.value } : d))}
                        className="w-full border border-line rounded-[8px] px-3 py-2 text-[13px] bg-ground-raised-2 text-text outline-none focus:border-amber mt-1"
                      />
                    </div>
                  </div>
                  {error && <p className="text-[11.5px] text-red">{error}</p>}
                  <div className="flex gap-2 mt-1">
                    <button
                      onClick={save}
                      disabled={saving}
                      className="lift glow-amber text-[11.5px] font-bold border-none rounded-[8px] px-3.5 py-2 bg-amber text-[#1a1400] disabled:opacity-50"
                    >
                      {saving ? "Guardando…" : "Guardar"}
                    </button>
                    <button
                      onClick={() => {
                        setEditingKey(null);
                        setDraft(null);
                      }}
                      className="text-[11.5px] font-semibold text-text-faint hover:text-text"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
