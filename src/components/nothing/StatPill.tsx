export function StatPill({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col items-center gap-1 px-4">
      <span className="font-num text-2xl leading-none text-foreground">{value}</span>
      <span className="text-[10px] tracking-widest text-muted-foreground">{label}</span>
    </div>
  );
}
