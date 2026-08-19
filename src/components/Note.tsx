export default function Note({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="panel panel-bracketed px-[18px] py-4 mb-3">
      <div className="data-label text-amber mb-1.5">{label}</div>
      <div className="text-[13.5px] text-text-soft leading-[1.6]">{children}</div>
    </div>
  );
}
