import { Sparkles, Shield, Crown } from "lucide-react";

export function BoostRow({ labels, soonText }: { labels: { double: string; shield: string; vip: string }; soonText: string }) {
  const items = [
    { icon: Sparkles, label: labels.double },
    { icon: Shield, label: labels.shield },
    { icon: Crown, label: labels.vip },
  ];
  return (
    <div className="flex items-center justify-center gap-3">
      {items.map(({ icon: Icon, label }) => (
        <button
          key={label}
          className="group flex items-center gap-2 rounded-full border border-border bg-secondary/40 px-4 py-2 text-xs text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
          title={soonText}
        >
          <Icon size={14} />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
