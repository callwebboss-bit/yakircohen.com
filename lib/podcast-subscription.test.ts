import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { PODCAST_SUBSCRIPTION_FAQS, PODCAST_SUBSCRIPTION_PLANS, type SubscriptionPlan } from "@/lib/data/podcast-subscription-page";
import { getExVat } from "@/lib/data/pricing-catalog";
import {
  buildSubscriptionOffersSchema,
  buildSubscriptionWhatsAppText,
  describeSubscriptionPlan,
  subscriptionFaqSchemaItems,
} from "@/lib/podcast-subscription";

const [basic, extended, video] = PODCAST_SUBSCRIPTION_PLANS;
const priced: SubscriptionPlan[] = [
  { ...basic, priceExVat: 1000 },
  { ...extended, priceExVat: 1800 },
  { ...video, priceExVat: 2500 },
];

describe("describeSubscriptionPlan", () => {
  it("מונה פרקים ועריכה", () => {
    assert.equal(describeSubscriptionPlan(basic), "2 פרקים בחודש, עריכת אודיו");
    assert.equal(describeSubscriptionPlan(video), "4 פרקים בחודש, עריכת אודיו ועריכת וידאו");
  });
  it("פרק אחד בלשון יחיד", () => {
    assert.equal(describeSubscriptionPlan({ ...basic, episodesPerMonth: 1 }), "פרק אחד בחודש, עריכת אודיו");
  });
});

describe("buildSubscriptionWhatsAppText", () => {
  it("בלי מסלול נבחר ההודעה כללית", () => {
    const text = buildSubscriptionWhatsAppText(null);
    assert.match(text, /מנוי חודשי להפקת פודקאסט/);
    assert.doesNotMatch(text, /מסלול/);
  });
  it("עם מסלול נבחר שמו ותיאורו בהודעה", () => {
    const text = buildSubscriptionWhatsAppText(video);
    assert.match(text, /מסלול וידאו/);
    assert.match(text, /עריכת וידאו/);
  });
});

describe("buildSubscriptionOffersSchema", () => {
  it("בלי מחירים לא נפלטת סכמה (placeholder)", () => {
    const unpriced = PODCAST_SUBSCRIPTION_PLANS.map((plan) => ({ ...plan, priceExVat: null }));
    assert.equal(buildSubscriptionOffersSchema(unpriced), null);
  });
  it("מחירי המסלולים נגזרים מהקטלוג ולא נכתבים כסכום", () => {
    const byId = Object.fromEntries(PODCAST_SUBSCRIPTION_PLANS.map((plan) => [plan.id, plan.priceExVat]));
    assert.equal(byId.basic, 2 * getExVat("podcast_audio"));
    assert.equal(byId.extended, getExVat("podcast_audio_pack_4"));
    assert.equal(byId.video, 4 * getExVat("podcast_video"));
    assert.ok(buildSubscriptionOffersSchema(PODCAST_SUBSCRIPTION_PLANS), "עם מחירי הקטלוג נפלטת סכמה");
  });
  it("מחיר חסר באחד המסלולים מבטל את כל הסכמה", () => {
    assert.equal(buildSubscriptionOffersSchema([priced[0], { ...priced[1], priceExVat: null }]), null);
  });
  it("עם מחירים: AggregateOffer עם Offer לכל מסלול, מחיר כולל מע״מ", () => {
    const schema = buildSubscriptionOffersSchema(priced, "https://example.test/podcast/subscription");
    assert.ok(schema);
    assert.equal(schema.offers["@type"], "AggregateOffer");
    assert.equal(schema.offers.offerCount, 3);
    assert.equal(schema.offers.offers.length, 3);
    assert.equal(schema.offers.offers[0]["@type"], "Offer");
    assert.equal(schema.offers.lowPrice, schema.offers.offers[0].price);
    assert.equal(schema.offers.highPrice, schema.offers.offers[2].price);
    assert.ok(Number(schema.offers.lowPrice) > 1000, "המחיר ב-price כולל מע״מ");
    assert.equal(schema.offers.offers[0].priceSpecification.price, 1000);
    assert.equal(schema.offers.offers[0].priceSpecification.valueAddedTaxIncluded, false);
  });
});

describe("subscriptionFaqSchemaItems", () => {
  it("תשובה חסרה אחת מבטלת את FAQPage", () => {
    assert.deepEqual(subscriptionFaqSchemaItems([{ question: "ש?", answer: null }]), []);
    assert.deepEqual(
      subscriptionFaqSchemaItems([
        { question: "ש?", answer: "ת" },
        { question: "ש2?", answer: null },
      ]),
      [],
    );
  });
  it("כל התשובות קיימות: מוחזרות כולן", () => {
    assert.equal(subscriptionFaqSchemaItems([{ question: "ש?", answer: "ת" }]).length, 1);
  });
  it("תשובת השמירה בענן נגזרת ממחיר הקטלוג ואומרת 'בלי תאריך תפוגה'", () => {
    const retention = PODCAST_SUBSCRIPTION_FAQS.find((faq) => faq.question.includes("נשמרים"));
    assert.ok(retention?.answer);
    assert.match(retention.answer, /בלי תאריך תפוגה/);
    assert.doesNotMatch(retention.answer, /לכל החיים/);
    assert.ok(retention.answer.includes(String(Math.round(getExVat("cloud_storage_permanent") * 1.18))));
  });
  it("אין עוד תשובה ריקה בדף המנוי", () => {
    assert.ok(PODCAST_SUBSCRIPTION_FAQS.every((faq) => faq.answer));
  });
});
