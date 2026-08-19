"use client";

export type TabKey =
  | "planning"
  | "chat"
  | "materials"
  | "personalize"
  | "user"
  | "admin";

const TABS: { key: TabKey; label: string }[] = [
  { key: "user", label: "Panel" },
  { key: "planning", label: "Planificación" },
  { key: "chat", label: "Chat" },
  { key: "materials", label: "Materiales" },
  { key: "personalize", label: "Tutor" },
  { key: "admin", label: "Admin" },
];

export default function TopBar({
  active,
  onChange,
  right,
  showAdmin = false,
}: {
  active: TabKey;
  onChange: (tab: TabKey) => void;
  right?: React.ReactNode;
  showAdmin?: boolean;
}) {
  const tabs = TABS.filter((t) => t.key !== "admin" || showAdmin);

  return (
    <div className="flex items-center justify-between gap-4 mb-8 flex-wrap border-b border-line pb-5">
      <div className="flex items-center gap-2.5">
        <div className="relative w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_220deg,var(--seal-violet),var(--pink),var(--seal-lime),var(--seal-violet))] animate-seal-spin" />
          <div className="relative w-3 h-3 rounded-full bg-ground" />
        </div>
        <div className="leading-none">
          <div className="font-display font-bold text-[18px] tracking-[-0.01em] text-text">Prixo</div>
          <div className="data-label text-text-faint">Tu idioma, un paso a la vez.</div>
        </div>
      </div>
      <nav className="flex gap-1 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`px-3.5 py-2 rounded-[8px] font-semibold text-[13px] whitespace-nowrap transition-all duration-200 border ${
              active === tab.key
                ? "bg-amber-tint text-amber border-amber-dim/40 scale-100"
                : "text-text-soft border-transparent hover:border-line hover:text-text hover:-translate-y-0.5"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
      {right}
    </div>
  );
}
