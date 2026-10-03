import assert from "node:assert/strict";
import { test } from "node:test";
import {
  EVENTS_SERVICES,
  PHOTOGRAPHY_SERVICES,
  STUDIO_SERVICES,
  VIDEO_SERVICES,
  VOICEOVER_SERVICES,
} from "@/lib/data/services";
import { withVat } from "@/lib/data/pricing";
import { getAddonsForBaseId, getExVat, type PriceItemId } from "@/lib/data/pricing-catalog";
import { buildServicePageEntitySchema, buildServiceSchema } from "./page-schema";

/*
 * נועל שלושה פגמים שנמצאו בסבב ספטמבר 2026 ותוקנו:
 *
 * 1. pricingToOffer פלט Offer עם priceCurrency ובלי price עבור מדרגות
 *    שהמחיר שלהן הוא טקסט ("הצעה אישית", "הצעה בוואטסאפ", "בתוספת תשלום").
 *    נמדדו 12 כאלה בחמשת הרג׳יסטרים. Offer בלי מחיר הוא צומת שבור.
 *
 * 2. הצומת הדק שנבנה ב-ServicePageLayout פלט Service בלי areaServed בכלל,
 *    בעוד הצומת העשיר נשא GeoCircle. 37 קבצים משתמשים בדק.
 *
 * 3. שני צמתי Service עם אותו @id יכולים להיפלט מאותו עמוד כשקובץ מעביר
 *    pagePath בלי emitPageEntitySchema={false} וגם פולט ServicePageSchema.
 */

const ALL_SERVICES = [
  ...Object.values(STUDIO_SERVICES),
  ...Object.values(VOICEOVER_SERVICES),
  ...Object.values(EVENTS_SERVICES),
  ...Object.values(VIDEO_SERVICES),
  ...Object.values(PHOTOGRAPHY_SERVICES),
];

type Offer = { price?: unknown; priceCurrency?: unknown; name?: unknown };

test("כל Offer בסכמת Service נושא מחיר מספרי", () => {
  assert.ok(ALL_SERVICES.length > 0, "רג׳יסטרי השירותים ריק, הבדיקה חסרת ערך");

  const broken: string[] = [];
  for (const service of ALL_SERVICES) {
    const schema = buildServiceSchema(service) as { offers?: Offer[] };
    for (const offer of schema.offers ?? []) {
      if (typeof offer.price !== "string" || !/^\d+(\.\d+)?$/.test(offer.price)) {
        broken.push(`${service.slug} -> ${String(offer.name)} (price=${String(offer.price)})`);
      }
    }
  }

  assert.deepEqual(
    broken,
    [],
    `Offer בלי מחיר מספרי. מדרגה שהמחיר שלה הוא טקסט לא אמורה להיכנס ל-offers:\n${broken.join("\n")}`,
  );
});

test("מדרגה שהמחיר שלה טקסט אכן יורדת מה-offers ולא נספרת", () => {
  /* events/dj-events: מ-3.10.2026 (שלב 4 WP2) שתי מדרגות מתומחרות מהקטלוג
     (dj_premium, dj_yakir_personal) והפרימיום נשאר "הצעה אישית". רק השתיים
     המתומחרות נכנסות ל-offers. */
  const djEvents = ALL_SERVICES.find((s) => s.slug === "events/dj-events");
  assert.ok(djEvents, "events/dj-events לא נמצא ברג׳יסטרי");
  const tiers = djEvents.pricing ?? [];
  const textTiers = tiers.filter((t) => !/\d/.test(t.price));
  assert.ok(textTiers.length > 0, "אין מדרגת טקסט, הבדיקה לא בודקת כלום");

  const schema = buildServiceSchema(djEvents) as { offers?: Offer[] };
  const names = (schema.offers ?? []).map((o) => o.name);
  assert.equal(names.length, tiers.length - textTiers.length);
  for (const t of textTiers) assert.ok(!names.includes(t.name), `${t.name} נכנס ל-offers`);
});

test("הצומת הדק נושא את אותו אזור שירות כמו העשיר", () => {
  const thin = buildServicePageEntitySchema({
    pagePath: "/studio/blessings",
    title: "בדיקה",
    description: "בדיקה",
  }) as { "@graph": Record<string, unknown>[] };

  const serviceNode = thin["@graph"][0] as { areaServed?: { "@type"?: string } };
  assert.equal(
    serviceNode.areaServed?.["@type"],
    "GeoCircle",
    "הצומת הדק חזר לפלוט Service בלי אזור שירות",
  );

  const rich = buildServiceSchema(ALL_SERVICES[0]) as { areaServed?: { "@type"?: string } };
  assert.deepEqual(
    serviceNode.areaServed,
    rich.areaServed,
    "שני צמתי ה-Service חייבים להצהיר על אותו אזור שירות בדיוק",
  );
});

test("עמוד השיר: Offers כולל מע״מ עם priceSpecification לפני מע״מ, והתוספות מהקטלוג", () => {
  /* שלב 2 חלק ג: השיר ותוספותיו מוצגים לצרכן כולל מע״מ. Offer כולל מע״מ בלי
     priceSpecification היה נקרא כמחיר לפני מע״מ, ו-590 הוא גם מחיר הברכה לפני מע״מ. */
  const song = STUDIO_SERVICES["recording-song-modiin"];
  const schema = buildServiceSchema(song) as {
    offers?: (Offer & { priceSpecification?: { price?: unknown; valueAddedTaxIncluded?: unknown } })[];
  };
  const offers = schema.offers ?? [];
  const expectedIds = ["song_recording", ...getAddonsForBaseId("song_recording").map((a) => a.id)];
  for (const id of expectedIds) {
    const exVat = getExVat(id as PriceItemId);
    const offer = offers.find(
      (o) => o.price === String(withVat(exVat)) && o.priceSpecification?.price === exVat,
    );
    assert.ok(offer, `חסר Offer כולל מע״מ ל-${id} (${withVat(exVat)} עם ${exVat} לפני מע״מ)`);
    assert.equal(offer.priceSpecification?.valueAddedTaxIncluded, false);
  }
  for (const offer of offers) {
    assert.ok(offer.priceSpecification, `Offer בלי priceSpecification בעמוד השיר: ${String(offer.name)}`);
  }
});
