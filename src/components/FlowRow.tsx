import { IconDot } from "@/components/icons/Icon";

export type FlowRowAccent = "cyan" | "amber" | "pink" | "seal-violet" | "seal-lime";

const ICON_ACCENT: Record<FlowRowAccent, string> = {
  cyan: "text-cyan",
  amber: "text-amber",
  pink: "text-pink",
  "seal-violet": "text-seal-violet",
  "seal-lime": "text-seal-lime",
};

export default function FlowRow({
  icon,
  name,
  meta,
  active,
  accent = "cyan",
}: {
  icon: React.ReactNode;
  name: string;
  meta: string;
  active: boolean;
  accent?: FlowRowAccent;
}) {
  return (
    <div className="flex items-center justify-between gap-3 px-3.5 py-[13px] border border-line rounded-[10px] mb-2.5 bg-ground-raised">
      <div className="flex items-center gap-3 min-w-0">
        <div className={`w-9 h-9 rounded-[8px] bg-ground-raised-2 border border-line flex items-center justify-center shrink-0 ${ICON_ACCENT[accent]}`}>
          {icon}
        </div>
        <div className="min-w-0">
          <div className="font-semibold text-[13.5px] text-text truncate">{name}</div>
          <div className="text-[11.5px] text-text-soft truncate">{meta}</div>
        </div>
      </div>
      <span
        className={`data-label flex items-center gap-1.5 font-bold px-2.5 py-1 rounded-[var(--radius-chip)] shrink-0 ${
          active ? "bg-cyan-tint text-cyan" : "bg-ground-raised-2 text-text-faint"
        }`}
      >
        <IconDot size={6} className={active ? "animate-pulse-dot" : ""} />
        {active ? "Activo" : "Pausado"}
      </span>
    </div>
  );
}
