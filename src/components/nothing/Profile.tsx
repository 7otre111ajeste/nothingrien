import { useEffect, useRef, useState } from "react";
import { Camera, Save, LogOut, Trash2, User as UserIcon, Search as SearchIcon, X, ArrowLeft, Send, Check, Flame, MousePointerClick, Trophy, Inbox, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { i18n, type Lang } from "@/lib/phrases";
import { toast } from "sonner";
import { CHECKPOINT_DEFS, defFor, CHECKPOINT_I18N, tr } from "@/lib/checkpoints";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type ProfileRow = {
  id: string;
  display_name: string;
  avatar_url: string | null;
  quote: string | null;
  created_at: string;
  equipped_badges: number[];
};
type StatRow = {
  user_id: string;
  total_clicks: number;
  current_streak: number;
  longest_streak: number;
  best_session: number;
  badges: number[];
  nothings_sent: number;
  nothings_received: number;
};

export function Profile({
  lang,
  userId,
  viewUserId,
  onView,
  badges,
  onEquippedChange,
}: {
  lang: Lang;
  userId?: string;
  viewUserId?: string | null;
  onView: (id: string | null) => void;
  badges: number[];
  onEquippedChange?: (eq: number[]) => void;
}) {
  const t = i18n[lang];
  const cpT = CHECKPOINT_I18N[lang];

  const targetId = viewUserId ?? userId;
  const isSelf = !viewUserId || viewUserId === userId;

  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [stats, setStats] = useState<StatRow | null>(null);
  const [username, setUsername] = useState("");
  const [quote, setQuote] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // search panel
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");
  const [results, setResults] = useState<{ id: string; display_name: string; avatar_url: string | null }[]>([]);
  const debRef = useRef<number | null>(null);

  // sending
  const [sending, setSending] = useState(false);
  const [sentCount, setSentCount] = useState(0);

  useEffect(() => {
    if (!targetId) return;
    setProfile(null); setStats(null); setSentCount(0);
    (async () => {
      const [{ data: p }, { data: s }] = await Promise.all([
        supabase.from("profiles").select("id, display_name, avatar_url, quote, created_at, equipped_badges").eq("id", targetId).maybeSingle(),
        supabase.from("user_stats").select("*").eq("user_id", targetId).maybeSingle(),
      ]);
      if (p) {
        const row = { ...(p as any), equipped_badges: (p as any).equipped_badges ?? [] } as ProfileRow;
        setProfile(row);
        if (isSelf) {
          setUsername(p.display_name ?? "");
          setQuote(p.quote ?? "");
          onEquippedChange?.(row.equipped_badges);
        }
      }
      if (s) setStats(s as StatRow);
    })();
  }, [targetId, isSelf]);

  // search debounce
  useEffect(() => {
    if (debRef.current) window.clearTimeout(debRef.current);
    if (q.trim().length < 2) { setResults([]); return; }
    debRef.current = window.setTimeout(async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id, display_name, avatar_url")
        .ilike("display_name", `%${q.trim().toLowerCase()}%`)
        .limit(15);
      setResults((data ?? []) as any);
    }, 250);
  }, [q]);

  const validUsername = (s: string) => /^[a-zA-Z0-9_]{3,20}$/.test(s);

  const save = async () => {
    if (!userId || !profile) return;
    const u = username.trim();
    if (u !== profile.display_name && !validUsername(u)) { toast.error(t.invalid_username); return; }
    setSaving(true);
    if (u !== profile.display_name) {
      const { data: existing } = await supabase.from("profiles").select("id").ilike("display_name", u).neq("id", userId).maybeSingle();
      if (existing) { setSaving(false); toast.error(t.username_taken); return; }
    }
    const { error } = await supabase.from("profiles").update({ display_name: u, quote: quote.trim() || null }).eq("id", userId);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    setProfile({ ...profile, display_name: u, quote: quote.trim() || null });
    toast.success(t.saved);
  };

  const upload = async (file: File) => {
    if (!userId) return;
    if (file.size > 4 * 1024 * 1024) { toast.error("max 4mb"); return; }
    setUploading(true);
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const path = `${userId}/avatar-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (error) { setUploading(false); toast.error(error.message); return; }
    const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
    await supabase.from("profiles").update({ avatar_url: pub.publicUrl }).eq("id", userId);
    setProfile(p => (p ? { ...p, avatar_url: pub.publicUrl } : p));
    setUploading(false);
    toast.success(t.saved);
  };

  const removeAvatar = async () => {
    if (!userId) return;
    await supabase.from("profiles").update({ avatar_url: null }).eq("id", userId);
    setProfile(p => (p ? { ...p, avatar_url: null } : p));
  };

  const sendNothing = async () => {
    if (!userId) { toast.error("sign in first"); return; }
    if (!targetId || isSelf) return;
    setSending(true);
    const { error } = await supabase.rpc("send_nothing", { target: targetId });
    setSending(false);
    if (error) { toast.error(error.message); return; }
    setSentCount(c => c + 1);
    setStats(s => s ? { ...s, nothings_received: s.nothings_received + 1 } : s);
  };

  if (!targetId || !profile) {
    return <div className="flex-1 flex items-center justify-center pb-24 text-xs text-muted-foreground">…</div>;
  }

  const ownedBadges = (isSelf ? badges : (stats?.badges ?? []));
  const equippedList = profile.equipped_badges ?? [];

  const toggleEquip = async (threshold: number) => {
    if (!isSelf || !userId) return;
    let next: number[];
    if (equippedList.includes(threshold)) {
      next = equippedList.filter(t => t !== threshold);
    } else {
      if (equippedList.length >= 3) { toast.error("max 3"); return; }
      next = [...equippedList, threshold];
    }
    setProfile(p => p ? { ...p, equipped_badges: next } : p);
    onEquippedChange?.(next);
    const { error } = await supabase.from("profiles").update({ equipped_badges: next }).eq("id", userId);
    if (error) toast.error(error.message);
  };

  return (
    <div className="w-full max-w-md mx-auto px-6 pb-24 pt-6 animate-fade-in-up">
      {/* header row */}
      <div className="flex items-center justify-between mb-6">
        {isSelf ? (
          <span className="w-8" />
        ) : (
          <button onClick={() => onView(null)} className="text-muted-foreground hover:text-foreground" aria-label={t.back}>
            <ArrowLeft size={18} />
          </button>
        )}
        <h2 className="font-serif-italic text-3xl">{isSelf ? t.profile : ""}</h2>
        {isSelf ? (
          <button
            onClick={() => setSearchOpen(o => !o)}
            className="text-muted-foreground hover:text-foreground"
            aria-label={t.search}
          >
            {searchOpen ? <X size={18} /> : <SearchIcon size={16} />}
          </button>
        ) : <span className="w-8" />}
      </div>

      {/* search panel (self only) */}
      {isSelf && searchOpen && (
        <div className="mb-6 animate-fade-in">
          <div className="relative">
            <SearchIcon size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              autoFocus
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder={t.search + "…"}
              className="w-full bg-secondary/40 border border-border rounded-full pl-9 pr-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-foreground/40"
            />
          </div>
          {q.trim().length >= 2 && (
            <div className="mt-2 space-y-1 max-h-72 overflow-y-auto">
              {results.length === 0 ? (
                <div className="text-center text-xs text-muted-foreground/60 py-3">—</div>
              ) : results.map(r => (
                <button
                  key={r.id}
                  onClick={() => { onView(r.id); setSearchOpen(false); setQ(""); }}
                  className="w-full flex items-center gap-2.5 rounded-lg bg-secondary/40 hover:bg-secondary px-2.5 py-2 text-sm text-left"
                >
                  <div className="h-7 w-7 rounded-full bg-secondary overflow-hidden flex items-center justify-center shrink-0">
                    {r.avatar_url ? <img src={r.avatar_url} className="h-full w-full object-cover" /> : <UserIcon size={12} className="text-muted-foreground" />}
                  </div>
                  <span className="truncate">{r.display_name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* public profile card */}
      <div className="mb-8 rounded-2xl border border-border bg-secondary/30 p-5">
        <div className="flex items-start gap-4">
          <div className="relative shrink-0">
            <div className="h-20 w-20 rounded-full bg-secondary/60 border border-border overflow-hidden flex items-center justify-center">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="avatar" className="h-full w-full object-cover" />
              ) : (
                <UserIcon size={28} className="text-muted-foreground" />
              )}
            </div>
            {isSelf && (
              <>
                <button
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-foreground text-background flex items-center justify-center disabled:opacity-50"
                  aria-label={t.upload}
                >
                  <Camera size={12} />
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = ""; }} />
              </>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-base flex items-center gap-1.5 truncate">
              <span className="truncate">{profile.display_name}</span>
              {equippedList.map(thr => {
                const d = defFor(thr);
                return d ? <span key={thr} className="font-serif-italic text-xl leading-none">{d.badge}</span> : null;
              })}
            </div>
            <div className="text-[10px] text-muted-foreground tracking-wider mt-0.5">
              {t.member_since} {new Date(profile.created_at).toLocaleDateString(lang)}
            </div>
            {profile.quote ? (
              <div className="mt-2 text-xs text-muted-foreground italic">"{profile.quote}"</div>
            ) : null}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-background/40 border border-border px-3 py-2.5 flex items-center gap-2">
            <Inbox size={12} className="text-muted-foreground" />
            <div className="flex-1">
              <div className="font-num text-lg leading-none">{(stats?.nothings_received ?? 0).toLocaleString()}</div>
              <div className="text-[9px] tracking-wider text-muted-foreground mt-1">{t.received_count}</div>
            </div>
          </div>
          <div className="rounded-lg bg-background/40 border border-border px-3 py-2.5 flex items-center gap-2">
            <Send size={12} className="text-muted-foreground" />
            <div className="flex-1">
              <div className="font-num text-lg leading-none">{(stats?.nothings_sent ?? 0).toLocaleString()}</div>
              <div className="text-[9px] tracking-wider text-muted-foreground mt-1">{t.sent_count}</div>
            </div>
          </div>
        </div>

        {isSelf && profile.avatar_url && (
          <button onClick={removeAvatar} className="mt-3 flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground">
            <Trash2 size={11} /> {t.remove}
          </button>
        )}

        {!isSelf && (
          <button
            onClick={sendNothing}
            disabled={sending}
            className="mt-4 w-full flex items-center justify-center gap-1.5 rounded-full bg-foreground text-background px-4 py-2 text-xs disabled:opacity-50 hover:opacity-90"
          >
            {sentCount > 0 ? <Check size={12} /> : <Send size={12} />}
            <span>{sentCount > 0 ? `${t.sent_count} ×${sentCount}` : t.send_one_nothing}</span>
          </button>
        )}
      </div>

      {/* stats grid */}
      {stats && (
        <div className="mb-8">
          <div className="text-[10px] tracking-widest text-muted-foreground text-center mb-3 uppercase">{t.my_stats}</div>
          <div className="grid grid-cols-3 gap-2">
            <StatBox icon={<MousePointerClick size={12} />} label={t.total} value={stats.total_clicks.toLocaleString()} />
            <StatBox icon={<Flame size={12} />} label={t.streak} value={stats.current_streak} />
            <StatBox icon={<Trophy size={12} />} label={t.best} value={stats.best_session} />
            <StatBox icon={<Inbox size={12} />} label={t.received_count} value={stats.nothings_received.toLocaleString()} />
            <StatBox icon={<Send size={12} />} label={t.sent_count} value={stats.nothings_sent.toLocaleString()} />
            <StatBox icon={<Award size={12} />} label={t.achievements} value={`${ownedBadges.length}/${CHECKPOINT_DEFS.length}`} />
          </div>
        </div>
      )}

      {/* edit (self only) */}
      {isSelf && (
        <>
          <div className="mb-5">
            <label className="text-[10px] tracking-widest text-muted-foreground uppercase">{t.username}</label>
            <input value={username} onChange={e => setUsername(e.target.value)} maxLength={20}
              className="mt-1.5 w-full bg-secondary/40 border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-foreground/40" />
          </div>
          <div className="mb-6">
            <label className="text-[10px] tracking-widest text-muted-foreground uppercase">{t.quote}</label>
            <textarea value={quote} onChange={e => setQuote(e.target.value)} maxLength={140} rows={3} placeholder={t.quote_ph}
              className="mt-1.5 w-full bg-secondary/40 border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-foreground/40 resize-none" />
            <div className="text-right text-[10px] text-muted-foreground mt-1">{quote.length}/140</div>
          </div>
          <button onClick={save} disabled={saving}
            className="w-full flex items-center justify-center gap-2 rounded-full bg-foreground text-background py-2.5 text-sm disabled:opacity-50 hover:opacity-90">
            <Save size={14} /> {t.save}
          </button>
        </>
      )}

      {/* badges */}
      <div className="mt-10">
        <div className="text-[10px] tracking-widest text-muted-foreground text-center mb-4 uppercase">{t.achievements}</div>
        {ownedBadges.length === 0 ? (
          <div className="text-center text-xs text-muted-foreground/60 italic">{cpT.none}</div>
        ) : (
          <div className="flex flex-wrap justify-center gap-2">
            {CHECKPOINT_DEFS.map(d => {
              if (!ownedBadges.includes(d.threshold)) return null;
              const isEq = isSelf && equippedList.includes(d.threshold);
              return (
                <Tooltip key={d.threshold}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => isSelf && toggleEquip(d.threshold)}
                      disabled={!isSelf}
                      className={`flex flex-col items-center gap-1 rounded-lg px-3 py-2 transition-colors ${isEq ? "bg-foreground text-background" : "bg-secondary/40 hover:bg-secondary text-foreground"} ${!isSelf ? "cursor-default" : ""}`}
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
      </div>

      {isSelf && (
        <button
          onClick={async () => { await supabase.auth.signOut(); window.location.reload(); }}
          className="mt-10 w-full flex items-center justify-center gap-2 text-xs text-muted-foreground hover:text-foreground"
        >
          <LogOut size={12} /> {t.sign_out}
        </button>
      )}
    </div>
  );
}

function StatBox({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="rounded-lg bg-secondary/40 border border-border px-2 py-3 flex flex-col items-center gap-1">
      <span className="text-muted-foreground">{icon}</span>
      <span className="font-num text-xl leading-none">{value}</span>
      <span className="text-[9px] tracking-wider text-muted-foreground text-center">{label}</span>
    </div>
  );
}
