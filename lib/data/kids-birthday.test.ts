import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  KIDS_BIRTHDAY,
  KIDS_BIRTHDAY_AEO,
  KIDS_BIRTHDAY_CAPACITY,
  KIDS_BIRTHDAY_GALLERY,
  KIDS_BIRTHDAY_HERO,
  KIDS_BIRTHDAY_LOCATION,
  KIDS_BIRTHDAY_PREPARATION,
  KIDS_BIRTHDAY_STAGES,
  buildKidsBirthdayFaqs,
  getAnsweredFaqs,
  getKidsBirthdayLimits,
  joinHebrewList,
} from "@/lib/data/kids-birthday";
import { buildServicePageEntitySchema } from "@/lib/seo/page-schema";

/* מורכב ממחרוזות: הקובץ הזה בתוך lib ונסרק על ידי audit:owner-todos */
const MARKER_HEAD = "[[" + "TODO-OWNER";

/** שדות שנשארו פתוחים אחרי תשובות הבעלים ב-8.10.2026 */
const OPEN_FIELDS = [
  KIDS_BIRTHDAY.ageRange,
  KIDS_BIRTHDAY.minChildren,
  KIDS_BIRTHDAY.takeHome,
  KIDS_BIRTHDAY.parentsBring,
  KIDS_BIRTHDAY.price,
];

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

  it("A5 לא נענה: התיאור רק חוזר על שם השלב, בלי פרט נוסף", () => {
    const last = KIDS_BIRTHDAY_STAGES[4];
    assert.equal(last.description, "מאזינים יחד.");
  });

  it("בדיוק חמישה שדות פתוחים, כל אחד null עם שאלה מסומנת", () => {
    assert.equal(OPEN_FIELDS.length, 5);
    for (const f of OPEN_FIELDS) {
      assert.equal(f.value, null);
      assert.ok(f.todo.startsWith(MARKER_HEAD), f.todo);
    }
  });

  it("הגיל נשאר ריק עד אישור, והשאלה לבעלים היא נוסח האישור", () => {
    assert.equal(KIDS_BIRTHDAY.ageRange.value, null);
    assert.ok(
      KIDS_BIRTHDAY.ageRange.todo.includes("הבנתי שמגיל 7 ומעלה, בלי גיל מקסימום. נכון?"),
    );
  });

  it("הקיבולת בנוסח שהבעלים הורה, והיא לא מוגדרת כמקסימום ילדים", () => {
    assert.equal(
      KIDS_BIRTHDAY_CAPACITY.note,
      "המקום מאכלס עד 14 איש. אם יש יותר, מחלקים לקבוצות.",
    );
    assert.equal(KIDS_BIRTHDAY_CAPACITY.people, 14);
    assert.ok(!("maxChildren" in KIDS_BIRTHDAY));
    assert.deepEqual(getKidsBirthdayLimits(), { min: null });
  });

  it("המיקום מוגדר ומקשר לעמוד האולפן הנייד", () => {
    assert.match(KIDS_BIRTHDAY_LOCATION.text, /באולפן במודיעין/);
    assert.equal(KIDS_BIRTHDAY_LOCATION.mobileStudio.href, "/studio/mobile-studio");
  });

  it("אין מחיר ואין מספר בטקסט של הכותרת, התיאור והשלבים", () => {
    const copy = [
      KIDS_BIRTHDAY_HERO.title,
      KIDS_BIRTHDAY_HERO.subtitle,
      KIDS_BIRTHDAY_HERO.metaDescription,
      KIDS_BIRTHDAY_AEO.text,
      ...KIDS_BIRTHDAY_STAGES.map((s) => s.description),
    ].join(" ");
    assert.doesNotMatch(copy, /\d/);
    assert.doesNotMatch(copy, /₪|ש"ח|ש״ח/);
  });

  it("ללא סימן קריאה, מקף ארוך וגרשיים מסולסלים בקופי", () => {
    const copy = [
      KIDS_BIRTHDAY_HERO.subtitle,
      KIDS_BIRTHDAY_HERO.metaDescription,
      KIDS_BIRTHDAY_AEO.text,
      KIDS_BIRTHDAY_PREPARATION,
      KIDS_BIRTHDAY_LOCATION.text,
      ...KIDS_BIRTHDAY_STAGES.map((s) => s.description),
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
    const answered = getAnsweredFaqs(buildKidsBirthdayFaqs());
    assert.deepEqual(
      answered.map((f) => f.question),
      [
        "מה קורה ביום הולדת באולפן?",
        "כמה זמן נמשך יום ההולדת?",
        "איך מזמינים?",
        "איך הילדים מתכוננים לפני יום ההולדת?",
        "כמה אנשים המקום מאכלס?",
        "איפה זה מתקיים?",
      ],
    );
    for (const f of answered) assert.ok(!f.answer.includes(MARKER_HEAD));
  });

  it("שאלה בלי תשובה נשארת ברשימת העמוד עם הסימון שלה", () => {
    const pending = buildKidsBirthdayFaqs().filter((f) => f.answer === null);
    assert.deepEqual(
      pending.map((f) => f.id),
      ["age", "min-children", "take-home", "parents-bring", "price"],
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
    assert.equal(getAnsweredFaqs(buildKidsBirthdayFaqs()).length, 6);
  });

  it("כשהבעלים ממלא שדות, התשובות והסכמה נגזרות מהם", () => {
    const filled = {
      ...KIDS_BIRTHDAY,
      ageRange: { value: "גילאי 6 עד 10", todo: "" },
      minChildren: { value: 6, todo: "" },
      takeHome: { value: ["שיר מוקלט", "תמונה", "מדבקה"], todo: "" },
    };
    const faqs = buildKidsBirthdayFaqs(filled);
    const byId = Object.fromEntries(faqs.map((f) => [f.id, f.answer]));
    assert.equal(byId["age"], "גילאי 6 עד 10");
    assert.equal(byId["min-children"], "מינימום 6 ילדים.");
    assert.equal(byId["take-home"], "שיר מוקלט, תמונה ומדבקה.");
    assert.equal(byId["price"], null);
    assert.equal(getAnsweredFaqs(faqs).length, 9);
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
