export default function ScreenHead({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-7">
      <h2 className="font-display text-[32px] sm:text-[36px] font-bold tracking-[-0.02em] text-text leading-[1.1]">
        {title}
      </h2>
      <p className="text-text-soft max-w-[600px] mt-2.5 text-[15px] leading-[1.55]">
        {description}
      </p>
    </div>
  );
}
