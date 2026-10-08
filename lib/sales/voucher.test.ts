import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  CONTACT_PHONE_DISPLAY,
  STUDIO_ADDRESS_LINE,
  STUDIO_PARKING_NOTE,
} from "@/lib/constants";
import { CANCELLATION_SUMMARY } from "@/lib/data/home-faq";
import { CENTRAL_FAQ_ITEMS, STUDIO_ARRIVE_EARLY_NOTE, STUDIO_BRING_NOTE } from "@/lib/data/faq-central";
import {
  BLESSING_PARTICIPANT_RULES,
  MOBILE_STUDIO_CHANNEL_RULES,
  PODCAST_PARTICIPANT_RULES,
} from "@/lib/data/pricing-catalog";
import { buildSalesBook, getSalesCard, type SalesCard } from "@/lib/sales/sales-book";
import {
  buildVoucherData,
  formatVoucherDate,
  generateVoucherCode,
  GIFT_VALIDITY_YEARS,
  normalizeVoucherCode,
  VOUCHER_CODE_ALPHABET,
  voucherAddons,
  type VoucherData,
  type VoucherInput,
} from "@/lib/sales/voucher";

/* 6.10.2026 בצהריים בישראל */
const ISSUED = new Date(Date.UTC(2026, 9, 6, 9, 0, 0));

function order(overrides: Partial<VoucherInput> = {}): VoucherData {
  return buildVoucherData({ kind: "order", cardId: "song_recording", addonIds: [], issuedAt: ISSUED, ...overrides });
}

function gift(overrides: Partial<VoucherInput> = {}): VoucherData {
  return buildVoucherData({ kind: "gift", cardId: "podcast_audio", addonIds: [], issuedAt: ISSUED, ...overrides });
}

function card(id: string): SalesCard {
  const found = getSalesCard(id);
  assert.ok(found, id);
  return found;
}

function allText(data: VoucherData): string {
  return Object.values(data)
    .flatMap((v) => (Array.isArray(v) ? v : [v]))
    .filter((v): v is string => typeof v === "string")
    .join("\n");
}

describe("voucher code", () => {
  it("YC- and four characters without look-alikes", () => {
    for (const ch of "0O1IL") assert.ok(!VOUCHER_CODE_ALPHABET.includes(ch), ch);
    for (let i = 0; i < 200; i += 1) {
      assert.match(generateVoucherCode(), /^YC-[A-HJKMNP-Z2-9]{4}$/);
    }
  });

  it("uses the random source it is given, including the edges", () => {
    assert.equal(generateVoucherCode(() => 0), `YC-${VOUCHER_CODE_ALPHABET[0].repeat(4)}`);
    const last = VOUCHER_CODE_ALPHABET[VOUCHER_CODE_ALPHABET.length - 1];
    assert.equal(generateVoucherCode(() => 0.999999), `YC-${last.repeat(4)}`);
    assert.equal(generateVoucherCode(() => 1), `YC-${last.repeat(4)}`);
  });

  it("an existing code is kept, normalized; an invalid one is replaced", () => {
    assert.equal(normalizeVoucherCode(" yc-a7k2 "), "YC-A7K2");
    assert.equal(normalizeVoucherCode("A7K2"), "YC-A7K2");
    assert.equal(normalizeVoucherCode("YC-A0K2"), null);
    assert.equal(order({ code: "yc-a7k2" }).code, "YC-A7K2");
    assert.match(order({ code: "nope" }).code, /^YC-[A-HJKMNP-Z2-9]{4}$/);
  });
});

