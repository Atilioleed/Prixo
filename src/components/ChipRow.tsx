"use client";

export default function ChipRow({
  options,
  selected,
  onSelect,
}: {
  options: string[];
  selected: string;
  onSelect: (v: string) => void;
}) {
  return (
    <div className="flex gap-2 flex-wrap">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onSelect(opt)}
          className={`border rounded-[var(--radius-chip)] px-3 py-1.5 text-xs font-semibold transition-colors ${
            selected === opt
              ? "bg-amber text-[#1a1400] border-amber"
              : "border-line text-text-soft bg-ground-raised-2 hover:border-line-bright"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
