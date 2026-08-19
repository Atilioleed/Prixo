import Link from "next/link";

export default function InfoPageLayout({
  eyebrow,
  title,
  updated,
  children,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <header className="max-w-[760px] mx-auto px-5 pt-6 pb-5 flex items-center justify-between border-b border-line">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_220deg,var(--seal-violet),var(--pink),var(--seal-lime),var(--seal-violet))] animate-seal-spin" />
            <div className="relative w-3 h-3 rounded-full bg-ground" />
          </div>
          <span className="font-display font-bold text-[18px] text-text">Prixo</span>
        </Link>
        <Link href="/" className="text-[13px] font-semibold text-text-soft hover:text-text">
          ← Volver al inicio
        </Link>
      </header>

      <div className="max-w-[760px] mx-auto px-5 py-14">
        <div className="data-label text-amber mb-2">{eyebrow}</div>
        <h1 className="font-display text-[32px] sm:text-[38px] font-bold mb-2 text-text">{title}</h1>
        <p className="text-[12.5px] text-text-faint mb-10">Última actualización: {updated}</p>

        <div className="prose flex flex-col gap-8">{children}</div>
      </div>

      <footer className="data-label text-center py-8 border-t border-line">
        Prixo — Tu idioma, un paso a la vez.
      </footer>
    </div>
  );
}
