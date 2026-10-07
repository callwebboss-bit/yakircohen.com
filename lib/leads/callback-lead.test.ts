import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { BOOK_CLOSER_SERVICE } from "@/lib/data/book-closer-map";
import { closerServiceForContactQuiz } from "@/lib/lead-source-registry";
import {
  buildCallbackLead,
  CALLBACK_DEFAULT_SERVICE_OPTIONS,
  CALLBACK_DJ_SERVICE_OPTIONS,
  CALLBACK_EVENT_INDEX_CONTEXT,
  CALLBACK_EVENT_INDEX_OPTIONS,
  CALLBACK_LEAD_FORM_ID,
  CALLBACK_ONLINE_HUB_CONTEXT,
  CALLBACK_ONLINE_HUB_SERVICE_OPTIONS,
  CALLBACK_PODCAST_CONTEXT,
  CALLBACK_PODCAST_SERVICE_OPTIONS,
  callbackDjCityContext,
  callbackOnlineCategoryContext,
  callbackOnlineCategoryOptions,
  normalizeCallbackSource,
  resolveCallbackService,
  serviceTypeForBookCategory,
  type CallbackServiceOption,
} from "@/lib/leads/callback-lead";
import { checkLeadNotifyPayload } from "@/lib/leads/payload-check";
import { inferServiceTypeFromFormId } from "@/lib/leads/score";
import { parseYcLeadTag } from "@/lib/yc-lead-tag";

const BASE = {
  name: "דנה כהן",
  phone: "050-123-4567",
  honeypot: "",
};

