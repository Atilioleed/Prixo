"use client";

import { useEffect, useMemo, useState } from "react";
import { useSchedule, ReminderChannel } from "@/context/ScheduleContext";
import { useSessions } from "@/context/SessionsContext";
import {
  IconChevronLeft,
  IconChevronRight,
  IconCheck,
  IconPhoneApp,
  IconMessageDots,
  IconMail,
  IconCalendar,
} from "@/components/icons/Icon";

const WEEKDAYS = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
const MONTHS = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];
const TIME_SLOTS = ["09:00", "10:00", "11:00", "12:00", "15:00", "16:00", "17:00"];
const CHANNELS: { key: ReminderChannel; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { key: "app", label: "App móvil", icon: IconPhoneApp },
  { key: "whatsapp", label: "WhatsApp", icon: IconMessageDots },
  { key: "sms", label: "SMS", icon: IconMail },
  { key: "email", label: "Correo", icon: IconMail },
];

function pad(n: number) {
  return n.toString().padStart(2, "0");
}
function dateKey(y: number, m: number, d: number) {
  return `${y}-${pad(m + 1)}-${pad(d)}`;
}

export default function ScheduleModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { sessions, schedule } = useSchedule();
  const { logSession } = useSessions();
  const today = useMemo(() => new Date(), []);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [channels, setChannels] = useState<Set<ReminderChannel>>(new Set(["app", "email"]));
  const [confirmed, setConfirmed] = useState(false);
  const [emailStatus, setEmailStatus] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const [calendarConnected, setCalendarConnected] = useState(false);
  const [calendarStatus, setCalendarStatus] = useState<"idle" | "creating" | "created" | "failed">("idle");

  useEffect(() => {
    if (!open) return;
    fetch("/api/connectors/google-calendar/status")
      .then((r) => r.json())
      .then((data) => setCalendarConnected(!!data.connected))
      .catch(() => {});
  }, [open]);

  if (!open) return null;

  const firstOfMonth = new Date(viewYear, viewMonth, 1);
  const startWeekday = firstOfMonth.getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const todayKey = dateKey(today.getFullYear(), today.getMonth(), today.getDate());
  const scheduledKeys = new Set(sessions.map((s) => s.date));

  const cells: (number | null)[] = [
    ...Array(startWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  function changeMonth(delta: number) {
    let m = viewMonth + delta;
    let y = viewYear;
    if (m < 0) { m = 11; y -= 1; }
    if (m > 11) { m = 0; y += 1; }
    setViewMonth(m);
    setViewYear(y);
  }

  function toggleChannel(c: ReminderChannel) {
    setChannels((prev) => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });
  }

  function confirm() {
    if (!selectedDate || !selectedTime) return;
    schedule(selectedDate, selectedTime, Array.from(channels));
    logSession("practice", `Clase agendada para el ${selectedDate} ${selectedTime}`);
    setConfirmed(true);

    const wantsEmail = channels.has("email");

    if (wantsEmail) setEmailStatus("sending");
    if (calendarConnected) setCalendarStatus("creating");

    fetch("/api/reminders/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: selectedDate, time: selectedTime, sendEmail: wantsEmail }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (wantsEmail) setEmailStatus(data.sent ? "sent" : "failed");
        if (calendarConnected) setCalendarStatus(data.calendarCreated ? "created" : "failed");
      })
      .catch(() => {
        if (wantsEmail) setEmailStatus("failed");
        if (calendarConnected) setCalendarStatus("failed");
      });
  }

  function close() {
    setConfirmed(false);
    setSelectedDate(null);
    setSelectedTime(null);
    setEmailStatus("idle");
    setCalendarStatus("idle");
    onClose();
  }

  const selectedLabel = selectedDate
    ? new Date(selectedDate + "T00:00:00").toLocaleDateString("es-CL", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    : null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={close}>
      <div
        className="panel panel-bracketed max-w-[640px] w-full p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {confirmed ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 rounded-full bg-cyan-tint border border-cyan-dim/40 flex items-center justify-center mx-auto mb-4">
              <IconCheck size={22} className="text-cyan" strokeWidth={2.2} />
            </div>
            <h3 className="font-display text-xl font-bold mb-2 text-text">Clase agendada</h3>
            <p className="text-sm text-text-soft mb-1">{selectedLabel} a las {selectedTime}</p>
            <p className="text-xs text-text-faint mb-1.5">
              Te avisamos por: {Array.from(channels).map((c) => CHANNELS.find((x) => x.key === c)?.label).join(", ") || "ningún canal seleccionado"}
            </p>
            {(channels.has("email") || calendarConnected) && (
              <div className="text-xs text-text-faint mb-6 flex flex-col gap-1">
                {channels.has("email") && (
                  <p>
                    {emailStatus === "sending" && "Enviando correo de confirmación…"}
                    {emailStatus === "sent" && "Correo de confirmación enviado."}
                    {emailStatus === "failed" && "No se pudo enviar el correo (revisa RESEND_API_KEY en Panel admin → Integraciones)."}
                  </p>
                )}
                {calendarConnected && (
                  <p>
                    {calendarStatus === "creating" && "Creando evento en tu Google Calendar…"}
                    {calendarStatus === "created" && "Evento creado en tu Google Calendar."}
                    {calendarStatus === "failed" && "No se pudo crear el evento en Google Calendar."}
                  </p>
                )}
              </div>
            )}
            {!channels.has("email") && !calendarConnected && <div className="mb-6" />}
            <button
              onClick={close}
              className="border-none px-5 py-2.5 rounded-[10px] bg-amber text-[#1a1400] font-semibold text-sm"
            >
              Listo
            </button>
          </div>
        ) : (
          <>
            <div className="data-label text-amber mb-1.5">Agendar sesión</div>
            <h3 className="font-display text-xl font-bold mb-5 text-text">Selecciona una fecha y hora</h3>
            <div className="grid grid-cols-1 sm:grid-cols-[1.1fr_1fr] gap-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <button onClick={() => changeMonth(-1)} className="text-text-faint hover:text-text px-1">
                    <IconChevronLeft size={16} />
                  </button>
                  <div className="font-semibold text-sm text-text">{MONTHS[viewMonth]} {viewYear}</div>
                  <button onClick={() => changeMonth(1)} className="text-text-faint hover:text-text px-1">
                    <IconChevronRight size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center mb-1">
                  {WEEKDAYS.map((w) => (
                    <div key={w} className="data-label">{w}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {cells.map((day, i) => {
                    if (day === null) return <div key={i} />;
                    const key = dateKey(viewYear, viewMonth, day);
                    const isToday = key === todayKey;
                    const isSelected = key === selectedDate;
                    const hasSession = scheduledKeys.has(key);
                    return (
                      <button
                        key={key}
                        onClick={() => setSelectedDate(key)}
                        className={`relative w-9 h-9 rounded-full text-[13px] tabular flex items-center justify-center ${
                          isSelected
                            ? "bg-amber text-[#1a1400] font-bold"
                            : isToday
                            ? "bg-amber-tint text-amber font-semibold"
                            : "hover:bg-ground-raised-2 text-text"
                        }`}
                      >
                        {day}
                        {hasSession && !isSelected && (
                          <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-cyan" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold mb-3 text-text">{selectedLabel ?? "Elige una fecha"}</div>
                <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto">
                  {TIME_SLOTS.map((t) => (
                    <button
                      key={t}
                      disabled={!selectedDate}
                      onClick={() => setSelectedTime(t)}
                      className={`border rounded-[8px] py-2.5 text-sm font-bold tabular disabled:opacity-40 ${
                        selectedTime === t
                          ? "bg-amber text-[#1a1400] border-amber"
                          : "border-line text-text-soft hover:border-line-bright"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="data-label mb-2">Avísame por</div>
              <div className="flex flex-wrap gap-2 mb-5">
                {CHANNELS.map((c) => (
                  <button
                    key={c.key}
                    onClick={() => toggleChannel(c.key)}
                    className={`border rounded-[var(--radius-chip)] px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 ${
                      channels.has(c.key)
                        ? "bg-amber text-[#1a1400] border-amber"
                        : "border-line text-text-soft"
                    }`}
                  >
                    <c.icon size={12} /> {c.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between gap-3 border border-line rounded-[10px] px-3.5 py-2.5 mb-5">
                <div className="flex items-center gap-2 text-xs text-text-soft">
                  <IconCalendar size={14} className={calendarConnected ? "text-cyan" : "text-text-faint"} />
                  {calendarConnected
                    ? "Google Calendar conectado — se crea el evento automáticamente."
                    : "Conecta tu Google Calendar para que la clase se agende sola."}
                </div>
                {!calendarConnected && (
                  <a
                    href="/api/connectors/google-calendar/start"
                    className="shrink-0 text-xs font-semibold text-amber hover:text-text"
                  >
                    Conectar
                  </a>
                )}
              </div>

              <button
                onClick={confirm}
                disabled={!selectedDate || !selectedTime}
                className="w-full border-none px-4 py-3 rounded-[10px] bg-amber text-[#1a1400] font-semibold text-sm disabled:opacity-40"
              >
                Agendar clase
              </button>
              <p className="text-[11px] text-text-faint mt-2.5 leading-relaxed">
                Si eliges correo, te mandamos una confirmación real (vía Resend). WhatsApp,
                SMS y las notificaciones push todavía necesitan conectar su proveedor (ver
                Panel admin → Integraciones).
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
