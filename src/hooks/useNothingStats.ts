import { useEffect, useRef, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Stats = {
  total_clicks: number;
  current_streak: number;
  longest_streak: number;
  best_session: number;
  last_click_date: string | null;
};

const empty: Stats = {
  total_clicks: 0, current_streak: 0, longest_streak: 0, best_session: 0, last_click_date: null,
};

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}
function yesterdayStr() {
  const d = new Date(); d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export function useNothingStats(userId: string | undefined) {
  const [stats, setStats] = useState<Stats>(empty);
  const [session, setSession] = useState(0);
  const pendingRef = useRef(0);
  const timerRef = useRef<number | null>(null);

  // initial load
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
    // streak logic
    let newStreak = stats.current_streak;
    let newLongest = stats.longest_streak;
    if (stats.last_click_date !== today) {
      if (stats.last_click_date === yesterdayStr() || stats.current_streak === 0) {
        newStreak = (stats.last_click_date === yesterdayStr()) ? stats.current_streak + 1 : 1;
      } else {
        newStreak = 1;
      }
      newLongest = Math.max(newLongest, newStreak);
    }
    const newTotal = stats.total_clicks + inc;
    const newBest = Math.max(stats.best_session, session);

    setStats({
      total_clicks: newTotal,
      current_streak: newStreak,
      longest_streak: newLongest,
      best_session: newBest,
      last_click_date: today,
    });

    await supabase.from("user_stats").update({
      total_clicks: newTotal,
      current_streak: newStreak,
      longest_streak: newLongest,
      best_session: newBest,
      last_click_date: today,
      updated_at: new Date().toISOString(),
    }).eq("user_id", userId);

    // upsert daily count
    const { data: existing } = await supabase.from("clicks_daily")
      .select("count").eq("user_id", userId).eq("day", today).maybeSingle();
    if (existing) {
      await supabase.from("clicks_daily").update({ count: existing.count + inc })
        .eq("user_id", userId).eq("day", today);
    } else {
      await supabase.from("clicks_daily").insert({ user_id: userId, day: today, count: inc });
    }
  }, [userId, stats, session]);

  const click = useCallback(() => {
    setSession(s => s + 1);
    pendingRef.current += 1;
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => { void flush(); }, 600);
  }, [flush]);

  useEffect(() => () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      void flush();
    }
  }, [flush]);

  const dailyDone = stats.last_click_date === todayStr();

  return { stats, session, click, dailyDone };
}
