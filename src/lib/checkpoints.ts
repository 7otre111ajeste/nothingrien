import type { Lang } from "./phrases";

// 12 checkpoints — secrets, on n'affiche jamais les chiffres à l'avance
export const CHECKPOINTS = [10, 25, 50, 100, 150, 200, 300, 500, 1000, 2000, 5000, 10000] as const;
export type Checkpoint = typeof CHECKPOINTS[number];

export type CheckpointDef = {
  threshold: Checkpoint;
  // animation key handled by overlay component
  anim: "ripple" | "shatter" | "spiral" | "stars" | "void" | "rain" | "explode" | "drift" | "halo" | "monolith" | "cosmos" | "ascend";
  // emoji-only badge (no image asset needed)
  badge: string;
  name: { en: string; fr: string };
  message: { en: string; fr: string };
  // mysterious teaser hinting another checkpoint exists, NEVER reveals the number
  teaser: { en: string; fr: string };
};

export const CHECKPOINT_DEFS: CheckpointDef[] = [
  {
    threshold: 10, anim: "ripple", badge: "○",
    name: { en: "the awakening", fr: "l'éveil" },
    message: { en: "you felt something. it was nothing. but you felt it.", fr: "tu as ressenti quelque chose. c'était rien. mais tu l'as ressenti." },
    teaser: { en: "something is hidden deeper. keep going.", fr: "quelque chose se cache plus loin. continue." },
  },
  {
    threshold: 25, anim: "shatter", badge: "◇",
    name: { en: "the void cracked", fr: "le vide s'est fissuré" },
    message: { en: "the void blinked. it has never blinked before.", fr: "le vide a cligné. il n'avait jamais cligné." },
    teaser: { en: "another thing waits. don't ask what.", fr: "une autre chose attend. ne demande pas quoi." },
  },
  {
    threshold: 50, anim: "spiral", badge: "✺",
    name: { en: "the spiral", fr: "la spirale" },
    message: { en: "you are spiraling. that's the point.", fr: "tu spirales. c'est le but." },
    teaser: { en: "the next layer is sleeping. wake it.", fr: "la prochaine couche dort. réveille-la." },
  },
  {
    threshold: 100, anim: "stars", badge: "✦",
    name: { en: "first century of nothing", fr: "premier siècle de rien" },
    message: { en: "100 nothings. that's basically a job.", fr: "100 riens. c'est presque un métier." },
    teaser: { en: "rumor says it gets weirder.", fr: "la rumeur dit que ça devient bizarre." },
  },
  {
    threshold: 150, anim: "rain", badge: "❄",
    name: { en: "soft static", fr: "statique douce" },
    message: { en: "you can hear the silence now, can't you.", fr: "tu entends le silence maintenant, hein." },
    teaser: { en: "keep tapping. something is listening.", fr: "continue. quelque chose écoute." },
  },
  {
    threshold: 200, anim: "void", badge: "●",
    name: { en: "the dark mirror", fr: "le miroir sombre" },
    message: { en: "the button is starting to recognize you.", fr: "le bouton commence à te reconnaître." },
    teaser: { en: "it remembers. that's all i'll say.", fr: "il se souvient. c'est tout ce que je dirai." },
  },
  {
    threshold: 300, anim: "explode", badge: "✸",
    name: { en: "controlled detonation", fr: "détonation contrôlée" },
    message: { en: "you have detonated nothing. impressive.", fr: "tu as fait exploser rien. impressionnant." },
    teaser: { en: "the next door has no handle. press anyway.", fr: "la prochaine porte n'a pas de poignée. appuie quand même." },
  },
  {
    threshold: 500, anim: "drift", badge: "✧",
    name: { en: "drift", fr: "dérive" },
    message: { en: "you drift through the timeline of pointless things.", fr: "tu dérives dans la timeline du sans-intérêt." },
    teaser: { en: "few have seen what comes next. fewer remember.", fr: "peu ont vu la suite. encore moins s'en souviennent." },
  },
  {
    threshold: 1000, anim: "halo", badge: "✪",
    name: { en: "the halo", fr: "le halo" },
    message: { en: "1000. the saints would be jealous of your nothing.", fr: "1000. les saints jalousent ton rien." },
    teaser: { en: "a higher floor exists. it has no walls.", fr: "un étage supérieur existe. il n'a pas de murs." },
  },
  {
    threshold: 2000, anim: "monolith", badge: "▮",
    name: { en: "the monolith", fr: "le monolithe" },
    message: { en: "a monolith appears. it does nothing. it is perfect.", fr: "un monolithe apparaît. il ne fait rien. il est parfait." },
    teaser: { en: "go further. the monolith is only the door.", fr: "va plus loin. le monolithe n'est que la porte." },
  },
  {
    threshold: 5000, anim: "cosmos", badge: "✺",
    name: { en: "cosmic nothing", fr: "rien cosmique" },
    message: { en: "galaxies form, do nothing, dissipate. you understand now.", fr: "des galaxies se forment, ne font rien, se dissipent. tu comprends." },
    teaser: { en: "one more, somewhere. legend, mostly.", fr: "encore un, quelque part. surtout une légende." },
  },
  {
    threshold: 10000, anim: "ascend", badge: "☉",
    name: { en: "ascension", fr: "ascension" },
    message: { en: "10000. you are no longer pressing. it presses you.", fr: "10000. tu n'appuies plus. il t'appuie." },
    teaser: { en: "and yet. perhaps even more.", fr: "et pourtant. peut-être encore plus." },
  },
];

export function defFor(threshold: number): CheckpointDef | undefined {
  return CHECKPOINT_DEFS.find(d => d.threshold === threshold);
}

export function nextCheckpoint(session: number): Checkpoint | undefined {
  for (const c of CHECKPOINTS) if (c > session) return c;
  return undefined;
}

export function checkpointReached(prev: number, next: number): Checkpoint | undefined {
  for (const c of CHECKPOINTS) {
    if (prev < c && next >= c) return c;
  }
  return undefined;
}

// short mysterious "checkpoint" labels (i18n)
export const CHECKPOINT_I18N = {
  en: { unlocked: "you unlocked", continue: "keep tapping. another awaits.", badges: "badges", none: "no badges yet. press the button.", share: "wear it" },
  fr: { unlocked: "tu as débloqué", continue: "continue. un autre t'attend.", badges: "badges", none: "pas encore de badge. appuie sur le bouton.", share: "afficher" },
} as const;
