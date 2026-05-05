import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Languages, Home as HomeIcon, Trophy, ShoppingBag, Check, User as UserIcon, Sun, Moon, Send, Inbox } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { i18n, phrases, type Lang } from "@/lib/phrases";
import { useNothingAuth } from "@/hooks/useNothingAuth";
import { useNothingStats } from "@/hooks/useNothingStats";
import { NothingButton } from "@/components/nothing/NothingButton";
import { StatPill } from "@/components/nothing/StatPill";
import { BoostRow } from "@/components/nothing/BoostRow";
import { Leaderboard } from "@/components/nothing/Leaderboard";
import { Search } from "@/components/nothing/Search";
import { Profile } from "@/components/nothing/Profile";
import { CheckpointOverlay } from "@/components/nothing/CheckpointOverlay";
import { CHECKPOINT_DEFS, defFor, CHECKPOINT_I18N } from "@/lib/checkpoints";

type Tab = "home" | "search" | "leaderboard" | "shop" | "profile";

const Index = () => {
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem("nothing.lang") as Lang) || "en");
  const [theme, setTheme] = useState<"dark" | "light">(() => (localStorage.getItem("nothing.theme") as "dark" | "light") || "dark");
  const [tab, setTab] = useState<Tab>("home");
  const [phraseIdx, setPhraseIdx] = useState(0);
  const t = i18n[lang];

  const { user } = useNothingAuth();
  const { stats, session, click, dailyDone, unlocked, dismissUnlocked } = useNothingStats(user?.id);
  const isAnon = !user || user.is_anonymous;
  const username = (user?.user_metadata as any)?.username as string | undefined;
  const [equipped, setEquipped] = useState<number | null>(() => {
    const v = localStorage.getItem("nothing.equipped");
    return v ? Number(v) : null;
  });
  const equipBadge = (threshold: number) => {
    setEquipped(threshold);
    localStorage.setItem("nothing.equipped", String(threshold));
  };
  const equippedDef = equipped ? defFor(equipped) : null;
  const cpT = CHECKPOINT_I18N[lang];

  // realtime toast on incoming nothing
  useEffect(() => {
    if (!user?.id) return;
    const ch = supabase
      .channel(`inbox-${user.id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "nothings", filter: `recipient_id=eq.${user.id}` }, async (payload: any) => {
        const senderId = payload.new?.sender_id;
        let name = "someone";
        if (senderId) {
          const { data } = await supabase.from("profiles").select("display_name").eq("id", senderId).maybeSingle();
          if (data?.display_name) name = data.display_name;
        }
        toast(`${t.received_toast}`, { description: `· ${name}`, icon: "○" });
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [user?.id, t.received_toast]);

  useEffect(() => { localStorage.setItem("nothing.lang", lang); }, [lang]);
  useEffect(() => {
    localStorage.setItem("nothing.theme", theme);
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  const handleClick = () => {
    setPhraseIdx(Math.floor(Math.random() * phrases[lang].length));
    click();
  };

  const currentPhrase = useMemo(() => phrases[lang][phraseIdx], [lang, phraseIdx]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* top bar */}
      <header className="flex items-center justify-between px-5 pt-5">
        <span className="font-serif-italic text-2xl">nothing</span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setTheme(t => (t === "dark" ? "light" : "dark"))}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="toggle theme"
          >
            {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
          </button>
          {isAnon ? (
            <Link to="/auth" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <UserIcon size={14} />
              <span>sign in</span>
            </Link>
          ) : (
            <button
              onClick={() => setTab("profile")}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              title={username ?? ""}
            >
              <UserIcon size={14} />
              <span className="flex items-center gap-1">
                {username ?? "sign out"}
                {equippedDef && <span className="font-serif-italic text-foreground text-base leading-none">{equippedDef.badge}</span>}
              </span>
            </button>
          )}
          <button
            onClick={() => setLang(l => (l === "en" ? "fr" : "en"))}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            aria-label="toggle language"
          >
            <Languages size={14} />
            <span>{lang === "en" ? "fr" : "en"}</span>
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {tab === "home" && (
          <div className="flex-1 flex flex-col items-center pt-6 pb-24 px-6 animate-fade-in-up">
            {/* stats */}
            <div className="flex items-center justify-center divide-x divide-border w-full max-w-md">
              <StatPill label={t.streak} value={stats.current_streak} />
              <StatPill label={t.total} value={stats.total_clicks.toLocaleString()} />
              <StatPill label={t.best} value={stats.best_session} />
            </div>

            {/* nothings counters */}
            <div className="mt-3 flex items-center justify-center gap-4 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1"><Inbox size={11} /> {stats.nothings_received.toLocaleString()} {t.nothings_recv}</span>
              <span className="opacity-30">·</span>
              <span className="flex items-center gap-1"><Send size={11} /> {stats.nothings_sent.toLocaleString()} {t.nothings_sent}</span>
            </div>

            {/* daily badge */}
            <div className="mt-6 mb-10">
              {dailyDone ? (
                <div className="flex items-center gap-2 rounded-full bg-secondary/50 px-3 py-1 text-[11px] text-muted-foreground">
                  <Check size={12} /> {t.daily_done}
                </div>
              ) : (
                <div className="rounded-full border border-dashed border-foreground/30 px-3 py-1 text-[11px] text-muted-foreground">
                  {t.daily_badge}
                </div>
              )}
            </div>

            {/* button */}
            <NothingButton label={t.button} onClick={handleClick} />

            {/* session counter */}
            <div className="mt-10 text-center">
              <div className="font-serif-italic text-5xl">{session.toLocaleString()}</div>
              <div className="text-[10px] tracking-widest text-muted-foreground mt-1">{t.session}</div>
            </div>

            {/* phrase */}
            <p key={phraseIdx + lang} className="mt-6 text-sm text-muted-foreground italic max-w-xs text-center animate-fade-in-up">
              {session === 0 ? "" : currentPhrase}
            </p>

            {/* boosts */}
            <div className="mt-12 w-full max-w-md">
              <div className="text-[10px] tracking-widest text-muted-foreground text-center mb-3">{t.boosts}</div>
              <BoostRow
                labels={{ double: t.boost_double, shield: t.boost_shield, vip: t.boost_vip }}
                soonText={t.soon}
              />
            </div>

            {/* manifesto */}
            <section className="mt-16 w-full max-w-md text-center">
              <h3 className="font-serif-italic text-2xl mb-3">{t.manifesto_title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed px-2">{t.manifesto_body}</p>
            </section>

            {/* badges */}
            <section className="mt-12 w-full max-w-md">
              <div className="text-[10px] tracking-widest text-muted-foreground text-center mb-4">{cpT.badges}</div>
              {stats.badges.length === 0 ? (
                <div className="text-center text-xs text-muted-foreground/60 italic">{cpT.none}</div>
              ) : (
                <div className="flex flex-wrap justify-center gap-2">
                  {CHECKPOINT_DEFS.map(d => {
                    const owned = stats.badges.includes(d.threshold);
                    if (!owned) return null;
                    const isEq = equipped === d.threshold;
                    return (
                      <button
                        key={d.threshold}
                        onClick={() => equipBadge(d.threshold)}
                        title={d.name[lang]}
                        className={`flex flex-col items-center gap-1 rounded-lg px-3 py-2 transition-colors ${isEq ? "bg-foreground text-background" : "bg-secondary/40 hover:bg-secondary text-foreground"}`}
                      >
                        <span className="font-serif-italic text-2xl leading-none">{d.badge}</span>
                        <span className="text-[9px] tracking-wider opacity-70">{d.name[lang]}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        )}

        {tab === "leaderboard" && <Leaderboard lang={lang} userId={user?.id} />}

        {tab === "search" && <Search lang={lang} userId={user?.id} />}

        {tab === "profile" && (
          <Profile
            lang={lang}
            userId={user?.id}
            badges={stats.badges}
            equipped={equipped}
            onEquip={equipBadge}
          />
        )}

        {tab === "shop" && (
          <div className="flex-1 flex flex-col items-center justify-center pb-24 animate-fade-in-up">
            <div className="font-serif-italic text-4xl mb-2">{t.shop}</div>
            <div className="text-xs text-muted-foreground">{t.soon}</div>
          </div>
        )}
      </main>

      {/* bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-md mx-auto flex items-center justify-around py-3">
          {([
            { id: "home", icon: HomeIcon, label: t.home },
            { id: "leaderboard", icon: Trophy, label: t.leaderboard },
            { id: "shop", icon: ShoppingBag, label: t.shop },
            { id: "profile", icon: UserIcon, label: t.profile },
          ] as const).map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex flex-col items-center gap-1 px-4 py-1 transition-colors ${tab === id ? "text-foreground" : "text-muted-foreground"}`}
            >
              <Icon size={18} />
              <span className="text-[10px] tracking-widest">{label}</span>
            </button>
          ))}
        </div>
      </nav>

      <CheckpointOverlay
        def={unlocked ? defFor(unlocked) ?? null : null}
        lang={lang}
        equipped={equipped}
        onClose={dismissUnlocked}
        onEquip={equipBadge}
      />
    </div>
  );
};

export default Index;
