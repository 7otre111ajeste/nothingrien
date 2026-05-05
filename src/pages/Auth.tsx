import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const signUpSchema = z.object({
  username: z.string().trim().min(3, "min 3 chars").max(20, "max 20 chars").regex(/^[a-z0-9_]+$/i, "letters, numbers, _ only"),
  email: z.string().trim().email("invalid email").max(255),
  password: z.string().min(6, "min 6 chars").max(72),
});
const signInSchema = z.object({
  email: z.string().trim().email("invalid email").max(255),
  password: z.string().min(6).max(72),
});

const Auth = () => {
  const nav = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      // if already signed in with a real (non-anonymous) account, go home
      const u = data.session?.user;
      if (u && !u.is_anonymous) nav("/", { replace: true });
    });
  }, [nav]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const parsed = signUpSchema.safeParse({ username: username.toLowerCase(), email, password });
        if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }

        // Get current anonymous session to migrate stats
        const { data: cur } = await supabase.auth.getSession();
        const anonId = cur.session?.user?.is_anonymous ? cur.session.user.id : null;

        const { data, error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: { username: parsed.data.username },
          },
        });
        if (error) { toast.error(error.message); return; }
        const newUser = data.user;
        if (newUser) {
          // create profile (use upsert in case)
          await supabase.from("profiles").upsert({ id: newUser.id, display_name: parsed.data.username });
          // initialize stats — copy from anon if exists
          if (anonId) {
            const { data: oldStats } = await supabase.from("user_stats").select("*").eq("user_id", anonId).maybeSingle();
            if (oldStats) {
              await supabase.from("user_stats").upsert({
                user_id: newUser.id,
                total_clicks: oldStats.total_clicks,
                current_streak: oldStats.current_streak,
                longest_streak: oldStats.longest_streak,
                best_session: oldStats.best_session,
                last_click_date: oldStats.last_click_date,
              });
            } else {
              await supabase.from("user_stats").upsert({ user_id: newUser.id });
            }
          } else {
            await supabase.from("user_stats").upsert({ user_id: newUser.id });
          }
        }
        toast.success("account created");
        nav("/", { replace: true });
      } else {
        const parsed = signInSchema.safeParse({ email, password });
        if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
        const { error } = await supabase.auth.signInWithPassword({
          email: parsed.data.email,
          password: parsed.data.password,
        });
        if (error) { toast.error(error.message); return; }
        toast.success("welcome back");
        nav("/", { replace: true });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-background text-foreground">
      <Link to="/" className="font-serif-italic text-3xl mb-10">nothing</Link>

      <div className="w-full max-w-xs">
        <div className="flex justify-center gap-1 mb-8">
          {(["signup", "signin"] as const).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-4 py-1.5 rounded-full text-xs transition-colors ${mode === m ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
            >{m === "signup" ? "create account" : "sign in"}</button>
          ))}
        </div>

        <form onSubmit={submit} className="space-y-3">
          {mode === "signup" && (
            <input
              type="text"
              placeholder="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoComplete="username"
              maxLength={20}
              className="w-full bg-secondary border border-border rounded-full px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-foreground/40"
            />
          )}
          <input
            type="email"
            placeholder="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
            maxLength={255}
            className="w-full bg-secondary border border-border rounded-full px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-foreground/40"
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            maxLength={72}
            className="w-full bg-secondary border border-border rounded-full px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-foreground/40"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-foreground text-background py-2.5 text-sm disabled:opacity-50"
          >
            {loading ? "…" : mode === "signup" ? "create account" : "sign in"}
          </button>
        </form>

        <Link to="/" className="block text-center mt-6 text-xs text-muted-foreground hover:text-foreground">
          continue without account
        </Link>
      </div>
    </div>
  );
};

export default Auth;
