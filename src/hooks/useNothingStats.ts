import { useEffect, useRef, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { checkpointReached, type Checkpoint } from "@/lib/checkpoints";

export type Stats = {
  total_clicks: number;
  current_streak: number;
  longest_streak: number;
  best_session: number;
  last_click_date: string | null;
  badges: number[];
};

const empty: Stats = {
  total_clicks: 0, current_streak: 0, longest_streak: 0, best_session: 0, last_click_date: null, badges: [],
};

function todayStr() { return new Date().toISOString().slice(0, 10); }
function yesterdayStr() { const d = new Date(); d.setDate(d.getDate() - 1); return d.toISOString().slice(0, 10); }

export function useNothingStats(userId: string | undefined) {
  const [stats, setStats] = useState<Stats>(empty);
  const [session, setSession] = useState(0);
  const [unlocked, setUnlocked] = useState<Checkpoint | null>(null);
  const pendingRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const sessionRef = useRef(0);
  sessionRef.current = session;

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    (async () => {
      const { data } = await supabase.from("user_stats").select("*").eq("user_id", userId).maybeSingle();
      if (!cancelled && data) {
        setStats({
          total_clicks: Number(data.total_clicks ?? 0),
          current_streak: data.current_streak ?? 0,
          longest_streak: data.longest_streak ?? 0,
          best_session: data.best_session ?? 0,
          last_click_date: data.last_click_date,
          badges: (data.badges as number[]) ?? [],
        });
      }
    })();
    return () => { cancelled = true; };
  }, [userId]);

  const flush = useCallback(async () => {
    if (!userId) return;
    const inc = pendingRef.current;
    if (inc <= 0) return;
    pendingRef.current = 0;

    const today = todayStr();
    let newStreak = stats.current_streak;
    let newLongest = stats.longest_streak;
    if (stats.last_click_date !== today) {
      newStreak = stats.last_click_date === yesterdayStr() ? stats.current_streak + 1 : 1;
      newLongest = Math.max(newLongest, newStreak);
    }
    const newTotal = stats.total_clicks + inc;
    const newBest = Math.max(stats.best_session, sessionRef.current);

    setStats(s => ({
      ...s,
      total_clicks: newTotal,
      current_streak: newStreak,
      longest_streak: newLongest,
      best_session: newBest,
      last_click_date: today,
    }));

    await supabase.from("user_stats").update({
      total_clicks: newTotal,
      current_streak: newStreak,
      longest_streak: newLongest,
      best_session: newBest,
      last_click_date: today,
      updated_at: new Date().toISOString(),
    }).eq("user_id", userId);

    const { data: existing } = await supabase.from("clicks_daily")
      .select("count").eq("user_id", userId).eq("day", today).maybeSingle();
    if (existing) {
      await supabase.from("clicks_daily").update({ count: existing.count + inc }).eq("user_id", userId).eq("day", today);
    } else {
      await supabase.from("clicks_daily").insert({ user_id: userId, day: today, count: inc });
    }
  }, [userId, stats]);

  const click = useCallback(() => {
    setSession(s => {
      const next = s + 1;
      const cp = checkpointReached(s, next);
      if (cp && !stats.badges.includes(cp)) {
        setUnlocked(cp);
        const newBadges = [...stats.badges, cp].sort((a, b) => a - b);
        setStats(st => ({ ...st, badges: newBadges }));
        if (userId) {
          void supabase.from("user_stats").update({ badges: newBadges }).eq("user_id", userId);
        }
      }
      return next;
    });
    pendingRef.current += 1;
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => { void flush(); }, 600);
  }, [flush, stats.badges, userId]);

  useEffect(() => () => {
    if (timerRef.current) { window.clearTimeout(timerRef.current); void flush(); }
  }, [flush]);

  const dailyDone = stats.last_click_date === todayStr();

  const dismissUnlocked = useCallback(() => setUnlocked(null), []);

  return { stats, session, click, dailyDone, unlocked, dismissUnlocked };
}