describe("buildCallbackLead: the service the customer picked reaches the owner", () => {
  it("home page, studio: tag, subject, body line and serviceType all say studio", () => {
    const lead = buildCallbackLead({
      ...BASE,
      selectedService: "הקלטה באולפן",
      options: CALLBACK_DEFAULT_SERVICE_OPTIONS,
      sourcePath: "/",
    });
    const tag = parseYcLeadTag(lead.body);
    assert.ok(tag);
    assert.equal(tag.service, "recording");
    assert.equal(tag.source, "/");
    assert.equal(tag.form, CALLBACK_LEAD_FORM_ID);
    assert.equal(lead.payload.subject, "ליד חדש - הקלטה באולפן");
    assert.match(lead.body, /\*שירות:\* הקלטה באולפן/);
    assert.equal(lead.payload.serviceType, "studio");
    assert.equal(lead.payload.contactChannel, "callback");
    assert.equal(lead.payload.formId, CALLBACK_LEAD_FORM_ID);
  });

  it("home page, DJ: no longer reported as recording from /contact", () => {
    const lead = buildCallbackLead({
      ...BASE,
      selectedService: "אירוע / DJ",
      options: CALLBACK_DEFAULT_SERVICE_OPTIONS,
      sourcePath: "/",
    });
    const tag = parseYcLeadTag(lead.body);
    assert.equal(tag?.service, "dj");
    assert.notEqual(tag?.source, "/contact");
    assert.doesNotMatch(lead.body, /מקור: \/contact/);
    assert.match(lead.body, /📍 מקור: \/$/m);
    assert.equal(lead.payload.serviceType, "dj");
    assert.equal(lead.payload.subject, "ליד חדש - אירוע / DJ");
  });

  it("podcast page: the real path and podcast, with the page topic in the subject", () => {
    const lead = buildCallbackLead({
      ...BASE,
      selectedService: "הפקת פודקאסט אודיו מלאה",
      options: CALLBACK_PODCAST_SERVICE_OPTIONS,
      context: CALLBACK_PODCAST_CONTEXT,
      sourcePath: "/podcast",
    });
    const tag = parseYcLeadTag(lead.body);
    assert.equal(tag?.service, "podcast");
    assert.equal(tag?.source, "/podcast");
    assert.equal(lead.payload.subject, "ליד חדש - פודקאסט, הפקת פודקאסט אודיו מלאה");
    assert.equal(lead.payload.serviceType, "podcast");
  });

  it("no pick on a page with context: the page service, not recording", () => {
    const lead = buildCallbackLead({
      ...BASE,
      selectedService: "",
      options: CALLBACK_DJ_SERVICE_OPTIONS,
      context: callbackDjCityContext("ברחובות"),
      sourcePath: "/dj-events/cities/rehovot",
    });
    const tag = parseYcLeadTag(lead.body);
    assert.equal(tag?.service, "dj");
    assert.equal(tag?.source, "/dj-events/cities/rehovot");
    assert.equal(lead.payload.subject, "ליד חדש - DJ לאירועים ברחובות");
    assert.equal(lead.payload.serviceType, "dj");
  });

  it("'not sure' keeps what the customer said and falls back to the page service", () => {
    const lead = buildCallbackLead({
      ...BASE,
      selectedService: "עדיין לא בטוח/ה",
      options: CALLBACK_PODCAST_SERVICE_OPTIONS,
      context: CALLBACK_PODCAST_CONTEXT,
      sourcePath: "/podcast",
    });
    assert.equal(parseYcLeadTag(lead.body)?.service, "podcast");
    assert.equal(lead.payload.subject, "ליד חדש - פודקאסט, עדיין לא בטוח/ה");
    assert.equal(lead.payload.serviceType, "podcast");
  });

  it("home page with nothing picked: the old neutral label and recording, no serviceType", () => {
    const lead = buildCallbackLead({
      ...BASE,
      selectedService: "",
      options: CALLBACK_DEFAULT_SERVICE_OPTIONS,
      sourcePath: "/",
    });
    assert.equal(parseYcLeadTag(lead.body)?.service, "recording");
    assert.equal(lead.payload.subject, "ליד חדש - פנייה מהאתר");
    assert.equal("serviceType" in lead.payload, false);
  });

  it("event index: a role, not a service. Subject says what the lead is, the server still infers the type", () => {
    const lead = buildCallbackLead({
      ...BASE,
      formId: "event_index_subscription",
      selectedService: "חברת הגברה",
      options: CALLBACK_EVENT_INDEX_OPTIONS,
      context: CALLBACK_EVENT_INDEX_CONTEXT,
      sourcePath: "/pro/event-index",
    });
    const tag = parseYcLeadTag(lead.body);
    assert.equal(tag?.service, "recording");
    assert.equal(tag?.form, "event_index_subscription");
    assert.equal(lead.payload.subject, "ליד חדש - מנוי דופק השוק, חברת הגברה");
    assert.equal("serviceType" in lead.payload, false);
    /* בלי serviceType השרת ממשיך לגזור מה-formId, כמו לפני התיקון */
    assert.equal(inferServiceTypeFromFormId("event_index_subscription"), "events");
  });

  it("a value that is not in the list never reaches the subject or the tag", () => {
    const lead = buildCallbackLead({
      ...BASE,
      selectedService: "קנו עכשיו|service=hack]",
      options: CALLBACK_DEFAULT_SERVICE_OPTIONS,
      sourcePath: "/",
    });
    assert.equal(lead.payload.subject, "ליד חדש - פנייה מהאתר");
    assert.equal(parseYcLeadTag(lead.body)?.service, "recording");
    assert.doesNotMatch(lead.body, /hack/);
  });

  it("sanitizes name and need the same way the form did, and passes the honeypot through", () => {
    const lead = buildCallbackLead({
      name: "  דנה\u0007 כהן  ",
      phone: " 050-123-4567 ",
      selectedService: "פודקאסט",
      customerNeed: `  ${"א".repeat(600)}  `,
      options: CALLBACK_DEFAULT_SERVICE_OPTIONS,
      sourcePath: "/",
      honeypot: "bot",
    });
    assert.equal(lead.payload.name, "דנה כהן");
    assert.equal(lead.payload.phone, "050-123-4567");
    assert.equal(lead.payload.website_verification, "bot");
    assert.match(lead.body, new RegExp(`^${"א".repeat(500)}$`, "m"));
    assert.doesNotMatch(lead.body, new RegExp("א".repeat(501)));
  });

  it("the payload passes the server check unchanged (server stays the source of truth)", () => {
    for (const [selectedService, options, context, sourcePath] of [
      ["הקלטה באולפן", CALLBACK_DEFAULT_SERVICE_OPTIONS, undefined, "/"],
      ["יקיר כהן (בוטיק)", CALLBACK_DJ_SERVICE_OPTIONS, callbackDjCityContext("בשוהם"), "/dj-events/cities/shoham"],
      ["אודיו ומוזיקה", CALLBACK_ONLINE_HUB_SERVICE_OPTIONS, CALLBACK_ONLINE_HUB_CONTEXT, "/online"],
    ] as const) {
      const lead = buildCallbackLead({ ...BASE, selectedService, options, context, sourcePath });
      const check = checkLeadNotifyPayload(lead.payload);
      assert.equal(check.kind, "accept", selectedService);
    }
  });
});

