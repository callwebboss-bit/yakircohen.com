import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { withVat } from "@/lib/data/pricing";
import { getExVat, PRICING_CATALOG } from "@/lib/data/pricing-catalog";
import { formatConsumerPrice } from "@/lib/data/pricing-display";
import {
  buildSongCallbackRequest,
  buildSongOfferHref,
  buildSongOfferMessage,
  buildSongOfferWhatsAppHref,
  calcSongOffer,
  getSongOfferExport,
  getSongOfferView,
  getSongParticipantRules,
  getSongParticipantsBreakdown,
  getSongParticipantsExplanation,
  isSongAddonAvailable,
  LEGACY_SONG_ALIASES,
  normalizeSongAddons,
  parseSongAddons,
  parseSongParticipants,
  resolveLegacySongAlias,
  SONG_ADDON_IDS,
  SONG_OFFER_CALLBACK_FORM_ID,
  songParticipantsSurcharge,
  type SongAddonId,
} from "@/lib/data/song-offer";
import { buildLeadNotifyBody } from "@/lib/lead-email-notify";
import { checkLeadNotifyPayload, FORM_ID_PATTERN } from "@/lib/leads/payload-check";

const PITCH = "song_pitch_coaching";
const CLIP = "studio_session_clip_edited";
const INTERVIEW = "song_pre_session_interview";
const BTS = "studio_bts";
const PHOTOS = "studio_photo_pack";
/* החלטות הבעלים: תמונות וסרטונים מהבית רק עם הקליפ (4.10), שמירה קבועה בענן ב-49 ₪ כולל מע״מ (6.10) */
const HOME_MEDIA = "song_home_media_40";
const STORAGE = "cloud_storage_permanent";

/* כל 8 תתי-הקבוצות של שלוש התוספות, עם המחיר שהבעלים אישר (OWNER-DECISIONS-2026-10-02).
   ראיון בלי קליפ אינו בחירה חוקית, ולכן המחיר שלו הוא המחיר בלי הראיון. */
const ALL_COMBINATIONS: Array<{
  input: SongAddonId[];
  addonIds: SongAddonId[];
  exVat: number;
  withVat: number;
}> = [
  { input: [], addonIds: [], exVat: 500, withVat: 590 },
  { input: [PITCH], addonIds: [PITCH], exVat: 800, withVat: 944 },
  { input: [CLIP], addonIds: [CLIP], exVat: 1250, withVat: 1475 },
  { input: [INTERVIEW], addonIds: [], exVat: 500, withVat: 590 },
  { input: [PITCH, CLIP], addonIds: [PITCH, CLIP], exVat: 1550, withVat: 1829 },
  { input: [PITCH, INTERVIEW], addonIds: [PITCH], exVat: 800, withVat: 944 },
  { input: [CLIP, INTERVIEW], addonIds: [CLIP, INTERVIEW], exVat: 1750, withVat: 2065 },
  { input: [PITCH, CLIP, INTERVIEW], addonIds: [PITCH, CLIP, INTERVIEW], exVat: 2050, withVat: 2419 },
];

