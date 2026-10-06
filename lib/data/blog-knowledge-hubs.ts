import { catalogWithVat, formatFromPriceDual, getExVat } from "@/lib/data/pricing-catalog";

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
  return formatted.replace(/^כרגע: מ-/, "").replace(/^מ-/, "");
}

function vatNis(exVat: number): string {
  return `${catalogWithVat(exVat).toLocaleString("he-IL")} ₪`;
}

/*
 * במיזוג main ל-feature/sales-fix (3.10.2026): התשובה נשענה על cover_song
 * (990, "שיר מוכן שכולל מיקס, מאסטרינג ותיקון זיופים"). לפי
 * OWNER-DECISIONS-2026-10-02.md הקלטת שיר היא song_recording, הקלטה, מיקס
 * ומאסטר, ותיקון זיופים תוספת. ברכה ושיר באותו מחיר בסיס, ולכן כשהם שווים
 * הם נאמרים במשפט אחד. מחיר לצרכן: כולל מע״מ קודם.
 */
export function buildStudioHubAnswer(): string {
  const blessingEx = getExVat("blessing_recording");
  const songEx = getExVat("song_recording");
  const opening =
    blessingEx === songEx
      ? `הקלטה באולפן מתחילה ב-${stripDualPrefix(formatFromPriceDual(songEx))}, ` +
        `לברכה, דרשה או אמירה ולשיר מוכן עם מיקס ומאסטר. `
      : `הקלטה באולפן מתחילה ב-${stripDualPrefix(formatFromPriceDual(blessingEx))} לברכה, דרשה או אמירה, ` +
        `ו-${stripDualPrefix(formatFromPriceDual(songEx))} לשיר מוכן עם מיקס ומאסטר. `;
  return (
    opening +
    `תיקון זיופים עם טכנאי שמכוון ומנחה הוא תוספת. ` +
    `מה שמזיז את המחיר הוא רמת הגימור, אורך ההקלטה, כמה אנשים מקליטים ואילו תוספות בוחרים. ` +
    `אפשר גם לצלם את ההקלטה לרשתות. ` +
    `לפני שמתחילים נבין מה אתם רוצים ליצור, ורק אז נגיד מחיר.`
  );
}

