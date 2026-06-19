import { SITE_GLOBAL_LINKS, SITE_NAVIGATION } from "@/lib/site-architecture";

export type VoiceIntentResult =
  | { type: "navigate"; href: string; label: string; confidence: "high" }
  | { type: "search"; query: string };

type IntentRule = {
  href: string;
  label: string;
  phrases: readonly string[];
  isHub?: boolean;
};

const PREFIX_STRIP =
  /^(תראה לי|תראו לי|אני מחפש|אני מחפשת|רוצה|רוצה ל|איפה|הראה לי|חפש|חיפוש|תמצא לי|תמצאו לי)\s*/iu;

const MANUAL_HUB_ALIASES: IntentRule[] = [
  {
    href: "/podcast",
    label: "פודקאסט",
    phrases: ["פודקאסט", "podcast"],
    isHub: true,
  },
  {
    href: "/studio",
    label: "אולפן הקלטות",
    phrases: ["אולפן הקלטות", "אולפן", "סטודיו"],
    isHub: true,
  },
  {
    href: "/book",
    label: "הזמנה מקוונת",
    phrases: ["להזמין", "הזמנה", "תור", "לקבוע תור", "לקבוע"],
    isHub: true,
  },
  {
    href: "/contact",
    label: "צור קשר",
    phrases: ["צור קשר", "לדבר איתכם", "ליצור קשר"],
    isHub: true,
  },
  {
    href: "/pricing",
    label: "מחירון",
    phrases: ["מחירון", "כמה זה עולה", "מחיר", "תמחור"],
    isHub: true,
  },
  {
    href: "/online",
    label: "שירותי AI",
    phrases: ["שירותי ai", "ai", "אונליין", "בינה מלאכותית"],
    isHub: true,
  },
  {
    href: "/voiceover",
    label: "קריינות",
    phrases: ["קריינות", "קריין", "voiceover"],
    isHub: true,
  },
  {
    href: "/video",
    label: "וידאו",
    phrases: ["וידאו", "video"],
    isHub: true,
  },
  {
    href: "/photography",
    label: "צילום",
    phrases: ["צילום", "צלם"],
    isHub: true,
  },
  {
    href: "/events",
    label: "אירועים",
    phrases: ["אירועים", "הגברה", "תקליטן"],
    isHub: true,
  },
  {
    href: "/events/attractions",
    label: "אטרקציות",
    phrases: ["אטרקציות"],
    isHub: true,
  },
  {
    href: "/academy",
    label: "אקדמיה",
    phrases: ["אקדמיה", "קורס", "קורסים"],
    isHub: true,
  },
  {
    href: "/pro",
    label: "שירותים מקצועיים",
    phrases: ["שירותים מקצועיים", "pro"],
    isHub: true,
  },
  {
    href: "/business",
    label: "לעסקים",
    phrases: ["לעסקים", "עסקים", "b2b"],
    isHub: true,
  },
  {
    href: "/blog",
    label: "מגזין",
    phrases: ["מגזין", "בלוג", "blog"],
    isHub: true,
  },
  {
    href: "/about",
    label: "אודות",
    phrases: ["אודות", "עלינו"],
    isHub: true,
  },
  {
    href: "/about/faq",
    label: "שאלות נפוצות",
    phrases: ["שאלות נפוצות", "faq"],
    isHub: true,
  },
  {
    href: "/start",
    label: "איך זה עובד",
    phrases: ["איך זה עובד"],
    isHub: true,
  },
  {
    href: "/portfolio",
    label: "תיק עבודות",
    phrases: ["תיק עבודות", "portfolio", "פורטפוליו"],
    isHub: true,
  },
];

const CHILD_PAGE_ALIASES: IntentRule[] = [
  {
    href: "/studio/recording-song-modiin",
    label: "הקלטת שיר במודיעין",
    phrases: ["הקלטת שיר במודיעין", "שיר במתנה", "הקלטת שיר"],
  },
  {
    href: "/studio/blessings",
    label: "ברכות מוקלטות",
    phrases: ["ברכות מוקלטות", "ברכה מוקלטת", "ברכות"],
  },
  {
    href: "/studio/blessings/bride-groom-blessing",
    label: "ברכת חתן וכלה",
    phrases: ["ברכת חתן וכלה", "שיר כניסה לחופה", "ברכת כלה"],
  },
  {
    href: "/events/dj-events",
    label: "תקליטן לאירועים",
    phrases: ["תקליטן לחתונה", "תקליטן לאירועים", "dj לחתונה"],
  },
  {
    href: "/online/mashup-fixer",
    label: "מאשאפים ומוזיקה",
    phrases: ["מאשאפ", "מאשאפים", "mashup", "מיקס מאשאפ"],
  },
  {
    href: "/online/vocal-fix",
    label: "שחזור סאונד AI",
    phrases: ["תיקון סאונד", "שחזור סאונד", "vocal fix", "ניקוי רעשים"],
  },
  {
    href: "/podcast/podcast-studio-modiin",
    label: "השכרת סטודיו לפודקאסט",
    phrases: ["סטודיו לפודקאסט", "אולפן פודקאסט במודיעין"],
  },
];

