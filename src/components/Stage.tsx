export default function Stage({
  phone,
  notes,
}: {
  phone: React.ReactNode;
  notes: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[340px_1fr] gap-9 items-start">
      {phone}
      <div className="pt-2">{notes}</div>
    </div>
  );
}