export function buildStudioHubMetaDescription(): string {
  const blessingEx = getExVat("blessing_recording");
  const songEx = getExVat("song_recording");
  const prices =
    blessingEx === songEx
      ? `ברכה או שיר מוכן מ-${vatNis(songEx)} כולל מע״מ. `
      : `ברכה מ-${vatNis(blessingEx)} כולל מע״מ, שיר מוכן מ-${vatNis(songEx)} כולל מע״מ. `;
  return prices + `מה מזיז את המחיר, מה אפשר לעשות לבד, ומתי אולפן לא שווה את זה.`;
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
        "headphones-purpose-guide",
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
        "songs-for-grandparents",
        "songs-for-parents",
        "songs-for-spouse",
        "bar-mitzvah-song-recording-guide",
        "bar-mitzvah-speech",
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
    `ב-${brand} ₪ לפני מע״מ. מה שקובע את התוצאה הוא הטון שנבחר, לא הציוד.`
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

export function buildEventsHubAnswer(): string {
  return (
    "DJ טוב הוא מי שנהנה מכל סוג של מוזיקה, כי מי שרע לו לא יכול לעשות שמח. " +
    "תשאלו אותו אילו ז'אנרים הוא אוהב, ותבדקו אם הוא נהנה גם מקלאסית " +
    "ומאפריקאית, כי שם לומדים לשלוט בקצב. ושאלו מי מגיע בפועל, מה קורה " +
    "אם הוא חולה, ומה הגיבוי לציוד."
  );
}

export function buildEventsHubMetaDescription(): string {
  /* אירועים הם צרכן: כולל מע״מ (החלטת הבעלים 2.10.2026) */
  const dj = vatNis(getExVat("dj_premium"));
  const attraction = vatNis(getExVat("event_attraction_1"));
  return (
    `תקליטן מהצוות מ-${dj} כולל מע״מ, אטרקציה בודדת מ-${attraction} כולל מע״מ. ` +
    `איזו מוזיקה הוא צריך לאהוב, מה לשאול לפני שחותמים, ומתי גם DJ טוב לא יציל.`
  );
}

const EVENTS_HUB: KnowledgeHub = {
  categoryId: "events",
  heading: "איך אני יודע שהוא טוב?",
  answer: buildEventsHubAnswer(),
  metaDescription: buildEventsHubMetaDescription(),
  groups: [
    {
      id: "choose",
      title: "איך בוחרים, ומה לשאול",
      slugs: [
        "wedding-dj-selection-guide-2026",
        "5-things-before-choosing-wedding-dj",
        "dj-selection-guide-events",
        "how-to-choose-wedding-dj-israel",
      ],
    },
    {
      id: "cost",
      title: "כמה זה עולה",
      slugs: ["dj-for-bar-mitzvah-cost", "cheap-dj-for-a-wedding"],
    },
    {
      id: "effects",
      title: "אפקטים: מה שווה את הכסף",
      slugs: [
        "wedding-effects-what-worth-it",
        "wedding-smoke-machine-guide",
        "heavy-smoke-vs-light-smoke-events",
        "cold-fireworks-events",
        "confetti-cannon-events-guide",
        "giant-balloons-for-events",
      ],
    },
    {
      id: "music",
      title: "המוזיקה עצמה",
      slugs: ["wedding-songs-chuppah", "wedding-slow-songs", "reception-songs", "bat-mitzvah-songs", "tips-for-perfect-wedding"],
    },
    {
      id: "by-event",
      title: "לפי סוג האירוע",
      slugs: [
        "memorial-ceremony-songs","corporate-event-dj-guide", "dj-summer-weddings-2026"],
    },
    {
      id: "vendors",
      title: "שאר הספקים באירוע",
      slugs: [
        "wedding-photography-and-sound-guide",
        "wedding-photography-guide",
        "event-filming-guide",
        "live-singer-sound-engineer-guide",
      ],
    },
    {
      id: "booking",
      title: "הזמנה מהאתר",
      slugs: ["events-booking-guide", "singer-amplification-booking"],
    },
  ],
};

export function buildEditingHubAnswer(): string {
  const noise = getExVat("ai_noise_basic").toLocaleString("he-IL");
  const restore = getExVat("ai_voice_restore").toLocaleString("he-IL");
  const pitch = getExVat("studio_pitch_correction").toLocaleString("he-IL");
  return (
    `ניקוי רעשים בסיסי מתחיל ב-${noise} ₪ לפני מע״מ, שחזור קול מלא ב-${restore} ₪, ` +
    `ותיקון זיופים ב-${pitch} ₪. מה שקובע את המחיר הוא מצב הקובץ, לא אורכו. ` +
    `רעש אפשר להוריד והד אפשר לצמצם, אבל עיוות ודחיסה מחקו מידע שאי אפשר להמציא. ` +
    `שלחו קובץ לבדיקה לפני שמשלמים.`
  );
}

export function buildEditingHubMetaDescription(): string {
  const noise = getExVat("ai_noise_basic").toLocaleString("he-IL");
  const restore = getExVat("ai_voice_restore").toLocaleString("he-IL");
  return (
    `ניקוי רעשים מ-${noise} ₪ + מע״מ, שחזור מלא מ-${restore} ₪ + מע״מ. ` +
    `מה אפשר להציל, מה נמחק ולא חוזר, ואיך יודעים לפני שמשלמים.`
  );
}

const EDITING_HUB: KnowledgeHub = {
  categoryId: "editing",
  heading: "כמה עולה להציל הקלטה גרועה?",
  answer: buildEditingHubAnswer(),
  metaDescription: buildEditingHubMetaDescription(),
  groups: [
    {
      id: "what-can-be-saved",
      title: "מה אפשר להציל, ומה כבר לא",
      slugs: [
        "rescue-damaged-recording",
        "fix-phone-recording-noise",
        "when-ai-audio-restoration-enough",
        "ai-audio-restoration-real-examples",
      ],
    },
    {
      id: "old-or-noisy",
      title: "הקלטה ישנה או מרועשת",
      slugs: ["ai-audio-restoration-guide", "sound-recovery-ai-podcast"],
    },
    {
      id: "off-pitch",
      title: "הקול לא מדויק",
      slugs: [
        "vocal-tuning-for-everyone",
        "pitch-correction-guide",
        "pitch-correction-vs-autotune",
      ],
    },
    {
      id: "not-finished",
      title: "הקובץ תקין אבל לא גמור",
      slugs: ["mixing-mastering-explained"],
    },
    {
      id: "how-it-works",
      title: "איך השירות עובד, ומה לבדוק",
      slugs: ["how-online-audio-service-works", "online-audio-service-complaints"],
    },
  ],
};

export function buildPodcastHubAnswer(): string {
  const pilot = getExVat("podcast_pilot").toLocaleString("he-IL");
  const video = getExVat("podcast_video").toLocaleString("he-IL");
  const editing = getExVat("podcast_editing_hour").toLocaleString("he-IL");
  return (
    `מתחילים בשמונה נושאים על דף, לא במיקרופון. אם יש לכם מספיק מה להגיד, ` +
    `קובעים סשן, מקליטים, ושולחים לעריכה. פיילוט אודיו מתחיל ב-${pilot} ₪ ` +
    `לפני מע״מ, פרק וידאו ב-${video} ₪, ועריכה בלבד ב-${editing} ₪ לשעה. ` +
    `מה שמחזיק פודקאסט הוא לוח זמנים ולא ציוד, ואם אין לכם שמונה נושאים ` +
    `עדיף לכתוב בלוג.`
  );
}

export function buildPodcastHubMetaDescription(): string {
  const pilot = getExVat("podcast_pilot").toLocaleString("he-IL");
  const video = getExVat("podcast_video").toLocaleString("he-IL");
  return (
    `פיילוט אודיו מ-${pilot} ₪ + מע״מ, פרק וידאו מ-${video} ₪ + מע״מ. ` +
    `האם שווה לכם בכלל, אולפן או מהבית, ומתי צריך עריכה מקצועית.`
  );
}

const PODCAST_HUB: KnowledgeHub = {
  categoryId: "podcast",
  heading: "איך פודקאסט עובד, מהרעיון עד הפרק הראשון?",
  answer: buildPodcastHubAnswer(),
  metaDescription: buildPodcastHubMetaDescription(),
  groups: [
    {
      id: "worth-it",
      title: "האם שווה לכם בכלל",
      slugs: [
        "podcast-for-small-business-worth-it",
        "business-podcast-roi-2026",
        "first-podcast-without-wasting-money",
      ],
    },
    {
      id: "where",
      title: "אולפן או מהבית",
      slugs: ["podcast-studio-vs-home-recording", "prepare-voice-podcast-studio"],
    },
    {
      id: "editing",
      title: "מתי צריך עריכה, ומה לבדוק",
      slugs: [
        "podcast-needs-professional-editing",
        "podcast-editing-complaints",
        "zoom-call-to-radio-quality",
      ],
    },
    {
      id: "full-guide",
      title: "מהרעיון עד הפרק הראשון",
      slugs: ["podcast-production-guide-israel"],
    },
    {
      id: "booking",
      title: "הזמנה מהאתר",
      slugs: ["podcast-booking-guide"],
    },
  ],
};

export function buildAcademyHubAnswer(): string {
  const lesson = getExVat("academy_private_hour").toLocaleString("he-IL");
  const pro = getExVat("academy_pro_session").toLocaleString("he-IL");
  const ulpan = getExVat("ulpan_monthly").toLocaleString("he-IL");
  return (
    `אפשר ללמוד שלושה דברים: תקלוט והפקה, דיבור מול קהל למי שמגמגם או חושש, ` +
    `ועברית. שיעור פרטי מתחיל ב-${lesson} ₪ לפני מע״מ, Pro Session של 90 דקות ` +
    `ב-${pro} ₪, ומסלול אולפן עברית חודשי ב-${ulpan} ₪. ` +
    `אני לא מקבל כל אחד, אני עובד עם מי שבא לעבוד.`
  );
}

export function buildAcademyHubMetaDescription(): string {
  const lesson = getExVat("academy_private_hour").toLocaleString("he-IL");
  const ulpan = getExVat("ulpan_monthly").toLocaleString("he-IL");
  return (
    `שיעור פרטי מ-${lesson} ₪ + מע״מ, אולפן עברית מ-${ulpan} ₪ + מע״מ. ` +
    `קורס DJ או שיעור פרטי, דיבור מול קהל, ולימוד עברית במודיעין.`
  );
}

const ACADEMY_HUB: KnowledgeHub = {
  categoryId: "academy",
  heading: "מה אפשר ללמוד אצלי?",
  answer: buildAcademyHubAnswer(),
  metaDescription: buildAcademyHubMetaDescription(),
  groups: [
    {
      id: "dj",
      title: "תקלוט והפקה",
      slugs: ["dj-course-guide", "dj-course-vs-private-lesson"],
    },
    {
      id: "speech",
      title: "דיבור מול קהל",
      slugs: ["no-speech-therapist-modiin"],
    },
    {
      id: "hebrew",
      title: "לימוד עברית",
      slugs: ["hebrew-tutor-modiin-guide", "street-hebrew-vs-government-ulpan"],
    },
  ],
};

const HUBS: readonly KnowledgeHub[] = [
  STUDIO_HUB,
  VOICEOVER_HUB,
  EVENTS_HUB,
  EDITING_HUB,
  PODCAST_HUB,
  ACADEMY_HUB,
];

export function getKnowledgeHub(categoryId: string): KnowledgeHub | undefined {
  return HUBS.find((h) => h.categoryId === categoryId);
}
