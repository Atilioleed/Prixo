const VARIANTS = {
  pub: "bg-cyan-tint text-cyan border border-cyan-dim/40",
  draft: "bg-ground-raised-2 text-text-faint border border-line",
  a1: "bg-amber-tint text-amber border border-amber-dim/40",
};

export default function Pill({
  variant,
  children,
}: {
  variant: keyof typeof VARIANTS;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`data-label font-bold px-2.5 py-1 rounded-[var(--radius-chip)] ${VARIANTS[variant]}`}
    >
      {children}
    </span>
  );
}
