import { formatFromPriceDual, getExVat } from "@/lib/data/pricing-catalog";

/**
 * מרכזי ידע לדליי הבלוג.
 *
 * ההחלטה (2.10.2026): לא לבנות מרחב `/learn` חדש אלא להפוך את
 * `/blog/category/<id>` הקיים ממצעד מאמרים לעמוד שמלמד. אפס כתובות
 * חדשות, אפס 301, אפס איבוד הון SEO. ראו docs/LEARN-CENTER-PLAN.md
 * שסומן כמבוטל.
 *
 * דלי בלי רשומה כאן ממשיך לקבל את הטיפול הגנרי הקיים.
 *
 * הכותרת והתשובה נכתבו על ידי הבעלים. הכותרת היא השאלה שהוא באמת
 * נשאל לפני הזמנה ("כמה זה עולה"), ולא שם התחום. המחירים נמשכים
 * מ-pricing-catalog ולא נכתבים ביד, כדי שלא יתיישנו ולא ייפלו
 * ב-audit:prose-prices.
 */

export type KnowledgeGroup = {
  id: string;
  /** כותרת הקבוצה. שאלה, לא תגית. */
  title: string;
  /** סלאגים לפי הסדר שבו כדאי לקרוא אותם, לא לפי תאריך. */
  slugs: readonly string[];
};

export type KnowledgeHub = {
  /** מזהה הדלי ב-BLOG_FILTER_CATEGORIES */
  categoryId: string;
  /** ה-h1 של העמוד */
  heading: string;
  /** בלוק התשובה ל-AEO. 40 עד 60 מילים. */
  answer: string;
  /** תיאור ל-SERP. נכתב בנפרד מהתשובה כי שם יש 155 תווים בלבד. */
  metaDescription: string;
  /** האם להציג את בלוק "מה מזיז את המחיר". נכון לדלי שהשאלה בו היא מחיר. */
  showPriceFactors?: boolean;
  groups: readonly KnowledgeGroup[];
};

function stripDualPrefix(formatted: string): string {
  return formatted.replace(/^כרגע: מ-/, "");
}

export function buildStudioHubAnswer(): string {
  const blessing = stripDualPrefix(
    formatFromPriceDual(getExVat("blessing_recording")),
  );
  const song = stripDualPrefix(formatFromPriceDual(getExVat("cover_song")));
  return (
    `הקלטה באולפן מתחילה ב-${blessing} לברכה או אמירה קצרה, ` +
    `ו-${song} לשיר מוכן שכולל מיקס, מאסטרינג ותיקון זיופים. ` +
    `מה שמזיז את המחיר הוא רמת הגימור, אורך ההקלטה, כמה אנשים מקליטים וכמה זה דחוף. ` +
    `אפשר גם לצלם את ההקלטה לרשתות. ` +
    `לפני שמתחילים נבין מה אתם רוצים ליצור, ורק אז נגיד מחיר.`
  );
}

export function buildStudioHubMetaDescription(): string {
  const blessing = getExVat("blessing_recording").toLocaleString("he-IL");
  const song = getExVat("cover_song").toLocaleString("he-IL");
  return (
    `ברכה מ-${blessing} ₪ + מע״מ, שיר מוכן מ-${song} ₪ + מע״מ. ` +
    `מה מזיז את המחיר, מה אפשר לעשות לבד, ומתי אולפן לא שווה את זה.`
  );
}

