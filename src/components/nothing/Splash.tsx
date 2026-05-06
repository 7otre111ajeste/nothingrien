import { useEffect, useMemo, useState } from "react";
import { LANG_META, type Lang } from "@/lib/phrases";

const QUOTES: Record<Lang, string[]> = {
  en: [
    "doing nothing is an art form.",
    "loading… nothing.",
    "the void awaits.",
    "monks train years for this.",
    "you opened an app to do nothing. perfect.",
    "less is more. nothing is everything.",
  ],
  fr: [
    "ne rien faire est un art.",
    "chargement… de rien.",
    "le vide t'attend.",
    "des moines s'entraînent pour ça.",
    "tu as ouvert une app pour rien. parfait.",
    "moins c'est plus. rien c'est tout.",
  ],
  es: [
    "no hacer nada es un arte.",
    "cargando… nada.",
    "el vacío te espera.",
    "menos es más. nada es todo.",
  ],
  pt: [
    "não fazer nada é uma arte.",
    "carregando… nada.",
    "o vazio te espera.",
    "menos é mais. nada é tudo.",
  ],
  de: [
    "nichts zu tun ist eine kunst.",
    "lädt… nichts.",
    "die leere wartet.",
    "weniger ist mehr. nichts ist alles.",
  ],
  it: [
    "non fare niente è un'arte.",
    "caricamento… niente.",
    "il vuoto ti aspetta.",
    "meno è più. niente è tutto.",
  ],
  ru: [
    "ничего не делать — это искусство.",
    "загрузка… ничего.",
    "пустота ждёт.",
  ],
  zh: [
    "无所事事是一种艺术。",
    "加载中… 无。",
    "虚空在等待。",
  ],
  ja: [
    "何もしないのは芸術だ。",
    "読み込み中… 無。",
    "虚無があなたを待つ。",
  ],
  ko: [
    "아무것도 하지 않는 것은 예술이다.",
    "로딩 중… 무.",
    "공허가 기다린다.",
  ],
  hi: [
    "कुछ न करना एक कला है।",
    "लोड हो रहा है… कुछ नहीं।",
  ],
  ar: [
    "ألا تفعل شيئًا فنّ.",
    "جارٍ التحميل… لا شيء.",
    "الفراغ ينتظرك.",
  ],
};

export function Splash({ lang, onDone }: { lang: Lang; onDone: () => void }) {
  const [leaving, setLeaving] = useState(false);
  const quote = useMemo(() => {
    const list = QUOTES[lang] ?? QUOTES.en;
    return list[Math.floor(Math.random() * list.length)];
  }, [lang]);
  const word = LANG_META[lang]?.nothing ?? "nothing";

  useEffect(() => {
    const t1 = window.setTimeout(() => setLeaving(true), 2700);
    const t2 = window.setTimeout(onDone, 3200);
    return () => { window.clearTimeout(t1); window.clearTimeout(t2); };
  }, [onDone]);

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
      style={{
        animation: leaving ? "splash-out 0.5s ease-out forwards" : undefined,
      }}
    >
      <div
        className="font-serif-italic text-6xl sm:text-7xl text-foreground"
        style={{ animation: "splash-letter 1s ease-out both" }}
      >
        {word}
      </div>
      <div className="mt-2 h-px w-16 bg-border" />
      <p
        className="mt-6 text-xs sm:text-sm text-muted-foreground italic max-w-xs text-center px-6"
        style={{ animation: "splash-quote 2.7s ease-in-out both" }}
      >
        {quote}
      </p>
    </div>
  );
}