describe("order confirmation", () => {
  it("title, status, greeting and what was ordered", () => {
    const song = card("song_recording");
    const clip = song.addons.find((a) => a.id === "studio_session_clip_edited");
    assert.ok(clip);
    const data = order({
      firstName: "דנה",
      addonIds: [clip.id],
      dateText: "יום ה׳ 15.10.2026",
      timeText: "18:00",
      agreed: "בלי תיקון זיופים, השיר יוצא כמו ששרתם",
    });
    assert.equal(data.kind, "order");
    assert.equal(data.title, "אישור הזמנה");
    assert.equal(data.statusLabel, "ממתין למקדמה");
    assert.equal(data.greeting, "תודה, דנה. ההזמנה נקלטה.");
    assert.equal(data.serviceTitle, `${song.title} + ${clip.label}`);
    assert.ok(data.included.length > 0 && data.included.length <= 4);
    assert.equal(data.included[0], song.included?.[0]);
    assert.equal(data.agreed, "סיכמנו: בלי תיקון זיופים, השיר יוצא כמו ששרתם");
    assert.equal(data.when, "יום ה׳ 15.10.2026, 18:00");
    assert.equal(data.issuedText, "6.10.2026");
    assert.equal(data.validUntilText, null);
    assert.equal(data.redemption, null);
  });

  it("after the deposit, the same code with 'the date is held'", () => {
    const first = order();
    const second = order({ code: first.code, status: "date_held" });
    assert.equal(second.code, first.code);
    assert.equal(second.statusLabel, "המועד שוריין");
    /* לא "ההזמנה נקלטה" פעם שנייה, ולא "המקדמה התקבלה" ליד "אינו קבלה" */
    assert.equal(order({ firstName: "דנה", status: "date_held" }).greeting, "תודה, דנה. המועד שמור לכם.");
    assert.equal(second.greeting, "תודה. המועד שמור לכם.");
    assert.doesNotMatch(allText(second), /מקדמה התקבלה/);
  });

  it("no date yet", () => {
    assert.equal(order().when, "המועד נקבע בתיאום");
    assert.equal(order().greeting, "תודה. ההזמנה נקלטה.");
  });

  it("studio: where without a street address, what to bring and parking, imported", () => {
    const data = order();
    assert.equal(data.where, "אולפן במודיעין, הכתובת נשלחת בוואטסאפ");
    assert.ok(!allText(data).includes(STUDIO_ADDRESS_LINE));
    assert.equal(data.bring, `${STUDIO_BRING_NOTE}. ${STUDIO_ARRIVE_EARLY_NOTE}`);
    assert.equal(data.parking, STUDIO_PARKING_NOTE);
  });

  it("the FAQ answer still reads exactly the same after extracting what to bring", () => {
    const prep = CENTRAL_FAQ_ITEMS.find((item) => item.id === "studio-prep");
    assert.equal(
      prep?.answer,
      `${STUDIO_BRING_NOTE}. לא צריך ניסיון קודם. ${STUDIO_ARRIVE_EARLY_NOTE}, עוברים על התסריט ומתחילים.`,
    );
  });

  it("events happen at the event, remote work has no place, and neither has bring or parking", () => {
    const dj = order({ cardId: "dj_premium" });
    assert.equal(dj.where, "במקום האירוע");
    assert.equal(dj.bring, null);
    assert.equal(dj.parking, null);
    const remote = order({ cardId: "studio_remote" });
    assert.equal(remote.where, null);
    assert.equal(remote.bring, null);
    assert.equal(remote.parking, null);
    assert.equal(order({ cardId: "mobile_podcast_at_home" }).bring, null);
  });

  it("delivered services say 'delivery', and show no line until there is a date", () => {
    const remote = order({ cardId: "studio_remote" });
    assert.equal(remote.whenLabel, "מסירה:");
    assert.equal(remote.when, null);
    const dated = order({ cardId: "studio_remote", dateText: "יום ה׳ 15.10.2026" });
    assert.equal(dated.whenLabel, "מסירה:");
    assert.equal(dated.when, "יום ה׳ 15.10.2026");
    assert.equal(order().whenLabel, "מתי:");
    assert.equal(gift().whenLabel, null);
  });

  it("an academy session held in the studio gets the studio's where, bring and parking", () => {
    const session = order({ cardId: "academy_nevermind_session" });
    assert.equal(session.where, "אולפן במודיעין, הכתובת נשלחת בוואטסאפ");
    assert.equal(session.parking, STUDIO_PARKING_NOTE);
    /* שאר השיעורים: המקום נקבע בשיחה, ומחוץ לאולפן יש תוספת נסיעות (החלטה 7.10) */
    const lesson = order({ cardId: "academy_private_hour" });
    assert.equal(lesson.where, "המקום נקבע בשיחה. מחוץ לאולפן יש תוספת נסיעות");
    assert.equal(lesson.whenLabel, "מתי:");
    assert.equal(lesson.parking, null);
    assert.equal(lesson.bring, null);
    assert.doesNotMatch(lesson.where ?? "", /\d/);
  });

  it("cancellation, terms, disclaimer and footer", () => {
    const data = order();
    assert.equal(data.cancellation, CANCELLATION_SUMMARY);
    assert.equal(data.termsUrl, "yakircohen.com/terms");
    assert.equal(data.disclaimer, "אישור הזמנה בלבד. אינו חשבונית מס ואינו קבלה.");
    assert.equal(data.footer, `${CONTACT_PHONE_DISPLAY} · yakircohen.com`);
  });

  it("participants beyond the included count are named, never priced", () => {
    const data = order({ cardId: "blessing_recording", participants: 4 });
    assert.equal(data.serviceTitle, `${card("blessing_recording").title}, 4 דוברים`);
    assert.equal(order({ participants: 1 }).serviceTitle, card("song_recording").title);
    assert.ok(order({ participants: 99 }).serviceTitle.endsWith(`, ${card("song_recording").participants?.at(-1)?.count} משתתפים`));
  });

  it("an add-on that needs another add-on is dropped without it", () => {
    const data = order({ addonIds: ["song_pre_session_interview"] });
    assert.equal(data.serviceTitle, card("song_recording").title);
  });

  it("the extra-participant add-on is the participants field, not a second line", () => {
    const extras = [
      ["blessing_recording", BLESSING_PARTICIPANT_RULES.extraId],
      ["studio_remote", BLESSING_PARTICIPANT_RULES.extraId],
      ["podcast_audio", PODCAST_PARTICIPANT_RULES.extraId],
      ["mobile_podcast_at_home", MOBILE_STUDIO_CHANNEL_RULES.channelId],
    ] as const;
    for (const [cardId, extraId] of extras) {
      assert.ok(card(cardId).addons.some((a) => a.id === extraId), cardId);
      assert.ok(!voucherAddons(card(cardId)).some((a) => a.id === extraId), cardId);
    }
    const data = order({ cardId: "blessing_recording", addonIds: [BLESSING_PARTICIPANT_RULES.extraId], participants: 4 });
    assert.equal(data.serviceTitle, `${card("blessing_recording").title}, 4 דוברים`);
    /* כרטיס בלי טבלת משתתפים מציג את כל השדרוגים */
    assert.deepEqual(voucherAddons(card("dj_premium")), card("dj_premium").addons);
  });

  it("unknown card throws", () => {
    assert.throws(() => order({ cardId: "no_such_card" }), /Unknown sales card/);
  });
});

