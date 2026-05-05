import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Languages, Home as HomeIcon, Trophy, ShoppingBag, Check, User as UserIcon, LogOut, Sun, Moon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { i18n, phrases, type Lang } from "@/lib/phrases";
import { useNothingAuth } from "@/hooks/useNothingAuth";
import { useNothingStats } from "@/hooks/useNothingStats";
import { NothingButton } from "@/components/nothing/NothingButton";
import { StatPill } from "@/components/nothing/StatPill";
import { BoostRow } from "@/components/nothing/BoostRow";
import { Leaderboard } from "@/components/nothing/Leaderboard";

type Tab = "home" | "leaderboard" | "shop";

const Index = () => {
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem("nothing.lang") as Lang) || "en");
  const [theme, setTheme] = useState<"dark" | "light">(() => (localStorage.getItem("nothing.theme") as "dark" | "light") || "dark");
  const [tab, setTab] = useState<Tab>("home");
  const [phraseIdx, setPhraseIdx] = useState(0);
  const t = i18n[lang];

  const { user } = useNothingAuth();
  const { stats, session, click, dailyDone } = useNothingStats(user?.id);
  const isAnon = !user || user.is_anonymous;
  const username = (user?.user_metadata as any)?.username as string | undefined;

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
              onClick={async () => { await supabase.auth.signOut(); window.location.reload(); }}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              title={username ?? ""}
            >
              <LogOut size={14} />
              <span>{username ?? "sign out"}</span>
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
          </div>
        )}

        {tab === "leaderboard" && <Leaderboard lang={lang} userId={user?.id} />}

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
    </div>
  );
};

export default Index;
