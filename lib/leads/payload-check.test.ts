import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { buildIntakeEmailBody, buildPayload } from "@/lib/book-intake/build-payload";
import { buildBookingWhatsAppBody } from "@/lib/booking-messages";
import { BOOK_AUDIENCE_ROUTES } from "@/lib/data/book-audience-routes";
import type { CrossSellContext } from "@/lib/data/booking-cross-sell";
import { PRO_SERVICES } from "@/lib/data/pro-services";
import { isLeadSpam } from "@/lib/form-validation";
import { buildLeadNotifyBody } from "@/lib/lead-email-notify";
import {
  checkLeadNotifyPayload,
  fitLeadBody,
  FORM_ID_PATTERN,
  leadSoftFlags,
  MAX_LEAD_BODY_CHARS,
} from "@/lib/leads/payload-check";
import { buildWizardEscapeLead } from "@/lib/book-wizard-cro/build-wizard-escape-href";
import { buildPricingInquiryBody } from "@/lib/pricing-inquiry-body";
import { buildSmartFormLeadEmailBody } from "@/lib/smart-form-lead-email";
import { buildClosingMessage, buildSimpleLeadMessage } from "@/lib/whatsapp-closing";

/*
 * כל formId אמיתי, עם הגוף שהבונה האמיתי מייצר ועם ה-crossSell של נקודת הקריאה,
 * חייב לעבור את בדיקת השרת. כך נשבר LF-01: הדפדפן הוסיף "קישור להזמנה: https://"
 * והשרת דחה את הליד שלו עצמו.
 */

const CONTACT = { name: "נועה כהן", phone: "050-123-4567" };
const PHONE = "0501234567";
const SUMMARY = [
  { label: "תאריך", value: "2026-12-01" },
  { label: "מיקום", value: "מודיעין" },
];

function booking(opts: {
  serviceLabel: string;
  bookCategory: "studio" | "podcast" | "events" | "singer" | "academy" | "clips" | "online" | "dj" | "photography";
  ycForm: string;
  price?: number;
}): string {
  const price = opts.price ?? 3200;
  return buildBookingWhatsAppBody({
    intent: "start_now",
    serviceLabel: opts.serviceLabel,
    summaryLines: SUMMARY,
    contact: CONTACT,
    priceExVat: price,
    totalEstimate: Math.round(price * 1.18),
    utmSource: `/book#${opts.bookCategory}`,
    bookCategory: opts.bookCategory,
    includeTrustFooter: true,
    timing: "urgent",
    ycForm: opts.ycForm,
  });
}

function ghost(subjectLines: string): string {
  return `${subjectLines}\n\n[partial: שלב סגירה - לא נשלח לוואטסאפ]`;
}

type Case = {
  formId: string;
  body: () => string;
  crossSell?: CrossSellContext;
  name?: string;
  phone?: string;
};

