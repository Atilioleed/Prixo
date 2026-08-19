export default function InfoSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="font-display text-[19px] font-bold mb-3 text-text">{title}</h2>
      <div className="text-[14px] text-text-soft leading-[1.7] flex flex-col gap-3">{children}</div>
    </section>
  );
}
