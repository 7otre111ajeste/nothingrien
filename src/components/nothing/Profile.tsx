import { useEffect, useRef, useState } from "react";
import { Camera, Save, LogOut, Trash2, User as UserIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { i18n, type Lang } from "@/lib/phrases";
import { toast } from "sonner";
import { CHECKPOINT_DEFS, defFor, CHECKPOINT_I18N } from "@/lib/checkpoints";

type ProfileRow = {
  id: string;
  display_name: string;
  avatar_url: string | null;
  quote: string | null;
  created_at: string;
};

export function Profile({
  lang,
  userId,
  badges,
  equipped,
  onEquip,
}: {
  lang: Lang;
  userId?: string;
  badges: number[];
  equipped: number | null;
  onEquip: (t: number) => void;
}) {
  const t = i18n[lang];
  const cpT = CHECKPOINT_I18N[lang];
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [username, setUsername] = useState("");
  const [quote, setQuote] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!userId) return;
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id, display_name, avatar_url, quote, created_at")
        .eq("id", userId)
        .maybeSingle();
      if (data) {
        setProfile(data as ProfileRow);
        setUsername(data.display_name ?? "");
        setQuote(data.quote ?? "");
      }
    })();
  }, [userId]);

  const validUsername = (s: string) => /^[a-zA-Z0-9_]{3,20}$/.test(s);

  const save = async () => {
    if (!userId || !profile) return;
    const u = username.trim();
    if (u !== profile.display_name && !validUsername(u)) {
      toast.error(t.invalid_username);
      return;
    }
    setSaving(true);
    if (u !== profile.display_name) {
      const { data: existing } = await supabase
        .from("profiles")
        .select("id")
        .ilike("display_name", u)
        .neq("id", userId)
        .maybeSingle();
      if (existing) {
        setSaving(false);
        toast.error(t.username_taken);
        return;
      }
    }
    const { error } = await supabase
      .from("profiles")
      .update({ display_name: u, quote: quote.trim() || null })
      .eq("id", userId);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setProfile({ ...profile, display_name: u, quote: quote.trim() || null });
    toast.success(t.saved);
  };

  const upload = async (file: File) => {
    if (!userId) return;
    if (file.size > 4 * 1024 * 1024) {
      toast.error("max 4mb");
      return;
    }
    setUploading(true);
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const path = `${userId}/avatar-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (error) {
      setUploading(false);
      toast.error(error.message);
      return;
    }
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

  if (!userId || !profile) {
    return (
      <div className="flex-1 flex items-center justify-center pb-24 text-xs text-muted-foreground">…</div>
    );
  }

  const equippedDef = equipped ? defFor(equipped) : null;

  return (
    <div className="w-full max-w-md mx-auto px-6 pb-24 pt-8 animate-fade-in-up">
      <h2 className="font-serif-italic text-4xl text-center mb-8">{t.profile}</h2>

      {/* avatar */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative">
          <div className="h-28 w-28 rounded-full bg-secondary/60 border border-border overflow-hidden flex items-center justify-center">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="avatar" className="h-full w-full object-cover" />
            ) : (
              <UserIcon size={36} className="text-muted-foreground" />
            )}
          </div>
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-foreground text-background flex items-center justify-center disabled:opacity-50"
            aria-label={t.upload}
          >
            <Camera size={14} />
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={e => {
              const f = e.target.files?.[0];
              if (f) upload(f);
              e.target.value = "";
            }}
          />
        </div>
        {profile.avatar_url && (
          <button
            onClick={removeAvatar}
            className="mt-3 flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground"
          >
            <Trash2 size={11} /> {t.remove}
          </button>
        )}
        <div className="mt-3 text-base flex items-center gap-1.5">
          {profile.display_name}
          {equippedDef && <span className="font-serif-italic text-xl leading-none">{equippedDef.badge}</span>}
        </div>
        <div className="text-[10px] text-muted-foreground tracking-wider mt-1">
          {t.member_since} {new Date(profile.created_at).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US")}
        </div>
      </div>

      {/* username */}
      <div className="mb-5">
        <label className="text-[10px] tracking-widest text-muted-foreground uppercase">{t.username}</label>
        <input
          value={username}
          onChange={e => setUsername(e.target.value)}
          maxLength={20}
          className="mt-1.5 w-full bg-secondary/40 border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-foreground/40"
        />
      </div>

      {/* quote */}
      <div className="mb-6">
        <label className="text-[10px] tracking-widest text-muted-foreground uppercase">{t.quote}</label>
        <textarea
          value={quote}
          onChange={e => setQuote(e.target.value)}
          maxLength={140}
          rows={3}
          placeholder={t.quote_ph}
          className="mt-1.5 w-full bg-secondary/40 border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-foreground/40 resize-none"
        />
        <div className="text-right text-[10px] text-muted-foreground mt-1">{quote.length}/140</div>
      </div>

      <button
        onClick={save}
        disabled={saving}
        className="w-full flex items-center justify-center gap-2 rounded-full bg-foreground text-background py-2.5 text-sm disabled:opacity-50 hover:opacity-90"
      >
        <Save size={14} /> {t.save}
      </button>

      {/* badges section */}
      <div className="mt-10">
        <div className="text-[10px] tracking-widest text-muted-foreground text-center mb-4">{cpT.badges}</div>
        {badges.length === 0 ? (
          <div className="text-center text-xs text-muted-foreground/60 italic">{cpT.none}</div>
        ) : (
          <div className="flex flex-wrap justify-center gap-2">
            {CHECKPOINT_DEFS.map(d => {
              if (!badges.includes(d.threshold)) return null;
              const isEq = equipped === d.threshold;
              return (
                <button
                  key={d.threshold}
                  onClick={() => onEquip(d.threshold)}
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
      </div>

      <button
        onClick={async () => { await supabase.auth.signOut(); window.location.reload(); }}
        className="mt-10 w-full flex items-center justify-center gap-2 text-xs text-muted-foreground hover:text-foreground"
      >
        <LogOut size={12} /> {t.sign_out}
      </button>
    </div>
  );
}