import {
  ATTRACTIONS,
  PRICING_TIERS,
  type AttractionItem,
} from "@/lib/data/attractions-calculator";
import { getExVat } from "@/lib/data/pricing-catalog";

/** אטרקציות לתצוגה B2B בדופק השוק — אפקטים + אווירה */
const PRO_ATTRACTION_IDS = [
  "cold-fireworks",
  "co2",
  "confetti",
  "smoke-cannons",
  "wedding-smoke",
  "bubbles",
  "balloons",
] as const;

export type ProAttractionItem = AttractionItem & {
  supplierExVat: number;
  /** מזהה לשיוך עם market-segments / event-index export */
  marketId?: string;
};

export const PRO_ATTRACTIONS: readonly ProAttractionItem[] = PRO_ATTRACTION_IDS.map(
  (id) => {
    const item = ATTRACTIONS.find((a) => a.id === id);
    if (!item) throw new Error(`Missing attraction: ${id}`);
    return {
      ...item,
      supplierExVat: getExVat("event_attraction_1"),
      marketId: mapMarketId(id),
    };
  },
);

function mapMarketId(id: string): string | undefined {
  const map: Record<string, string> = {
    "cold-fireworks": "attraction_cold_fireworks",
    bubbles: "attraction_bubbles",
    "wedding-smoke": "attraction_smoke",
    co2: "attraction_smoke",
    "smoke-cannons": "attraction_smoke",
    confetti: "attraction_confetti",
  };
  return map[id];
}

export const PRO_BUNDLE_COUNT = 3;

export const PRO_SINGLE_EX_VAT = getExVat("event_attraction_1");

export const PRO_BUNDLE_3_EX_VAT = getExVat("event_attraction_3");

export const PRO_BUNDLE_3_SAVING_EX_VAT =
  PRO_SINGLE_EX_VAT * PRO_BUNDLE_COUNT - PRO_BUNDLE_3_EX_VAT;

export const PRO_BUNDLE_TIER = PRICING_TIERS.find((t) => t.count === PRO_BUNDLE_COUNT)!;

export const PRODUCER_PITCH = {
  kicker: "למפיקים וחברות הפקה",
  title: "מפיקים שמכירים את הערך האמיתי של אטרקציות",
  body:
    "אם אתם מפיקים ויודעים כמה עולה רגע שבור — אנחנו מביאים מפעילים מקצועיים שמפעילים בדיוק בזמן ובשנייה הנכונה. שקט נפשי אמיתי: הגעה מוקדמת, תיאום cue עם DJ וטקס, ועזרה בסנכרון בלי הפרעות לצילום או לרחבה.",
  bullets: [
    "מפעיל צמוד לאורך האירוע — לא רק השכרת ציוד",
    "תיאום מראש עם DJ, מנחה וצלמים",
    "הפעלה מדויקת ברגע הנכון — כניסה, שבירת כוס, סלואו",
    "ביטוח, בטיחות ואישורי אולם כשנדרש",
    `חבילת ${PRO_BUNDLE_COUNT} אטרקציות במחיר מיוחד — חיסכון ${PRO_BUNDLE_3_SAVING_EX_VAT.toLocaleString("he-IL")} ₪ לפני מע״מ`,
  ],
} as const;

export function formatProPriceExVat(n: number): string {
  return `${n.toLocaleString("he-IL")} ₪`;
}

export function buildProducerBundleWhatsAppText(
  selectedNames: readonly string[],
): string {
  const list = selectedNames.map((n, i) => `${i + 1}. ${n}`).join("\n");
  return [
    "שלום, אני מפיק/ה ומעוניין/ת בחבילת אטרקציות מדופק השוק.",
    "",
    `חבילת ${PRO_BUNDLE_COUNT} אטרקציות (${formatProPriceExVat(PRO_BUNDLE_3_EX_VAT)} לפני מע״מ):`,
    list,
    "",
    "אשמח לפרטים על זמינות, סנכרון והפעלה באירוע.",
  ].join("\n");
}