const CASES: Case[] = [
  {
    formId: "studio_recording_booking",
    body: () => booking({ serviceLabel: "הקלטה באולפן", bookCategory: "studio", ycForm: "studio_recording_booking" }),
    crossSell: { bookCategory: "studio", routeId: "family-gifts", recordingType: "cover", atmosphere: "family" },
  },
  {
    formId: "events_booking_wizard",
    body: () => booking({ serviceLabel: "אטרקציות לאירוע", bookCategory: "events", ycForm: "events_booking_wizard" }),
    crossSell: { bookCategory: "events", routeId: null },
  },
  {
    formId: "podcast_booking_wizard",
    body: () => booking({ serviceLabel: "הפקת פודקאסט", bookCategory: "podcast", ycForm: "podcast_booking_wizard" }),
    crossSell: { bookCategory: "podcast" },
  },
  {
    formId: "singer_amplification_booking",
    body: () => booking({ serviceLabel: "הגברה לזמרים", bookCategory: "singer", ycForm: "singer_amplification_booking" }),
    crossSell: { bookCategory: "singer" },
  },
  /* לידי "רוח" של האשפים, לפי formId מ-lib/data/cro */
  { formId: "events_booking", body: () => ghost("תאריך: 2026-12-01\nחבילה: מסיבת רווקות") },
  { formId: "podcast_booking", body: () => ghost("חבילה: פרק ראשון") },
  {
    formId: "academy_booking",
    body: () => booking({ serviceLabel: "שיעור פרטי", bookCategory: "academy", ycForm: "academy_booking", price: 450 }),
    crossSell: { bookCategory: "academy" },
  },
  {
    formId: "clips_booking",
    body: () => booking({ serviceLabel: "קליפ", bookCategory: "clips", ycForm: "clips_booking" }),
    crossSell: { bookCategory: "clips" },
  },
  {
    formId: "online_restore_booking",
    body: () => booking({ serviceLabel: "שחזור סאונד", bookCategory: "online", ycForm: "online_restore_booking", price: 350 }),
    crossSell: { bookCategory: "online" },
  },
  {
    formId: "photography_calculator",
    body: () => booking({ serviceLabel: "חבילת צילום לאירוע", bookCategory: "photography", ycForm: "photography_calculator" }),
    crossSell: { bookCategory: "photography", routeId: null },
  },
  {
    formId: "dj_events_calculator",
    body: () => booking({ serviceLabel: "DJ ואירועים", bookCategory: "dj", ycForm: "dj_events_calculator", price: 9800 }),
    crossSell: { bookCategory: "dj", routeId: null },
  },
  {
    formId: "podcast_calculator",
    body: () => "שלום, אשמח לשמוע על חבילת פרק ראשון\nסה״כ משוער: 1,490 ₪ לפני מע״מ\n[YC:service=podcast|price=1490]",
    crossSell: { bookCategory: "podcast" },
    phone: undefined,
    name: undefined,
  },
  {
    formId: "academy_trial_lesson",
    body: () =>
      buildClosingMessage({
        serviceLabel: "שיעור ניסיון עברית פרטי",
        contact: CONTACT,
        intent: "start_now",
        summaryLines: SUMMARY,
        ycForm: "academy_trial_lesson",
      }),
    crossSell: { bookCategory: "academy" },
  },
  {
    formId: "singer_amplification_callback",
    body: () =>
      buildClosingMessage({
        serviceLabel: "הגברה לזמרים",
        contact: CONTACT,
        priceExVat: 4200,
        timing: "month",
        ycForm: "singer_amplification_callback",
      }),
    crossSell: { bookCategory: "singer", routeId: "singer-amplification" },
  },
  {
    formId: "contact_quiz",
    body: () =>
      buildClosingMessage({
        serviceLabel: "הקלטה באולפן",
        contact: CONTACT,
        customerNeed: "יש לי שיר ביוטיוב https://youtu.be/abc חחחחחחח!!!!!!",
        summaryLines: SUMMARY,
        timing: "urgent",
        intent: "start_now",
        source: "/contact",
        ycForm: "contact_quiz",
      }),
    crossSell: { bookCategory: "studio" },
  },
  ...["recording_song_final_cta_form", "recording_song_inquiry_form", "funny_ringtone_order_form", "callback_lead_form", "event_index_subscription"].map(
    (formId): Case => ({
      formId,
      body: () =>
        buildSimpleLeadMessage({
          contact: CONTACT,
          serviceLabel: "הקלטת שיר",
          customerNeed: "רוצה להקליט שיר לבת מצווה",
          source: "/recording-song",
          closerServiceId: "recording",
          ycForm: formId,
        }),
      crossSell: formId.startsWith("recording_song") ? { bookCategory: "studio" } : undefined,
    }),
  ),
  {
    formId: "pricing_inquiry",
    body: () =>
      buildPricingInquiryBody({
        sectionId: "studio",
        sectionTitle: "הקלטה באולפן",
        row: { label: "שיר כיסוי", exVat: 990 },
        qualify: { eventDate: "2026-12-01", budgetHint: "2000" },
        message: "שלום",
        name: CONTACT.name,
        phone: PHONE,
        email: "noa@example.com",
      }),
  },
  {
    formId: "smart_form_book",
    body: () =>
      buildSmartFormLeadEmailBody({
        categoryId: "family",
        selectedChipIds: ["cover", "song_pitch"],
        name: CONTACT.name,
        contactMethod: PHONE,
        socialOrId: "@noa",
        termsAccepted: true,
        baseCatalogId: "song_recording",
        estimateExVat: 800,
        upsellCatalogIds: ["song_pitch_coaching"],
        bookCategory: "studio",
      }),
    crossSell: { bookCategory: "studio" },
  },
  { formId: "online_restore_feasibility", body: () => "בדיקת היתכנות לשחזור הקלטה ישנה", phone: undefined },
  { formId: "wizard_wa_escape", body: () => "שלום, אשמח להמשיך בוואטסאפ", phone: undefined },
];

/** formId שלא נשלחים ל-/api/lead-notify, וכל אחד מהם נבדק במקום אחר */
const NOT_LEAD_NOTIFY = new Map<string, string>([
  ["pricing_inquiry_draft", "/api/leads/recover, ראו lib/leads/duplicate.test.ts"],
  ["book_intake_wizard", "/api/lead-intake, נבדק למטה עם buildIntakeEmailBody"],
]);

const ALL_CATEGORIES = ["studio", "podcast", "events", "dj", "photography", "clips", "singer", "academy", "online"];

