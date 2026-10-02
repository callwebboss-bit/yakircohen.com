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
  getSongOfferView,
  isSongAddonAvailable,
  LEGACY_SONG_ALIASES,
  normalizeSongAddons,
  parseSongAddons,
  resolveLegacySongAlias,
  SONG_ADDON_IDS,
  SONG_OFFER_CALLBACK_FORM_ID,
  type SongAddonId,
} from "@/lib/data/song-offer";
import { buildLeadNotifyBody } from "@/lib/lead-email-notify";
import { checkLeadNotifyPayload, FORM_ID_PATTERN } from "@/lib/leads/payload-check";

const PITCH = "song_pitch_coaching";
const CLIP = "studio_session_clip_edited";
const INTERVIEW = "song_pre_session_interview";

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
  it("reads the base and the three add-ons from the catalog, in order", () => {
    assert.equal(getExVat("song_recording"), 500);
    assert.equal(getExVat(PITCH), 300);
    assert.equal(getExVat(CLIP), 750);
    assert.equal(getExVat(INTERVIEW), 500);
    assert.deepEqual(SONG_ADDON_IDS, [PITCH, CLIP, INTERVIEW]);
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
    assert.ok(req.body.includes("• ראיון קצר במתחם הפודקאסט - 590 ₪"));
    assert.ok(req.body.includes("סה״כ: 2,065 ₪ כולל מע״מ (1,750 ₪ + מע״מ)"));
    assert.ok(req.body.includes("[YC:"));
    assert.ok(req.subject.includes("2,065 ₪"));
    assert.deepEqual(req.pricingRef, {
      sectionId: "song-offer",
      label: "הקלטת שיר (הקלטה, מיקס ומאסטר) + קליפ ערוך מהסשן באולפן + ראיון קצר במתחם הפודקאסט",
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
