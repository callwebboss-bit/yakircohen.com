import { z } from "zod";
import type { ProServiceId } from "@/lib/data/pro-services";
import { getProService } from "@/lib/data/pro-services";
import { getExVat } from "@/lib/data/pricing-catalog";
import { checkAvailability } from "@/lib/data/equipment-inventory";
import { PRE_BUILT_SETS_CATALOG } from "@/lib/data/pre-built-sets-catalog";

export const advisorResponseSchema = z.object({
  summary: z.string(),
  recommendations: z.array(z.string()),
  estimatedPriceExVat: z.number().optional(),
  priceNote: z.string().optional(),
  nextSteps: z.array(z.string()),
  technicalNotes: z.string().optional(),
});

export type AdvisorResponse = z.infer<typeof advisorResponseSchema>;

const STYLE_LABELS: Record<string, string> = {
  club: "מועדון אנרגטי",
  luxury: "יוקרתי",
  festival: "פסטיבל",
  minimal: "מינימלי",
};

const EFFECT_LABELS: Record<string, string> = {
  reverb: "הדהוד",
  delay: "הד מושהה",
  laser: "אפקט לייזר",
  filter: "מסנן תדרים",
};

const FORMAT_LABELS: Record<string, string> = {
  usb: "דיסק און קי מוכן",
  drive: "הורדה מדרייב",
};

const USE_CASE_LABELS: Record<string, string> = {
  podcast_audio: "פודקאסט אודיו",
  podcast_video: "פודקאסט וידאו",
  stream: "שידור חי",
};

const EVENT_TYPE_LABELS: Record<string, string> = {
  concert: "הופעה",
  conference: "כנס",
  wedding: "חתונה",
  outdoor: "אירוע בחוץ",
};

function labelFrom(map: Record<string, string>, key: string, fallback = "לפי בחירה"): string {
  return map[key] ?? fallback;
}

function fillTemplate(template: string, inputs: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => inputs[key] ?? "");
}

export function buildAdvisorUserPrompt(
  serviceId: ProServiceId,
  inputs: Record<string, string>,
): string {
  const svc = getProService(serviceId);
  return fillTemplate(svc.prompt.userTemplate, inputs);
}

export function buildAdvisorSystemPrompt(serviceId: ProServiceId): string {
  const svc = getProService(serviceId);
  return `${svc.prompt.system}

החזר JSON בפורמט:
{
  "summary": "סיכום קצר בעברית פשוטה",
  "recommendations": ["המלצה 1", "המלצה 2"],
  "estimatedPriceExVat": מספר,
  "priceNote": "הערת מחיר",
  "nextSteps": ["צעד 1", "צעד 2"],
  "technicalNotes": "פרטים טכניים אופציונליים"
}

אל תשתמש באנגלית בתשובה — רק עברית ברורה.`;
}

