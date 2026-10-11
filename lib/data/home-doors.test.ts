import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { DOOR_SENTENCES, HOME_DOORS, HOME_MORE_LINKS } from "@/lib/data/home-doors";
import { INTENT_NAV_ITEMS, doorForIntent, type DoorId } from "@/lib/data/intent-nav";
import {
  SMART_FORM_CATEGORIES,
  SMART_FORM_STEP1_PRIMARY,
  SMART_FORM_STEP1_SECONDARY,
  getSmartFormCategory,
} from "@/lib/data/smart-form-matrix";
import { HEADER_PRIMARY_NAV } from "@/lib/site-architecture";

/* ק7 (11.10.2026): הדלתות בראש דף הבית, בתפריט, ברצועת הכוונה וב-/book.
   D84 ארבע דלתות, D85 שורת "עוד", D93 שיר ומתנה ופודקאסט ראשונות וגדולות. */

const DOOR_ORDER: readonly DoorId[] = ["song-gift", "podcast", "event", "business", "more"];

describe("ק7: הדלתות בדף הבית", () => {
  it("המשפטים של הבעלים מילה במילה", () => {
    assert.equal(
      DOOR_SENTENCES["song-gift"],
      "שעה אחת באולפן: הקלטה, מיקס ומאסטר, והשיר ביד באותו רגע. גם כמתנה.",
    );
    assert.equal(
      DOOR_SENTENCES.podcast,
      "מקליטים באולפן או אצלכם, ואת הפרק מקבלים באותה שנייה שמסיימים להקליט.",
    );
  });

  it("שיר ומתנה ופודקאסט ראשונות וגדולות, אירוע ולעסקים אחריהן וקטנות (D93)", () => {
    assert.deepEqual(
      HOME_DOORS.map((d) => [d.door, d.prominence]),
      [
        ["song-gift", "primary"],
        ["podcast", "primary"],
        ["event", "secondary"],
        ["business", "secondary"],
      ],
    );
  });

  it("דלת השיר כוללת ברכה ושובר מתנה, ודלת הפודקאסט את האולפן הנייד (D93)", () => {
    const song = HOME_DOORS.find((d) => d.door === "song-gift");
    const podcast = HOME_DOORS.find((d) => d.door === "podcast");
    const songHrefs = song?.links.map((l) => l.href) ?? [];
    assert.ok(songHrefs.includes("/studio/blessings"));
    assert.ok(songHrefs.includes("/matanot/gift-voucher"));
    assert.ok(podcast?.links.some((l) => l.href === "/podcast/mobile-podcast-at-home"));
  });

  it("לכל דלת גדולה מחיר מהקטלוג, משפט וכפתור", () => {
    for (const door of HOME_DOORS.filter((d) => d.prominence === "primary")) {
      assert.ok(door.price, `${door.door} בלי מחיר`);
      assert.ok(door.cta, `${door.door} בלי כפתור`);
      assert.equal(door.sentence, DOOR_SENTENCES[door.door as keyof typeof DOOR_SENTENCES]);
    }
    assert.equal(HOME_DOORS[0].price?.id, "song_recording");
    assert.equal(HOME_DOORS[1].price?.id, "podcast_audio");
  });

  it("שורת עוד מכילה את השירותים שמחוץ לדלתות (D85, D93)", () => {
    const labels = HOME_MORE_LINKS.map((l) => l.label);
    for (const label of ["תיקון מרחוק", "קריינות", "קורסים", "וידאו וצילום", "מחירון", "הפקת סינגל"]) {
      assert.ok(labels.includes(label), `חסר "${label}" בשורת עוד`);
    }
  });

  it("כל קישור פנימי, ומזהי הפריטים לא חוזרים בתוך דלת", () => {
    for (const door of HOME_DOORS) {
      const ids = [door.itemId, ...door.links.map((l) => l.id)];
      assert.equal(new Set(ids).size, ids.length, `מזהה כפול בדלת ${door.door}`);
      for (const href of [door.href, ...door.links.map((l) => l.href)]) {
        assert.match(href, /^\/[a-z]/, href);
      }
    }
    for (const link of HOME_MORE_LINKS) assert.match(link.href, /^\/[a-z]/, link.href);
  });

  it("בלי סימנים שאסורים בקופי (audit:ai-tells)", () => {
    const copy = [
      ...HOME_DOORS.flatMap((d) => [d.title, d.sentence, d.cta ?? "", d.priceNote ?? "", d.price?.label ?? "", ...d.links.map((l) => l.label)]),
      ...HOME_MORE_LINKS.map((l) => l.label),
    ].join("\n");
    assert.doesNotMatch(copy, /[–—…“”‘’!]/);
  });
});

