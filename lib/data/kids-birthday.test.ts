import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  KIDS_BIRTHDAY,
  KIDS_BIRTHDAY_AEO,
  KIDS_BIRTHDAY_GALLERY,
  KIDS_BIRTHDAY_HERO,
  KIDS_BIRTHDAY_STAGES,
  buildKidsBirthdayFaqs,
  describeChildrenRange,
  getAnsweredFaqs,
  getKidsBirthdayLimits,
  joinHebrewList,
} from "@/lib/data/kids-birthday";
import { buildServicePageEntitySchema } from "@/lib/seo/page-schema";

/* מורכב ממחרוזות: הקובץ הזה בתוך lib ונסרק על ידי audit:owner-todos */
const MARKER_HEAD = "[[" + "TODO-OWNER";

describe("kids-birthday data", () => {
  it("חמשת השלבים לפי הסדר שהבעלים נתן, ובלי שלב נוסף", () => {
    assert.deepEqual(
      KIDS_BIRTHDAY_STAGES.map((s) => s.title),
      ["קבלת פנים", "בחירת שיר", "הקלטה בתאים", "מיקס קצר", "האזנה משותפת"],
    );
  });

  it("שדה שהבעלים לא נתן הוא null עם שאלה מסומנת, ולא ערך משוער", () => {
    const missing = [
      KIDS_BIRTHDAY.ageRange,
      KIDS_BIRTHDAY.minChildren,
      KIDS_BIRTHDAY.maxChildren,
      KIDS_BIRTHDAY.takeHome,
      KIDS_BIRTHDAY.parentsBring,
      KIDS_BIRTHDAY.price,
      KIDS_BIRTHDAY.location,
      ...KIDS_BIRTHDAY_STAGES.flatMap((s) => [s.description, s.minutes]),
    ];
    for (const f of missing) {
      assert.equal(f.value, null);
      assert.ok(f.todo.startsWith(MARKER_HEAD), f.todo);
    }
  });

  it("אין מחיר ואין מספר בטקסט של הכותרת, התיאור והשלבים", () => {
    const copy = [
      KIDS_BIRTHDAY_HERO.title,
      KIDS_BIRTHDAY_HERO.subtitle,
      KIDS_BIRTHDAY_HERO.metaDescription,
      KIDS_BIRTHDAY_AEO.text,
    ].join(" ");
    assert.doesNotMatch(copy, /\d/);
    assert.doesNotMatch(copy, /₪|ש"ח|ש״ח/);
  });

  it("ללא סימן קריאה, מקף ארוך וגרשיים מסולסלים בקופי", () => {
    const copy = [
      KIDS_BIRTHDAY_HERO.subtitle,
      KIDS_BIRTHDAY_HERO.metaDescription,
      KIDS_BIRTHDAY_AEO.text,
      ...buildKidsBirthdayFaqs().flatMap((f) => [f.question, f.answer ?? ""]),
    ].join("\n");
    assert.doesNotMatch(copy, /!/);
    assert.doesNotMatch(copy, /[–—…“”‘’]/);
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
  it("רק שאלות עם תשובה ידועה נכנסות לסכמה, ואף תשובה לא נושאת סימון", () => {
    const faqs = buildKidsBirthdayFaqs();
    const answered = getAnsweredFaqs(faqs);
    assert.deepEqual(
      answered.map((f) => f.question),
      [
        "מה קורה ביום הולדת באולפן?",
        "כמה זמן נמשך יום ההולדת?",
        "איך מזמינים?",
      ],
    );
    for (const f of answered) assert.ok(!f.answer.includes(MARKER_HEAD));
  });

  it("שאלה בלי תשובה נשארת ברשימת העמוד עם הסימון שלה", () => {
    const pending = buildKidsBirthdayFaqs().filter((f) => f.answer === null);
    assert.deepEqual(
      pending.map((f) => f.id),
      ["age", "children-count", "take-home", "parents-bring", "price", "where"],
    );
    for (const f of pending) assert.ok(f.todo.startsWith(MARKER_HEAD));
  });

  it("סכמת Service: בלי offers ובלי מחיר, וכל שאלה בסכמת ה-FAQ היא שאלה עם תשובה", () => {
    /* כמו בעמוד: ה-Service נבנה בלי faqs, וה-FAQPage נפלט בנפרד מהשאלות שיש להן תשובה */
    const schema = buildServicePageEntitySchema({
      pagePath: "/studio/kids-birthday",
      title: KIDS_BIRTHDAY_HERO.title,
      description: KIDS_BIRTHDAY_HERO.metaDescription,
    });
    const json = JSON.stringify(schema);
    assert.ok(!json.includes('"offers"'));
    assert.ok(!json.includes('"price"'));
    assert.ok(!json.includes(MARKER_HEAD));
    assert.deepEqual(
      schema["@graph"].map((n) => n["@type"]),
      ["Service"],
    );
    assert.equal(getAnsweredFaqs(buildKidsBirthdayFaqs()).length, 3);
  });

  it("כשהבעלים ממלא שדות, התשובות והסכמה נגזרות מהם", () => {
    const filled = {
      ...KIDS_BIRTHDAY,
      ageRange: { value: "גילאי 6 עד 10", todo: "" },
      minChildren: { value: 6, todo: "" },
      maxChildren: { value: 12, todo: "" },
      takeHome: { value: ["שיר מוקלט", "תמונה", "מדבקה"], todo: "" },
    };
    const faqs = buildKidsBirthdayFaqs(filled);
    const byId = Object.fromEntries(faqs.map((f) => [f.id, f.answer]));
    assert.equal(byId["age"], "גילאי 6 עד 10");
    assert.equal(byId["children-count"], "מינימום 6 ילדים, מקסימום 12.");
    assert.equal(byId["take-home"], "שיר מוקלט, תמונה ומדבקה.");
    assert.equal(byId["price"], null);
    assert.equal(getAnsweredFaqs(faqs).length, 6);
  });
});

describe("עזרים", () => {
  it("טווח ילדים: משפט רק כשיש גם מינימום וגם מקסימום", () => {
    assert.equal(describeChildrenRange({ min: null, max: null }), null);
    assert.equal(describeChildrenRange({ min: 5, max: null }), null);
    assert.equal(describeChildrenRange({ min: 5, max: 9 }), "מינימום 5 ילדים, מקסימום 9.");
  });

  it("המגבלות בפועל הן null עד שהבעלים ממלא", () => {
    assert.deepEqual(getKidsBirthdayLimits(), { min: null, max: null });
  });

  it("חיבור רשימה בעברית", () => {
    assert.equal(joinHebrewList([]), "");
    assert.equal(joinHebrewList(["א"]), "א");
    assert.equal(joinHebrewList(["א", "ב"]), "א וב");
    assert.equal(joinHebrewList(["א", "ב", "ג"]), "א, ב וג");
  });
});
