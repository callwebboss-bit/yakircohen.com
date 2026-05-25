export type PhotographyAddonSection = "core" | "pre" | "during" | "post";

export type PhotographyAddon = {
  id: string;
  label: string;
  sublabel: string;
  price: number;
  section: PhotographyAddonSection;
};

export type PhotographyAIService = {
  id: string;
  label: string;
  sublabel: string;
  price: number;
};

export type HourPreset = {
  hours: number;
  name: string;
  sub: string;
  badge?: string;
};

import { STUDIO_ONE_HOUR_NIS } from "@/lib/data/pricing";

export const HOURLY_RATE = STUDIO_ONE_HOUR_NIS;
export const AI_BUNDLE_DISCOUNT = 500;

export const HOUR_PRESETS: HourPreset[] = [
  {
    hours: 4,
    name: "המהות",
    sub: "קבלת פנים, טקס, ריקודים ראשונים",
  },
  {
    hours: 8,
    name: "הסיפור המלא",
    sub: "מההכנות ועד שיא הלילה",
    badge: "הנבחרת",
  },
  {
    hours: 12,
    name: "המורשת",
    sub: "ליווי מהבוקר ועד האורח האחרון",
    badge: "מתנת AI",
  },
];

export const PHOTOGRAPHY_ADDONS: PhotographyAddon[] = [
  {
    id: "video",
    label: "וידאו 4K",
    sublabel: "עריכה מלאה לסרט קצר",
    price: 2500,
    section: "core",
  },
  {
    id: "magnets",
    label: "מגנטים לאורחים",
    sublabel: "הדפסה איכותית במהלך האירוע",
    price: 1800,
    section: "core",
  },
  {
    id: "prelude",
    label: "צילומי זוגיות",
    sublabel: "לפני האירוע",
    price: 2200,
    section: "pre",
  },
  {
    id: "avantgarde",
    label: "צילום אומנותי",
    sublabel: "סשן מיוחד לזוג",
    price: 3800,
    section: "pre",
  },
  {
    id: "reels",
    label: "רילס בזמן אמת",
    sublabel: "עריכה במהלך האירוע",
    price: 2800,
    section: "during",
  },
  {
    id: "priority",
    label: "מסירה מהירה",
    sublabel: "תוך 48 שעות",
    price: 1400,
    section: "post",
  },
  {
    id: "archive",
    label: "ארכיון מאסטר",
    sublabel: "גיבוי מאובטח ל-10 שנים",
    price: 2800,
    section: "post",
  },
];

export const PHOTOGRAPHY_AI_SERVICES: PhotographyAIService[] = [
  {
    id: "panorama",
    label: "פנורמות AI",
    sublabel: "תמונות רחבות באיכות גבוהה",
    price: 850,
  },
  {
    id: "retouch",
    label: "ריטוש AI",
    sublabel: "ניקוי רקע ושיפור תאורה",
    price: 1200,
  },
  {
    id: "cinema",
    label: "קליפ AI",
    sublabel: "היילייטס מוכן למחרת",
    price: 950,
  },
];

export const ADDON_SECTION_LABELS: Record<PhotographyAddonSection, string> = {
  core: "שירותים נוספים",
  pre: "לפני האירוע",
  during: "במהלך האירוע",
  post: "אחרי האירוע",
};

export function getPackageLabel(hours: number): { name: string; sub: string } {
  const preset = HOUR_PRESETS.find((p) => p.hours === hours);
  if (preset) return { name: preset.name, sub: preset.sub };
  if (hours < 4) return { name: `${hours} שעות`, sub: "כיסוי קצר לרגעים מרכזיים" };
  if (hours < 8) return { name: `${hours} שעות`, sub: "כיסוי מקיף של שיאי האירוע" };
  if (hours < 12) return { name: `${hours} שעות`, sub: "תיעוד עמוק לאורך הערב" };
  return { name: `${hours} שעות`, sub: "ליווי צמוד לאורך כל האירוע" };
}
