import assert from "node:assert/strict";
import { test } from "node:test";
import siteSchema from "@/lib/seo/site-schema.json";
import { ENTITY_IDS } from "@/lib/seo/entity-ids";
import {
  EVENTS_SERVICES,
  PHOTOGRAPHY_SERVICES,
  STUDIO_SERVICES,
  VIDEO_SERVICES,
  VOICEOVER_SERVICES,
} from "@/lib/data/services";
import {
  buildServicePageEntitySchema,
  buildServiceSchema,
  buildWebPageSchema,
} from "./page-schema";

/*
 * הפניה בגרף סכמה חייבת להתחבר לצומת שקיים.
 *
 * מה שהיה: build-site-schema.ts הכריז על הצמתים עם `${SITE_URL}/#organization`,
 * והקוד שמפנה אליהם בנה `${absoluteUrl()}#organization`. absoluteUrl() מחזיר
 * את הדומיין בלי לוכסן סוגר, ולכן נוצרו שני IRI שונים שנבדלים בלוכסן אחד.
 * נמדד: ה-provider של כל צומת Service באתר הצביע על צומת שלא קיים.
 *
 * הבדיקה מריצה את הבנאים האמיתיים ולא קוראת מחרוזות, ולכן אי אפשר לרמות
 * אותה בעריכת טקסט. היא סורקת רקורסיבית כל "@id" שמפנה לדומיין שלנו עם
 * סולמית, ודורשת שהוא יופיע ברשימת הצמתים המוכרזים.
 */

const declaredIds = new Set(
  (siteSchema as { "@graph": { "@id"?: string }[] })["@graph"]
    .map((node) => node["@id"])
    .filter((id): id is string => typeof id === "string"),
);

/** כל @id שמופיע כהפניה, כלומר באובייקט שאין בו @type משלו. */
function collectRefs(value: unknown, out: string[] = [], isRoot = true): string[] {
  if (Array.isArray(value)) {
    for (const item of value) collectRefs(item, out, false);
    return out;
  }
  if (value === null || typeof value !== "object") return out;

  const obj = value as Record<string, unknown>;
  const id = obj["@id"];
  /* צומת מוכרז נושא @type. אובייקט עם @id בלבד הוא הפניה. */
  if (typeof id === "string" && !("@type" in obj) && !isRoot) out.push(id);

  for (const key of Object.keys(obj)) {
    if (key === "@id") continue;
    collectRefs(obj[key], out, false);
  }
  return out;
}

const ALL_SERVICES = [
  ...Object.values(STUDIO_SERVICES),
  ...Object.values(VOICEOVER_SERVICES),
  ...Object.values(EVENTS_SERVICES),
  ...Object.values(VIDEO_SERVICES),
  ...Object.values(PHOTOGRAPHY_SERVICES),
];

test("כל מזהה ב-ENTITY_IDS מתאים לצומת מוכרז בגרף", () => {
  assert.ok(declaredIds.size >= 4, "גרף האתר ריק או לא נטען, הבדיקה חסרת ערך");
  for (const [key, id] of Object.entries(ENTITY_IDS)) {
    assert.ok(
      declaredIds.has(id),
      `ENTITY_IDS.${key} = ${id} לא קיים בגרף. הצמתים המוכרזים:\n${[...declaredIds].join("\n")}`,
    );
  }
});

test("כל הפניה מצמתי Service ו-WebPage מתחברת לצומת קיים", () => {
  assert.ok(ALL_SERVICES.length > 0, "רג׳יסטרי השירותים ריק");

  const schemas: unknown[] = [
    ...ALL_SERVICES.map((service) => buildServiceSchema(service)),
    buildServicePageEntitySchema({
      pagePath: "/studio/blessings",
      title: "בדיקה",
      description: "בדיקה",
    }),
    buildWebPageSchema({
      slug: "studio",
      title: "בדיקה",
      description: "בדיקה",
    }),
  ];

  const dangling = new Set<string>();
  let checked = 0;
  for (const schema of schemas) {
    for (const ref of collectRefs(schema)) {
      if (!ref.includes("#")) continue;
      if (!ref.startsWith("https://yakircohen.com")) continue;
      checked++;
      if (!declaredIds.has(ref)) dangling.add(ref);
    }
  }

  assert.ok(checked > 0, "לא נסרקה אף הפניה. סביר שהסורק נשבר, לא שאין הפניות");
  assert.deepEqual(
    [...dangling],
    [],
    `הפניות שלא מתחברות לשום צומת. הפרש של לוכסן אחד מספיק:\n${[...dangling].join("\n")}\n\nמוכרז:\n${[...declaredIds].join("\n")}`,
  );
});

test("האדם והעסק לא חולקים את אותה זהות", () => {
  const graph = (siteSchema as { "@graph": { "@type"?: unknown; "@id"?: string; sameAs?: string[] }[] })["@graph"];
  const person = graph.find((n) => n["@id"] === ENTITY_IDS.founder);
  const business = graph.find((n) => n["@id"] === ENTITY_IDS.localBusiness);

  assert.ok(person?.sameAs?.length, "לצומת האדם אין sameAs");
  assert.ok(business?.sameAs?.length, "לצומת העסק אין sameAs");

  /*
   * רישום Google Maps הוא כתובת הזהות של העסק. כשהוא הופיע גם על צומת
   * האדם, הגרף אמר שהאדם והעסק הם אותה ישות, והמנוע לא ידע למי לייחס
   * ביקורות, מומחיות וכתובת פיזית.
   */
  const mapListing = (url: string) => url.includes("maps.app.goo.gl") || url.includes("google.com/maps");

  assert.ok(
    business.sameAs.some(mapListing),
    "צומת העסק חייב לשאת את רישום המפות. בלעדיו אין קישור בין האתר לרישום",
  );
  assert.equal(
    person.sameAs.filter(mapListing).length,
    0,
    "צומת האדם נושא את רישום המפות של העסק. זה ערבוב ישויות:\n" + person.sameAs.join("\n"),
  );
});
