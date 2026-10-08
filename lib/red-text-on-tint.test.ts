import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

/*
 * F-06 (נגישות, 7.10.2026): text-brand-red (#d42b2b) על הגוונים שלו מתחת ל-4.5:1
 * (bg-brand-red/5 4.47, /8 4.25, /10 4.13, /15 3.82 על #fafaf8), ולכן כל מחרוזת שמשלבת
 * את שניהם נכשלת ב-1.4.3. התיקון הוא text-brand-red-text (#9a2222, 6.57:1 על /10).
 * הטסט הוא grep: הוא סורק שורות מקור, ולכן לא רואה טקסט שיושב בתוך הורה מגוון
 * כשהגוון מוגדר בשורה אחרת. הוא תופס את הצורה הנפוצה, שבה הגוון והטקסט באותה מחרוזת.
 *
 * מה נחשב הפרה, לפי וריאנטים (hover:, active:, ...):
 *  - text-brand-red ו-bg-brand-red/(5|8|10|15) באותו מצב (שניהם בסיס, או שניהם hover).
 *  - text-brand-red בסיס וגוון רק ב-hover/active, אלא אם יש באותה שורה צבע טקסט אחר
 *    לאותו מצב (למשל hover:text-brand-red-text, כמו ב-Button.tsx).
 *  - text-brand-red/NN (טקסט שקוף למחצה) בכל מקום.
 *
 * מותר רק מה שמופיע ב-ALLOWLIST. הרשימה עוברת עם count מקסימלי לקובץ, כך שהפרה
 * חדשה בקובץ מורשה נכשלת גם היא. שני סוגי רשומות:
 *  - EXEMPT: חריג לגיטימי. אייקון או קישוט מעל גוון צריך 3:1 (1.4.11) ולא 4.5:1.
 *  - BURNDOWN: חוב שנמצא ולא תוקן כי הקובץ לא בבעלות הסבב הזה. התיקון הוא להחליף
 *    text-brand-red ב-text-brand-red-text בשורה, ולהוריד את הרשומה מכאן.
 */

type Allow = { max: number; kind: "EXEMPT" | "BURNDOWN"; why: string };