describe("song offer: catalog", () => {
  it("reads the base and the seven add-ons from the catalog, in order", () => {
    assert.equal(getExVat("song_recording"), 500);
    assert.equal(getExVat(PITCH), 300);
    assert.equal(getExVat(CLIP), 750);
    assert.equal(getExVat(INTERVIEW), 500);
    /* החלטת הבעלים 4.10.2026: אותם מחירים כמו באשף /book */
    assert.equal(getExVat(BTS), 250);
    assert.equal(getExVat(PHOTOS), 200);
    assert.equal(getExVat(HOME_MEDIA), 400);
    assert.equal(getExVat(STORAGE), 41.5);
    assert.deepEqual(SONG_ADDON_IDS, [PITCH, CLIP, INTERVIEW, BTS, PHOTOS, HOME_MEDIA, STORAGE]);
  });

  it("the removed song packages are gone from the catalog", () => {
    const ids = new Set<string>(PRICING_CATALOG.map((item) => item.id));
    for (const removed of ["cover_song", "song_package", "studio_viral", "studio_all_in"]) {
      assert.ok(!ids.has(removed), removed);
    }
    /* נשארים: הצילום הגולמי, תיקון הזיופים לברכה, והפקות הסינגל */
    for (const kept of ["studio_session_clip", "studio_pitch_correction", "single_production", "full_production_clip"]) {
      assert.ok(ids.has(kept), kept);
    }
    assert.equal(getExVat("single_production"), 3500);
    assert.equal(getExVat("full_production_clip"), 4500);
    assert.equal(getExVat("studio_session_clip"), 450);
  });

  it("the view has prices both ways and the interview requires the clip", () => {
    const view = getSongOfferView();
    assert.equal(view.base.id, "song_recording");
    assert.equal(view.base.exVat, 500);
    assert.equal(view.base.withVat, 590);
    assert.ok(view.base.excluded.includes("תיקון זיופים"));
    assert.deepEqual(
      view.addons.map((a) => [a.id, a.exVat, a.withVat, a.requires]),
      [
        [PITCH, 300, 354, null],
        [CLIP, 750, 885, null],
        [INTERVIEW, 500, 590, CLIP],
        [BTS, 250, 295, null],
        [PHOTOS, 200, 236, null],
        [HOME_MEDIA, 400, 472, CLIP],
        [STORAGE, 41.5, 49, null],
      ],
    );
  });

  it("no promo, sale or struck price wording on the interview (no regular price was given)", () => {
    const view = getSongOfferView();
    const interview = view.addons.find((a) => a.id === INTERVIEW)!;
    const text = [interview.label, interview.description, ...interview.included].join(" ");
    assert.doesNotMatch(text, /מבצע|מחיר היכרות|במקום|הנחה|promo/i);
  });
});

describe("song offer: calcSongOffer", () => {
  for (const combo of ALL_COMBINATIONS) {
    const name = combo.input.length ? combo.input.join("+") : "base only";
    it(`${name}: ${combo.exVat} ex VAT, ${combo.withVat} incl. VAT`, () => {
      const calc = calcSongOffer(combo.input);
      assert.deepEqual(calc.addonIds, combo.addonIds);
      assert.equal(calc.totalExVat, combo.exVat);
      assert.equal(calc.totalWithVat, combo.withVat);
      /* סכום השורות שווה לסכום, בשתי הצורות, ושווה ל-withVat של הסכום לפני מע״מ */
      assert.equal(calc.lines.reduce((s, l) => s + l.exVat, 0), calc.totalExVat);
      assert.equal(calc.lines.reduce((s, l) => s + l.withVat, 0), calc.totalWithVat);
      assert.equal(calc.totalWithVat, withVat(calc.totalExVat));
      assert.equal(calc.lines[0]?.id, "song_recording");
      assert.equal(calc.lines.length, 1 + combo.addonIds.length);
    });
  }

  it("the interview requires the clip", () => {
    assert.equal(isSongAddonAvailable(INTERVIEW, []), false);
    assert.equal(isSongAddonAvailable(INTERVIEW, [PITCH]), false);
    assert.equal(isSongAddonAvailable(INTERVIEW, [CLIP]), true);
    assert.equal(isSongAddonAvailable(PITCH, []), true);
    assert.equal(isSongAddonAvailable(CLIP, []), true);
    /* לא מוסיף את הקליפ בשקט, כדי שהמחיר לא יעלה בלי שהלקוח בחר */
    assert.deepEqual(normalizeSongAddons([INTERVIEW]), []);
  });

  it("ignores unknown ids, removes duplicates and keeps catalog order", () => {
    assert.deepEqual(
      normalizeSongAddons(["express_delivery", INTERVIEW, CLIP, "nope", PITCH, CLIP]),
      [PITCH, CLIP, INTERVIEW],
    );
    assert.deepEqual(calcSongOffer(["studio_session_clip", "cover_song"]).addonIds, []);
  });
});

