import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CONTACT_PHONE_WHATSAPP } from "@/lib/constants";
import { findLeadCode } from "@/lib/lead-code";
import {
  buildServiceWhatsAppText,
  buildWhatsAppHref,
  readWhatsAppLeadCode,
  stampWhatsAppLeadCode,
  toCustomerWhatsAppText,
} from "@/lib/whatsapp";
import { buildClosingMessage } from "@/lib/whatsapp-closing";
import { buildIntakeWhatsAppHref, buildPayload } from "@/lib/book-intake/build-payload";
import { buildConsultWhatsAppHref } from "@/lib/booking-messages";
import { BOOK_AUDIENCE_ROUTES, buildFastWhatsAppMessage } from "@/lib/data/book-audience-routes";
import { buildBlogCtaWhatsAppMessage } from "@/lib/data/conversion-copy";
import { buildShopWhatsAppHref } from "@/lib/data/shop-vouchers";
import { buildSongOfferWhatsAppHref } from "@/lib/data/song-offer";
import { buildAccordionWhatsAppText, STUDIO_PRICING_ACCORDION_PANELS } from "@/lib/data/studio-pricing-accordion";

function decodeText(href: string): string {
  return new URL(href).searchParams.get("text") ?? "";
}

describe("toCustomerWhatsAppText (LF-06)", () => {
  const owner = buildClosingMessage({
    serviceLabel: "הקלטה באולפן",
    contact: { name: "נועה", phone: "050-123-4567" },
    priceExVat: 3000,
    timing: "urgent",
    intent: "start_now",
    closerServiceId: "recording",
    ycForm: "contact_quiz",
  });

  it("the owner text still carries the internal lines", () => {
    assert.match(owner, /ליד פרימיום/);
    assert.match(owner, /⏰ דחוף/);
    assert.match(owner, /\*כוונה:\*/);
  });

  it("the customer's WhatsApp text drops premium, timing and intent lines", () => {
    const text = decodeText(buildWhatsAppHref({ text: owner }));
    assert.doesNotMatch(text, /ליד פרימיום/);
    assert.doesNotMatch(text, /⏰ דחוף/);
    assert.doesNotMatch(text, /\*כוונה:\*/);
    assert.ok(!text.startsWith("\n"), "no leading blank line");
    assert.match(text, /\*שירות:\* הקלטה באולפן/);
    assert.match(text, /\*שם:\* נועה/);
  });

  /* החלטת הבעלים D67, 7.10.2026: התג נשאר רק במייל לבעלים */
  it("drops the [YC:...] tag from the customer's text, the owner text keeps it", () => {
    assert.match(owner, /\[YC:[^\]]*service=/);
    const text = decodeText(buildWhatsAppHref({ text: owner }));
    assert.ok(!text.includes("[YC:"), text);
    assert.ok(!text.endsWith("\n"), "no trailing blank line where the tag was");
  });

  it("removes a tag inside a line and keeps the rest of the line", () => {
    assert.equal(toCustomerWhatsAppText("שלום [YC:service=dj|source=x|step=1]\nתודה"), "שלום\nתודה");
  });

  it("does not touch customer text that only mentions the words", () => {
    const t = "אני דחוף לי להקליט\nכוונה שלי היא לשיר";
    assert.equal(toCustomerWhatsAppText(t), t);
  });

  it("removes every timing flag", () => {
    for (const flag of ["📆 תוך חודש", "🗓️ גמיש", "🔭 עתידי"]) {
      assert.equal(toCustomerWhatsAppText(`${flag}\n\nשלום`), "שלום");
    }
  });
});