function buildHubRules(): IntentRule[] {
  const rules: IntentRule[] = [...MANUAL_HUB_ALIASES];
  const seen = new Set(rules.map((r) => r.href));

  for (const cat of SITE_NAVIGATION) {
    if (!seen.has(cat.href)) {
      rules.push({
        href: cat.href,
        label: cat.label,
        phrases: [cat.label],
        isHub: true,
      });
      seen.add(cat.href);
    }
  }

  for (const link of SITE_GLOBAL_LINKS) {
    if (!seen.has(link.href)) {
      rules.push({
        href: link.href,
        label: link.label,
        phrases: [link.label],
        isHub: true,
      });
      seen.add(link.href);
    }
  }

  return rules;
}

const HUB_RULES = buildHubRules();

export function normalizeVoiceQuery(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function stripPrefixes(normalized: string): string {
  let s = normalized;
  let prev = "";
  while (s !== prev) {
    prev = s;
    s = s.replace(PREFIX_STRIP, "").trim();
  }
  return s;
}

function hubMatchScore(normalized: string, phrase: string): number {
  const p = normalizeVoiceQuery(phrase);
  if (!p) return 0;
  if (normalized === p) return 100;
  const wordCount = normalized.split(/\s+/).length;
  if (wordCount <= 3 && normalized.includes(p) && p.length >= 3) {
    return 60 + p.length;
  }
  return 0;
}

function childPageMatchScore(normalized: string, phrase: string): number {
  const p = normalizeVoiceQuery(phrase);
  if (!p) return 0;
  if (normalized === p) return 100;
  const normalizedWords = normalized.split(/\s+/);
  const phraseWords = p.split(/\s+/);
  if (p.length >= 8 && normalized.includes(p)) {
    if (normalizedWords.length <= phraseWords.length + 1) {
      return 85 + p.length;
    }
    return 0;
  }
  if (p.length >= 5 && normalized.includes(p) && normalizedWords.length <= 4) {
    return 75 + p.length;
  }
  return 0;
}

function resolveChildPageIntent(normalized: string): VoiceIntentResult | null {
  type Match = { rule: IntentRule; score: number };
  const matches: Match[] = [];

  for (const rule of CHILD_PAGE_ALIASES) {
    for (const phrase of rule.phrases) {
      const score = childPageMatchScore(normalized, phrase);
      if (score > 0) matches.push({ rule, score });
    }
  }

  if (matches.length === 0) return null;

  matches.sort((a, b) => b.score - a.score);
  const bestByHref = new Map<string, Match>();
  for (const match of matches) {
    const existing = bestByHref.get(match.rule.href);
    if (!existing || match.score > existing.score) {
      bestByHref.set(match.rule.href, match);
    }
  }
  const uniqueMatches = [...bestByHref.values()].sort((a, b) => b.score - a.score);
  const best = uniqueMatches[0];
  const second = uniqueMatches[1];
  const isClearWinner = !second || best.score > second.score + 5;

  if (isClearWinner && best.score >= 75) {
    return {
      type: "navigate",
      href: best.rule.href,
      label: best.rule.label,
      confidence: "high",
    };
  }

  return null;
}

export function resolveVoiceIntent(transcript: string): VoiceIntentResult {
  const raw = transcript.trim();
  const normalized = stripPrefixes(normalizeVoiceQuery(raw));
  if (!normalized) {
    return { type: "search", query: raw };
  }

  const childIntent = resolveChildPageIntent(normalized);
  if (childIntent) return childIntent;

  type Match = { rule: IntentRule; score: number };
  const matches: Match[] = [];

  for (const rule of HUB_RULES) {
    for (const phrase of rule.phrases) {
      const score = hubMatchScore(normalized, phrase);
      if (score > 0) matches.push({ rule, score });
    }
  }

  if (matches.length === 0) {
    return { type: "search", query: normalized };
  }

  matches.sort((a, b) => b.score - a.score);

  const bestByHref = new Map<string, Match>();
  for (const match of matches) {
    const existing = bestByHref.get(match.rule.href);
    if (!existing || match.score > existing.score) {
      bestByHref.set(match.rule.href, match);
    }
  }
  const uniqueMatches = [...bestByHref.values()].sort((a, b) => b.score - a.score);
  const best = uniqueMatches[0];
  const second = uniqueMatches[1];
  const isClearWinner = !second || best.score > second.score + 5;

  if (isClearWinner && best.score >= 60) {
    return {
      type: "navigate",
      href: best.rule.href,
      label: best.rule.label,
      confidence: "high",
    };
  }

  return { type: "search", query: normalized };
}
