"use client";

import { SessionProvider } from "next-auth/react";
import { TutorProfileProvider } from "@/context/TutorProfileContext";
import { PlanProvider } from "@/context/PlanContext";
import { SessionsProvider } from "@/context/SessionsContext";
import { ScheduleProvider } from "@/context/ScheduleContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <TutorProfileProvider>
        <PlanProvider>
          <SessionsProvider>
            <ScheduleProvider>{children}</ScheduleProvider>
          </SessionsProvider>
        </PlanProvider>
      </TutorProfileProvider>
    </SessionProvider>
  );
}