function expectAccepted(c: Case, crossSell = c.crossSell) {
  const body = buildLeadNotifyBody({
    formId: c.formId,
    subject: "ליד חדש",
    body: c.body(),
    crossSell,
  });
  const result = checkLeadNotifyPayload({
    formId: c.formId,
    subject: "ליד חדש",
    body,
    name: "name" in c ? c.name : CONTACT.name,
    phone: "phone" in c ? c.phone : PHONE,
    website_verification: "",
  });
  assert.deepEqual(result, { kind: "accept", flags: [] }, `${c.formId} נדחה: ${JSON.stringify(result)}`);
  return body;
}

describe("checkLeadNotifyPayload: real form bodies", () => {
  for (const c of CASES) {
    it(`accepts ${c.formId}`, () => {
      expectAccepted(c);
    });
  }

  it("accepts the cross-sell block for all 9 categories (the LF-01 regression)", () => {
    const base = CASES[0];
    let withLink = 0;
    for (const bookCategory of ALL_CATEGORIES) {
      const body = expectAccepted(base, { bookCategory });
      /* הבדיקה הישנה (isLeadSpam על כל הגוף) דחתה בדיוק את הגוף הזה */
      if (body.includes("קישור להזמנה: https://")) {
        withLink += 1;
        assert.equal(isLeadSpam(body), true);
      }
    }
    assert.equal(withLink, ALL_CATEGORIES.length);
  });

  it("accepts every /book audience route quick lead and feasibility message", () => {
    for (const route of BOOK_AUDIENCE_ROUTES) {
      const quickId = `book_audience_${route.id.replace(/[^a-z0-9_]/gi, "_").slice(0, 40)}`;
      const feasId = `book_feasibility_${route.id.replace(/[^a-z0-9_]/gi, "_").slice(0, 36)}`;
      assert.match(quickId, FORM_ID_PATTERN, quickId);
      assert.match(feasId, FORM_ID_PATTERN, feasId);
      if (route.feasibilityCheckMessage) {
        expectAccepted({ formId: feasId, body: () => route.feasibilityCheckMessage!, phone: undefined });
      }
    }
  });

  it("every pro wizard formId is valid", () => {
    for (const service of PRO_SERVICES) {
      const id = `pro_wizard_${service.id.replace(/[^a-z0-9_]/gi, "_").slice(0, 40)}`;
      assert.match(id, FORM_ID_PATTERN, id);
    }
  });

  it("intake body (lead-intake) has no soft flags and fits the limit", () => {
    const payload = buildPayload({
      name: CONTACT.name,
      phone: PHONE,
      email: "",
      serviceTypeTag: "MIX_AND_MASTER",
      freeTextDescription: "הנה השיר: https://youtu.be/abc חחחחחחח",
    });
    const body = buildIntakeEmailBody(payload);
    assert.deepEqual(leadSoftFlags(payload.lead_name, body), []);
    assert.ok(body.length <= MAX_LEAD_BODY_CHARS);
  });
});

describe("checkLeadNotifyPayload: rules", () => {
  const ok = {
    formId: "contact_quiz",
    subject: "ליד חדש",
    body: "שלום",
    name: CONTACT.name,
    phone: PHONE,
  };

  it("customer links, repeated letters and !!!!!! are accepted (LF-16)", () => {
    for (const body of ["https://www.youtube.com/watch?v=x", "חחחחחחחח", "!!!!!!!!", "www.example.com"]) {
      assert.deepEqual(checkLeadNotifyPayload({ ...ok, body }), { kind: "accept", flags: [] });
    }
  });

  it("spam keywords only soft-flag", () => {
    assert.deepEqual(checkLeadNotifyPayload({ ...ok, body: "buy now casino" }), {
      kind: "accept",
      flags: ["spam_keyword"],
    });
  });

  it("a URL in the name is rejected", () => {
    assert.deepEqual(checkLeadNotifyPayload({ ...ok, name: "http://spam.example" }), {
      kind: "reject",
      error: "rejected",
    });
  });

  it("a filled honeypot is silently accepted", () => {
    assert.deepEqual(checkLeadNotifyPayload({ ...ok, website_verification: "bot" }), { kind: "honeypot" });
  });

  it("missing fields, bad formId, bad phone and long body are rejected", () => {
    assert.deepEqual(checkLeadNotifyPayload({ ...ok, body: "  " }), { kind: "reject", error: "missing_fields" });
    assert.deepEqual(checkLeadNotifyPayload({ ...ok, formId: "Bad-Form" }), { kind: "reject", error: "invalid_form" });
    assert.deepEqual(checkLeadNotifyPayload({ ...ok, phone: "12345" }), { kind: "reject", error: "invalid_phone" });
    assert.deepEqual(checkLeadNotifyPayload({ ...ok, body: "א".repeat(MAX_LEAD_BODY_CHARS + 1) }), {
      kind: "reject",
      error: "body_too_long",
    });
  });
});