const ALLOWLIST: Record<string, Allow> = {
  "app/(services)/academy/dj-course/page.tsx": { max: 2, kind: "BURNDOWN", why: "טקסט על גוון. הקובץ לא בבעלות סבב ב-7.10.2026, להחליף text-brand-red ב-text-brand-red-text" },
  "app/(services)/academy/hebrew-lessons/page.tsx": { max: 2, kind: "BURNDOWN", why: "שורה 318: מספרי שלבים (aria-hidden) על גוון, להחליף ל-brand-red-text. שורה 476: מספר-סימן-מים text-brand-red/20, עיטור aria-hidden מכוון (F-41), חריג" },
  "app/(services)/academy/voiceover/page.tsx": { max: 1, kind: "BURNDOWN", why: "טקסט על גוון. הקובץ לא בבעלות סבב ב-7.10.2026, להחליף text-brand-red ב-text-brand-red-text" },
  "app/clinic/page.tsx": { max: 1, kind: "BURNDOWN", why: "טקסט על גוון. הקובץ לא בבעלות סבב ב-7.10.2026, להחליף text-brand-red ב-text-brand-red-text" },
  "app/start/page.tsx": { max: 3, kind: "BURNDOWN", why: "שורה 147: תג טקסט על גוון, להחליף. שורות 215 ו-248 הן אייקונים בלבד (3:1 מספיק), חריגים" },
  "app/thank-you/page.tsx": { max: 1, kind: "BURNDOWN", why: "טקסט על גוון. הקובץ לא בבעלות סבב ב-7.10.2026, להחליף text-brand-red ב-text-brand-red-text" },
  "components/academy/AcademyCourseFitSections.tsx": { max: 1, kind: "BURNDOWN", why: "טקסט על גוון. הקובץ לא בבעלות סבב ב-7.10.2026, להחליף text-brand-red ב-text-brand-red-text" },
  "components/blog/NeedsDiagnostic.tsx": { max: 1, kind: "BURNDOWN", why: "טקסט על גוון. הקובץ לא בבעלות סבב ב-7.10.2026, להחליף text-brand-red ב-text-brand-red-text" },
  "components/blog/SocialShare.tsx": { max: 1, kind: "BURNDOWN", why: "טקסט על גוון. הקובץ לא בבעלות סבב ב-7.10.2026, להחליף text-brand-red ב-text-brand-red-text" },
  "components/booking/BookAudienceCard.tsx": { max: 5, kind: "BURNDOWN", why: "טקסט על גוון. הקובץ לא בבעלות סבב ב-7.10.2026, להחליף text-brand-red ב-text-brand-red-text" },
  "components/booking/BookNeedMatcher.tsx": { max: 1, kind: "BURNDOWN", why: "טקסט על גוון. הקובץ לא בבעלות סבב ב-7.10.2026, להחליף text-brand-red ב-text-brand-red-text" },
  "components/booking/BookWhatHappensNext.tsx": { max: 1, kind: "BURNDOWN", why: "טקסט על גוון. הקובץ לא בבעלות סבב ב-7.10.2026, להחליף text-brand-red ב-text-brand-red-text" },
  "components/booking/BookingSchedulePicker.tsx": { max: 1, kind: "BURNDOWN", why: "טקסט על גוון. הקובץ לא בבעלות סבב ב-7.10.2026, להחליף text-brand-red ב-text-brand-red-text" },
  "components/booking/BookingSuccessPanel.tsx": { max: 1, kind: "BURNDOWN", why: "טקסט על גוון. הקובץ לא בבעלות סבב ב-7.10.2026, להחליף text-brand-red ב-text-brand-red-text" },
  "components/booking/ConfettiMomentSelector.tsx": { max: 1, kind: "BURNDOWN", why: "טקסט על גוון. הקובץ לא בבעלות סבב ב-7.10.2026, להחליף text-brand-red ב-text-brand-red-text" },
  "components/booking/intake/IntakeStepService.tsx": { max: 1, kind: "BURNDOWN", why: "טקסט על גוון. הקובץ לא בבעלות סבב ב-7.10.2026, להחליף text-brand-red ב-text-brand-red-text" },
  "components/booking/smart-form/SmartFormClient.tsx": { max: 2, kind: "BURNDOWN", why: "טקסט על גוון. הקובץ לא בבעלות סבב ב-7.10.2026, להחליף text-brand-red ב-text-brand-red-text" },
  "components/business/CompanyDetailsCard.tsx": { max: 2, kind: "BURNDOWN", why: "טקסט על גוון. הקובץ לא בבעלות סבב ב-7.10.2026, להחליף text-brand-red ב-text-brand-red-text" },
  "components/business/social-media/SocialMediaHeroGrid.tsx": { max: 1, kind: "EXEMPT", why: "קופסת אייקון בלבד (1.4.11 דורש 3:1, והאדום על /8 הוא 4.25:1)" },
  "components/calculators/UnifiedPricingCalculator.tsx": { max: 1, kind: "BURNDOWN", why: "טקסט על גוון. הקובץ לא בבעלות סבב ב-7.10.2026, להחליף text-brand-red ב-text-brand-red-text" },
  "components/contact/ContactPageContent.tsx": { max: 2, kind: "BURNDOWN", why: "טקסט על גוון. הקובץ לא בבעלות סבב ב-7.10.2026, להחליף text-brand-red ב-text-brand-red-text" },
  "components/events/AudienceTabs.tsx": { max: 1, kind: "EXEMPT", why: "עיגול V דקורטיבי (aria-hidden) מעל גוון, אייקון בלבד" },
  "components/forms/LeadFormAlert.tsx": { max: 1, kind: "BURNDOWN", why: "טקסט על גוון. הקובץ לא בבעלות סבב ב-7.10.2026, להחליף text-brand-red ב-text-brand-red-text" },
  "components/layout/Header.tsx": { max: 2, kind: "EXEMPT", why: "כפתור אייקון (לוח שנה) בלי טקסט, השם בא מ-aria-label. שני הספירות הן אותה שורה (גוון בבסיס ובריחוף)" },
  "components/marketing/AcademyBookingWizard.tsx": { max: 1, kind: "BURNDOWN", why: "טקסט על גוון. הקובץ לא בבעלות סבב ב-7.10.2026, להחליף text-brand-red ב-text-brand-red-text" },
  "components/marketing/EventIndexAttractionsCatalog.tsx": { max: 1, kind: "BURNDOWN", why: "טקסט על גוון. הקובץ לא בבעלות סבב ב-7.10.2026, להחליף text-brand-red ב-text-brand-red-text" },
  "components/marketing/EventsBookingWizard.tsx": { max: 6, kind: "BURNDOWN", why: "טקסט על גוון. הקובץ לא בבעלות סבב ב-7.10.2026, להחליף text-brand-red ב-text-brand-red-text" },
  "components/marketing/FilterGate.tsx": { max: 2, kind: "BURNDOWN", why: "טקסט על גוון. הקובץ לא בבעלות סבב ב-7.10.2026, להחליף text-brand-red ב-text-brand-red-text" },
  "components/marketing/HomePageSections.tsx": { max: 1, kind: "BURNDOWN", why: "hover:text-brand-red על hover:bg-brand-red/5. להוסיף hover:text-brand-red-text" },
  "components/marketing/HomeTrustFeatureGrid.tsx": { max: 1, kind: "EXEMPT", why: "קופסת אייקון בלבד (aria-hidden)" },
  "components/marketing/PodcastBookingWizard.tsx": { max: 4, kind: "BURNDOWN", why: "כולל text-brand-red/80 בשורה 899" },
  "components/marketing/ProServiceWizard.tsx": { max: 1, kind: "BURNDOWN", why: "טקסט על גוון. הקובץ לא בבעלות סבב ב-7.10.2026, להחליף text-brand-red ב-text-brand-red-text" },
  "components/marketing/ProductionCalculator.tsx": { max: 1, kind: "BURNDOWN", why: "טקסט על גוון. הקובץ לא בבעלות סבב ב-7.10.2026, להחליף text-brand-red ב-text-brand-red-text" },
  "components/marketing/ServiceCard.tsx": { max: 1, kind: "BURNDOWN", why: "טקסט על גוון. הקובץ לא בבעלות סבב ב-7.10.2026, להחליף text-brand-red ב-text-brand-red-text" },
  "components/marketing/StudioGearRoom.tsx": { max: 3, kind: "EXEMPT", why: "קופסאות אייקון/אמוג'י דקורטיביות (aria-hidden)" },
  "components/marketing/WhatsappLeadRouter.tsx": { max: 1, kind: "BURNDOWN", why: "טקסט על גוון. הקובץ לא בבעלות סבב ב-7.10.2026, להחליף text-brand-red ב-text-brand-red-text" },
  "components/seo/AcousticConsultingPageContent.tsx": { max: 2, kind: "BURNDOWN", why: "טקסט על גוון. הקובץ לא בבעלות סבב ב-7.10.2026, להחליף text-brand-red ב-text-brand-red-text" },
  "components/seo/ColdFireworksPageContent.tsx": { max: 1, kind: "BURNDOWN", why: "גוון רק ב-hover. להוסיף hover:text-brand-red-text, כמו ב-Button.tsx" },
  "components/seo/DjEventsPageContent.tsx": { max: 1, kind: "BURNDOWN", why: "גוון רק ב-hover. להוסיף hover:text-brand-red-text, כמו ב-Button.tsx" },
  "components/seo/DjFreeToolsSection.tsx": { max: 1, kind: "BURNDOWN", why: "text-brand-red/90 (4.25:1). להחליף ל-text-brand-red-text" },
  "components/seo/FunnyRingtonePageContent.tsx": { max: 1, kind: "BURNDOWN", why: "טקסט על גוון. הקובץ לא בבעלות סבב ב-7.10.2026, להחליף text-brand-red ב-text-brand-red-text" },
  "components/seo/OnlinePhotoEnhancePageContent.tsx": { max: 3, kind: "BURNDOWN", why: "שורה 203 תג על גוון, שורות 225 ו-269 גוון רק ב-hover" },
  "components/seo/PhotoSlideshowPageContent.tsx": { max: 1, kind: "BURNDOWN", why: "טקסט על גוון. הקובץ לא בבעלות סבב ב-7.10.2026, להחליף text-brand-red ב-text-brand-red-text" },
  "components/seo/PodcastEditingPageContent.tsx": { max: 1, kind: "BURNDOWN", why: "טקסט על גוון. הקובץ לא בבעלות סבב ב-7.10.2026, להחליף text-brand-red ב-text-brand-red-text" },
  "components/seo/PodcastHubPageContent.tsx": { max: 2, kind: "BURNDOWN", why: "כפתור עם גוון ב-hover וב-active (שורה אחת, נספרת פעמיים)" },
  "components/seo/PodcastProductionPageContent.tsx": { max: 1, kind: "BURNDOWN", why: "טקסט על גוון. הקובץ לא בבעלות סבב ב-7.10.2026, להחליף text-brand-red ב-text-brand-red-text" },
  "components/seo/PodcastRecordingPageContent.tsx": { max: 3, kind: "BURNDOWN", why: "כולל שורת המחיר text-lg font-bold (4.25:1) שהוזכרה ב-F-06, שורה 341, שהגוון שלה בהורה ולכן הטסט לא רואה אותה" },
  "components/seo/PodcastSoundRepairPageContent.tsx": { max: 1, kind: "BURNDOWN", why: "טקסט על גוון. הקובץ לא בבעלות סבב ב-7.10.2026, להחליף text-brand-red ב-text-brand-red-text" },
  "components/seo/SingerAmplificationPageContent.tsx": { max: 1, kind: "BURNDOWN", why: "טקסט על גוון. הקובץ לא בבעלות סבב ב-7.10.2026, להחליף text-brand-red ב-text-brand-red-text" },
  "components/seo/StageLedDjPageContent.tsx": { max: 1, kind: "BURNDOWN", why: "גוון רק ב-hover. להוסיף hover:text-brand-red-text, כמו ב-Button.tsx" },
  "components/seo/StudioAcousticBeforeAfter.tsx": { max: 1, kind: "BURNDOWN", why: "טקסט על גוון. הקובץ לא בבעלות סבב ב-7.10.2026, להחליף text-brand-red ב-text-brand-red-text" },
  "components/seo/TimeSavedMatrix.tsx": { max: 1, kind: "BURNDOWN", why: "th על bg-brand-red/5" },
  "components/singer-amplification/SingerSystemBuilderWidget.tsx": { max: 1, kind: "BURNDOWN", why: "טקסט על גוון. הקובץ לא בבעלות סבב ב-7.10.2026, להחליף text-brand-red ב-text-brand-red-text" },
  "components/ui/MicroAudioAudition.tsx": { max: 1, kind: "BURNDOWN", why: "טקסט על גוון. הקובץ לא בבעלות סבב ב-7.10.2026, להחליף text-brand-red ב-text-brand-red-text" },
  "components/ui/ShareButton.tsx": { max: 1, kind: "BURNDOWN", why: "טקסט על גוון. הקובץ לא בבעלות סבב ב-7.10.2026, להחליף text-brand-red ב-text-brand-red-text" },
  "components/ui/TableOfContents.tsx": { max: 1, kind: "BURNDOWN", why: "hover:text-brand-red על hover:bg-brand-red/5. להחליף ל-hover:text-brand-red-text" },
  "components/ui/VoiceSearchMicButton.tsx": { max: 1, kind: "EXEMPT", why: "כפתור אייקון (מיקרופון) בלי טקסט, השם מ-aria-label" },
  "components/ui/accordion.tsx": { max: 1, kind: "EXEMPT", why: "עיגול אייקון (פלוס/מינוס) בלי טקסט" },
};