describe("song offer: links and parsing", () => {
  it("parseSongAddons reads a comma list and tolerates junk", () => {
    assert.deepEqual(parseSongAddons(null), []);
    assert.deepEqual(parseSongAddons(""), []);
    assert.deepEqual(parseSongAddons(`${CLIP},${PITCH}`), [PITCH, CLIP]);
    assert.deepEqual(parseSongAddons(` ${PITCH} , bogus,,${PITCH}`), [PITCH]);
    assert.deepEqual(parseSongAddons(INTERVIEW), []);
  });

  it("the page link round-trips through parseSongAddons", () => {
    for (const combo of ALL_COMBINATIONS) {
      const href = buildSongOfferHref(combo.input);
      assert.ok(href.startsWith("/studio/recording-song-modiin"));
      assert.ok(href.endsWith("#song-offer"));
      const query = href.split("?")[1]?.split("#")[0] ?? "";
      const value = new URLSearchParams(query).get("addons");
      assert.deepEqual(parseSongAddons(value), combo.addonIds);
    }
    assert.equal(buildSongOfferHref([]), "/studio/recording-song-modiin#song-offer");
    assert.equal(buildSongOfferHref([PITCH], "/studio"), `/studio?addons=${PITCH}#song-offer`);
  });

  it("maps the old package ids to their documented presets", () => {
    assert.deepEqual(resolveLegacySongAlias("cover_song"), [PITCH]);
    assert.deepEqual(resolveLegacySongAlias("song_package"), [PITCH]);
    assert.deepEqual(resolveLegacySongAlias("studio_viral"), [PITCH, CLIP]);
    assert.deepEqual(resolveLegacySongAlias("studio_all_in"), [PITCH]);
    assert.deepEqual(Object.keys(LEGACY_SONG_ALIASES).sort(), [
      "cover_song",
      "song_package",
      "studio_all_in",
      "studio_viral",
    ]);
  });

  it("returns null for ids that are not removed song packages", () => {
    assert.equal(resolveLegacySongAlias("song_recording"), null);
    assert.equal(resolveLegacySongAlias("blessing_recording"), null);
    assert.equal(resolveLegacySongAlias("toString"), null);
    assert.equal(resolveLegacySongAlias(""), null);
    assert.equal(resolveLegacySongAlias(null), null);
  });
});

describe("song offer: WhatsApp message", () => {
  it("lists every chosen item with its VAT-inclusive price, and the total", () => {
    const { text, ycTag } = buildSongOfferMessage([PITCH, CLIP], { source: "/studio/recording-song-modiin" });
    assert.equal(
      text,
      [
        "שלום, אשמח להקליט שיר באולפן.",
        "מה בחרתי:",
        "• הקלטת שיר (הקלטה, מיקס ומאסטר) - 590 ₪",
        "• תיקון זיופים וטכנאי שמכוון ומנחה - 354 ₪",
        "• קליפ ערוך מהסשן באולפן - 885 ₪",
        "סה״כ: 1,829 ₪ כולל מע״מ (1,550 ₪ + מע״מ)",
        "מתי נוח לכם להקליט?",
      ].join("\n"),
    );
    /* התג נפרד מההודעה, ומי שבונה את הקישור מחליט אם לצרף אותו */
    assert.ok(!text.includes("[YC:"));
    assert.match(ycTag, /^\[YC:service=recording\|price=1550\|package=song_recording,song_pitch_coaching,studio_session_clip_edited\|form=song_offer\|source=\/studio\/recording-song-modiin\|step=1\]$/);
  });

  it("never leads with the before-VAT price, never promises delivery times", () => {
    for (const combo of ALL_COMBINATIONS) {
      const { text } = buildSongOfferMessage(combo.input, { source: "/x" });
      assert.doesNotMatch(text, /לפני מע״מ/);
      assert.doesNotMatch(text, /48|שעות|אקספרס|מבצע/);
      assert.ok(text.includes(`${combo.withVat.toLocaleString("he-IL")} ₪ כולל מע״מ`));
      assert.ok(text.trimEnd().endsWith("מתי נוח לכם להקליט?"));
      assert.doesNotMatch(text, /[!—–…“”]/);
    }
  });

  it("gift mode changes the first line and tags the purpose", () => {
    const { text, ycTag } = buildSongOfferMessage([], { source: "/gifts", giftMode: true });
    assert.ok(text.startsWith("שלום, אשמח להקליט שיר במתנה באולפן."));
    assert.match(ycTag, /purpose=gift/);
  });

  it("the wa.me link carries the total, and the tag only when asked", () => {
    const href = buildSongOfferWhatsAppHref([CLIP], { source: "/studio" });
    assert.ok(href.startsWith("https://wa.me/"));
    const text = new URL(href).searchParams.get("text") ?? "";
    assert.ok(text.includes("1,475 ₪ כולל מע״מ (1,250 ₪ + מע״מ)"));
    assert.ok(text.includes("[YC:"));
    assert.ok(!text.includes("📍"));
    const noTag = buildSongOfferWhatsAppHref([CLIP], { source: "/studio", includeYcTag: false });
    assert.ok(!(new URL(noTag).searchParams.get("text") ?? "").includes("[YC:"));
  });
});

