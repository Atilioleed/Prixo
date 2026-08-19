export default function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-[340px] mx-auto md:mx-0 shrink-0 bg-[#05070a] rounded-[32px] p-2.5 border border-line-bright shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)] relative">
      <div className="absolute top-4 right-5 w-1.5 h-1.5 rounded-full bg-amber animate-pulse-dot" />
      <div className="bg-ground-raised rounded-[22px] overflow-hidden min-h-[620px] flex flex-col relative border border-line">
        <div className="h-[20px] flex items-center justify-center shrink-0">
          <div className="w-[64px] h-1 bg-line-bright rounded-full" />
        </div>
        {children}
      </div>
    </div>
  );
}