describe("gift voucher", () => {
  it("to, from, the gift, valid for five years, how to redeem", () => {
    const data = gift({ giftTo: "סבתא רחל", giftFrom: "הנכדים, באהבה", giftTitle: "פודקאסט עם סבתא באולפן" });
    assert.equal(data.kind, "gift");
    assert.equal(data.title, "שובר מתנה");
    assert.equal(data.giftTo, "סבתא רחל");
    assert.equal(data.giftFrom, "הנכדים, באהבה");
    assert.equal(data.serviceTitle, "פודקאסט עם סבתא באולפן");
    /* החוק: שנתיים לפחות. פחות מזה לא עובר */
    assert.ok(GIFT_VALIDITY_YEARS >= 2);
    assert.equal(data.validUntilText, `6.10.${2026 + GIFT_VALIDITY_YEARS}`);
    assert.equal(
      data.redemption,
      `למימוש: שולחים בוואטסאפ את קוד השובר ל-${CONTACT_PHONE_DISPLAY} ומתאמים מועד. אפשר לממש גם לשירות אחר מהקטלוג, בשווי ששולם`,
    );
    assert.match(data.disclaimer, /אינו חשבונית מס/);
  });

  it("no greeting, status, place, bring or parking; card title without a gift title", () => {
    const data = gift();
    for (const key of ["greeting", "statusLabel", "where", "bring", "parking", "when", "agreed"] as const) {
      assert.equal(data[key], null, key);
    }
    assert.equal(data.serviceTitle, card("podcast_audio").title);
  });

  it("the catalog title keeps its numbers; only typed text is cleaned", () => {
    const slideshow = card("growth_slideshow_100");
    assert.match(slideshow.title, /\d{3}/);
    assert.equal(gift({ cardId: slideshow.id, giftTitle: slideshow.title }).serviceTitle, slideshow.title);
    assert.equal(gift({ cardId: slideshow.id, giftTitle: "מצגת לסבתא, 500 שקל" }).serviceTitle, "מצגת לסבתא");
  });

  it("29 February is valid until 1 March of the expiry year, so validity never shrinks", () => {
    const leap = gift({ issuedAt: new Date(Date.UTC(2028, 1, 29, 9)) });
    assert.equal(leap.issuedText, "29.2.2028");
    /* שנת התפוגה מחושבת מהקבוע, כדי ששינוי תוקף לא ישבור את הבדיקה */
    const expiryYear = 2028 + GIFT_VALIDITY_YEARS;
    const isLeap = (y: number) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
    assert.equal(leap.validUntilText, isLeap(expiryYear) ? `29.2.${expiryYear}` : `1.3.${expiryYear}`);
  });

  it("dates follow Israel time, not UTC", () => {
    /* 23:30 UTC ב-5.10 הוא כבר 6.10 בישראל */
    assert.equal(formatVoucherDate(new Date(Date.UTC(2026, 9, 5, 23, 30))), "6.10.2026");
  });
});