const ROOTS = ["app", "components"];
const SKIP = /node_modules|\.next|\.generated\.|\.test\.|[/\\]generated[/\\]/;

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (SKIP.test(p)) continue;
    if (entry.isDirectory()) walk(p, out);
    else if (/\.tsx?$/.test(entry.name)) out.push(p);
  }
  return out;
}

/** "hover:bg-brand-red/5" -> { variant: "hover", utility: "bg-brand-red/5" } */
function parseToken(raw: string): { variant: string; utility: string } | null {
  const token = raw.replace(/^[^\w[-]+|[^\w\]/.-]+$/g, "");
  if (!token) return null;
  const parts = token.split(":");
  const utility = parts[parts.length - 1];
  return { variant: parts.slice(0, -1).join(":"), utility };
}

const TINT = /^bg-brand-red\/(5|8|10|15)$/;
const TEXT_RED = "text-brand-red";
const TEXT_RED_ALPHA = /^text-brand-red\/\d+$/;
/** צבעי טקסט שדורסים את האדום באותו מצב */
const TEXT_OVERRIDE = /^text-(brand-red-text|brand-red-dark|white|foreground|\[#)/;

function lineViolations(line: string): string[] {
  const tokens = line
    .split(/[\s"'`,(){}]+/)
    .map(parseToken)
    .filter((t): t is { variant: string; utility: string } => t !== null);

  const found: string[] = [];

  for (const t of tokens) {
    if (TEXT_RED_ALPHA.test(t.utility)) found.push(`${t.variant ? t.variant + ":" : ""}${t.utility}`);
  }

  const tints = tokens.filter((t) => TINT.test(t.utility));
  const reds = tokens.filter((t) => t.utility === TEXT_RED);
  if (tints.length === 0 || reds.length === 0) return found;

  for (const tint of tints) {
    for (const red of reds) {
      const sameState = red.variant === tint.variant;
      const redOnBase = red.variant === "";
      const tintOnBase = tint.variant === "";
      if (!sameState && !redOnBase && !tintOnBase) continue;
      if (redOnBase && !tintOnBase) {
        const overridden = tokens.some(
          (o) => o.variant === tint.variant && TEXT_OVERRIDE.test(o.utility),
        );
        if (overridden) continue;
      }
      found.push(
        `${red.variant ? red.variant + ":" : ""}${red.utility} + ${tint.variant ? tint.variant + ":" : ""}${tint.utility}`,
      );
    }
  }
  return found;
}

describe("בורר ההפרות של אדום מותג על גוון", () => {
  it("תופס את הצורות הנפוצות", () => {
    assert.ok(lineViolations('className="rounded-full bg-brand-red/10 px-3 text-xs text-brand-red"').length > 0);
    assert.ok(lineViolations('? "border-brand-red bg-brand-red/5 text-brand-red"').length > 0);
    assert.ok(lineViolations('"hover:bg-brand-red/5 hover:text-brand-red"').length > 0);
    assert.ok(lineViolations('className="text-xs text-brand-red/80"').length > 0);
    assert.ok(lineViolations("border-brand-red text-brand-red hover:bg-brand-red/10").length > 0);
  });

  it("לא תופס את התיקונים ואת המקרים התקינים", () => {
    assert.deepEqual(lineViolations('className="bg-brand-red/10 text-brand-red-text"'), []);
    assert.deepEqual(lineViolations('className="bg-brand-red text-white"'), []);
    assert.deepEqual(lineViolations('className="border-brand-red/40 text-brand-red hover:underline"'), []);
    assert.deepEqual(lineViolations('"hover:bg-brand-red/5 hover:text-brand-red-text"'), []);
    assert.deepEqual(lineViolations("text-brand-red hover:bg-brand-red/10 hover:text-brand-red-text"), []);
    assert.deepEqual(lineViolations('className="bg-brand-red/[0.04] text-brand-red-dark"'), []);
  });
});

describe("אדום מותג על הגוון שלו (F-06)", () => {
  const perFile = new Map<string, string[]>();

  for (const root of ROOTS) {
    for (const file of walk(root)) {
      const lines = readFileSync(file, "utf8").split("\n");
      lines.forEach((line, i) => {
        for (const v of lineViolations(line)) {
          const key = file.split(path.sep).join("/");
          const list = perFile.get(key) ?? [];
          list.push(`${i + 1}: ${v}`);
          perFile.set(key, list);
        }
      });
    }
  }

  it("אין הפרה חדשה מחוץ לרשימת המותרים", () => {
    const unexpected = [...perFile].filter(([file]) => !(file in ALLOWLIST));
    assert.deepEqual(
      unexpected.map(([file, hits]) => `${file} -> ${hits.join(" | ")}`),
      [],
      "text-brand-red על bg-brand-red/(5|8|10|15) נכשל ב-1.4.3. להחליף ב-text-brand-red-text",
    );
  });

  it("קובץ מורשה לא צובר הפרות מעבר למה שאושר", () => {
    const grown = Object.entries(ALLOWLIST)
      .map(([file, allow]) => ({ file, allow, count: perFile.get(file)?.length ?? 0 }))
      .filter(({ allow, count }) => count > allow.max)
      .map(({ file, allow, count }) => `${file}: ${count} מעל ${allow.max} (${allow.kind})`);
    assert.deepEqual(grown, []);
  });

  it("כל רשומה ברשימה מסבירה את עצמה", () => {
    for (const [file, allow] of Object.entries(ALLOWLIST)) {
      assert.ok(allow.why.trim().length > 10, `${file} בלי נימוק`);
    }
  });
});
