export default function TLDR({ items }: { items: string[] }) {
  return (
    <div className="panel panel-bracketed p-4">
      <div className="data-label text-cyan mb-2">En resumen</div>
      <ul className="flex flex-col gap-1.5 text-[13px] text-text-soft leading-relaxed">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-cyan shrink-0">—</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
