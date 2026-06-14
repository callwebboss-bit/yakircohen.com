import {
  ATTRACTIONS,
  PRICING_TIERS,
  type AttractionItem,
} from "@/lib/data/attractions-calculator";
import { getExVat } from "@/lib/data/pricing-catalog";

/** אטרקציות לתצוגה B2B בדופק השוק */
const PRO_ATTRACTION_IDS = [
  "cold-fireworks",
  "co2",
  "confetti",
  "smoke-cannons",
  "wedding-smoke",
  "bubbles",
  "balloons",
] as const;

const PRO_PITCH_BY_ID: Record<
  (typeof PRO_ATTRACTION_IDS)[number],
  { pitch: string; moment: string }
> = {
  "cold-fireworks": {
    pitch: "מפל ניצוצות בטוח לחופה ולרגע שיא",
    moment: "כניסה, שבירת כוס, סלואו",
  },
  co2: {
    pitch: "עשן לחץ חזק לרגע שכולם מצלמים",
    moment: "שיא רחבה, כניסת זוג",
  },
  confetti: {
    pitch: "גשם קונפטי צבעוני לצילום ויראלי",
    moment: "ריקודים, הפתעה באמצע",
  },
  "smoke-cannons": {
    pitch: "ענני עשן ממוקדים לרגע מרכזי",
    moment: "טקס, כניסות, הפתעות",
  },
  "wedding-smoke": {
    pitch: "ערפל לרחבה שמייצר תמונות חזקות",
    moment: "כניסה, סלואו, חופה",
  },
  bubbles: {
    pitch: "בועות עם עשן פנימי, בטוח לשמלות",
    moment: "ילדים, רחבה, צילום",
  },
  balloons: {
    pitch: "בלוני ענק לאווירה ולצילום קבוצתי",
    moment: "פתיחת רחבה, צילומים",
  },
};

export type ProAttractionItem = Omit<AttractionItem, "icon"> & {
  supplierExVat: number;
  pitch: string;
  moment: string;
  marketId?: string;
};

export const PRO_ATTRACTIONS: readonly ProAttractionItem[] = PRO_ATTRACTION_IDS.map(
  (id) => {
    const item = ATTRACTIONS.find((a) => a.id === id);
    if (!item) throw new Error(`Missing attraction: ${id}`);
    const { icon: _icon, ...rest } = item;
    const meta = PRO_PITCH_BY_ID[id];
    return {
      ...rest,
      pitch: meta.pitch,
      moment: meta.moment,
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
  kicker: "שירותי אטרקציות למפיקים",
  title: "מפעיל באירוע, לא רק השכרת ציוד",
  body:
    "מפיקים שמכירים את המחיר של רגע שבור יודעים שההבדל הוא בזמן. אנחנו מגיעים מוקדם, מתאמים מול DJ, מנחה וצלמים, ומפעילים בדיוק בשנייה הנכונה. בלי רעש מיותר על הבמה ובלי הפתעות באמצע הטקס.",
  benefits: [
    {
      title: "מפעיל צמוד",
      text: "אדם אחד אחראי על ההפעלה לאורך כל האירוע",
    },
    {
      title: "סנכרון מדויק",
      text: "תיאום cues מראש עם DJ, מנחה וצילום",
    },
    {
      title: "שקט נפשי",
      text: "ביטוח, בטיחות ואישורי אולם כשצריך",
    },
    {
      title: "חבילה למפיקים",
      text: `שלוש אטרקציות ב${PRO_BUNDLE_3_EX_VAT.toLocaleString("he-IL")} שקלים לפני מע״מ`,
    },
  ],
} as const;

export function formatProPriceExVat(n: number): string {
  return `${n.toLocaleString("he-IL")} שקלים`;
}

export function formatProPriceShort(n: number): string {
  return `${n.toLocaleString("he-IL")} ₪`;
}

export function buildProducerBundleWhatsAppText(
  selectedNames: readonly string[],
): string {
  const list = selectedNames.map((n, i) => `${i + 1}. ${n}`).join("\n");
  return [
    "שלום, אני מפיק/ה ומעוניין/ת בחבילת אטרקציות מדופק השוק.",
    "",
    `חבילת ${PRO_BUNDLE_COUNT} אטרקציות, ${formatProPriceExVat(PRO_BUNDLE_3_EX_VAT)} לפני מע״מ:`,
    list,
    "",
    "אשמח לפרטים על זמינות, סנכרון והפעלה באירוע.",
  ].join("\n");
}