describe("no price anywhere", () => {
  function priceNumbers(c: SalesCard): Set<number> {
    return new Set([
      c.exVat,
      c.inclVat,
      ...c.addons.flatMap((a) => [a.exVat, a.inclVat]),
      ...c.combos.flatMap((x) => [x.totalExVat, x.totalInclVat]),
      ...(c.participants ?? []).flatMap((r) => [r.totalExVat, r.totalInclVat]),
    ]);
  }

  it("for every card, order and gift: no currency, no VAT, none of the card's amounts", () => {
    for (const c of buildSalesBook().cards) {
      const addonIds = c.addons.map((a) => a.id);
      const docs = [
        buildVoucherData({ kind: "order", cardId: c.id, addonIds, participants: 4, firstName: "דנה", issuedAt: ISSUED }),
        buildVoucherData({ kind: "gift", cardId: c.id, addonIds, giftTo: "רחל", giftFrom: "נועם", issuedAt: ISSUED }),
      ];
      const amounts = priceNumbers(c);
      for (const data of docs) {
        const text = allText(data);
        assert.doesNotMatch(text, /₪|ש״ח|ש"ח|מע״מ|שקל/, `${c.id}/${data.kind}`);
        for (const n of text.match(/\d[\d,]*(?:\.\d+)?/g) ?? []) {
          assert.ok(!amounts.has(Number(n.replace(/,/g, ""))), `${c.id}/${data.kind}: ${n}`);
        }
      }
    }
  });

  it("digits only in the code, the dates, the phone and the imported texts", () => {
    const data = order({ firstName: "דנה", dateText: "15.10.2026", timeText: "18:00", agreed: "בלי תיקון זיופים" });
    let text = allText(data);
    for (const allowed of [
      data.code,
      data.issuedText,
      "15.10.2026, 18:00",
      CONTACT_PHONE_DISPLAY,
      CANCELLATION_SUMMARY,
      STUDIO_ARRIVE_EARLY_NOTE,
    ]) {
      text = text.split(allowed).join(" ");
    }
    /* שורות "כלול" מהקטלוג הן טקסט מיובא. בשיר: "2 סבבים תוך 24 שעות" (החלטת הבעלים D65, 7.10.2026) */
    for (const line of card("song_recording").included ?? []) text = text.split(line).join(" ");
    assert.doesNotMatch(text, /\d/);
    const g = gift({ giftTo: "רחל" });
    let giftText = allText(g);
    for (const allowed of [g.code, g.issuedText, g.validUntilText ?? "", CONTACT_PHONE_DISPLAY, CANCELLATION_SUMMARY]) {
      giftText = giftText.split(allowed).join(" ");
    }
    for (const line of card("podcast_audio").included ?? []) giftText = giftText.split(line).join(" ");
    assert.doesNotMatch(giftText, /\d/);
  });

  it("amounts typed into free text are removed", () => {
    const c = card("song_recording");
    const typed = `${c.inclVat.toLocaleString("he-IL")} ₪ כולל מע״מ`;
    const data = order({ agreed: `מקדמה ${typed}, בלי תיקון זיופים`, giftTitle: typed });
    const text = allText(data);
    assert.doesNotMatch(text, /₪|מע״מ/);
    assert.ok(!text.includes(c.inclVat.toLocaleString("he-IL")));
    assert.equal(data.agreed, "סיכמנו: מקדמה, בלי תיקון זיופים");
    const g = gift({ giftTitle: `שיר במתנה ${typed}` });
    assert.equal(g.serviceTitle, "שיר במתנה");
  });

  it("a phone number or a bare amount typed by hand never reaches the image", () => {
    const data = order({
      firstName: "דנה 054-1234567",
      agreed: "מקדמה 500, יתרה 1,200 ביום ההקלטה, 054 123 4567, בלי תיקון זיופים",
    });
    assert.equal(data.greeting, "תודה, דנה. ההזמנה נקלטה.");
    assert.equal(data.agreed, "סיכמנו: מקדמה, יתרה ביום ההקלטה, בלי תיקון זיופים");
    const text = allText(data);
    for (const leaked of ["054", "1234567", "500", "1,200"]) assert.ok(!text.includes(leaked), leaked);
    const g = gift({ giftTo: "רחל 0541234567", giftFrom: "+972 54 123 4567 נועם" });
    assert.equal(g.giftTo, "רחל");
    assert.equal(g.giftFrom, "נועם");
  });

  it("dates, times and small counts in free text stay", () => {
    const data = order({ agreed: "4 דוברים, חזרה ב-15.10 בשעה 18:00, ההקלטה ב-20/10/2026" });
    assert.equal(data.agreed, "סיכמנו: 4 דוברים, חזרה ב-15.10 בשעה 18:00, ההקלטה ב-20/10/2026");
    assert.equal(order({ dateText: "יום ה׳ 15.10.2026", timeText: "18:00" }).when, "יום ה׳ 15.10.2026, 18:00");
  });
});

describe("site gift voucher validity matches the printed voucher", () => {
  it("the shop FAQs say the same validity the voucher prints", async () => {
    const { SHOP_VOUCHER_FAQ_SCHEMA } = await import("@/lib/data/shop-vouchers");
    const { SHOP_VOUCHER_FAQ_UI } = await import("@/lib/data/shop-page");
    const words: Record<number, string> = { 2: "שנתיים", 3: "שלוש שנים", 5: "חמש שנים" };
    const expected = words[GIFT_VALIDITY_YEARS];
    assert.ok(expected, "add the Hebrew wording for the new validity here and in the shop FAQs");
    const answers = [...SHOP_VOUCHER_FAQ_SCHEMA, ...SHOP_VOUCHER_FAQ_UI]
      .filter((q) => /תוקף/.test(q.question))
      .map((q) => q.answer);
    assert.ok(answers.length >= 2);
    for (const answer of answers) assert.match(answer, new RegExp(`^${expected}`));
  });
});