describe("buildServiceWhatsAppText: ברכה אחת בלבד", () => {
  const PRICE = "מחיר לדוגמה";

  it("נושא בלי ברכה נעטף בפתיחה, כמו קודם", () => {
    assert.equal(buildServiceWhatsAppText("הקלטת שיר"), "שלום, אשמח לשמוע על הקלטת שיר");
    assert.equal(
      buildServiceWhatsAppText("  הקלטת שיר  ", PRICE),
      `שלום, אשמח לשמוע על הקלטת שיר - מחיר: ${PRICE}`,
    );
  });

  it("נושא ריק נשאר הפתיחה הכללית", () => {
    assert.equal(buildServiceWhatsAppText(""), "שלום, אשמח לשמוע על השירות");
    assert.equal(buildServiceWhatsAppText("   ", PRICE), `שלום, אשמח לשמוע על השירות - מחיר: ${PRICE}`);
  });

  it("נושא שפותח בברכה נשלח כמו שהוא, בלי ברכה שנייה", () => {
    const subject = "שלום, מעוניין/ת בהגברה לזמר/להקה";
    assert.equal(buildServiceWhatsAppText(subject), subject);
    assert.equal(buildServiceWhatsAppText(`  ${subject}  `), subject);
    assert.doesNotMatch(buildServiceWhatsAppText(subject), /אשמח לשמוע על שלום/);
  });

  it("המחיר מתווסף באותה צורה גם כשהנושא פותח בברכה", () => {
    const subject = "שלום, מעוניין/ת בהגברה לזמר/להקה - חבילה 1";
    assert.equal(buildServiceWhatsAppText(subject, PRICE), `${subject} - מחיר: ${PRICE}`);
  });

  it("כל מילות הברכה, עם פסיק או רווח אחריהן", () => {
    for (const subject of ["שלום, רציתי לשאול", "היי, רציתי לשאול", "הי רציתי לשאול", "אהלן, רציתי לשאול", "שלום רציתי לשאול"]) {
      assert.equal(buildServiceWhatsAppText(subject), subject);
    }
  });

  it("מילה שרק מתחילה כמו ברכה אינה ברכה", () => {
    assert.equal(buildServiceWhatsAppText("הילוך איטי לסרטון"), "שלום, אשמח לשמוע על הילוך איטי לסרטון");
    assert.equal(buildServiceWhatsAppText("שלומית ושירים"), "שלום, אשמח לשמוע על שלומית ושירים");
  });

  it("הקישור לוואטסאפ נושא את הטקסט בלי הכפלה", () => {
    const text = decodeText(
      buildWhatsAppHref({ text: buildServiceWhatsAppText("היי, מעוניין בפודקאסט", PRICE) }),
    );
    assert.equal(text, `היי, מעוניין בפודקאסט - מחיר: ${PRICE}`);
  });
});

/* ─── קוד פנייה (החלטת הבעלים D67, 7.10.2026) ─── */

describe("lead code in the WhatsApp link (D67)", () => {
  const href = buildWhatsAppHref({
    text: "שלום, אשמח להקליט שיר\n[YC:service=recording|source=/x|step=1]",
    utm_source: "website",
    utm_campaign: "song_offer",
  });

  it("stamps a code as the last line, instead of the tag", () => {
    const stamped = stampWhatsAppLeadCode(href);
    const text = decodeText(stamped);
    const lines = text.split("\n");
    assert.match(lines[lines.length - 1], /^קוד פנייה: [A-HJKMNP-Z2-9]{4}$/);
    assert.ok(!text.includes("[YC:"));
    assert.equal(readWhatsAppLeadCode(stamped), findLeadCode(text));
    /* שאר הפרמטרים נשארים, ורווח נשאר %20 */
    assert.match(stamped, /&utm_source=website&utm_campaign=song_offer$/);
    assert.ok(!stamped.includes("+"));
  });

  it("a second click keeps the same code, an explicit code replaces it", () => {
    const once = stampWhatsAppLeadCode(href);
    assert.equal(stampWhatsAppLeadCode(once), once);
    assert.equal(readWhatsAppLeadCode(stampWhatsAppLeadCode(once, "A7K2")), "A7K2");
    assert.equal(readWhatsAppLeadCode(stampWhatsAppLeadCode(href, "A7K2")), "A7K2");
  });

  it("strips a tag even from a link that did not go through buildWhatsAppHref", () => {
    const raw = `https://wa.me/${CONTACT_PHONE_WHATSAPP}?text=${encodeURIComponent("שלום\n[YC:service=dj|source=x|step=1]")}`;
    const text = decodeText(stampWhatsAppLeadCode(raw, "A7K2"));
    assert.equal(text, "שלום\nקוד פנייה: A7K2");
  });

  it("leaves other links alone: share links, other numbers, no text", () => {
    const share = `https://wa.me/?text=${encodeURIComponent("כתבה מעניינת")}`;
    const other = `https://wa.me/972500000000?text=${encodeURIComponent("שלום")}`;
    const empty = `https://wa.me/${CONTACT_PHONE_WHATSAPP}`;
    for (const link of [share, other, empty, "https://example.com/?text=x", "not a url"]) {
      assert.equal(stampWhatsAppLeadCode(link), link);
      assert.equal(readWhatsAppLeadCode(link), null);
    }
  });

  it("buildWhatsAppHref keeps an existing code last, after the source line", () => {
    const text = decodeText(buildWhatsAppHref({ text: "שלום\nקוד פנייה: A7K2", source: "/studio" }));
    assert.equal(text, "שלום\n\n📍 מקור: /studio\nקוד פנייה: A7K2");
  });
});

