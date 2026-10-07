import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import {
  LEGACY_AUDIO_SAMPLE,
  LEGACY_CTA,
  LEGACY_DELIVERABLES,
  LEGACY_FAQS,
  LEGACY_OWNER_FACTS,
  LEGACY_PRACTICAL_DETAILS,
  LEGACY_PREP_TIPS,
  LEGACY_QUESTION_TOPICS,
  LEGACY_QUESTIONS_COUNT,
  LEGACY_QUESTIONS_NOTE,
  LEGACY_QUESTIONS_PDF,
  LEGACY_RECORDING_DESCRIPTION,
  LEGACY_RECORDING_META_TITLE,
  LEGACY_RECORDING_OPEN_FACT_KEYS,
  LEGACY_RECORDING_READY,
  LEGACY_RECORDING_SUBTITLE,
  LEGACY_WHY_NOW,
  openLegacyFactKeys,
} from "@/lib/data/legacy-recording";
import { buildLegacyRecordingSchema } from "@/lib/seo/legacy-recording-schema";

const root = join(import.meta.dirname, "..", "..");

/* כל הקופי הגלוי של הדף, למעט שדות מסוג עובדה חסרה שנבדקים בנפרד */
function allCopy(): string[] {
  return [
    LEGACY_RECORDING_META_TITLE,
    LEGACY_RECORDING_DESCRIPTION,
    LEGACY_RECORDING_SUBTITLE,
    LEGACY_QUESTIONS_NOTE,
    LEGACY_CTA.heading,
    LEGACY_CTA.body,
    LEGACY_CTA.whatsappLabel,
    LEGACY_CTA.whatsappText,
    ...LEGACY_WHY_NOW,
    ...LEGACY_PREP_TIPS,
    ...LEGACY_QUESTION_TOPICS.flatMap((t) => [t.title, ...t.questions]),
    ...LEGACY_DELIVERABLES.flatMap((d) => [d.title, d.body]),
    ...LEGACY_PRACTICAL_DETAILS.flatMap((d) => [d.label, d.value]),
    ...LEGACY_FAQS.flatMap((f) => [f.question, f.answer]),
    ...Object.values(LEGACY_OWNER_FACTS),
  ];
}

/* docs/HUMAN-COPY-GUIDELINES.md: בלי מקפים ארוכים, שלוש נקודות בתו אחד,
   מרכאות מסולסלות וסימן קריאה */
const FORBIDDEN_CHARS = /[—–…“”‘’!]/;

test("יש בדיוק 15 שאלות, כולן ייחודיות וכולן שאלות", () => {
  const questions = LEGACY_QUESTION_TOPICS.flatMap((t) => t.questions);
  assert.equal(questions.length, 15);
  assert.equal(LEGACY_QUESTIONS_COUNT, 15);
  assert.equal(new Set(questions).size, 15);
  for (const q of questions) {
    assert.ok(q.endsWith("?"), `לא שאלה: ${q}`);
  }
});

