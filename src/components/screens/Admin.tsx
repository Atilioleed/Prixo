"use client";

import { useEffect, useState } from "react";
import ScreenHead from "@/components/ScreenHead";
import FlowRow from "@/components/FlowRow";
import Pill from "@/components/Pill";
import {
  IconLoop,
  IconTrend,
  IconAlarm,
  IconCap,
  IconTarget,
  IconUsers,
  IconCoin,
  IconGear,
  IconMessageDots,
  IconCheck,
  IconKey,
  IconPlug,
  IconCalendar,
  IconCoin as IconMoney,
  IconMessageDots as IconWhatsapp,
  IconMail,
  IconPhoneApp,
  IconWave,
  IconLock,
} from "@/components/icons/Icon";

type AdmKey =
  | "flujos"
  | "escenarios"
  | "docs"
  | "pruebas"
  | "usuarios"
  | "negocio"
  | "ia"
  | "capacitacion"
  | "integraciones"
  | "conectores";

const NAV: { key: AdmKey; label: string; group: string }[] = [
  { key: "flujos", label: "Flujos de conversación", group: "Gestión" },
  { key: "escenarios", label: "Escenarios de práctica", group: "Gestión" },
  { key: "docs", label: "Documentos de aprendizaje", group: "Gestión" },
  { key: "pruebas", label: "Pruebas y evaluaciones", group: "Gestión" },
  { key: "usuarios", label: "Usuarios y perfiles", group: "Alumnos" },
  { key: "negocio", label: "Métricas de negocio", group: "Negocio" },
  { key: "ia", label: "Configuración de IA / avatares", group: "Sistema" },
  { key: "capacitacion", label: "Capacitación del agente", group: "Sistema" },
  { key: "integraciones", label: "Integraciones", group: "Sistema" },
  { key: "conectores", label: "Conectores", group: "Sistema" },
];

const KPIS = [
  { v: "3,482", k: "Alumnos activos" },
  { v: "6", k: "Idiomas activos" },
  { v: "89%", k: "Retención a 30 días" },
  { v: "4.8", k: "Satisfacción promedio" },
];

const CLIENTES = [
  { name: "Martina R.", segment: "Joven", lang: "Inglés", level: "A2", activity: "Hoy", active: true },
  { name: "Atilio L.", segment: "Profesional", lang: "Inglés", level: "B2", activity: "Hoy", active: true },
  { name: "Familia Gómez (3 perfiles)", segment: "Niño / Adulto", lang: "Inglés", level: "A1 / B1", activity: "Ayer", active: true },
  { name: "Javiera C.", segment: "Adulto", lang: "Inglés", level: "B1", activity: "Hace 3 días", active: true },
  { name: "Roberto P.", segment: "Negociador", lang: "Inglés", level: "B2", activity: "Hace 40 días", active: false },
  { name: "Sofía T.", segment: "Joven viajero", lang: "Inglés", level: "A2", activity: "Hace 60 días", active: false },
];

const PLAN_BREAKDOWN = [
  { plan: "Individual", clients: 2840, avg: 8, revenue: 22720 },
  { plan: "Familiar", clients: 512, avg: 22, revenue: 11264 },
  { plan: "Empresas", clients: 130, avg: 340, revenue: 44200 },
];

const CONNECTORS = [
  { icon: IconCalendar, name: "Google Calendar", desc: "Sincroniza las clases que el alumno agenda desde su panel — pendiente, necesita OAuth de Google Calendar además del login", active: false },
  { icon: IconMoney, name: "Stripe", desc: "Cobro de suscripciones y facturación", active: false },
  { icon: IconWhatsapp, name: "WhatsApp Business (Twilio)", desc: "Envía los recordatorios de clase que el alumno eligió por WhatsApp", active: false },
  { icon: IconMail, name: "SMS (Twilio)", desc: "Envía los recordatorios de clase por mensaje de texto", active: false },
  { icon: IconPhoneApp, name: "Notificaciones push (app móvil)", desc: "Recordatorios dentro de la app — requiere la app nativa, no solo la PWA", active: false },
  { icon: IconPlug, name: "Zapier", desc: "Automatizaciones con otras herramientas", active: false },
  { icon: IconMessageDots, name: "Slack", desc: "Alertas internas para el equipo de Prixo", active: false },
];

interface ProviderStatus {
  id: string;
  label: string;
  tier: "free" | "pago";
  priority: number;
  configured: boolean;
  model: string;
}

