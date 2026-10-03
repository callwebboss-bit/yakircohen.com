import assert from "node:assert/strict";
import { test } from "node:test";
import { CATALOG_VAT_RATE, SONG_PARTICIPANT_RULES, getExVat } from "@/lib/data/pricing-catalog";
import {
  DEFAULT_WORK_VALUE,
  STUDIO_COST_CATEGORIES,
  STUDIO_COST_METHODOLOGY,
  hourCost,
  nis,
  studioCostFaqs,
  monthlyFixedCost,
  songBreakdown,
} from "@/lib/data/studio-cost-model";

test("F נעול על 6,755.55 (cost-model-sources.md סעיף 19.2)", () => {
  assert.equal(monthlyFixedCost(), 6755.55);
});

test("עלות שעה בתרחיש הבסיס תואמת את model-status.md", () => {
  assert.equal(hourCost(60), 312.59);
  assert.equal(hourCost(40), 468.89);
  assert.equal(hourCost(80), 234.44);
  assert.equal(hourCost(60, 15000), 362.59);
});

test("פרוסות B מסתכמות במחיר הלקוח, מהקטלוג", () => {
  const customer = getExVat("song_recording") * (1 + CATALOG_VAT_RATE);
  const sum = songBreakdown().reduce((s, row) => s + row.amount, 0);
  assert.ok(Math.abs(sum - customer) < 0.01, `sum ${sum} != ${customer}`);
});

test("פיצול זמן העבודה מסתכם בשורה עצמה", () => {
  const work = songBreakdown().find((r) => r.id === "work");
  assert.ok(work?.parts);
  const sum = work.parts.reduce((s, p) => s + p.amount, 0);
  assert.ok(Math.abs(sum - work.amount) < 0.01);
});

test("לכל שורת עלות יש סוג מקור, נוסחה וקישור למקור (\"לכל מספר יש מקור\")", () => {
  for (const category of STUDIO_COST_CATEGORIES) {
    for (const line of category.lines) {
      assert.ok(line.kinds.length > 0, line.label);
      assert.ok(line.formula.length > 0, line.label);
      assert.ok(line.sourceUrl?.startsWith("https://"), line.label);
    }
  }
});

test("FAQ שיר קבוצה לפי SONG_PARTICIPANT_RULES, בלי מחיר המשתתף של ברכה (החלטת בעלים 3.10, סבב רביעי)", () => {
  const answer = studioCostFaqs().find((f) => f.id === "group-song")?.answer ?? "";
  const extra = Math.round(getExVat(SONG_PARTICIPANT_RULES.extraId) * (1 + CATALOG_VAT_RATE));
  const blessingExtra = Math.round(getExVat("studio_extra_participant") * (1 + CATALOG_VAT_RATE));
  assert.ok(answer.includes(`${extra} ₪`), answer);
  assert.ok(!answer.includes(`${blessingExtra} ₪`), answer);
  assert.ok(answer.includes(String(SONG_PARTICIPANT_RULES.max)), answer);
});

test("אין מספר כתוב ביד ליד ₪ בטקסט המתודולוגיה", () => {
  for (const line of STUDIO_COST_METHODOLOGY) {
    assert.ok(!/\d{1,3},\d{3} ₪/.test(line) || line.includes(nis(DEFAULT_WORK_VALUE)), line);
  }
});