test("הקופי נקי מתווים אסורים וממחיר", () => {
  for (const text of allCopy()) {
    assert.ok(!FORBIDDEN_CHARS.test(text), `תו אסור ב: ${text}`);
    assert.ok(!/₪|שקל|ש"ח/.test(text), `מחיר בקופי: ${text}`);
  }
});

test("כותרת הדפדפן בטווח 50-60 עם סיומת המותג", () => {
  const full = `${LEGACY_RECORDING_META_TITLE} | יקיר כהן הפקות`;
  assert.ok(full.length >= 50 && full.length <= 60, `אורך ${full.length}: ${full}`);
});

test("openLegacyFactKeys מזהה רק ערכים שמתחילים בסימון חסר", () => {
  const marker = "[[" + "TODO-OWNER: מה חסר]]";
  assert.deepEqual(
    openLegacyFactKeys({ a: "ערך אמיתי", b: marker, c: "שעה" }),
    ["b"],
  );
  assert.deepEqual(openLegacyFactKeys({ a: "ערך" }), []);
});

test("מוכנות לפרסום נגזרת מהנתונים ולא מדגל ידני", () => {
  assert.deepEqual(LEGACY_RECORDING_OPEN_FACT_KEYS, openLegacyFactKeys());
  assert.equal(
    LEGACY_RECORDING_READY,
    LEGACY_RECORDING_OPEN_FACT_KEYS.length === 0 && LEGACY_AUDIO_SAMPLE !== null,
  );
});

test("כל שדה ב-LEGACY_OWNER_FACTS משמש בעמוד או בשאלות", () => {
  const used = JSON.stringify([
    LEGACY_DELIVERABLES,
    LEGACY_PRACTICAL_DETAILS,
    LEGACY_FAQS,
  ]);
  /* אורך הראיון והקובץ הערוך ו-preparation מוצגים ישירות ברכיב */
  const renderedDirectly = ["interviewLength", "editedFileLength", "preparation"];
  for (const [key, value] of Object.entries(LEGACY_OWNER_FACTS)) {
    if (renderedDirectly.includes(key)) continue;
    /* JSON מוסיף לוכסנים לפני מרכאות, לכן משווים מול הצורה המוברחת */
    const needle = JSON.stringify(value).slice(1, -1).slice(0, 40);
    assert.ok(used.includes(needle), `שדה שלא מוצג: ${key}`);
  }
});

test("הסכמה: Service ו-FAQPage, בלי offers ובלי areaServed", () => {
  const schema = buildLegacyRecordingSchema();
  const graph = schema["@graph"] as Record<string, unknown>[];
  const service = graph.find((n) => n["@type"] === "Service");
  const faq = graph.find((n) => n["@type"] === "FAQPage");
  assert.ok(service && faq);
  assert.ok(!("offers" in service), "offers בלי מחיר הוא צומת שבור");
  assert.ok(!("areaServed" in service), "אזור הגעה לבית עוד לא נמסר");
  /* מאפיינים של CreativeWork/WebPage, לא של Service (קומיט 62c6ecf2) */
  for (const key of ["inLanguage", "dateModified", "speakable"]) {
    assert.ok(!(key in service), `${key} אינו מאפיין של Service`);
  }
  assert.equal(faq.inLanguage, "he-IL");
  const entities = faq.mainEntity as { name: string }[];
  assert.deepEqual(
    entities.map((e) => e.name),
    LEGACY_FAQS.map((f) => f.question),
  );
});

test("קובץ ה-PDF קיים, תקין, וגודלו ומספר עמודיו תואמים לנתונים", () => {
  const file = join(root, "public", LEGACY_QUESTIONS_PDF.path);
  assert.ok(existsSync(file), `חסר ${file}`);
  const bytes = readFileSync(file);
  assert.equal(bytes.subarray(0, 5).toString("latin1"), "%PDF-");
  assert.equal(
    statSync(file).size,
    LEGACY_QUESTIONS_PDF.sizeBytes,
    "הקובץ השתנה. להריץ: npx tsx scripts/generate-legacy-questions-pdf.ts",
  );
  const pages = bytes.toString("latin1").match(/\/Type\s*\/Page(?![s\w])/g)?.length;
  assert.equal(pages, LEGACY_QUESTIONS_PDF.pages);
});

test("שם ההורדה הוא PDF, והנתיב לא נקרא href", () => {
  assert.ok(LEGACY_QUESTIONS_PDF.downloadName.endsWith(".pdf"));
  assert.ok(LEGACY_QUESTIONS_PDF.path.startsWith("/downloads/"));
});

test("אם יש דוגמת אודיו: הקובץ קיים, עד 60 שניות, ויש תמלול", () => {
  if (!LEGACY_AUDIO_SAMPLE) return;
  assert.ok(existsSync(join(root, "public", LEGACY_AUDIO_SAMPLE.src)));
  assert.ok(LEGACY_AUDIO_SAMPLE.durationSeconds <= 60);
  assert.ok(LEGACY_AUDIO_SAMPLE.transcript.trim().length > 0);
});