interface ApiStatus {
  aiProviders: ProviderStatus[];
  email: { configured: boolean };
  googleAuth: { configured: boolean };
}

function money(n: number) {
  return `$${n.toLocaleString("es-CL")}`;
}

function TableHead({ cols }: { cols: string[] }) {
  return (
    <thead>
      <tr>
        {cols.map((h) => (
          <th
            key={h}
            className="text-left font-mono text-[10.5px] uppercase tracking-[0.05em] text-text-faint px-2.5 py-2 border-b-[1.5px] border-line"
          >
            {h}
          </th>
        ))}
      </tr>
    </thead>
  );
}

export default function Admin() {
  const [tab, setTab] = useState<AdmKey>("flujos");
  const [clientes, setClientes] = useState(CLIENTES);
  const [apiStatus, setApiStatus] = useState<ApiStatus | null>(null);

  useEffect(() => {
    if (tab !== "integraciones") return;
    fetch("/api/admin/status")
      .then((r) => r.json())
      .then((data) => {
        if (!data.error) setApiStatus(data);
      })
      .catch(() => {});
  }, [tab]);

  const groupSeen = new Set<string>();
  const activeCount = clientes.filter((c) => c.active).length;
  const inactiveCount = clientes.length - activeCount;
  const totalRevenue = PLAN_BREAKDOWN.reduce((s, p) => s + p.revenue, 0);
  const totalCosts = Math.round(totalRevenue * 0.42);
  const margin = totalRevenue - totalCosts;
  const marginPct = Math.round((margin / totalRevenue) * 100);

  return (
    <>
      <ScreenHead
        title="Panel administrativo"
        description="Solo administradores. Donde tu equipo gestiona flujos de conversación, material de estudio, pruebas, usuarios y las métricas del negocio."
      />

      <div className="panel panel-bracketed grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-line mb-5">
        {KPIS.map((k) => (
          <div key={k.k} className="p-4">
            <div className="tabular font-semibold text-xl text-text">{k.v}</div>
            <div className="data-label mt-1">{k.k}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] panel overflow-hidden min-h-[640px] p-0">
        <div className="bg-ground border-b md:border-b-0 md:border-r border-line p-3 md:p-[18px_12px]">
          {NAV.map((item, i) => {
            const showGroup = !groupSeen.has(item.group);
            groupSeen.add(item.group);
            return (
              <div key={item.key}>
                {showGroup && (
                  <div
                    className={`data-label mx-2.5 mb-1.5 ${i === 0 ? "mt-0" : "mt-3.5"}`}
                  >
                    {item.group}
                  </div>
                )}
                <button
                  onClick={() => setTab(item.key)}
                  className={`w-full text-left border-none px-2.5 py-2.5 rounded-[8px] text-[13px] font-semibold flex items-center gap-2 ${
                    tab === item.key ? "bg-amber-tint text-amber" : "text-text-soft hover:bg-ground-raised-2"
                  }`}
                >
                  {item.label}
                </button>
              </div>
            );
          })}
        </div>

        <div className="p-6 md:px-[26px] md:py-6">
          {tab === "flujos" && (
            <div>
              <h3 className="text-[19px] font-bold mb-1 text-text">Flujos de conversación</h3>
              <div className="text-[12.5px] text-text-soft mb-[18px]">
                Secuencias automatizadas que la IA ejecuta según el contexto del alumno.
              </div>
              <FlowRow icon={<IconWave size={16} />} name="Bienvenida — primer contacto" meta="Se activa al crear la cuenta" active />
              <FlowRow icon={<IconTrend size={16} />} name="Evaluación de nivel inicial" meta="Ubica al alumno en A1–C1 antes de la primera lección" active />
              <FlowRow icon={<IconLoop size={16} />} name="Refuerzo semanal de vocabulario" meta="Repasa palabras con errores frecuentes" active />
              <FlowRow icon={<IconAlarm size={16} />} name="Alerta de inactividad (7 días)" meta="Mensaje motivacional + resumen de progreso" active={false} />
              <FlowRow icon={<IconCap size={16} />} name="Preparación para examen" meta='Solo para alumnos con objetivo "Examen"' active />
            </div>
          )}

          {tab === "escenarios" && (
            <div>
              <h3 className="text-[19px] font-bold mb-1 text-text">Escenarios de práctica</h3>
              <div className="text-[12.5px] text-text-soft mb-[18px]">
                Plantillas de roleplay reutilizables entre idiomas — el segundo eje de
                escalabilidad, junto al idioma.
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-[12.5px]">
                  <TableHead cols={["Escenario", "Perfil objetivo", "Vertical", "Idiomas activos", "Estado"]} />
                  <tbody>
                    {[
                      ["Negociar precio con proveedor", "Empresario / negociador", "Compras / logística", "3", "pub"],
                      ["Pitch a inversionistas", "Empresario / negociador", "Startups / fintech", "2", "pub"],
                      ["Entrevista de visa de trabajo", "Joven viajero", "Migración", "3", "pub"],
                      ["Alquilar un departamento afuera", "Joven viajero", "Vida diaria", "2", "pub"],
                      ["Reunión de seguimiento con cliente", "Profesional", "Ventas", "1", "draft"],
                    ].map((row) => (
                      <tr key={row[0]}>
                        {row.slice(0, 4).map((c, i) => (
                          <td key={i} className="px-2.5 py-2.5 border-b border-line text-text">
                            {c}
                          </td>
                        ))}
                        <td className="px-2.5 py-2.5 border-b border-line">
                          <Pill variant={row[4] === "pub" ? "pub" : "draft"}>
                            {row[4] === "pub" ? "Publicado" : "Borrador"}
                          </Pill>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === "docs" && (
            <div>
              <h3 className="text-[19px] font-bold mb-1 text-text">Documentos de aprendizaje</h3>
              <div className="text-[12.5px] text-text-soft mb-[18px]">
                Lecciones, vocabulario y material de gramática que alimentan a la IA por
                idioma y nivel. Los mismos que el alumno ve en &quot;Materiales&quot;.
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-[12.5px]">
                  <TableHead cols={["Documento", "Idioma", "Nivel", "Tipo", "Estado"]} />
                  <tbody>
                    {[
                      ["Pasado simple — irregulares", "Inglés", "A2", "Gramática", "pub"],
                      ["Vocabulario — en el supermercado", "Inglés", "A1", "Vocabulario", "pub"],
                      ["Business English — reuniones", "Inglés", "B2", "Lección", "pub"],
                      ["Presente perfecto", "Inglés", "B1", "Gramática", "draft"],
                      ["Verbos de acción — niños", "Inglés", "A1", "Vocabulario", "draft"],
                    ].map((row) => (
                      <tr key={row[0]}>
                        <td className="px-2.5 py-2.5 border-b border-line text-text">{row[0]}</td>
                        <td className="px-2.5 py-2.5 border-b border-line text-text">{row[1]}</td>
                        <td className="px-2.5 py-2.5 border-b border-line">
                          <Pill variant="a1">{row[2]}</Pill>
                        </td>
                        <td className="px-2.5 py-2.5 border-b border-line text-text">{row[3]}</td>
                        <td className="px-2.5 py-2.5 border-b border-line">
                          <Pill variant={row[4] === "pub" ? "pub" : "draft"}>
                            {row[4] === "pub" ? "Publicado" : "Borrador"}
                          </Pill>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === "pruebas" && (
            <div>
              <h3 className="text-[19px] font-bold mb-1 text-text">Pruebas y evaluaciones</h3>
              <div className="text-[12.5px] text-text-soft mb-[18px]">
                Exámenes que miden avance y ajustan automáticamente el nivel del alumno —
                son las mismas pruebas que gatillan avanzar de etapa en el Temario.
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-[12.5px]">
                  <TableHead cols={["Prueba", "Idioma", "Nivel objetivo", "Preguntas", "Aprobación"]} />
                  <tbody>
                    {[
                      ["Diagnóstico inicial", "Inglés", "A1–C1", "24", "—"],
                      ["Cierre de unidad — Pasado simple", "Inglés", "A2", "12", "82%"],
                      ["Simulacro entrevista laboral", "Inglés", "B2", "10", "67%"],
                      ["Repaso de vocabulario semanal", "Inglés", "A1", "15", "91%"],
                    ].map((row) => (
                      <tr key={row[0]}>
                        <td className="px-2.5 py-2.5 border-b border-line text-text">{row[0]}</td>
                        <td className="px-2.5 py-2.5 border-b border-line text-text">{row[1]}</td>
                        <td className="px-2.5 py-2.5 border-b border-line">
                          <Pill variant="a1">{row[2]}</Pill>
                        </td>
                        <td className="px-2.5 py-2.5 border-b border-line text-text">{row[3]}</td>
                        <td className="px-2.5 py-2.5 border-b border-line text-text">{row[4]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === "usuarios" && (
            <div>
              <h3 className="text-[19px] font-bold mb-1 text-text">Usuarios y perfiles</h3>
              <div className="text-[12.5px] text-text-soft mb-4">
                Cuentas individuales y familiares, con su segmento, avance y estado.
              </div>
              <div className="flex gap-3 mb-4">
                <div className="border border-line rounded-[10px] px-3.5 py-2.5 flex items-center gap-2">
                  <IconUsers size={14} className="text-cyan" />
                  <div>
                    <div className="tabular font-semibold text-text">{activeCount}</div>
                    <div className="data-label">Activos</div>
                  </div>
                </div>
                <div className="border border-line rounded-[10px] px-3.5 py-2.5 flex items-center gap-2">
                  <IconLock size={14} className="text-text-faint" />
                  <div>
                    <div className="tabular font-semibold text-text">{inactiveCount}</div>
                    <div className="data-label">Desactivados</div>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-[12.5px]">
                  <TableHead cols={["Alumno", "Segmento", "Idioma", "Nivel", "Última actividad", "Estado", ""]} />
                  <tbody>
                    {clientes.map((c) => (
                      <tr key={c.name}>
                        <td className="px-2.5 py-2.5 border-b border-line text-text">{c.name}</td>
                        <td className="px-2.5 py-2.5 border-b border-line text-text">{c.segment}</td>
                        <td className="px-2.5 py-2.5 border-b border-line text-text">{c.lang}</td>
                        <td className="px-2.5 py-2.5 border-b border-line text-text">{c.level}</td>
                        <td className="px-2.5 py-2.5 border-b border-line text-text">{c.activity}</td>
                        <td className="px-2.5 py-2.5 border-b border-line">
                          <Pill variant={c.active ? "pub" : "draft"}>
                            {c.active ? "Activo" : "Desactivado"}
                          </Pill>
                        </td>
                        <td className="px-2.5 py-2.5 border-b border-line">
                          <button
                            onClick={() =>
                              setClientes((prev) =>
                                prev.map((x) => (x.name === c.name ? { ...x, active: !x.active } : x))
                              )
                            }
                            className="text-[11px] font-semibold text-cyan hover:text-text"
                          >
                            {c.active ? "Desactivar" : "Reactivar"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === "negocio" && (
            <div>
              <h3 className="text-[19px] font-bold mb-1 text-text">Métricas de negocio</h3>
              <div className="text-[12.5px] text-text-soft mb-[18px]">
                Datos de ejemplo — se conectan a tu pasarela de pago real (ver Conectores).
              </div>
              <div className="panel grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-line mb-6">
                <div className="p-3.5 flex items-center gap-2.5">
                  <IconCoin size={16} className="text-amber shrink-0" />
                  <div>
                    <div className="tabular font-semibold text-lg text-text">{money(totalRevenue)}</div>
                    <div className="data-label">Ingresos / mes</div>
                  </div>
                </div>
                <div className="p-3.5 flex items-center gap-2.5">
                  <IconTrend size={16} className="text-red shrink-0" />
                  <div>
                    <div className="tabular font-semibold text-lg text-text">{money(totalCosts)}</div>
                    <div className="data-label">Costos / mes</div>
                  </div>
                </div>
                <div className="p-3.5 flex items-center gap-2.5">
                  <IconCoin size={16} className="text-cyan shrink-0" />
                  <div>
                    <div className="tabular font-semibold text-lg text-text">{money(margin)}</div>
                    <div className="data-label">Margen bruto</div>
                  </div>
                </div>
                <div className="p-3.5 flex items-center gap-2.5">
                  <IconTarget size={16} className="text-cyan shrink-0" />
                  <div>
                    <div className="tabular font-semibold text-lg text-text">{marginPct}%</div>
                    <div className="data-label">Utilidad</div>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-[12.5px]">
                  <TableHead cols={["Plan", "Clientes", "Ingreso promedio", "Ingreso total"]} />
                  <tbody>
                    {PLAN_BREAKDOWN.map((p) => (
                      <tr key={p.plan}>
                        <td className="px-2.5 py-2.5 border-b border-line font-semibold text-text">{p.plan}</td>
                        <td className="px-2.5 py-2.5 border-b border-line text-text tabular">{p.clients.toLocaleString("es-CL")}</td>
                        <td className="px-2.5 py-2.5 border-b border-line text-text tabular">{money(p.avg)}</td>
                        <td className="px-2.5 py-2.5 border-b border-line text-text tabular">{money(p.revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === "ia" && (
            <div>
              <h3 className="text-[19px] font-bold mb-1 text-text">Configuración de IA / avatares</h3>
              <div className="text-[12.5px] text-text-soft mb-[18px]">
                Voces, personalidades y reglas de corrección disponibles para todos los
                alumnos.
              </div>
              <FlowRow icon={<IconMessageDots size={16} />} name="Banco de voces" meta="6 voces activas · americano, británico, neutro" active />
              <FlowRow icon={<IconGear size={16} />} name="Personalidades base" meta="Cercano, formal, motivador, exigente" active />
              <FlowRow icon={<IconCheck size={16} />} name="Reglas de corrección" meta="Nivel de tolerancia al error por segmento (niño vs. profesional)" active />
            </div>
          )}

          {tab === "capacitacion" && (
            <div>
              <h3 className="text-[19px] font-bold mb-1 text-text">Capacitación del agente</h3>
              <div className="text-[12.5px] text-text-soft mb-[18px]">
                Cómo mejora el tutor de IA con el uso — datos que alimentan el prompt y las
                reglas de corrección.
              </div>
              <FlowRow icon={<IconCheck size={16} />} name="Correcciones revisadas por humano" meta="342 esta semana · mejora las reglas de corrección" active />
              <FlowRow icon={<IconMessageDots size={16} />} name="Conversaciones de referencia" meta="128 conversaciones marcadas como ejemplo de buen tono" active />
              <FlowRow icon={<IconTarget size={16} />} name="Escenarios nuevos sugeridos por alumnos" meta="14 pendientes de revisión" active={false} />
              <FlowRow icon={<IconTrend size={16} />} name="Feedback de satisfacción post-sesión" meta="4.8 / 5 promedio, 1.240 respuestas" active />
            </div>
          )}

          {tab === "integraciones" && (
            <div>
              <h3 className="text-[19px] font-bold mb-1 text-text">Integraciones</h3>
              <div className="text-[12.5px] text-text-soft mb-[18px]">
                El &quot;cerebro&quot; de la IA prueba estos proveedores en este orden y pasa
                al siguiente automáticamente si uno falla o no está configurado — así el
                tutor sigue funcionando aunque un proveedor tenga una caída. Por seguridad
                nunca se muestra la clave completa, solo si está configurada.
              </div>
              {!apiStatus ? (
                <div className="text-[12.5px] text-text-faint">Cargando…</div>
              ) : (
                <>
                  <div className="data-label mb-2.5 mt-1">Agentes de IA — orden de respaldo</div>
                  {apiStatus.aiProviders.map((p) => (
                    <FlowRow
                      key={p.id}
                      icon={<IconKey size={16} />}
                      name={`${p.priority} · ${p.label} (${p.tier === "free" ? "gratis" : "pago"})`}
                      meta={
                        p.configured
                          ? `Configurada · modelo ${p.model}`
                          : `No configurada — agregala en .env.local (ver .env.local.example)`
                      }
                      active={p.configured}
                    />
                  ))}

                  <div className="data-label mb-2.5 mt-5">Correo y acceso</div>
                  <FlowRow
                    icon={<IconMail size={16} />}
                    name="Email (Resend) — confirmaciones y recordatorios"
                    meta={apiStatus.email.configured ? "Configurada" : "No configurada — RESEND_API_KEY"}
                    active={apiStatus.email.configured}
                  />
                  <FlowRow
                    icon={<IconKey size={16} />}
                    name="Google — inicio de sesión"
                    meta={apiStatus.googleAuth.configured ? "Configurada" : "No configurada — AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET"}
                    active={apiStatus.googleAuth.configured}
                  />
                </>
              )}
            </div>
          )}

          {tab === "conectores" && (
            <div>
              <h3 className="text-[19px] font-bold mb-1 text-text">Conectores</h3>
              <div className="text-[12.5px] text-text-soft mb-[18px]">
                Integraciones con otras herramientas. Los agentes de IA y el correo (Resend)
                ya funcionan de verdad — ver Panel admin → Integraciones. El resto de acá
                son conectores conceptuales todavía sin construir: cuando un alumno elige
                avisos por WhatsApp, SMS o notificación push, hoy quedan guardados como
                recordatorio interno, sin enviarse.
              </div>
              {CONNECTORS.map((c) => (
                <FlowRow key={c.name} icon={<c.icon size={16} />} name={c.name} meta={c.desc} active={c.active} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
