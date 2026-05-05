import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { i18n, type Lang } from "@/lib/phrases";

type Cat = "streak" | "session" | "total" | "received" | "sent";
type Period = "24h" | "7d" | "30d" | "all";

type Row = { user_id: string; display_name: string; value: number };

function daysAgo(n: number) {
  const d = new Date(); d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

export function Leaderboard({ lang, userId }: { lang: Lang; userId?: string }) {
  const t = i18n[lang];
  const [cat, setCat] = useState<Cat>("total");
  const [period, setPeriod] = useState<Period>("all");
  const [rows, setRows] = useState<Row[]>([]);
  const [myRank, setMyRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const periodDisabled = cat !== "total"; // streak/session = all-time only

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      let result: Row[] = [];

      if (cat === "total" && period !== "all") {
        const days = period === "24h" ? 1 : period === "7d" ? 7 : 30;
        const since = daysAgo(days - 1);
        const { data } = await supabase
          .from("clicks_daily")
          .select("user_id, count, day")
          .gte("day", since);
        const agg = new Map<string, number>();
        (data ?? []).forEach((r: any) => {
          agg.set(r.user_id, (agg.get(r.user_id) ?? 0) + Number(r.count ?? 0));
        });
        const ids = Array.from(agg.keys());
        const { data: profs } = await supabase.from("profiles").select("id, display_name").in("id", ids.length ? ids : ["00000000-0000-0000-0000-000000000000"]);
        const nameOf = new Map((profs ?? []).map((p: any) => [p.id, p.display_name]));
        result = Array.from(agg.entries())
          .map(([id, v]) => ({ user_id: id, display_name: nameOf.get(id) ?? "anon", value: v }))
          .sort((a, b) => b.value - a.value);
      } else {
        const col =
          cat === "streak" ? "current_streak" :
          cat === "session" ? "best_session" :
          cat === "received" ? "nothings_received" :
          cat === "sent" ? "nothings_sent" :
          "total_clicks";
        const { data } = await supabase
          .from("user_stats")
          .select(`user_id, ${col}`)
          .order(col, { ascending: false })
          .limit(200);
        const ids = (data ?? []).map((r: any) => r.user_id);
        const { data: profs } = await supabase.from("profiles").select("id, display_name").in("id", ids.length ? ids : ["00000000-0000-0000-0000-000000000000"]);
        const nameOf = new Map((profs ?? []).map((p: any) => [p.id, p.display_name]));
        result = (data ?? []).map((r: any) => ({
          user_id: r.user_id,
          display_name: nameOf.get(r.user_id) ?? "anon",
          value: Number(r[col] ?? 0),
        })).filter(r => r.value > 0);
      }

      if (cancelled) return;
      setRows(result.slice(0, 100));
      if (userId) {
        const idx = result.findIndex(r => r.user_id === userId);
        setMyRank(idx >= 0 ? idx + 1 : null);
      }
      setLoading(false);
    };
    void load();

    const channel = supabase
      .channel(`lb-${cat}-${period}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "user_stats" }, () => void load())
      .on("postgres_changes", { event: "*", schema: "public", table: "clicks_daily" }, () => void load())
      .subscribe();
    return () => { cancelled = true; supabase.removeChannel(channel); };
  }, [cat, period, userId]);

  const cats: { id: Cat; label: string }[] = useMemo(() => [
    { id: "streak", label: t.cat_streak },
    { id: "session", label: t.cat_session },
    { id: "total", label: t.cat_total },
    { id: "received", label: t.cat_received },
    { id: "sent", label: t.cat_sent },
  ], [t]);
  const periods: { id: Period; label: string }[] = [
    { id: "24h", label: t.period_24h },
    { id: "7d", label: t.period_7d },
    { id: "30d", label: t.period_30d },
    { id: "all", label: t.period_all },
  ];

  return (
    <div className="w-full max-w-md mx-auto px-6 pb-24 pt-10 animate-fade-in-up">
      <h2 className="font-serif-italic text-4xl text-center mb-8">{t.leaderboard}</h2>

      <div className="flex justify-center gap-1 mb-3">
        {cats.map(c => (
          <button
            key={c.id}
            onClick={() => setCat(c.id)}
            className={`px-3 py-1.5 rounded-full text-xs transition-colors ${cat === c.id ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
          >{c.label}</button>
        ))}
      </div>

      <div className="flex justify-center gap-1 mb-6">
        {periods.map(p => (
          <button
            key={p.id}
            disabled={periodDisabled && p.id !== "all"}
            onClick={() => setPeriod(p.id)}
            className={`px-3 py-1 rounded-full text-[10px] tracking-widest transition-colors ${period === p.id ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"} disabled:opacity-30 disabled:cursor-not-allowed`}
          >{p.label}</button>
        ))}
      </div>

      <div className="space-y-1">
        {loading && rows.length === 0 && (
          <div className="text-center text-muted-foreground text-xs py-8">…</div>
        )}
        {rows.length === 0 && !loading && (
          <div className="text-center text-muted-foreground text-xs py-8">no data yet — be the first.</div>
        )}
        {rows.map((r, i) => {
          const isMe = r.user_id === userId;
          return (
            <div key={r.user_id} className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${isMe ? "bg-secondary text-foreground" : "text-muted-foreground"}`}>
              <span className="flex items-center gap-3">
                <span className="font-serif-italic text-base w-6 text-right">{i + 1}</span>
                <span>{r.display_name}{isMe ? ` · ${t.you}` : ""}</span>
              </span>
              <span className="font-serif-italic text-base">{r.value.toLocaleString()}</span>
            </div>
          );
        })}
      </div>

      {myRank !== null && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 rounded-full bg-secondary border border-border px-4 py-2 text-xs">
          {t.rank} · <span className="font-serif-italic text-base">#{myRank}</span>
        </div>
      )}
    </div>
  );
}
