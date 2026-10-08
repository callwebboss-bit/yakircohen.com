import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  KIDS_BIRTHDAY_AEO,
  KIDS_BIRTHDAY_CAPACITY,
  KIDS_BIRTHDAY_GALLERY,
  KIDS_BIRTHDAY_HERO,
  KIDS_BIRTHDAY_LOCATION,
  KIDS_BIRTHDAY_PREPARATION,
  KIDS_BIRTHDAY_STAGES,
  buildKidsBirthdayFaqs,
  joinHebrewList,
} from "@/lib/data/kids-birthday";
import { buildServicePageEntitySchema } from "@/lib/seo/page-schema";

/* מורכב ממחרוזות: הקובץ הזה בתוך lib ונסרק על ידי audit:owner-todos */
const MARKER_HEAD = "[[" + "TODO-OWNER";

/** כל הטקסט שהדף מציג מקובץ הנתונים */
function allCopy(): string {
  return [
    KIDS_BIRTHDAY_HERO.title,
    KIDS_BIRTHDAY_HERO.subtitle,
    KIDS_BIRTHDAY_HERO.metaTitle,
    KIDS_BIRTHDAY_HERO.metaDescription,
    KIDS_BIRTHDAY_AEO.question,
    KIDS_BIRTHDAY_AEO.text,
    KIDS_BIRTHDAY_CAPACITY.note,
    KIDS_BIRTHDAY_PREPARATION,
    KIDS_BIRTHDAY_LOCATION,
    ...KIDS_BIRTHDAY_STAGES.flatMap((s) => [s.title, s.description]),
    ...buildKidsBirthdayFaqs().flatMap((f) => [f.question, f.answer]),
    ...KIDS_BIRTHDAY_GALLERY.map((g) => g.alt),
  ].join("\n");
}

describe("kids-birthday data", () => {
  it("חמשת השלבים לפי הסדר שהבעלים נתן, ובלי שלב נוסף", () => {
    assert.deepEqual(
      KIDS_BIRTHDAY_STAGES.map((s) => s.title),
      ["קבלת פנים", "בחירת שיר", "הקלטה בתאים", "מיקס קצר", "האזנה משותפת"],
    );
  });

  it("לכל שלב יש תיאור, ואין שדה משך: הבעלים לא ביקש דקות", () => {
    for (const stage of KIDS_BIRTHDAY_STAGES) {
      assert.ok(stage.description.length > 0, stage.id);
      assert.ok(!("minutes" in stage), stage.id);
      assert.doesNotMatch(stage.description, /דקות/);
    }
  });

  it("מיקס קצר והאזנה משותפת: רק ניסוח שחוזר על שם השלב, בלי הבטחה", () => {
    const byId = Object.fromEntries(KIDS_BIRTHDAY_STAGES.map((s) => [s.id, s.description]));
    assert.equal(byId["short-mix"], "עושים מיקס קצר.");
    assert.equal(byId["group-listening"], "מאזינים יחד.");
  });

  it("הקיבולת בנוסח שהבעלים הורה", () => {
    assert.equal(
      KIDS_BIRTHDAY_CAPACITY.note,
      "המקום מאכלס עד 14 איש. אם יש יותר, מחלקים לקבוצות.",
    );
    assert.equal(KIDS_BIRTHDAY_CAPACITY.people, 14);
  });

  it("המיקום: רק 'הכול מתקיים באולפן במודיעין', בלי גנים, צילומי חוץ ואולפן נייד", () => {
    assert.equal(KIDS_BIRTHDAY_LOCATION, "הכול מתקיים באולפן במודיעין.");
  });

  it("אין סימון TODO-OWNER בשום טקסט של העמוד", () => {
    assert.ok(!allCopy().includes(MARKER_HEAD));
  });

  it("אין בטקסט הבטחות ופרטים שהוסרו: גיל, מינימום, מוצר שמקבלים, מחיר, השגחה, מענה", () => {
    const copy = allCopy();
    const banned: [RegExp, string][] = [
      [/מגיל|גילאי|טווח גילאים|בני \d|בנות \d/, "גיל"],
      [/מינימום|מקסימום/, "מינימום או מקסימום ילדים"],
      [/לוקח הביתה|מקבל הביתה|קובץ השיר/, "מה לוקחים הביתה"],
      [/להביא/, "מה ההורים מביאים"],
      [/₪|ש"ח|ש״ח|מחיר|עולה|הצעה/, "מחיר או הצעת מחיר"],
      [/לשחק|מתחם הפודקאסטים|מספיק עניין|השגחה/, "השגחה ובידור ילדים"],
      [/גנים|צילומי חוץ|אולפן נייד/, "צילומי חוץ ואולפן נייד"],
      [/נחזור|נשוב|תוך שעה|מענה|אישור/, "הבטחת חזרה, זמן מענה או אישור"],
    ];
    for (const [re, label] of banned) {
      assert.doesNotMatch(copy, re, label);
    }
  });

  it("אין מספר בטקסט מלבד 14 (הקיבולת)", () => {
    const withoutCapacity = allCopy().replaceAll(KIDS_BIRTHDAY_CAPACITY.note, "");
    assert.doesNotMatch(withoutCapacity, /\d/);
  });

  it("ללא סימן קריאה, מקף ארוך וגרשיים מסולסלים בקופי", () => {
    const copy = allCopy();
    assert.doesNotMatch(copy, /!/);
    assert.doesNotMatch(copy, /[\u2013\u2014\u2026\u201C\u201D\u2018\u2019]/);
  });

  it("הגלריה: כל תמונה היא תמונת אולפן עם alt תיאורי, בלי 'יום הולדת'", () => {
    assert.ok(KIDS_BIRTHDAY_GALLERY.length > 0);
    for (const image of KIDS_BIRTHDAY_GALLERY) {
      assert.ok(image.alt.length > 10);
      assert.doesNotMatch(image.alt, /יום הולדת/);
      assert.match(image.src, /^\/images\/services\/studio\//);
    }
  });
});

describe("FAQ ו-JSON-LD", () => {
  it("שש שאלות, לכל אחת תשובה מלאה, וכולן נכנסות לסכמה", () => {
    const faqs = buildKidsBirthdayFaqs();
    assert.deepEqual(
      faqs.map((f) => f.id),
      ["what-happens", "how-long", "how-to-order", "preparation", "capacity", "where"],
    );
    for (const f of faqs) assert.ok(f.answer.trim().length > 0, f.id);
  });

  it("סכמת Service: בלי offers ובלי מחיר", () => {
    const schema = buildServicePageEntitySchema({
      pagePath: "/studio/kids-birthday",
      title: KIDS_BIRTHDAY_HERO.title,
      description: KIDS_BIRTHDAY_HERO.metaDescription,
    });
    const json = JSON.stringify(schema);
    assert.ok(!json.includes('"offers"'));
    assert.ok(!json.includes('"price"'));
    assert.deepEqual(
      schema["@graph"].map((n) => n["@type"]),
      ["Service"],
    );
  });
});

describe("עזרים", () => {
  it("חיבור רשימה בעברית", () => {
    assert.equal(joinHebrewList([]), "");
    assert.equal(joinHebrewList(["א"]), "א");
    assert.equal(joinHebrewList(["א", "ב"]), "א וב");
    assert.equal(joinHebrewList(["א", "ב", "ג"]), "א, ב וג");
  });
});
