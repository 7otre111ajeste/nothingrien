import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

const adjectives = ["silent","empty","lazy","calm","void","quiet","still","blank","zen","null","idle","sleepy"];
const nouns = ["monk","ghost","cloud","stone","shadow","panda","whale","leaf","drift","moon","star","wave"];
function randomName() {
  const a = adjectives[Math.floor(Math.random()*adjectives.length)];
  const n = nouns[Math.floor(Math.random()*nouns.length)];
  const num = Math.floor(Math.random()*1000);
  return `${a}_${n}_${num}`;
}

export function useNothingAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!cancelled) setUser(session?.user ?? null);
    });

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (cancelled) return;
      if (data.session?.user) {
        setUser(data.session.user);
      } else {
        const { data: signed, error } = await supabase.auth.signInAnonymously();
        if (error) console.error(error);
        if (signed?.user) {
          setUser(signed.user);
          // create profile + stats rows
          await supabase.from("profiles").insert({ id: signed.user.id, display_name: randomName() }).select();
          await supabase.from("user_stats").insert({ user_id: signed.user.id }).select();
        }
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
}