function parseMultiselect(value: string): string[] {
  if (!value?.trim()) return [];
  try {
    const parsed = JSON.parse(value) as unknown;
    if (Array.isArray(parsed)) return parsed.map(String);
  } catch {
    return value.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

function formatEffects(effects: string[]): string {
  if (!effects.length) return "הדהוד והד מושהה";
  return effects.map((e) => labelFrom(EFFECT_LABELS, e, e)).join(", ");
}

/** Fallback when AI gateway is unavailable */
export function buildRuleBasedAdvisor(
  serviceId: ProServiceId,
  inputs: Record<string, string>,
): AdvisorResponse {
  const svc = getProService(serviceId);
  const basePrice = getExVat(svc.pricingId);

  switch (serviceId) {
    case "dj-voice-tags": {
      const effects = parseMultiselect(inputs.effects ?? "");
      const style = labelFrom(STYLE_LABELS, inputs.style ?? "club", "מועדון");
      return {
        summary: `תג קולי בסגנון ${style} עם ${formatEffects(effects)}.`,
        recommendations: [
          "קריינות קצרה (3 עד 8 שניות) לסט",
          effects.includes("reverb") || !effects.length ? "הדהוד קל לתחושת מועדון" : "",
          effects.includes("laser") ? "אפקט לייזר לפני ואחרי המשפט" : "הד מושהה מסונכרן לקצב",
          "גרסה באיכות מקסימלית וגרסה דחוסה",
        ].filter(Boolean),
        estimatedPriceExVat: basePrice,
        priceNote: "חבילת 5 תגים — 1,200 שקלים לפני מע״מ",
        nextSteps: ["אישור טקסט סופי", "הקלטה ועריכה", "מסירה תוך יומיים"],
        technicalNotes: "מוכן לנגן מקצועי — עוצמה מאוזנת",
      };
    }
    case "mashup-fixer":
      return {
        summary: `מאשאפ חירום: ${inputs.songA ?? "שיר ראשון"} ו-${inputs.songB ?? "שיר שני"} לאירוע ב-${inputs.eventDate ?? "תאריך קרוב"}.`,
        recommendations: [
          "התאמת סולמות ידנית לפני מיזוג",
          "נקודת מיזוג מומלצת: פתיחה, שיא או סיום",
          "מסירה עד 24 שעות לאירועים דחופים",
        ],
        estimatedPriceExVat: basePrice,
        priceNote: "כולל סבב תיקון אחד",
        nextSteps: ["אישור תנאים", "שליחת קבצים בוואטסאפ", "מסירת קבצים מוכנים"],
      };
    case "pre-built-sets": {
      const cat = inputs.category ?? "reception_2026";
      const set = PRE_BUILT_SETS_CATALOG.find((s) => s.category === cat);
      return {
        summary: set?.description ?? "סט מוכן לפי הקטגוריה שבחרתם.",
        recommendations: [
          set ? `${set.title} — ${set.durationMinutes} דקות, ${set.trackCount} שירים` : "בחירת קטגוריה",
          `קצב ממוצע: ${set?.bpmRange ?? "100 עד 128"}`,
          labelFrom(FORMAT_LABELS, inputs.format ?? "usb", "דיסק און קי מוכן"),
        ],
        estimatedPriceExVat: set?.priceExVat ?? basePrice,
        nextSteps: ["האזנה לדוגמה", "רכישה", "מסירה"],
      };
    }
    case "studio-in-a-box":
      return {
        summary: `תכנון אולפן ל-${labelFrom(USE_CASE_LABELS, inputs.useCase ?? "", "פודקאסט")} בחדר ${inputs.dimensions ?? "לפי מידות"}.`,
        recommendations: [
          "פנלים אקוסטיים וספיגת בס בפינות",
          inputs.useCase === "podcast_video" ? "תאורה משולשת ורקע נקי" : "מיקרופון דינמי או קונדנסר לפי החדר",
          "מפרט מלא בדוח מסודר",
          "עריכת עשרה פרקים ראשונים כלולה",
        ],
        estimatedPriceExVat: basePrice,
        priceNote: `תקציב ציוד משוער: ${inputs.budget ? `${inputs.budget} שקלים` : "לפי צורך"}`,
        nextSteps: ["שיחת וידאו לייעוץ", "דוח מפרט", "הזמנת ציוד (אופציונלי)"],
      };
    case "bulk-production": {
      const eps = Number(inputs.episodesPerMonth) || 4;
      const monthly = eps * basePrice;
      const shorts = inputs.shortsCount ?? "3";
      return {
        summary: `פס ייצור: ${eps} פרקים בחודש, כ-${inputs.avgDuration ?? "45"} דקות בממוצע.`,
        recommendations: [
          "פתיח וסגיר קבועים למיתוג אחיד",
          `${shorts} סרטונים קצרים לכל פרק`,
          "עוצמת שמע אחידה לכל הפרקים",
          eps >= 8 ? "הנחת נפח — נדון בשיחה" : "מחיר לפרק לפי המחירון",
        ],
        estimatedPriceExVat: monthly,
        priceNote: `${basePrice.toLocaleString("he-IL")} שקלים לפרק לפני מע״מ`,
        nextSteps: ["הגדרת תבנית עריכה", "שליחת פרק ראשון לניסיון", "הסכם קצב חודשי"],
      };
    }
    case "dry-hire": {
      const items = parseMultiselect(inputs.items ?? "");
      const date = inputs.eventDate ?? new Date().toISOString().slice(0, 10);
      const avail = checkAvailability(date, items.length ? items : ["mixer_ah_qu"]);
      const total = avail.items.reduce((s, i) => s + (i.ok ? i.dailyRateExVat : 0), 0);
      const dateLabel = new Date(date + "T12:00:00").toLocaleDateString("he-IL");
      return {
        summary: avail.allAvailable
          ? `כל הפריטים שביקשתם פנויים ל-${dateLabel}.`
          : `חלק מהפריטים לא פנויים ל-${dateLabel} — נבדוק חלופות.`,
        recommendations: avail.items.map(
          (i) => `${i.label}: ${i.ok ? "פנוי" : "תפוס"} — ${i.dailyRateExVat.toLocaleString("he-IL")} שקלים ליום`,
        ),
        estimatedPriceExVat: total || basePrice,
        priceNote: "השכרת ציוד בלבד — בלי טכנאי בשטח",
        nextSteps: ["אישור רשימה", "תיאום איסוף", "ערבות לפי מדיניות"],
      };
    }
    case "system-tuning": {
      const withField = inputs.needsSmaart === "yes";
      const eventLabel = labelFrom(EVENT_TYPE_LABELS, inputs.eventType ?? "", "אירוע");
      return {
        summary: `תכנון הגברה ל-${eventLabel}, כ-${inputs.venueSize ?? "250"} אורחים${withField ? " — כולל מדידות בשטח" : ""}.`,
        recommendations: [
          "מודל ממוחשב של האולם",
          "פריסת רמקול ראשי ומושהים לפי הגיאומטריה",
          withField ? "מדידות בשטח לפני האירוע" : "דוח פריסה מרחוק",
        ],
        estimatedPriceExVat: basePrice,
        nextSteps: ["קבלת תוכנית או מידות", "בניית מודל", "דוח וייעוץ טלפוני"],
      };
    }
    default:
      return {
        summary: svc.subtitle,
        recommendations: [...svc.features.slice(0, 3)],
        estimatedPriceExVat: basePrice,
        nextSteps: ["יצירת קשר בוואטסאפ", "קבלת הצעה מדויקת"],
      };
  }
}