describe("song offer: callback request (Phase 1 submit contract)", () => {
  const req = buildSongCallbackRequest({
    name: "  נועה כהן ",
    phone: "054-123-4567",
    addonIds: [INTERVIEW, CLIP, "bogus"],
    source: "/studio/recording-song-modiin",
    submissionId: "sub-1",
    honeypot: "",
  });

  it("uses a valid form id and the studio service type", () => {
    assert.equal(req.formId, SONG_OFFER_CALLBACK_FORM_ID);
    assert.equal(req.formId, "song_offer_callback");
    assert.match(req.formId, FORM_ID_PATTERN);
    assert.equal(req.serviceType, "studio");
    assert.equal(req.submissionId, "sub-1");
    assert.equal(req.name, "נועה כהן");
    assert.equal(req.website_verification, "");
  });

  it("carries the selection, the totals and a link back to it", () => {
    assert.ok(req.body.includes("• קליפ ערוך מהסשן באולפן - 885 ₪"));
    assert.ok(req.body.includes("• פודקאסט אישי לפני השיר - 590 ₪"));
    assert.ok(req.body.includes("סה״כ: 2,065 ₪ כולל מע״מ (1,750 ₪ + מע״מ)"));
    assert.ok(req.body.includes("[YC:"));
    assert.ok(req.subject.includes("2,065 ₪"));
    assert.deepEqual(req.pricingRef, {
      sectionId: "song-offer",
      label: "הקלטת שיר (הקלטה, מיקס ומאסטר) + קליפ ערוך מהסשן באולפן + פודקאסט אישי לפני השיר",
      exVat: 1750,
      href: `/studio/recording-song-modiin?addons=${CLIP},${INTERVIEW}#song-offer`,
    });
  });

  it("the server payload check accepts it as the browser would send it", () => {
    const result = checkLeadNotifyPayload({
      ...req,
      body: buildLeadNotifyBody(req),
    });
    assert.deepEqual(result, { kind: "accept", flags: [] });
  });

  it("a filled honeypot is passed through for the server to drop quietly", () => {
    const bot = buildSongCallbackRequest({
      name: "bot",
      phone: "0541234567",
      addonIds: [],
      source: "/x",
      submissionId: "s",
      honeypot: "http://spam",
    });
    assert.deepEqual(checkLeadNotifyPayload(bot), { kind: "honeypot" });
  });
});

describe("formatConsumerPrice", () => {
  it("leads with the VAT-inclusive amount and keeps the ex-VAT note small", () => {
    assert.deepEqual(formatConsumerPrice(500), {
      total: "590 ₪",
      totalLabel: "590 ₪ כולל מע״מ",
      exVatNote: "500 ₪ + מע״מ",
      delta: "+590 ₪",
    });
    assert.equal(formatConsumerPrice(1550).totalLabel, "1,829 ₪ כולל מע״מ");
    assert.equal(formatConsumerPrice(300).delta, "+354 ₪");
  });
});

describe("getSongOfferExport (owner quoting tool)", () => {
  it("exports every valid combination with the same totals as calcSongOffer", () => {
    const exp = getSongOfferExport();
    assert.equal(exp.base.id, "song_recording");
    assert.deepEqual(exp.addons.map((a) => a.id), [...SONG_ADDON_IDS]);
    /* 7 תוספות הן 128 תתי-קבוצות. בלי קליפ יש 64, ומהן רק 16 בלי ראיון ובלי תמונות
       מהבית, שתיהן רק עם הקליפ. 128 פחות 48 שווה 80. */
    assert.equal(exp.combinations.length, 80);
    for (const combo of exp.combinations) {
      const calc = calcSongOffer(combo.addonIds);
      assert.deepEqual(combo.addonIds, calc.addonIds);
      assert.equal(combo.totalExVat, calc.totalExVat);
      assert.equal(combo.totalWithVat, calc.totalWithVat);
      assert.equal(combo.offerHref, buildSongOfferHref(combo.addonIds));
    }
    /* הראיון והתמונות מהבית רק עם הקליפ: אף שילוב לא כולל אותם בלי קליפ */
    assert.ok(
      exp.combinations.every(
        (c) =>
          (!c.addonIds.includes("song_pre_session_interview") &&
            !c.addonIds.includes("song_home_media_40")) ||
          c.addonIds.includes("studio_session_clip_edited"),
      ),
    );
  });

  it("is plain JSON (the export writes it with JSON.stringify)", () => {
    const exp = getSongOfferExport();
    assert.deepEqual(JSON.parse(JSON.stringify(exp)), exp);
  });
});

