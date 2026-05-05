import { useEffect, useMemo, useState } from "react";
import { type CheckpointDef, CHECKPOINT_I18N } from "@/lib/checkpoints";
import type { Lang } from "@/lib/phrases";

type Props = {
  def: CheckpointDef | null;
  lang: Lang;
  equipped: number | null;
  onClose: () => void;
  onEquip: (threshold: number) => void;
};

function Particles({ anim }: { anim: CheckpointDef["anim"] }) {
  // pre-compute particle positions per anim
  const particles = useMemo(() => {
    const count = anim === "cosmos" || anim === "stars" ? 80 : anim === "rain" ? 60 : anim === "explode" || anim === "shatter" ? 40 : 30;
    return Array.from({ length: count }, (_, i) => ({
      i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      d: Math.random() * 0.8,
      r: Math.random() * 360,
      s: 0.3 + Math.random() * 1.2,
    }));
  }, [anim]);

  switch (anim) {
    case "ripple":
      return (
        <>
          {[0, 0.3, 0.6].map(d => (
            <span key={d} className="absolute inset-0 m-auto h-40 w-40 rounded-full border-2 border-foreground" style={{ animation: `cp-ripple 1.6s ease-out ${d}s forwards`, opacity: 0 }} />
          ))}
        </>
      );
    case "shatter":
      return <>{particles.map(p => (
        <span key={p.i} className="absolute h-1.5 w-1.5 bg-foreground" style={{ left: "50%", top: "50%", transform: `rotate(${p.r}deg)`, animation: `cp-shatter 1.4s ease-out ${p.d}s forwards` }} />
      ))}</>;
    case "spiral":
      return <>{particles.map(p => (
        <span key={p.i} className="absolute h-1 w-1 rounded-full bg-foreground" style={{ left: "50%", top: "50%", animation: `cp-spiral 2s linear ${p.d}s forwards`, ["--r" as any]: `${p.r}deg` }} />
      ))}</>;
    case "stars":
      return <>{particles.map(p => (
        <span key={p.i} className="absolute h-0.5 w-0.5 rounded-full bg-foreground" style={{ left: `${p.x}%`, top: `${p.y}%`, animation: `cp-twinkle 2s ease-in-out ${p.d}s infinite` }} />
      ))}</>;
    case "void":
      return <span className="absolute inset-0 m-auto h-2 w-2 rounded-full bg-foreground" style={{ animation: "cp-void 1.8s ease-in-out forwards" }} />;
    case "rain":
      return <>{particles.map(p => (
        <span key={p.i} className="absolute h-3 w-px bg-foreground/60" style={{ left: `${p.x}%`, top: "-10%", animation: `cp-rain 1.4s linear ${p.d}s forwards` }} />
      ))}</>;
    case "explode":
      return <>{particles.map(p => (
        <span key={p.i} className="absolute h-1 w-1 rounded-full bg-foreground" style={{ left: "50%", top: "50%", animation: `cp-explode 1.2s ease-out ${p.d * 0.2}s forwards`, ["--r" as any]: `${p.r}deg` }} />
      ))}</>;
    case "drift":
      return <>{particles.map(p => (
        <span key={p.i} className="absolute h-px w-8 bg-foreground/40" style={{ left: `${p.x}%`, top: `${p.y}%`, animation: `cp-drift 3s ease-out ${p.d}s forwards` }} />
      ))}</>;
    case "halo":
      return (
        <>
          {[0, 0.2, 0.4, 0.6].map(d => (
            <span key={d} className="absolute inset-0 m-auto h-32 w-32 rounded-full border border-foreground" style={{ animation: `cp-halo 2.4s ease-out ${d}s forwards`, opacity: 0 }} />
          ))}
        </>
      );
    case "monolith":
      return <span className="absolute inset-0 m-auto h-48 w-12 bg-foreground" style={{ animation: "cp-monolith 2s ease-out forwards" }} />;
    case "cosmos":
      return <>{particles.map(p => (
        <span key={p.i} className="absolute h-0.5 w-0.5 rounded-full bg-foreground" style={{ left: `${p.x}%`, top: `${p.y}%`, animation: `cp-cosmos 3s ease-in-out ${p.d}s infinite` }} />
      ))}</>;
    case "ascend":
      return <>{particles.map(p => (
        <span key={p.i} className="absolute h-1 w-1 rounded-full bg-foreground" style={{ left: `${p.x}%`, top: "100%", animation: `cp-ascend 3s ease-out ${p.d}s forwards` }} />
      ))}</>;
    default:
      return null;
  }
}

export function CheckpointOverlay({ def, lang, equipped, onClose, onEquip }: Props) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (def) {
      setVisible(true);
      const t = setTimeout(() => setVisible(false), 4500);
      return () => clearTimeout(t);
    }
  }, [def]);

  if (!def) return null;
  const t = CHECKPOINT_I18N[lang];
  const isEquipped = equipped === def.threshold;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-500 ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      onClick={() => { setVisible(false); setTimeout(onClose, 300); }}
    >
      <div className="absolute inset-0 bg-background/85 backdrop-blur-sm" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Particles anim={def.anim} />
      </div>
      <div className="relative text-center px-8 max-w-sm animate-fade-in-up">
        <div className="font-serif-italic text-7xl mb-2">{def.badge}</div>
        <div className="text-[10px] tracking-[0.3em] text-muted-foreground uppercase mb-2">{t.unlocked}</div>
        <h3 className="font-serif-italic text-3xl mb-4">{def.name[lang]}</h3>
        <p className="text-sm text-muted-foreground italic mb-2">{def.message[lang]}</p>
        <p className="text-xs text-muted-foreground/70 mb-6">{def.teaser[lang]}</p>
        <button
          onClick={(e) => { e.stopPropagation(); onEquip(def.threshold); }}
          className="rounded-full border border-foreground/30 px-4 py-1.5 text-xs hover:bg-foreground hover:text-background transition-colors"
        >
          {isEquipped ? "✓ " + t.share : t.share + " " + def.badge}
        </button>
      </div>
    </div>
  );
}
