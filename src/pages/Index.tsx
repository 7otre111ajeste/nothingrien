import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Languages, Home as HomeIcon, Trophy, ShoppingBag, Check, User as UserIcon, Sun, Moon, Send, Inbox } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { i18n, phrases, LANGS, LANG_META, type Lang } from "@/lib/phrases";
import { useNothingAuth } from "@/hooks/useNothingAuth";
import { useNothingStats } from "@/hooks/useNothingStats";
import { NothingButton } from "@/components/nothing/NothingButton";
import { StatPill } from "@/components/nothing/StatPill";
import { BoostRow } from "@/components/nothing/BoostRow";
import { Leaderboard } from "@/components/nothing/Leaderboard";
import { Profile } from "@/components/nothing/Profile";
import { CheckpointOverlay } from "@/components/nothing/CheckpointOverlay";
import { CHECKPOINT_DEFS, defFor, CHECKPOINT_I18N, tr } from "@/lib/checkpoints";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Splash } from "@/components/nothing/Splash";

const RECEIVED_DESC: Record<string, string> = {
  en: "nothings received from other users", fr: "riens reçus des autres utilisateurs",
  es: "nadas recibidas de otros usuarios", pt: "nadas recebidos de outros usuários",
  de: "nichtse von anderen nutzern erhalten", it: "nienti ricevuti dagli altri utenti",
  ru: "ничего, полученные от других", zh: "从其他用户收到的无", ja: "他のユーザーから受け取った無",
  ko: "다른 사용자로부터 받은 무", hi: "अन्य उपयोगकर्ताओं से प्राप्त nothings",
  ar: "لا شيء مستلم من مستخدمين آخرين",
};
const SENT_DESC: Record<string, string> = {
  en: "nothings sent to other users (max 3/day)", fr: "riens envoyés aux autres (max 3/jour)",
  es: "nadas enviadas a otros (máx 3/día)", pt: "nadas enviados a outros (máx 3/dia)",
  de: "an andere gesendete nichtse (max 3/tag)", it: "nienti inviati ad altri (max 3/giorno)",
  ru: "ничего, отправленные другим (макс 3/день)", zh: "发送给其他用户的无 (每日最多3)",
  ja: "他ユーザーへ送信した無 (1日3まで)", ko: "다른 사용자에게 보낸 무 (하루 최대 3)",
  hi: "अन्य को भेजे गए nothings (अधिकतम 3/दिन)", ar: "لا شيء مرسل للآخرين (3 كحد أقصى يومياً)",
};

type Tab = "home" | "leaderboard" | "shop" | "profile";