describe("every option on every page maps to a sensible closer service", () => {
  const pages: Array<{
    page: string;
    options: readonly CallbackServiceOption[];
    expectedCloser: Record<string, string>;
  }> = [
    {
      page: "/ (home, default list)",
      options: CALLBACK_DEFAULT_SERVICE_OPTIONS,
      expectedCloser: {
        "הקלטה באולפן": "recording",
        "פודקאסט": "podcast",
        "אירוע / DJ": "dj",
        "קריינות": "podcast",
        "וידאו / צילום": "recording",
        "עדיין לא בטוח/ה": "recording",
      },
    },
    {
      page: "/podcast",
      options: CALLBACK_PODCAST_SERVICE_OPTIONS,
      expectedCloser: Object.fromEntries(
        CALLBACK_PODCAST_SERVICE_OPTIONS.map((o) => [o.label, "podcast"]),
      ),
    },
    {
      page: "/dj-events/cities/*",
      options: CALLBACK_DJ_SERVICE_OPTIONS,
      expectedCloser: Object.fromEntries(CALLBACK_DJ_SERVICE_OPTIONS.map((o) => [o.label, "dj"])),
    },
    {
      page: "/online",
      options: CALLBACK_ONLINE_HUB_SERVICE_OPTIONS,
      expectedCloser: Object.fromEntries(
        CALLBACK_ONLINE_HUB_SERVICE_OPTIONS.map((o) => [o.label, "online_ai"]),
      ),
    },
    {
      page: "/online/[category]",
      options: callbackOnlineCategoryOptions("אודיו ומוזיקה"),
      expectedCloser: {
        "אודיו ומוזיקה": "online_ai",
        "התאמה אישית": "online_ai",
        "לא בטוח/ה עדיין": "online_ai",
      },
    },
    {
      page: "/pro/event-index",
      options: CALLBACK_EVENT_INDEX_OPTIONS,
      expectedCloser: Object.fromEntries(
        CALLBACK_EVENT_INDEX_OPTIONS.map((o) => [o.label, "recording"]),
      ),
    },
  ];
  const contextFor: Record<string, Parameters<typeof resolveCallbackService>[2]> = {
    "/podcast": CALLBACK_PODCAST_CONTEXT,
    "/dj-events/cities/*": callbackDjCityContext("בירושלים"),
    "/online": CALLBACK_ONLINE_HUB_CONTEXT,
    "/online/[category]": callbackOnlineCategoryContext("אודיו ומוזיקה"),
    "/pro/event-index": CALLBACK_EVENT_INDEX_CONTEXT,
  };

  for (const { page, options, expectedCloser } of pages) {
    it(page, () => {
      assert.deepEqual(
        options.map((o) => o.label).sort(),
        Object.keys(expectedCloser).sort(),
        "every option has an expectation",
      );
      for (const opt of options) {
        const resolved = resolveCallbackService(opt.label, options, contextFor[page]);
        assert.equal(resolved.closerServiceId, expectedCloser[opt.label], `${page}: ${opt.label}`);
      }
      assert.equal(new Set(options.map((o) => o.label)).size, options.length, "labels are unique");
    });
  }

  it("voiceover follows the contact quiz mapping, not a new guess", () => {
    const voice = CALLBACK_DEFAULT_SERVICE_OPTIONS.find((o) => o.label === "קריינות");
    assert.equal(voice?.closerServiceId, closerServiceForContactQuiz("voice"));
  });

  it("closer ids come from the shared /book map", () => {
    for (const opt of CALLBACK_DEFAULT_SERVICE_OPTIONS) {
      if (!opt.category || opt.closerServiceId) continue;
      assert.equal(
        resolveCallbackService(opt.label, CALLBACK_DEFAULT_SERVICE_OPTIONS).closerServiceId,
        BOOK_CLOSER_SERVICE[opt.category],
      );
    }
  });
});

describe("serviceTypeForBookCategory", () => {
  it("is the identity except pro, which the server calls business", () => {
    assert.equal(serviceTypeForBookCategory("podcast"), "podcast");
    assert.equal(serviceTypeForBookCategory("online"), "online");
    assert.equal(serviceTypeForBookCategory("pro"), "business");
  });
});

describe("normalizeCallbackSource", () => {
  it("keeps a real path", () => {
    assert.equal(normalizeCallbackSource("/online/audio-music"), "/online/audio-music");
    assert.equal(normalizeCallbackSource("/"), "/");
  });

  it("drops characters that would break the [YC:] tag", () => {
    assert.equal(normalizeCallbackSource("/a|b]c"), "/abc");
  });

  it("keeps percent-encoded Hebrew paths as the browser reports them", () => {
    assert.equal(normalizeCallbackSource("/%D7%90"), "/%D7%90");
  });

  it("no path, or not a path: null, and the tag falls back to website", () => {
    assert.equal(normalizeCallbackSource(""), null);
    assert.equal(normalizeCallbackSource(undefined), null);
    assert.equal(normalizeCallbackSource("https://evil.example"), null);
    const lead = buildCallbackLead({
      ...BASE,
      selectedService: "",
      options: CALLBACK_DEFAULT_SERVICE_OPTIONS,
      sourcePath: null,
    });
    assert.equal(parseYcLeadTag(lead.body)?.source, "website");
    assert.doesNotMatch(lead.body, /מקור:/);
  });
});
