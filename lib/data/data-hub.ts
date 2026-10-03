import { INDUSTRY_2026_PATHNAME } from "@/lib/data/industry-2026";
import { STUDIO_COST_PATHNAME } from "@/lib/data/studio-cost-model";
import { absoluteUrl } from "@/lib/site-url";

/* עמוד האינדקס /data. נוצר כדי שקישור פירורי הלחם "נתונים" לא יוביל ל-404
   (pre-mortem 4.10.2026, ממצא 4). בלי אף מספר בעמוד, ובלי כותרות דינמיות של עמודי
   הבן: התוויות הן התוויות הקבועות של פירורי הלחם והפוטר.
   משפט התשובה (speakable) ממתין לניסוח של יקיר (4.10: "לבנות בלי משפט בינתיים").
   כשהוא מגיע, מוחקים את הפטור של /data ב-scripts/audit-aeo-coverage.mjs. */

export const DATA_HUB_SLUG = "data";
export const DATA_HUB_TITLE = "נתונים";
export const DATA_HUB_DESCRIPTION = "נתוני תעשייה 2026 ועלות אולפן הקלטות.";

export const DATA_HUB_LINKS = [
  { label: "נתוני תעשייה 2026", href: INDUSTRY_2026_PATHNAME },
  { label: "עלות אולפן הקלטות", href: STUDIO_COST_PATHNAME },
] as const;

export const DATA_HUB_ITEM_LIST = DATA_HUB_LINKS.map((link) => ({
  name: link.label,
  url: absoluteUrl(link.href.replace(/^\/+/, "")),
}));