describe("song offer: participants (owner decisions 2026-10-03, round 4)", () => {
  it("the catalog holds the rule: 1 included, every additional participant 99, max 12", () => {
    assert.deepEqual(getSongParticipantRules(), {
      included: 1,
      max: 12,
      extraExVat: 99,
    });
    assert.equal(getExVat("song_group_participant"), 99);
    /* 190 נשאר לברכה ולשעת חדר בלבד, לא לשיר */
    assert.equal(getExVat("studio_extra_participant"), 190);
  });

  it("surcharge before VAT for every count, clamped to 1..12", () => {
    const expected = [0, 99, 198, 297, 396, 495, 594, 693, 792, 891, 990, 1089];
    for (let n = 1; n <= 12; n += 1) {
      assert.equal(songParticipantsSurcharge(n), expected[n - 1], `n=${n}`);
    }
    assert.equal(songParticipantsSurcharge(0), 0);
    assert.equal(songParticipantsSurcharge(-3), 0);
    assert.equal(songParticipantsSurcharge(13), 1089);
    assert.equal(songParticipantsSurcharge(99), 1089);
  });

  it("2 singers: 500 + 99 = 599 before VAT, 707 including VAT", () => {
    const calc = calcSongOffer([], 2);
    assert.equal(calc.totalExVat, 599);
    assert.equal(calc.totalWithVat, 707);
  });

  it("4 singers: 500 + 3 × 99 = 797 before VAT, 940 including VAT", () => {
    const calc = calcSongOffer([], 4);
    assert.equal(calc.participants, 4);
    assert.equal(calc.totalExVat, 797);
    assert.equal(calc.totalWithVat, 940);
    assert.deepEqual(
      calc.lines.map((l) => [l.id, l.label, l.exVat, l.withVat]),
      [
        ["song_recording", "הקלטת שיר (הקלטה, מיקס ומאסטר)", 500, 590],
        ["song_participants", "משתתפים: 4", 297, 350],
      ],
    );
  });

  it("limit 1: no participants line, same as before", () => {
    const calc = calcSongOffer([PITCH], 1);
    assert.equal(calc.lines.length, 2);
    assert.equal(calc.totalExVat, 800);
    assert.deepEqual(calcSongOffer([PITCH], 0), calc);
  });

  it("limit 12: 500 + 11 × 99 = 1,589 before VAT, 1,875 including VAT, and 13 is cut to 12", () => {
    const calc = calcSongOffer([], 12);
    assert.equal(calc.participants, 12);
    assert.equal(calc.totalExVat, 1589);
    assert.equal(calc.totalWithVat, 1875);
    assert.deepEqual(calcSongOffer([], 13), calc);
  });

  it("totals agree both ways for every combination and every count", () => {
    for (const combo of ALL_COMBINATIONS) {
      for (let n = 1; n <= 12; n += 1) {
        const calc = calcSongOffer(combo.input, n);
        assert.equal(calc.totalExVat, combo.exVat + songParticipantsSurcharge(n));
        assert.equal(calc.totalWithVat, withVat(calc.totalExVat));
        assert.equal(calc.lines.reduce((s, l) => s + l.exVat, 0), calc.totalExVat);
        assert.equal(calc.lines.reduce((s, l) => s + l.withVat, 0), calc.totalWithVat);
      }
    }
  });

  it("the explanation line is built from the catalog, VAT-inclusive first", () => {
    const exp = getSongParticipantsExplanation();
    assert.equal(exp.withVat, "כל משתתף נוסף +117 ₪ כולל מע״מ");
    assert.equal(exp.exVat, "(99 ₪ + מע״מ)");
    assert.equal(exp.limit, "עד 12 בשיר");
    assert.equal(
      getSongOfferExport().participants.explanation,
      "כל משתתף נוסף +117 ₪ כולל מע״מ (99 ₪ + מע״מ) · עד 12 בשיר",
    );
    assert.doesNotMatch(exp.withVat + exp.exVat + exp.limit, /[!—–…“”]/);
  });

  it("the WhatsApp message has a participants line with the surcharge", () => {
    const { text, ycTag } = buildSongOfferMessage([CLIP], { source: "/x", participants: 4 });
    assert.equal(
      text,
      [
        "שלום, אשמח להקליט שיר באולפן.",
        "מה בחרתי:",
        "• הקלטת שיר (הקלטה, מיקס ומאסטר) - 590 ₪",
        "• משתתפים: 4 (כולל תוספת 350 ₪)",
        "  פירוט לפי משתתף: 590 + 117 + 117 + 117 ₪ כולל מע״מ (500 + 99 + 99 + 99 ₪ + מע״מ)",
        "  כל משתתף נוסף הוא ערוץ הקלטה נוסף ומוסיף למחיר.",
        "• קליפ ערוך מהסשן באולפן - 885 ₪",
        "סה״כ: 1,825 ₪ כולל מע״מ (1,547 ₪ + מע״מ)",
        "מתי נוח לכם להקליט?",
      ].join("\n"),
    );
    assert.match(ycTag, /price=1547/);
    assert.match(ycTag, /recorders=4/);
    assert.doesNotMatch(buildSongOfferMessage([], { source: "/x" }).ycTag, /recorders=/);
  });

  it("the page link carries ?participants= and round-trips", () => {
    assert.equal(
      buildSongOfferHref([PITCH], undefined, 4),
      `/studio/recording-song-modiin?addons=${PITCH}&participants=4#song-offer`,
    );
    assert.equal(buildSongOfferHref([], undefined, 1), "/studio/recording-song-modiin#song-offer");
    assert.equal(buildSongOfferHref([], "/studio", 30), "/studio?participants=12#song-offer");
    assert.equal(parseSongParticipants("4"), 4);
    assert.equal(parseSongParticipants(null), 1);
    assert.equal(parseSongParticipants("abc"), 1);
    assert.equal(parseSongParticipants("0"), 1);
    assert.equal(parseSongParticipants("40"), 12);
  });

  it("the callback request carries the participants and the total", () => {
    const req = buildSongCallbackRequest({
      name: "נועה",
      phone: "054-123-4567",
      addonIds: [],
      participants: 4,
      source: "/studio/recording-song-modiin",
      submissionId: "sub-p",
    });
    assert.ok(req.body.includes("• משתתפים: 4 (כולל תוספת 350 ₪)"));
    assert.ok(
      req.body.includes("פירוט לפי משתתף: 590 + 117 + 117 + 117 ₪ כולל מע״מ (500 + 99 + 99 + 99 ₪ + מע״מ)"),
    );
    assert.ok(req.body.includes("כל משתתף נוסף הוא ערוץ הקלטה נוסף ומוסיף למחיר."));
    assert.ok(req.body.includes("סה״כ: 940 ₪ כולל מע״מ (797 ₪ + מע״מ)"));
    assert.equal(req.pricingRef?.exVat, 797);
    assert.equal(req.pricingRef?.href, "/studio/recording-song-modiin?participants=4#song-offer");
    assert.deepEqual(
      checkLeadNotifyPayload({ ...req, body: buildLeadNotifyBody(req) }),
      { kind: "accept", flags: [] },
    );
  });

  it("the owner export lists the participant rules", () => {
    const exp = getSongOfferExport();
    assert.equal(exp.participantsParam, "participants");
    assert.equal(exp.participants.max, 12);
    assert.equal(exp.participants.extraExVat, 99);
  });
});

