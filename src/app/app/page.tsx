"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import TopBar, { TabKey } from "@/components/TopBar";
import { useTutorProfile } from "@/context/TutorProfileContext";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import UserMenu from "@/components/UserMenu";
import Chat from "@/components/screens/Chat";
import Planning from "@/components/screens/Planning";
import Materials from "@/components/screens/Materials";
import Personalize from "@/components/screens/Personalize";
import UserDashboard from "@/components/screens/UserDashboard";
import Admin from "@/components/screens/Admin";
import OnboardingWizard from "@/components/onboarding/OnboardingWizard";

export default function AppShell() {
  const [tab, setTab] = useState<TabKey>("user");
  const { status } = useSession();
  const router = useRouter();
  const { profile, update, ready } = useTutorProfile();
  const isAdmin = useIsAdmin();

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
  }, [status, router]);

  if (status !== "authenticated" || !ready) {
    return (
      <div className="min-h-screen flex items-center justify-center text-text-faint text-sm">
        Cargando…
      </div>
    );
  }

  if (!profile.onboarded) {
    return <OnboardingWizard onDone={() => setTab("user")} />;
  }

  return (
    <div className="max-w-[1180px] mx-auto px-5 pt-7 pb-20">
      <TopBar active={tab} onChange={setTab} right={<UserMenu />} showAdmin={isAdmin === true} />

      <div key={tab} className="animate-rise">
        {tab === "planning" && (
          <Planning
            onPracticeScenario={(scenario) => {
              update({ scenario });
              setTab("chat");
            }}
          />
        )}
        {tab === "chat" && <Chat />}
        {tab === "materials" && <Materials />}
        {tab === "personalize" && <Personalize />}
        {tab === "user" && <UserDashboard onGoToPlanning={() => setTab("planning")} />}
        {tab === "admin" && isAdmin && <Admin />}
      </div>

      <footer className="text-center mt-[50px] flex flex-col items-center gap-2.5">
        <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[12px] font-semibold text-text-soft">
          <Link href="/privacidad" className="hover:text-text">Privacidad</Link>
          <Link href="/terminos" className="hover:text-text">Términos</Link>
          <Link href="/faq" className="hover:text-text">Preguntas frecuentes</Link>
        </nav>
        <div className="data-label">Prixo — Tu idioma, un paso a la vez. MVP en desarrollo.</div>
      </footer>
    </div>
  );
}