describe("ק7: הסדר בתפריט וברצועת הכוונה", () => {
  it("רצועת הכוונה לפי סדר הדלתות, וכל ה-href נשארו", () => {
    const order = INTENT_NAV_ITEMS.map((item) => DOOR_ORDER.indexOf(doorForIntent(item.id)));
    for (let i = 1; i < order.length; i++) {
      assert.ok(order[i] >= order[i - 1], `${INTENT_NAV_ITEMS[i].id} לפני דלת מוקדמת יותר`);
    }
    assert.deepEqual(
      INTENT_NAV_ITEMS.map((item) => item.href).sort(),
      [
        "/business",
        "/events/bar-mitzvah",
        "/events/wedding-attractions-packages",
        "/matanot",
        "/podcast",
        "/pricing",
        "/studio/blessings",
        "/studio/mobile-studio",
        "/studio/recording-song-modiin",
      ],
    );
  });

  it("בכותרת: אולפן, מתנות ופודקאסט לפני אירועים, והקישור המודגש הראשון באולפן הוא הקלטת שיר", () => {
    const keys = HEADER_PRIMARY_NAV.map((e) => (e.kind === "dropdown" ? e.category.id : e.href));
    const events = keys.indexOf("events");
    for (const key of ["studio", "/matanot", "podcast"]) {
      assert.ok(keys.indexOf(key) < events, `${key} אחרי אירועים`);
    }
    const studio = HEADER_PRIMARY_NAV.find((e) => e.kind === "dropdown" && e.category.id === "studio");
    assert.equal(
      studio?.kind === "dropdown" ? studio.category.featured?.[0]?.href : undefined,
      "/studio/recording-song-modiin",
    );
  });
});

describe("ק7: השלב הראשון ב-/book", () => {
  it("שני כרטיסים גדולים: שיר או שיר במתנה, ופודקאסט", () => {
    assert.deepEqual(
      SMART_FORM_STEP1_PRIMARY.map((c) => c.id),
      ["song", "podcast"],
    );
    assert.equal(getSmartFormCategory("song")?.title, "שיר או שיר במתנה");
    assert.equal(getSmartFormCategory("song")?.cardLine, DOOR_SENTENCES["song-gift"]);
    assert.equal(getSmartFormCategory("podcast")?.cardLine, DOOR_SENTENCES.podcast);
  });

  it("כל השאר גלויים בקטן, וכל כרטיס עם דלת", () => {
    assert.equal(
      SMART_FORM_STEP1_PRIMARY.length + SMART_FORM_STEP1_SECONDARY.length,
      SMART_FORM_CATEGORIES.length,
    );
    for (const c of SMART_FORM_CATEGORIES) assert.ok(DOOR_ORDER.includes(c.door), c.id);
  });

  it("השיר יצא מכרטיס הברכה: אין צ'יפ שיר בתוך family", () => {
    const family = getSmartFormCategory("family");
    assert.ok(family);
    assert.ok(!family.chips.some((chip) => chip.catalogId === "song_recording"));
    assert.ok(getSmartFormCategory("song")?.chips.some((chip) => chip.id === "cover"));
  });
});
