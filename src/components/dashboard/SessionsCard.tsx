"use client";

import { useSessions } from "@/context/SessionsContext";
import { IconMessageDots, IconTrend, IconVideo } from "@/components/icons/Icon";

const TYPE_ICON: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  practice: IconMessageDots,
  review: IconTrend,
  video: IconVideo,
};

function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return "ahora";
  if (mins < 60) return `hace ${mins} min`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `hace ${hours} h`;
  const days = Math.round(hours / 24);
  return `hace ${days} d`;
}

export default function SessionsCard() {
  const { sessions } = useSessions();

  return (
    <div className="panel p-5">
      <div className="data-label text-amber mb-3.5">Sesiones recientes</div>
      {sessions.length === 0 ? (
        <p className="text-sm text-text-soft">
          Todavía no hay sesiones registradas — se registran automáticamente cuando
          practicas en el chat o haces una videollamada.
        </p>
      ) : (
        <div className="flex flex-col gap-2.5 max-h-[280px] overflow-y-auto">
          {sessions.map((s) => {
            const Ic = TYPE_ICON[s.type] ?? IconMessageDots;
            return (
              <div key={s.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-[8px] bg-ground-raised-2 border border-line flex items-center justify-center text-cyan shrink-0">
                  <Ic size={14} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[12.5px] font-semibold text-text truncate">{s.label}</div>
                </div>
                <div className="text-[11px] text-text-faint shrink-0 tabular">{relativeTime(s.timestamp)}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