describe("song offer: per-person breakdown (owner decision 3.10.2026, round 3)", () => {
  it("one singer has no surcharge line and no breakdown in the message", () => {
    const { text } = buildSongOfferMessage([], { source: "/x", participants: 1 });
    assert.doesNotMatch(text, /פירוט לפי משתתף/);
    assert.equal(calcSongOffer([], 1).lines.some((l) => l.detail), false);
  });

  it("breaks down 2, 4 and 12 singers from the catalog, VAT-inclusive first", () => {
    assert.equal(
      getSongParticipantsBreakdown(2).line,
      "2 משתתפים: 590 + 117 ₪ כולל מע״מ (500 + 99 ₪ + מע״מ)",
    );
    assert.equal(
      getSongParticipantsBreakdown(4).line,
      "4 משתתפים: 590 + 117 + 117 + 117 ₪ כולל מע״מ (500 + 99 + 99 + 99 ₪ + מע״מ)",
    );
    assert.equal(
      getSongParticipantsBreakdown(12).line,
      "12 משתתפים: 590 + 11 × 117 ₪ כולל מע״מ (500 + 11 × 99 ₪ + מע״מ)",
    );
  });

  it("clamps the breakdown to the 12 limit and its extras sum to the surcharge", () => {
    assert.equal(getSongParticipantsBreakdown(40).head, "12 משתתפים");
    for (let n = 1; n <= 12; n += 1) {
      assert.equal(getSongParticipantsBreakdown(n).extrasExVat, songParticipantsSurcharge(n));
    }
  });

  it("the breakdown copy has no AI tells", () => {
    for (let n = 1; n <= 12; n += 1) {
      assert.doesNotMatch(getSongParticipantsBreakdown(n).line, /[!—–…“”]/);
    }
  });
});

