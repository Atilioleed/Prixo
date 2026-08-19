"use client";

import { useState } from "react";
import ScreenHead from "@/components/ScreenHead";
import VideoCallModal from "@/components/VideoCallModal";
import AccountCard from "@/components/dashboard/AccountCard";
import PlanSummaryCard from "@/components/dashboard/PlanSummaryCard";
import CurriculumCard from "@/components/dashboard/CurriculumCard";
import SessionsCard from "@/components/dashboard/SessionsCard";
import ScheduleModal from "@/components/dashboard/ScheduleModal";
import { useTutorProfile } from "@/context/TutorProfileContext";
import { usePlan } from "@/context/PlanContext";
import { useSessions } from "@/context/SessionsContext";
import { useSchedule } from "@/context/ScheduleContext";
import { STAGES } from "@/lib/curriculum";
import { useSession } from "next-auth/react";
import {
  IconFlame,
  IconBook,
  IconCheck,
  IconCalendar,
  IconBell,
  IconVideo,
  IconPhoneApp,
  IconMessageDots,
  IconMail,
} from "@/components/icons/Icon";

const CHANNEL_ICON: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  app: IconPhoneApp,
  whatsapp: IconMessageDots,
  sms: IconMail,
  email: IconMail,
};

export default function UserDashboard({ onGoToPlanning }: { onGoToPlanning: () => void }) {
  const { data: session } = useSession();
  const { profile } = useTutorProfile();
  const { activePlan } = usePlan();
  const { logSession } = useSessions();
  const { sessions: scheduledClasses, cancel } = useSchedule();
  const [videoOpen, setVideoOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);

  const displayName = profile.displayName || session?.user?.name || "";
  const currentStage = STAGES[Math.min(profile.stageIndex, STAGES.length - 1)];

  return (
    <>
      <ScreenHead
        title={`Hola${displayName ? `, ${displayName}` : ""}`}
        description={`Nivel ${currentStage.level} · ${profile.targetLanguage} — tu resumen diario, tu plan, tu temario y tus sesiones.`}
      />

      <div className="panel panel-bracketed grid grid-cols-3 divide-x divide-line mb-6">
        <div className="p-4 sm:p-5 flex items-center gap-3">
          <IconFlame size={22} className="text-amber shrink-0" />
          <div>
            <div className="tabular font-semibold text-xl sm:text-2xl leading-none text-text">12</div>
            <div className="data-label mt-1">Racha</div>
          </div>
        </div>
        <div className="p-4 sm:p-5 flex items-center gap-3">
          <IconBook size={20} className="text-seal-violet shrink-0" />
          <div>
            <div className="tabular font-semibold text-xl sm:text-2xl leading-none text-text">248</div>
            <div className="data-label mt-1">Palabras</div>
          </div>
        </div>
        <div className="p-4 sm:p-5 flex items-center gap-3">
          <IconCheck size={20} className="text-pink shrink-0" />
          <div>
            <div className="tabular font-semibold text-xl sm:text-2xl leading-none text-text">{profile.stageIndex}</div>
            <div className="data-label mt-1">Etapas</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4 items-start">
        <div className="flex flex-col gap-4">
          <PlanSummaryCard onGoToPlanning={onGoToPlanning} />
          <CurriculumCard />
          <SessionsCard />
        </div>

        <div className="flex flex-col gap-4">
          <div className="panel p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <IconCalendar size={16} className="text-amber" />
                <span className="font-semibold text-[13px] text-text">Mis clases agendadas</span>
              </div>
              <button
                onClick={() => setScheduleOpen(true)}
                className="lift glow-amber text-[11px] font-bold text-[#1a1400] bg-amber px-3 py-1.5 rounded-[var(--radius-chip)]"
              >
                + Agendar
              </button>
            </div>
            {scheduledClasses.length === 0 ? (
              <p className="text-[12px] text-text-soft">
                Todavía no agendaste ninguna clase. Elige un día y hora para recibir
                recordatorios.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {scheduledClasses.slice(0, 4).map((s) => (
                  <div key={s.id} className="flex items-center justify-between gap-2 bg-ground-raised-2 border border-line rounded-[8px] px-3 py-2">
                    <div className="text-[12px] text-text tabular">
                      <span className="font-semibold">{s.date}</span> · {s.time}
                      <div className="flex items-center gap-1.5 mt-1 text-text-faint">
                        {s.channels.map((c) => {
                          const Ic = CHANNEL_ICON[c];
                          return Ic ? <Ic key={c} size={11} /> : null;
                        })}
                      </div>
                    </div>
                    <button
                      onClick={() => cancel(s.id)}
                      className="text-[10.5px] font-semibold text-text-faint hover:text-red"
                    >
                      Cancelar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="panel p-5">
            <div className="flex items-center gap-2 mb-2.5">
              <IconBell size={16} className="text-amber" />
              <span className="font-semibold text-[13px] text-text">Recordatorios</span>
            </div>
            {activePlan && activePlan.milestones.length > 0 ? (
              <div className="flex flex-col gap-1.5">
                {activePlan.milestones.slice(0, 4).map((m, i) => (
                  <div key={i} className="text-[12px] text-text-soft">
                    <span className="font-semibold text-text">{m.title}</span> — {m.when}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-[12px] text-text-faint">
                Arma tu plan para ver tus próximos hitos acá.
              </div>
            )}
          </div>

          <div className="panel panel-bracketed p-4 bg-amber-tint">
            <div className="flex items-center gap-2 mb-0.5">
              <IconVideo size={15} className="text-amber" />
              <span className="font-semibold text-[13px] text-text">Practicar por videollamada</span>
            </div>
            <div className="text-[11px] text-text-soft mb-3 ml-[23px]">15 min con {profile.avatarName}</div>
            <button
              onClick={() => {
                setVideoOpen(true);
                logSession("video", `Videollamada con ${profile.avatarName}`);
              }}
              className="lift glow-amber w-full border-none bg-amber text-[#1a1400] px-3.5 py-2.5 rounded-[var(--radius-chip)] font-bold text-[12px]"
            >
              Iniciar
            </button>
          </div>

          <AccountCard />
        </div>
      </div>

      <VideoCallModal open={videoOpen} onClose={() => setVideoOpen(false)} tutorName={profile.avatarName} />
      <ScheduleModal open={scheduleOpen} onClose={() => setScheduleOpen(false)} />
    </>
  );
}
