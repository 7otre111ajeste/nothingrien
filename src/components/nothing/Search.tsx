import { useEffect, useMemo, useRef, useState } from "react";
import { Search as SearchIcon, Send, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Lang } from "@/lib/phrases";
import { toast } from "sonner";

const T = {
  en: {
    title: "find a nothing-er",
    placeholder: "search by username…",
    send: "send nothing",
    sent: "sent",
    you: "you",
    received: "received",
    sentLabel: "sent",
    empty: "no one found.",
    hint: "type at least 2 characters.",
  },
  fr: {
    title: "trouver un nothing-er",
    placeholder: "chercher par username…",
    send: "envoyer rien",
    sent: "envoyé",
    you: "toi",
    received: "reçu",
    sentLabel: "envoyé",
    empty: "personne trouvé.",
    hint: "tape au moins 2 caractères.",
  },
} as const;

type Profile = {
  id: string;
  display_name: string;
};
type StatLite = { user_id: string; nothings_sent: number; nothings_received: number };

export function Search({ lang, userId }: { lang: Lang; userId?: string }) {
  const t = T[lang];
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Profile[]>([]);
  const [stats, setStats] = useState<Record<string, StatLite>>({});
  const [sending, setSending] = useState<string | null>(null);
  const [justSent, setJustSent] = useState<Record<string, number>>({});
  const debRef = useRef<number | null>(null);

  useEffect(() => {
    if (debRef.current) window.clearTimeout(debRef.current);
    if (q.trim().length < 2) { setResults([]); return; }
    debRef.current = window.setTimeout(async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id, display_name")
        .ilike("display_name", `%${q.trim().toLowerCase()}%`)
        .limit(20);
      const profs = (data ?? []) as Profile[];
      setResults(profs);
      if (profs.length) {
        const { data: s } = await supabase
          .from("user_stats")
          .select("user_id, nothings_sent, nothings_received")
          .in("user_id", profs.map(p => p.id));
        const map: Record<string, StatLite> = {};
        (s ?? []).forEach((r: any) => { map[r.user_id] = r; });
        setStats(map);
      }
    }, 280);
  }, [q]);

  const send = async (target: string) => {
    if (!userId) { toast.error("sign in first"); return; }
    if (target === userId) { toast("nice try."); return; }
    setSending(target);
    const { error } = await supabase.rpc("send_nothing", { target });
    setSending(null);
    if (error) { toast.error(error.message); return; }
    setJustSent(s => ({ ...s, [target]: (s[target] ?? 0) + 1 }));
    setStats(s => ({
      ...s,
      [target]: {
        user_id: target,
        nothings_sent: s[target]?.nothings_sent ?? 0,
        nothings_received: (s[target]?.nothings_received ?? 0) + 1,
      },
    }));
  };

  const showHint = q.trim().length > 0 && q.trim().length < 2;

  return (
    <div className="w-full max-w-md mx-auto px-6 pb-24 pt-10 animate-fade-in-up">
      <h2 className="font-serif-italic text-4xl text-center mb-8">{t.title}</h2>

      <div className="relative mb-6">
        <SearchIcon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder={t.placeholder}
          className="w-full bg-secondary/40 border border-border rounded-full pl-10 pr-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-foreground/40"
        />
      </div>

      {showHint && <div className="text-center text-xs text-muted-foreground/60">{t.hint}</div>}
      {!showHint && q.trim().length >= 2 && results.length === 0 && (
        <div className="text-center text-xs text-muted-foreground/60">{t.empty}</div>
      )}

      <div className="space-y-2">
        {results.map(p => {
          const s = stats[p.id];
          const isMe = p.id === userId;
          const sentNow = justSent[p.id] ?? 0;
          return (
            <div key={p.id} className="flex items-center justify-between rounded-xl bg-secondary/40 border border-border px-3 py-2.5">
              <div className="min-w-0 flex-1">
                <div className="text-sm truncate">{p.display_name}{isMe && ` · ${t.you}`}</div>
                <div className="text-[10px] text-muted-foreground tracking-wider">
                  ↓ {(s?.nothings_received ?? 0).toLocaleString()} {t.received} · ↑ {(s?.nothings_sent ?? 0).toLocaleString()} {t.sentLabel}
                </div>
              </div>
              {!isMe && (
                <button
                  onClick={() => send(p.id)}
                  disabled={sending === p.id}
                  className="flex items-center gap-1.5 rounded-full bg-foreground text-background px-3 py-1.5 text-xs disabled:opacity-50 hover:opacity-90"
                >
                  {sentNow > 0 ? <Check size={12} /> : <Send size={12} />}
                  <span>{sentNow > 0 ? `${t.sent} ×${sentNow}` : t.send}</span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