describe("song offer: the 3.10.2026 lead (six singers, clip, family talk, photos)", () => {
  const ALL = [PITCH, CLIP, INTERVIEW, BTS, PHOTOS];
  const ORDER = [CLIP, INTERVIEW, BTS, PHOTOS];

  it("six participants with clip, family talk, behind the scenes and photos: 2,695 + VAT = 3,180", () => {
    const calc = calcSongOffer(ORDER, 6);
    assert.equal(calc.totalExVat, 500 + 5 * 99 + 750 + 500 + 250 + 200);
    assert.equal(calc.totalExVat, 2695);
    assert.equal(calc.totalWithVat, 3180);
    assert.deepEqual(calc.addonIds, ORDER);
  });

  it("the photo and video add-ons do not need the clip", () => {
    assert.deepEqual(normalizeSongAddons([BTS, PHOTOS]), [BTS, PHOTOS]);
    assert.deepEqual(normalizeSongAddons(ALL), ALL);
  });

  it("the personal podcast covers family questions and is delivered on its own too", () => {
    const view = getSongOfferView();
    const interview = view.addons.find((a) => a.id === INTERVIEW)!;
    const text = [interview.description, ...interview.included].join(" ");
    assert.match(text, /המשפחה או חבר קרוב/);
    assert.match(text, /מראיינים/);
    assert.match(text, /קובץ נפרד/);
  });

  it("notes go into the message and the callback, without changing the total", () => {
    const notes = "  שיחה משפחתית לפני השיר, ושישה זמרים  ";
    const { text } = buildSongOfferMessage(ORDER, { source: "/studio/recording-song-modiin", participants: 6, notes });
    assert.ok(text.includes("הערות: שיחה משפחתית לפני השיר, ושישה זמרים"));
    assert.ok(text.indexOf("הערות:") < text.indexOf("מתי נוח לכם להקליט?"));
    assert.ok(text.includes("סה״כ: 3,180 ₪ כולל מע״מ (2,695 ₪ + מע״מ)"));
    const req = buildSongCallbackRequest({
      name: "נועה כהן",
      phone: "054-123-4567",
      addonIds: ORDER,
      participants: 6,
      notes,
      source: "/studio/recording-song-modiin",
      submissionId: "sub-notes",
      honeypot: "",
    });
    assert.ok(req.body.includes("הערות: שיחה משפחתית לפני השיר, ושישה זמרים"));
    assert.equal(req.pricingRef?.exVat, 2695);
  });

  it("no notes line when the field is empty, and long notes are cut", () => {
    const { text } = buildSongOfferMessage([CLIP], { source: "/x", notes: "   " });
    assert.ok(!text.includes("הערות:"));
    const long = buildSongOfferMessage([CLIP], { source: "/x", notes: "א".repeat(900) }).text;
    const line = long.split("\n").find((l) => l.startsWith("הערות: "))!;
    assert.equal(line.length, "הערות: ".length + 500);
  });
});