const Index = () => {
  const [showSplash, setShowSplash] = useState(() => !sessionStorage.getItem("nothing.splashed"));
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem("nothing.lang") as Lang | null;
    if (saved && (LANGS as readonly string[]).includes(saved)) return saved;
    const nav = (typeof navigator !== "undefined" ? navigator.language : "en").slice(0, 2) as Lang;
    return ((LANGS as readonly string[]).includes(nav) ? nav : "en");
  });
  const [theme, setTheme] = useState<"dark" | "light">(() => (localStorage.getItem("nothing.theme") as "dark" | "light") || "dark");
  const [tab, setTab] = useState<Tab>("home");
  const [viewUserId, setViewUserId] = useState<string | null>(null);
  const [phraseIdx, setPhraseIdx] = useState(0);
  const t = i18n[lang];

  const { user } = useNothingAuth();
  const { stats, session, click, dailyDone, unlocked, dismissUnlocked } = useNothingStats(user?.id);
  const isAnon = !user || user.is_anonymous;
  const username = (user?.user_metadata as any)?.username as string | undefined;
  const [equippedList, setEquippedList] = useState<number[]>([]);
  // load from profile
  useEffect(() => {
    if (!user?.id) { setEquippedList([]); return; }
    (async () => {
      const { data } = await supabase.from("profiles").select("equipped_badges").eq("id", user.id).maybeSingle();
      if (data?.equipped_badges) setEquippedList(data.equipped_badges as number[]);
    })();
  }, [user?.id]);
  const equipBadge = async (threshold: number) => {
    if (!user?.id) return;
    let next: number[];
    if (equippedList.includes(threshold)) {
      next = equippedList.filter(t => t !== threshold);
    } else {
      if (equippedList.length >= 3) { toast.error("max 3"); return; }
      next = [...equippedList, threshold];
    }
    setEquippedList(next);
    await supabase.from("profiles").update({ equipped_badges: next }).eq("id", user.id);
  };
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

  useEffect(() => {
    localStorage.setItem("nothing.lang", lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);
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
      {showSplash && (
        <Splash lang={lang} onDone={() => { sessionStorage.setItem("nothing.splashed", "1"); setShowSplash(false); }} />
      )}
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
              onClick={() => { setViewUserId(null); setTab("profile"); }}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              title={username ?? ""}
            >
              <UserIcon size={14} />
              <span className="flex items-center gap-1">
                {username ?? "sign out"}
                {equippedList.map(thr => {
                  const d = defFor(thr);
                  return d ? <span key={thr} className="font-serif-italic text-foreground text-base leading-none">{d.badge}</span> : null;
                })}
              </span>
            </button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                aria-label={t.language}
              >
                <Languages size={14} />
                <span>{LANG_META[lang].flag} {lang}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="max-h-[60vh] overflow-y-auto">
              {LANGS.map(l => (
                <DropdownMenuItem key={l} onClick={() => setLang(l)} className="text-xs gap-2">
                  <span>{LANG_META[l].flag}</span>
                  <span className="flex-1">{LANG_META[l].label}</span>
                  <span className="text-muted-foreground italic">{LANG_META[l].nothing}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
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
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="flex items-center gap-1 cursor-help"><Inbox size={11} /> {stats.nothings_received.toLocaleString()} {t.nothings_recv}</span>
                </TooltipTrigger>
                <TooltipContent className="max-w-[200px] text-xs">{RECEIVED_DESC[lang] ?? RECEIVED_DESC.en}</TooltipContent>
              </Tooltip>
              <span className="opacity-30">·</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="flex items-center gap-1 cursor-help"><Send size={11} /> {stats.nothings_sent.toLocaleString()} {t.nothings_sent}</span>
                </TooltipTrigger>
                <TooltipContent className="max-w-[200px] text-xs">{SENT_DESC[lang] ?? SENT_DESC.en}</TooltipContent>
              </Tooltip>
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
              <div className="font-num text-5xl">{session.toLocaleString()}</div>
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
                    const isEq = equippedList.includes(d.threshold);
                    return (
                      <Tooltip key={d.threshold}>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => equipBadge(d.threshold)}
                            className={`flex flex-col items-center gap-1 rounded-lg px-3 py-2 transition-colors ${isEq ? "bg-foreground text-background" : "bg-secondary/40 hover:bg-secondary text-foreground"}`}
                          >
                            <span className="font-serif-italic text-2xl leading-none">{d.badge}</span>
                            <span className="text-[9px] tracking-wider opacity-70">{tr(d.name, lang)}</span>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[200px] text-xs">
                          <div className="font-serif-italic text-sm mb-0.5">{tr(d.name, lang)}</div>
                          <div className="text-[10px] text-muted-foreground tracking-wider">{cpT.requires} {d.threshold} {cpT.clicks}</div>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        )}

        {tab === "leaderboard" && (
          <Leaderboard
            lang={lang}
            userId={user?.id}
            onOpenProfile={(id) => { setViewUserId(id === user?.id ? null : id); setTab("profile"); }}
          />
        )}

        {tab === "profile" && (
          <Profile
            lang={lang}
            userId={user?.id}
            viewUserId={viewUserId}
            onView={setViewUserId}
            badges={stats.badges}
            onEquippedChange={setEquippedList}
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
        equipped={equippedList.length > 0 ? equippedList[0] : null}
        onClose={dismissUnlocked}
        onEquip={equipBadge}
      />
    </div>
  );
};

export default Index;
