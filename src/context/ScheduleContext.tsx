"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type ReminderChannel = "app" | "whatsapp" | "sms" | "email";

export interface ScheduledSession {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  channels: ReminderChannel[];
  createdAt: string;
}

interface Ctx {
  sessions: ScheduledSession[];
  schedule: (date: string, time: string, channels: ReminderChannel[]) => void;
  cancel: (id: string) => void;
}

const ScheduleContext = createContext<Ctx | null>(null);
const STORAGE_KEY = "prixo-schedule";

export function ScheduleProvider({ children }: { children: React.ReactNode }) {
  const [sessions, setSessions] = useState<ScheduledSession[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // One-shot hydration from localStorage on mount, not a state sync loop.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setSessions(JSON.parse(raw));
    } catch {
      // ignore malformed storage
    }
  }, []);

  function schedule(date: string, time: string, channels: ReminderChannel[]) {
    setSessions((prev) => {
      const next = [
        ...prev,
        { id: crypto.randomUUID(), date, time, channels, createdAt: new Date().toISOString() },
      ].sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // storage unavailable, keep in-memory only
      }
      return next;
    });
  }

  function cancel(id: string) {
    setSessions((prev) => {
      const next = prev.filter((s) => s.id !== id);
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // storage unavailable, keep in-memory only
      }
      return next;
    });
  }

  return (
    <ScheduleContext.Provider value={{ sessions, schedule, cancel }}>
      {children}
    </ScheduleContext.Provider>
  );
}

export function useSchedule() {
  const ctx = useContext(ScheduleContext);
  if (!ctx) throw new Error("useSchedule must be used within ScheduleProvider");
  return ctx;
}