const STUDIO_HUB: KnowledgeHub = {
  categoryId: "studio",
  heading: "כמה עולה להקליט באולפן?",
  answer: buildStudioHubAnswer(),
  metaDescription: buildStudioHubMetaDescription(),
  showPriceFactors: true,
  groups: [
    {
      id: "cost",
      title: "מה זה עולה, ומה מזיז את המחיר",
      slugs: [
        "studio-recording-cost-israel-2026",
        "bar-mitzvah-recording-price-guide",
        "studio-recording-complaints",
      ],
    },
    {
      id: "diy",
      title: "מה אפשר לעשות לבד, ואיפה זה נשבר",
      slugs: [
        "how-to-record-at-home",
        "home-recording-7-mistakes",
        "home-mic-guide",
        "studio-guide",
      ],
    },
    {
      id: "when",
      title: "מתי אולפן שווה את זה, ומתי לא",
      slugs: ["home-studio-vs-professional-studio-2026", "studio-vs-home-fix-cost"],
    },
    {
      id: "prep",
      title: "איך מגיעים מוכנים",
      slugs: [
        "studio-session-prep-checklist",
        "ready-for-records",
        "original-song-what-to-prepare",
        "bride-groom-blessing-recording-tips",
      ],
    },
    {
      id: "occasion",
      title: "לפי האירוע שלכם",
      slugs: [
        "bar-mitzvah-song-recording-guide",
        "bat-mitzvah-clip-guide",
        "chuppah-song-guide-couples",
        "recorded-song-birthday-gift",
        "unique-gift-recording-ideas-2026",
        "bar-mitzvah-september-recording-tips",
        "wedding-surprise-song-story",
      ],
    },
    {
      id: "practical",
      title: "טכני ולוגיסטי",
      slugs: [
        "mp3-vs-wav-studio-guide",
        "record-song-10-minutes-ai",
        "mobile-recording-studio-guide",
        "how-to-book-studio-modiin",
      ],
    },
  ],
};

export function buildVoiceoverHubAnswer(): string {
  const ivr = getExVat("voiceover_ivr").toLocaleString("he-IL");
  const brand = getExVat("audio_brand_starter").toLocaleString("he-IL");
  return (
    `לקוח שמתקשר שומע את העסק לפני שהוא רואה אותו. הקלטה מהנייד ברעש רקע ` +
    `יוצרת רושם תוך שניות, וקשה לתקן אותו אחר כך. קריינות למרכזייה מתחילה ` +
    `ב-${ivr} ₪ לפני מע״מ לשלוש הודעות, וחבילת מיתוג קולי עם ג'ינגל ` +
    `ב-${brand} ₪. מה שקובע את התוצאה הוא הטון שנבחר, לא הציוד.`
  );
}

export function buildVoiceoverHubMetaDescription(): string {
  const ivr = getExVat("voiceover_ivr").toLocaleString("he-IL");
  const promo = getExVat("voiceover_promo").toLocaleString("he-IL");
  return (
    `מרכזייה מ-${ivr} ₪ + מע״מ, סרטון תדמית מ-${promo} ₪ + מע״מ. ` +
    `מה לבדוק לפני שמזמינים, כמה תיקונים כלולים, ולמה זה נשמע מיושן.`
  );
}

const VOICEOVER_HUB: KnowledgeHub = {
  categoryId: "voiceover",
  heading: "איך העסק שלי נשמע בטלפון?",
  answer: buildVoiceoverHubAnswer(),
  metaDescription: buildVoiceoverHubMetaDescription(),
  groups: [
    {
      id: "why",
      title: "למה זה משנה",
      slugs: ["phone-voiceover-business", "professional-voiceover-for-business"],
    },
    {
      id: "before",
      title: "מה לבדוק לפני שמזמינים",
      slugs: ["voiceover-business-complaints", "commercial-voiceover-guide"],
    },
    {
      id: "more",
      title: "מה עוד אפשר להפיק לעסק",
      slugs: [
        "audio-branding-for-business",
        "corporate-content-studio-guide",
        "on-site-podcast-studio-business",
        "corporate-song-production-guide",
        "audiobook-recording-israel-guide",
        "vhs-tape-digitization-ai-guide",
      ],
    },
  ],
};

const HUBS: readonly KnowledgeHub[] = [STUDIO_HUB, VOICEOVER_HUB];

export function getKnowledgeHub(categoryId: string): KnowledgeHub | undefined {
  return HUBS.find((h) => h.categoryId === categoryId);
}
