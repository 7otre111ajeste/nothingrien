import { useState } from "react";

export function NothingButton({ label, onClick }: { label: string; onClick: () => void }) {
  const [pressed, setPressed] = useState(0);
  return (
    <div className="relative flex items-center justify-center">
      {/* concentric pulsing rings */}
      <span className="pointer-events-none absolute h-44 w-44 rounded-full border border-foreground/20 ring-pulse" />
      <span className="pointer-events-none absolute h-44 w-44 rounded-full border border-foreground/15 ring-pulse ring-pulse-2" />
      <span className="pointer-events-none absolute h-44 w-44 rounded-full border border-foreground/10 ring-pulse ring-pulse-3" />
      <button
        onClick={() => { setPressed(p => p + 1); onClick(); }}
        key={pressed}
        className="animate-press relative h-44 w-44 rounded-full bg-foreground text-background font-serif-italic text-4xl shadow-[0_0_60px_-10px_hsl(var(--foreground)/0.4)] active:shadow-[0_0_20px_-5px_hsl(var(--foreground)/0.3)] transition-shadow"
      >
        {label}
      </button>
    </div>
  );
}
