/**
 * תקרת הנחה (החלטת הבעלים 3.10.2026, סבב שני): "כרגע אין הנחה מעל 8%".
 *
 * למה זה קיים: לפני ההחלטה האתר הציג חבילות אטרקציות ב-10%, 15% ו-20%,
 * "חיסכון 20-30%" בחבילות החתונה, 10% לחיילים, חבילות מאשאפים עד 20%,
 * חבילת תגים ב-31%, הנחת AI של 500 ש"ח (28%) ו"399 במקום 500" (20%).
 * כל אחד מהם נכתב במקום אחר, ולכן השומר אוסף כאן כל מקור של הנחה שמחושבת
 * בקוד. אחוז שנכתב כטקסט נבדק בנפרד ב-audit:trust-claims.
 *
 * רץ ב-audit:pricing (scripts/validate-coupon-offers.ts) ובבדיקה
 * discount-policy.test.ts. הקובץ לא מיובא מעמודים, כדי לא להוסיף את
 * רישום ה-CRO למטען שלהם.
 */
import type { CroLastMinuteUpsell } from "@/lib/book-wizard-cro/types";
import { COUPON_DISCOUNT_CAP } from "@/lib/data/coupon-offers";
import { CRO_REGISTRY } from "@/lib/data/cro";
import {
  aiBundleDiscountExVat,
  PHOTOGRAPHY_AI_SERVICES,
} from "@/lib/data/photography-calculator";
import {
  CATALOG_BUNDLES,
  catalogBundleDiscountRate,
  getExVat,
  MAX_DISCOUNT_PERCENT,
  MAX_DISCOUNT_RATE,
} from "@/lib/data/pricing-catalog";
import { GEO_PROMO } from "@/lib/data/social-media";
import { LAST_MINUTE_BTS_PROMO_PRICE, upgradePriceExVat } from "@/lib/studio-upgrade-pricing";

const EPSILON = 1e-9;

export type DiscountViolation = { source: string; rate: number };

function pct(rate: number): string {
  return `${(rate * 100).toFixed(1)}%`;
}

/** כל ההנחות שמחושבות בקוד, עם שיעור ההנחה של כל אחת */
export function collectDiscounts(): DiscountViolation[] {
  const out: DiscountViolation[] = [];

  for (const b of CATALOG_BUNDLES) {
    out.push({ source: `חבילת קטלוג ${b.bundleId}`, rate: catalogBundleDiscountRate(b) });
  }

  out.push({ source: "תקרת קופון COUPON_DISCOUNT_CAP", rate: COUPON_DISCOUNT_CAP });

  /* מחיר ייחוס מוצג ("במקום") רק כשיש referenceCatalogId. מבצע בלי מחיר
     ייחוס מוצג הוא מחיר, ולא נמדד כאן (החלטת הבעלים: המבצעים אמיתיים). */
  for (const [category, cfg] of Object.entries(CRO_REGISTRY)) {
    const up: CroLastMinuteUpsell | undefined = cfg.lastMinuteUpsell;
    if (!up?.referenceCatalogId || up.promoPrice == null) continue;
    const list = getExVat(up.referenceCatalogId);
    out.push({ source: `מחיר ייחוס באשף ${category}`, rate: (list - up.promoPrice) / list });
  }

  out.push({ source: "מבצע סושיאל GEO_PROMO", rate: GEO_PROMO.discountPercent / 100 });

  const aiSums = PHOTOGRAPHY_AI_SERVICES.flatMap((a, i) =>
    PHOTOGRAPHY_AI_SERVICES.slice(i + 1).map((b) => a.price + b.price),
  );
  for (const sum of aiSums) {
    out.push({ source: `הנחת חבילת AI על ${sum}`, rate: aiBundleDiscountExVat(sum) / sum });
  }

  /* BTS ב-99 מוצג בלי מחיר ייחוס, ולכן הוא מחיר ולא הנחה מוצגת. נבדק רק
     שהמחיר שנגבה הוא אכן המחיר שמוצג. */
  if (upgradePriceExVat("bts", { lastMinuteBtsDeal: true }) !== LAST_MINUTE_BTS_PROMO_PRICE) {
    out.push({ source: "BTS last-minute לא תואם למחיר המוצג", rate: 1 });
  }

  return out;
}

export function findDiscountViolations(): DiscountViolation[] {
  return collectDiscounts().filter((d) => d.rate > MAX_DISCOUNT_RATE + EPSILON);
}

export function validateDiscountPolicy(): void {
  const bad = findDiscountViolations();
  if (bad.length > 0) {
    throw new Error(
      `הנחה מעל ${MAX_DISCOUNT_PERCENT}%:\n` +
        bad.map((d) => `  ${d.source}: ${pct(d.rate)}`).join("\n"),
    );
  }
}
