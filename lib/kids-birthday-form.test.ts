import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  CHILDREN_SANITY_CAP,
  buildKidsBirthdayLeadMessage,
  parseChildrenCount,
  validateChildrenCount,
  validateKidsBirthdayLead,
} from "@/lib/kids-birthday-form";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { parseYcLeadTag } from "@/lib/yc-lead-tag";

const NO_LIMITS = { min: null };

/** תאריך עתידי תקף, בפורמט שמחזיר input מסוג date */
function futureIso(daysAhead = 30): string {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

describe("parseChildrenCount", () => {
  it("מקבל מספר שלם חיובי בלבד", () => {
    assert.equal(parseChildrenCount("8"), 8);
    assert.equal(parseChildrenCount(" 12 "), 12);
    for (const bad of ["", "0", "-3", "2.5", "שמונה", "1e3", "8 ילדים"]) {
      assert.equal(parseChildrenCount(bad), null, bad);
    }
  });
});

describe("validateChildrenCount", () => {
  it("בלי מינימום (null): מדלג עליו ומקבל כל כמות סבירה", () => {
    assert.equal(validateChildrenCount("1", NO_LIMITS).ok, true);
    assert.equal(validateChildrenCount("40", NO_LIMITS).ok, true);
  });

  it("מעל 14 (הקיבולת של המקום) מותר: ההערה מידעית ולא חוסמת", () => {
    for (const n of ["14", "15", "30", "120"]) {
      assert.equal(validateChildrenCount(n, NO_LIMITS).ok, true, n);
    }
  });

  it("תקרת השפיות חוסמת ספאם בלי להיראות כמגבלה עסקית", () => {
    assert.equal(validateChildrenCount(String(CHILDREN_SANITY_CAP), NO_LIMITS).ok, true);
    const res = validateChildrenCount(String(CHILDREN_SANITY_CAP + 1), NO_LIMITS);
    assert.equal(res.ok, false);
    assert.ok(!res.ok && !res.errors.children.includes(String(CHILDREN_SANITY_CAP)));
  });

  it("שדה ריק ושאינו מספר שלם נחסמים", () => {
    for (const bad of ["", "  ", "abc", "0", "3.5"]) {
      assert.equal(validateChildrenCount(bad, NO_LIMITS).ok, false, bad);
    }
  });

  it("כשהמינימום מולא: חוסם מתחתיו ומציין את המספר, ולא חוסם מעליו", () => {
    const limits = { min: 6 };
    const low = validateChildrenCount("5", limits);
    assert.ok(!low.ok && low.errors.children.includes("6"));
    assert.equal(validateChildrenCount("6", limits).ok, true);
    assert.equal(validateChildrenCount("20", limits).ok, true);
  });
});

describe("validateKidsBirthdayLead", () => {
  const valid = {
    name: "נועה כהן",
    phone: "052-3456789",
    date: futureIso(),
    children: "8",
  };

  it("טופס תקין: ok עם טלפון מנורמל", () => {
    const res = validateKidsBirthdayLead(valid, NO_LIMITS);
    assert.equal(res.ok, true);
    assert.ok(res.ok && res.normalizedPhone === "0523456789");
  });

  it("מחזיר שגיאה לכל שדה לפי שמו: name, phone, date, children", () => {
    const res = validateKidsBirthdayLead(
      { name: "", phone: "123", date: "", children: "" },
      NO_LIMITS,
    );
    assert.equal(res.ok, false);
    assert.deepEqual(
      !res.ok && Object.keys(res.errors).sort(),
      ["children", "date", "name", "phone"],
    );
  });

  it("תאריך בעבר נחסם תחת date", () => {
    const res = validateKidsBirthdayLead({ ...valid, date: "2020-01-01" }, NO_LIMITS);
    assert.ok(!res.ok && "date" in res.errors && !("eventDate" in res.errors));
  });

  it("מכבד מינימום שמולא, ולא חוסם מעל קיבולת המקום", () => {
    const low = validateKidsBirthdayLead({ ...valid, children: "3" }, { min: 5 });
    assert.ok(!low.ok && "children" in low.errors);
    const over = validateKidsBirthdayLead({ ...valid, children: "18" }, { min: 5 });
    assert.equal(over.ok, true);
  });
});

describe("buildKidsBirthdayLeadMessage", () => {
  const body = buildKidsBirthdayLeadMessage({
    name: "נועה כהן",
    phone: "052-345-6789",
    date: "2030-03-14",
    children: 9,
  });

  it("כולל שם, טלפון, תאריך ומספר ילדים ושם שירות", () => {
    assert.match(body, /נועה כהן/);
    assert.match(body, /052-345-6789/);
    assert.match(body, /תאריך מבוקש: .*2030/);
    assert.match(body, /מספר ילדים: 9/);
    assert.match(body, /יום הולדת לילדים באולפן/);
    assert.match(body, /מקור: \/studio\/kids-birthday/);
  });

  it("תג YC מזהה את הטופס, ומספר הילדים לא נכנס ל-children של תמחור ההקלטה", () => {
    const tag = parseYcLeadTag(body);
    assert.ok(tag);
    assert.equal(tag.service, "recording");
    assert.equal(tag.form, "studio_kids_birthday_form");
    assert.equal(tag.source, "/studio/kids-birthday");
    assert.equal(tag.children, null);
    assert.equal(tag.price, null);
  });

  it("אין מחיר בהודעה", () => {
    assert.doesNotMatch(body, /₪|מחיר/);
  });

  it("קישור הוואטסאפ מקודד עברית ולא חושף את שורת הכוונה הפנימית", () => {
    const href = buildWhatsAppHref({
      text: body,
      utm_source: "website",
      utm_campaign: "studio_kids_birthday_form",
    });
    assert.ok(href.startsWith("https://wa.me/972587555456?text="));
    const decoded = decodeURIComponent(href.split("text=")[1].split("&")[0]);
    assert.doesNotMatch(decoded, /כוונה/);
    assert.match(decoded, /מספר ילדים: 9/);
  });
});