describe("long real bodies", () => {
  it("a 2000-character message (the form maximum) is accepted, only the local closer link is dropped", () => {
    const raw = buildClosingMessage({
      serviceLabel: "הקלטה באולפן",
      contact: CONTACT,
      customerNeed: "א".repeat(2000),
      summaryLines: SUMMARY,
      intent: "start_now",
      ycForm: "contact_quiz",
    });
    const body = buildLeadNotifyBody({ formId: "contact_quiz", subject: "ליד", body: raw, crossSell: { bookCategory: "studio" } });
    assert.ok(body.length <= MAX_LEAD_BODY_CHARS, `length ${body.length}`);
    assert.ok(body.includes(raw.trim()));
    assert.ok(body.includes("קליטה מהירה"));
    assert.ok(!body.includes("yakir-closer.html?lead="));
    assert.equal(checkLeadNotifyPayload({ formId: "contact_quiz", subject: "ליד", body, name: CONTACT.name, phone: PHONE }).kind, "accept");
  });

  it("fitLeadBody fixes the same body sent by old browser JS, and leaves short bodies alone", () => {
    const raw = `שלום\n${"א".repeat(2000)}`;
    const old = `${raw}\n\n---\nלהדבקה ב-yakir-closer: העתיקו את גוף ההודעה למעלה לשדה "קליטה מהירה".\nאו פתחו מקומית: yakir-closer.html?lead=${"QUJD".repeat(1600)}\nאחרי ייבוא - שלב א׳: הצעת מחיר.`;
    assert.ok(old.length > MAX_LEAD_BODY_CHARS);
    const fitted = fitLeadBody(old);
    assert.ok(fitted.length <= MAX_LEAD_BODY_CHARS);
    assert.ok(fitted.startsWith(raw));
    const short = buildLeadNotifyBody({ formId: "contact_quiz", subject: "ליד", body: "שלום" });
    assert.equal(fitLeadBody(short), short);
    assert.ok(short.includes("yakir-closer.html?lead="));
  });
});

describe("wizard escape lead", () => {
  it("the owner email body keeps the premium and intent lines that the customer link drops (LF-06)", () => {
    const { body, href } = buildWizardEscapeLead({
      category: "studio",
      serviceLabel: "הקלטה באולפן",
      formId: "studio_recording_booking",
      summaryLines: SUMMARY,
      priceExVat: 9000,
      ycStep: 2,
    });
    const customer = new URL(href).searchParams.get("text") ?? "";
    assert.ok(body.includes("ליד פרימיום"));
    assert.ok(body.includes("*כוונה:*"));
    assert.ok(!customer.includes("ליד פרימיום"));
    assert.ok(!customer.includes("*כוונה:*"));
    assert.ok(customer.includes("[YC:"));
  });
});

/*
 * מגן כיסוי: כל formId שמופיע בקוד חייב להופיע בטבלה למעלה (או ב-NOT_LEAD_NOTIFY).
 * טופס חדש בלי שורה כאן מפיל את הבדיקות, ולכן אי אפשר להוסיף טופס שהשרת דוחה.
 */
describe("formId coverage guard", () => {
  const ROOT = process.cwd();
  const DIRS = ["components", "hooks", path.join("lib", "data", "cro")];
  const PATTERNS = [/formId\s*[:=]\s*"([a-z][a-z0-9_]+)"/g, /FORM_ID\s*=\s*"([a-z][a-z0-9_]+)"/g];

  function walk(dir: string, out: string[] = []): string[] {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full, out);
      else if (/\.(ts|tsx)$/.test(entry.name) && !/\.test\.ts$/.test(entry.name)) out.push(full);
    }
    return out;
  }

  it("every formId literal in components has a test case", () => {
    const found = new Set<string>();
    for (const dir of DIRS) {
      for (const file of walk(path.join(ROOT, dir))) {
        const src = fs.readFileSync(file, "utf8");
        for (const re of PATTERNS) {
          for (const m of src.matchAll(re)) found.add(m[1]);
        }
      }
    }
    assert.ok(found.size > 10, `found only ${found.size} formIds, scan is broken`);
    const covered = new Set([...CASES.map((c) => c.formId), ...NOT_LEAD_NOTIFY.keys()]);
    const missing = [...found].filter((id) => !covered.has(id)).sort();
    assert.deepEqual(missing, [], `formId בלי בדיקה ב-payload-check.test.ts: ${missing.join(", ")}`);
  });
});