/* D67: אף בונה של הודעת לקוח לא מוציא [YC:] בקישור, גם כשהגוף שלו נושא תג */
describe("no [YC:] in any customer WhatsApp link (D67)", () => {
  const hrefs: Array<[string, string]> = [
    [
      "closing",
      buildWhatsAppHref({
        text: buildClosingMessage({
          serviceLabel: "הקלטה באולפן",
          contact: { name: "נועה", phone: "050-123-4567" },
          priceExVat: 500,
          closerServiceId: "recording",
          ycForm: "contact_quiz",
        }),
      }),
    ],
    ["song offer", buildSongOfferWhatsAppHref([], { source: "/studio" })],
    [
      "blog cta",
      buildWhatsAppHref({
        text: buildBlogCtaWhatsAppMessage({ body: "שלום", closerService: "podcast", utmCampaign: "blog" }),
      }),
    ],
    [
      "shop",
      buildShopWhatsAppHref({ text: "שלום", section: "vouchers", tier: "basic", campaign: "shop" }),
    ],
    ["consult", buildConsultWhatsAppHref([{ label: "שירות", value: "פודקאסט" }], { name: "נועה", phone: "0501234567" })],
    [
      "book intake",
      buildIntakeWhatsAppHref(
        buildPayload({ name: "נועה", phone: "0501234567", email: "", serviceTypeTag: null, freeTextDescription: "" }),
      ),
    ],
    ...STUDIO_PRICING_ACCORDION_PANELS.map(
      (panel) => [`accordion ${panel.id}`, buildWhatsAppHref({ text: buildAccordionWhatsAppText(panel) })] as [string, string],
    ),
    ...BOOK_AUDIENCE_ROUTES.map(
      (route) => [`fast ${route.id}`, buildWhatsAppHref({ text: buildFastWhatsAppMessage(route) })] as [string, string],
    ),
  ];

  for (const [name, href] of hrefs) {
    it(name, () => {
      for (const link of [href, stampWhatsAppLeadCode(href)]) {
        const text = decodeText(link);
        assert.ok(text.trim(), name);
        assert.ok(!text.includes("[YC:"), `${name}: ${text}`);
      }
      assert.match(decodeText(stampWhatsAppLeadCode(href)), /\nקוד פנייה: [A-HJKMNP-Z2-9]{4}$/);
    });
  }

  it("book intake: the code in the link is the code sent to the owner", () => {
    const payload = buildPayload({ name: "נועה", phone: "0501234567", email: "", serviceTypeTag: null, freeTextDescription: "" });
    assert.equal(readWhatsAppLeadCode(buildIntakeWhatsAppHref(payload)), payload.lead_code);
  });
});
