/**
 * The blog's `category` field (lib/data/blog.ts) is free-text Hebrew and has
 * accumulated ~24 near-duplicate variants across 79 posts (e.g. "DJ ואירועים"
 * vs "דיג'יי ואירועים"). Rather than rewrite every post's `category` value,
 * this groups the existing raw values into a small set of filter buckets for
 * the /blog hub - additive only, the underlying posts are untouched.
 */

export type BlogFilterCategory = {
  id: string;
  label: string;
  /** Raw `BlogPost.category` values that belong to this bucket */
  matches: readonly string[];
};

export const BLOG_FILTER_CATEGORIES: readonly BlogFilterCategory[] = [
  {
    id: "studio",
    label: "אולפן והקלטה",
    matches: [
      "אולפן הקלטות",
      "אולפן והקלטה",
      "הקלטה ואולפן",
      "הקלטות ואולפן",
      "אולפן ושירים",
      "חתונה ואולפן",
    ],
  },
  {
    id: "podcast",
    label: "פודקאסט",
    matches: ["פודקאסט ואולפן", "פודקאסט"],
  },
  {
    id: "events",
    label: "אירועים ו-DJ",
    matches: [
      "DJ ואירועים",
      "דיג'יי ואירועים",
      "אירועים וחתונות",
      "אירועים",
      "חתונה ומוזיקה",
      "הגברה וציוד",
    ],
  },
  {
    id: "editing",
    label: "עריכה ושחזור סאונד",
    matches: ["עריכה ושחזור סאונד"],
  },
  {
    id: "voiceover",
    label: "קריינות ותוכן עסקי",
    matches: ["קריינות", "קריינות ועסקים", "תוכן לעסקים", "שירותים דיגיטליים"],
  },
  {
    id: "academy",
    label: "אקדמיה ולימוד",
    matches: ["האקדמיה לסאונד", "אקדמיה וקורסים", "לימוד עברית", "גמגום ודיבור"],
  },
  {
    id: "gifts",
    label: "ברכות ומתנות",
    matches: ["ברכות והקלטות", "הפקה מוזיקלית"],
  },
];

export function getFilterCategoryId(category: string): string | undefined {
  return BLOG_FILTER_CATEGORIES.find((c) => c.matches.includes(category))?.id;
}
