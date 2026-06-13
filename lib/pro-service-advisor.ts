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
  "summary": "סיכום קצר בעברית",
  "recommendations": ["המלצה 1", "המלצה 2"],
  "estimatedPriceExVat": מספר,
  "priceNote": "הערת מחיר",
  "nextSteps": ["צעד 1", "צעד 2"],
  "technicalNotes": "פרטים טכניים אופציונליים"
}`;
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
      const style = inputs.style ?? "club";
      return {
        summary: `Voice Tag בסגנון ${style} עם ${effects.length ? effects.join(", ") : "Reverb ו-Delay"}.`,
        recommendations: [
          "קריינות קצרה (3–8 שניות) לסט",
          effects.includes("reverb") || !effects.length ? "Reverb hall קל לתחושת מועדון" : "",
          effects.includes("laser") ? "אפקט Laser לפני ואחרי המשפט" : "Delay סינכרוני לקצב",
          "גרסת WAV + MP3 320",
        ].filter(Boolean),
        estimatedPriceExVat: basePrice,
        priceNote: "חבילת 5 tags — 1,200 ₪ לפני מע״מ",
        nextSteps: ["אישור טקסט סופי", "הקלטה ועריכה", "מסירה תוך 24–48 שעות"],
        technicalNotes: "מוכן ל-Pioneer CDJ — peak -3dB",
      };
    }
    case "mashup-fixer":
      return {
        summary: `מאשאפ חירום: ${inputs.songA ?? "שיר א"} + ${inputs.songB ?? "שיר ב"} לאירוע ${inputs.eventDate ?? "קרוב"}.`,
        recommendations: [
          "Key Matching ידני לפני מיזוג",
          "נקודת מיזוג מומלצת: intro/outro או drop",
          "SLA עד 24 שעות לאירועים דחופים",
        ],
        estimatedPriceExVat: basePrice,
        priceNote: "כולל סבב תיקון אחד",
        nextSteps: ["אישור תנאים", "שליחת קבצים בוואטסאפ", "מסירת WAV/MP3"],
      };
    case "pre-built-sets": {
      const cat = inputs.category ?? "reception_2026";
      const set = PRE_BUILT_SETS_CATALOG.find((s) => s.category === cat);
      return {
        summary: set?.description ?? "סט מובנה לפי קטגוריה.",
        recommendations: [
          set ? `${set.title} — ${set.durationMinutes} דק׳, ${set.trackCount} שירים` : "בחירת קטגוריה",
          `BPM: ${set?.bpmRange ?? "100–128"}`,
          inputs.format === "usb" ? "USB מוכן ל-Rekordbox" : "הורדה מ-Drive",
        ],
        estimatedPriceExVat: set?.priceExVat ?? basePrice,
        nextSteps: ["מאזינים לדוגמה", "רכישה", "מסירה"],
      };
    }
    case "studio-in-a-box":
      return {
        summary: `תכנון אולפן ${inputs.useCase ?? "פודקאסט"} לחדר ${inputs.dimensions ?? "—"}.`,
        recommendations: [
          "פנלים אקוסטיים + bass trap בפינות",
          inputs.useCase === "podcast_video" ? "3-point lighting + רקע נקי" : "מיקרופון דינמי SM7B או קונדנסר",
          "מפרט מלא בדוח PDF",
          "חבילת עריכה ל-10 פרקים ראשונים כלולה",
        ],
        estimatedPriceExVat: basePrice,
        priceNote: `תקציב ציוד: ${inputs.budget ?? "לפי צורך"} ₪`,
        nextSteps: ["שיחת וידאו לייעוץ", "דוח מפרט", "הזמנת ציוד (אופציונלי)"],
      };
    case "bulk-production": {
      const eps = Number(inputs.episodesPerMonth) || 4;
      const monthly = eps * basePrice;
      return {
        summary: `פס ייצור: ${eps} פרקים/חודש, ~${inputs.avgDuration ?? "45"} דק׳ ממוצע.`,
        recommendations: [
          "פתיח וסגיר קבועים (ברנדינג)",
          `${inputs.shortsCount ?? "3"} Shorts לפרק`,
          "נורמליזציה ל-Spotify/Apple",
          eps >= 8 ? "הנחת נפח — נדון בשיחה" : "מחיר לפרק לפי מחירון",
        ],
        estimatedPriceExVat: monthly,
        priceNote: `${basePrice} ₪ לפרק לפני מע״מ`,
        nextSteps: ["הגדרת תבנית עריכה", "שליחת פרק ראשון לפיילוט", "SLA חודשי"],
      };
    }
    case "dry-hire": {
      const items = parseMultiselect(inputs.items ?? "");
      const date = inputs.eventDate ?? new Date().toISOString().slice(0, 10);
      const avail = checkAvailability(date, items.length ? items : ["mixer_ah_qu"]);
      const total = avail.items.reduce((s, i) => s + (i.ok ? i.dailyRateExVat : 0), 0);
      return {
        summary: avail.allAvailable
          ? `כל הפריטים זמינים ל-${date}.`
          : `חלק מהפריטים לא זמינים ל-${date} — נבדוק חלופות.`,
        recommendations: avail.items.map(
          (i) => `${i.label}: ${i.ok ? "זמין" : "תפוס"} — ${i.dailyRateExVat} ₪/יום`,
        ),
        estimatedPriceExVat: total || basePrice,
        priceNote: "Dry Hire — ציוד בלבד, ללא טכנאי",
        nextSteps: ["אישור רשימה", "תיאום איסוף", "ערבות/פיקדון לפי מדיניות"],
      };
    }
    case "system-tuning":
      return {
        summary: `תכנון ${inputs.needsSmaart === "yes" ? "EASE + SMAART" : "EASE"} ל-${inputs.venueSize ?? "250"} אורחים, ${inputs.eventType ?? "אירוע"}.`,
        recommendations: [
          "מודל 3D של האולם ב-EASE",
          "פריסת main + delay לפי גיאומטריה",
          inputs.needsSmaart === "yes" ? "מדידות SMAART לפני האירוע" : "דוח פריסה מרחוק",
        ],
        estimatedPriceExVat: basePrice,
        nextSteps: ["קבלת תוכנית/מידות", "מודל EASE", "דוח + ייעוץ טלפוני"],
      };
    default:
      return {
        summary: svc.subtitle,
        recommendations: [...svc.features.slice(0, 3)],
        estimatedPriceExVat: basePrice,
        nextSteps: ["יצירת קשר בוואטסאפ", "קבלת הצעה מדויקת"],
      };
  }
}
