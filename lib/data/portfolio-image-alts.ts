import { deriveHebrewAlt } from "@/lib/hebrew-image-alt";

/**
 * F-20 / F-36 / F-54 (ביקורת נגישות 7.10.2026): תיאורי תמונה כתובים ביד.
 *
 * ה-alt של גלריות השירותים נגזר משם הקובץ (deriveHebrewAlt). שם קובץ של מצלמה
 * או של כלי עריכה לא מתאר כלום: "leom9008", "00000img burst20200701191123548
 * cover scaled", "ננו בננה copy". גם שם באנגלית שתורגם חלקית נשאר מילה אחת
 * ("קונפטי" על חמש תמונות שונות, "תקליטן" על ארבע). ה-alt לא נשאר בקול הקורא:
 * הוא נקרא בשם הכפתור "פתח תמונה: ...", בכיתוב הגלוי מתחת לתמונה, בכיתוב של
 * הלייטבוקס ובכיתובי ה-ImageGallery ב-JSON-LD. כל משפט כאן נכתב אחרי שהתמונה
 * נצפתה בפועל, ומתאר מה רואים בה.
 *
 * המפתח הוא הנתיב היחסי מ-public/images/services, בלי / בהתחלה. מה שלא נמצא כאן
 * ממשיך להיגזר משם הקובץ, ואם הנגזר לא שמיש יוצא "תמונה מתיק העבודות - תמונה N".
 * לא משנים שמות קבצים: הכתובות מופיעות בבסיס ה-SEO.
 *
 * כלל מילים: ה-alt מוצג כ-figcaption גלוי, ו-audit:seo-diff נכשל על כל ירידה
 * במספר המילים בעמוד. לכן כל משפט כאן ארוך לפחות כמו ה-alt שהוא מחליף.
 * lib/data/portfolio-image-alts.test.ts שומר על הניסוח, על הייחודיות בתיקייה
 * ועל כך שהמפתחות מצביעים על קבצים שקיימים.
 */

/** קידומת הכתובת של תמונות השירותים; הנתיב היחסי הוא מה שאחריה. */
export const PORTFOLIO_IMAGES_URL_PREFIX = "/images/services/";

/** אותה תמונה (אותו md5) בכמה תיקיות מקבלת את אותו משפט, כדי שהניסוח לא יסתור בין עמודים. */
const SMOKE_COUPLE_SLOW_DANCE = "חתן וכלה רוקדים בענן עשן כבד נמוך מול האורחים";
const DUTY_FREE_LED_BOOTH = "עמדת לד אדומה עם מיתוג 102FM בכניסה לחנות דיוטי פרי בטרמינל";
const BLUE_LED_BOOTH_TERRACE = "עמדת DJ עם חזית לד כחולה זוהרת על מרפסת בערב";
const LED_FRONT_LOGO_DECK = "חזית לד עם הלוגו של יקיר כהן על עמדת DJ בבמת עץ";
const MOBILE_RADIO_STUDIO = "אולפן רדיו נייד מאחורי עמדת לד אדומה, מגישה ואיש עם אוזניות";
const MOBILE_BROADCAST_SHOWROOM = "עמדת שידור לד ניידת של 102FM באולם תצוגה של מכוניות";
const SMOKE_COUPLE_LED_BOOTH = "חתן וכלה רוקדים בענן עשן כבד מול עמדת DJ עם חזית לד";
const SMOKE_COUPLE_PURPLE = "חתן וכלה אוחזים ידיים ורוקדים בעשן כבד באור סגול";
const CONFETTI_PINK_BLUE_CROWD = "קהל רוקד תחת גשם קונפטי ורוד וכחול ותאורת במה";
const CONFETTI_GOLD_COUPLE = "זוג צוחק תחת ענן קונפטי זהוב ולבן באירוע בחוץ";

export const PORTFOLIO_IMAGE_ALTS: Readonly<Record<string, string>> = {
  /* academy: לפני ואחרי של חדר שהפך לאולפן ביתי */
  "academy/home-studio/לפני.webp":
    "לפני: חדר ריק עם רמקולי מוניטור, שולחן וכלי עבודה על הרצפה",
  "academy/home-studio/אחרי.webp":
    "אחרי: אותו חדר כאולפן ביתי עם פאנלים אקוסטיים ותאורה סגולה",
  "academy/music-production/60.1779100400862.kHJWpRp_Zll11-uQ_F4OhVWEKGmcUKGYHVPEM-jctnE.Vy8iMTdiYTgtMTllMWNhYzI1OWYi.webp":
    "איש מצביע על מסך הקלטה ליד קלידים, ומאחורי הזכוכית איש עם אוזניות",

  "dj-course/ידידיה קורס דיגיי גיל 50.webp":
    "גבר מחייך בחולצה שחורה ליד קונטרולר DJ מול לוגו יקיר כהן",

  /* אטרקציות: זיקוקים קרים */
  "events/attractions/cold-fireworks/Cold Spark Entrance Effect.webp":
    "שני עמודי ניצוצות קרים בכניסה ללובי מפואר עם רצפת שיש מבריקה",
  "events/attractions/cold-fireworks/Cold Spark Machine - Close-up.webp":
    "מכונת ניצוצות קרים שחורה עם לוגו יקיר כהן יורה עמוד ניצוצות",
  "events/attractions/cold-fireworks/Cold Sparkler Entrance.webp":
    "זוג בכניסה לאולם חשוך בין עמודי ניצוצות קרים משני הצדדים",
  "events/attractions/cold-fireworks/Sparklers Stage Setup.webp":
    "ארבעה עמודי ניצוצות קרים משני צידי עמדת DJ מול וילון בורדו",
  "events/attractions/cold-fireworks/Sparklers on Dance Floor.webp":
    "אורחים רוקדים בין עמודי ניצוצות קרים באולם עם נברשות",

  /* אטרקציות: תותח קונפטי */
  "events/attractions/confetti-cannon/Colorful Confetti Shower (1).webp": CONFETTI_PINK_BLUE_CROWD,
  "events/attractions/confetti-cannon/Colorful Confetti.webp": CONFETTI_GOLD_COUPLE,
  "events/attractions/confetti-cannon/Confetti Canon Blast.webp":
    "פיצוץ קונפטי זהוב גבוה באמצע רחבת ריקודים באולם מפואר",
  "events/attractions/confetti-cannon/Confetti_Hit.webp":
    "קהל מרים ידיים תחת מטר קונפטי צבעוני",
  "events/attractions/confetti-cannon/Confetti at Ceremony.webp":
    "קונפטי לבן יוצר קשת מעל המעבר בין הכיסאות בטקס עם פרחים לבנים",
  "events/attractions/confetti-cannon/חנן-בן-ארי-קונפטי-scaled.webp":
    "אדם עומד באולם חשוך מול מסך לד גדול בין פיסות קונפטי נופלות",
  "events/attractions/confetti-cannon/קונפטי-2.webp":
    "קונפטי נופל על קהל מרים ידיים בהופעה עם תאורת במה כחולה",

  /* אטרקציות: בלוני ענק */
  "events/attractions/giant-balloons/Ballroom Close Up Decor.webp":
    "אשכול בלונים כסופים ולבנים תלוי מתחת לתקרה מעוטרת באולם אירועים",
  "events/attractions/giant-balloons/Giant Balloons Dance Floor.webp":
    "ענן בלונים לבנים וכסופים מעל רחבת ריקודים באולם מפואר",
  "events/attractions/giant-balloons/בלוני ענק לרחבה(1).webp":
    "בלונים ענקיים צבעוניים מעל קהל מרים ידיים ברחבה",

  /* אטרקציות: עמדת לד. "כמדת" בשם הקובץ הוא טעות הקלדה של "עמדת" */
  "events/attractions/led-booth/102FM בטרמינל.webp": DUTY_FREE_LED_BOOTH,
  "events/attractions/led-booth/400120200453_289382.webp": BLUE_LED_BOOTH_TERRACE,
  "events/attractions/led-booth/IMG-20200706-WA0025.webp": LED_FRONT_LOGO_DECK,
  "events/attractions/led-booth/לד עמדה.webp": SMOKE_COUPLE_LED_BOOTH,
  "events/attractions/led-booth/עמדת לד 2.webp":
    "עמדת DJ עם חזית לד על במה נמוכה באולם אירועים עם שולחנות",
  "events/attractions/led-booth/עמדת לד2.jfif":
    "במה באולם אירועים עם מסכי לד ורצפה מבריקה, ולהקה על הבמה",
  "events/attractions/led-booth/עמדתלד 2.webp":
    "עמדת לד מציגה גרפיקת זיקוק כחול וסגול בחנות דיוטי פרי",
  "events/attractions/led-booth/עמדתשידור 102 FM.webp":
    "צוות שידור רדיו עם אוזניות ומיקרופונים מאחורי עמדת לד אדומה של 102FM",
  "events/attractions/led-booth/עמדת-לד-השכרות-1024x576.webp":
    "עמדת DJ שחורה על במה עם מסך לד ולוגו יקיר כהן באולם",
  "events/attractions/led-booth/כמדת שידור עמדת לד ניידת.webp": MOBILE_BROADCAST_SHOWROOM,

  /* אטרקציות: מכונת עשן כבד */
  "events/attractions/wedding-smoking-machine/אטרקציה - עשן עבד לאירוע.webp":
    "חתן וכלה מחובקים בענן עשן כבד תחת אורות במה",
  "events/attractions/wedding-smoking-machine/אפשרט עשן כבד באירועים.webp": SMOKE_COUPLE_PURPLE,
  "events/attractions/wedding-smoking-machine/כשן לסלואו.webp":
    "ריקוד סלואו של חתן וכלה בעשן כבד מתחת לתקרת פרחים תלויה",
  "events/attractions/wedding-smoking-machine/עשן כבד בדיחה.webp":
    "ענן עשן כבד על רחבת הריקודים באולם עם תאורת משושים",
  "events/attractions/wedding-smoking-machine/עשן כבד לחתונה(1).webp":
    "חתן עם כיפה וכלה מתחבקים בריקוד בתוך ענן עשן כבד",
  "events/attractions/wedding-smoking-machine/עשן-כבד-2-scaled.webp": SMOKE_COUPLE_SLOW_DANCE,

  /* ציוד: הקידומת dj- ו-eq- בשם הקובץ הייתה כל ה-alt ("תקליטן", "eq ...") */
  "events/equipment/dj-102FM בטרמינל.webp": DUTY_FREE_LED_BOOTH,
  "events/equipment/dj-400120200453_289382.webp": BLUE_LED_BOOTH_TERRACE,
  "events/equipment/dj-IMG-20200706-WA0025.webp": LED_FRONT_LOGO_DECK,
  "events/equipment/dj-אולפן 102FM - הקמת עמדת לד לאולפן רדיו נייד.webp": MOBILE_RADIO_STUDIO,
  "events/equipment/eq-מיקרופון להגברות מיוחדות.webp":
    "מיקרופון אולפן תלוי על זרוע מתכווננת על רקע כהה",
  "events/equipment/eq-מיקרופון שור לזמרים.webp":
    "מיקרופון ידני מקרוב על רקע מטושטש של אורות במה",

  "events/dj-events/כמדת שידור עמדת לד ניידת.webp": MOBILE_BROADCAST_SHOWROOM,

  "events/wedding-packages/Colorful Confetti Shower (1).webp": CONFETTI_PINK_BLUE_CROWD,
  "events/wedding-packages/Colorful Confetti.webp": CONFETTI_GOLD_COUPLE,

  "heavy-smoke/אפשרט עשן כבד באירועים.webp": SMOKE_COUPLE_PURPLE,
  "heavy-smoke/לד עמדה.webp": SMOKE_COUPLE_LED_BOOTH,
  "heavy-smoke/עשן-כבד-2-scaled.webp": SMOKE_COUPLE_SLOW_DANCE,

  /* צילום: שמות קבצים של מצלמה */
  "photography/wedding/LEOM9008.webp": "חתן וכלה עומדים יד ביד מתחת לגג קש",
  "photography/wedding/LEOM9080.webp": "חתן וכלה צועדים זה לצד זה ליד גדר שיחים",
  "photography/wedding/LMR52141.webp": "חתן וכלה מתחבקים בשדה קוצים יבשים מול הרים",
  "photography/wedding/LMR59054.webp":
    "חתן וכלה אוחזים ידיים ביציאה מקשת אבן, הכלה בשמלת סאטן לבנה",
  "photography/wedding/LMS02518.webp": "חתן וכלה מתחבקים ליד רכב כהה, הכלה אוחזת זר לבן",

  /* פודקאסט */
  "podcast/איזמירלי.webp":
    "אורח יושב על ספה באולפן פודקאסט מול קיר גרפיטי, בין מצלמה ומיקרופונים",
  "podcast/צילום על מסך ירוק.webp":
    "חיילת בלבוש צבאי מצולמת מול מסך ירוק, ליד מצלמה עם מיקרופון כיווני",
  "podcast/צילום על מסך ירוק 2.webp":
    "גבר יושב ליד שולחן ומדבר מול מסך ירוק ומצלמה על חצובה",
  "podcast/רודריגו-2.webp": "שני גברים צוחקים זה מול זה מול מיקרופונים בהקלטת פודקאסט",

  /* אולפן: הקלטת שיר */
  "studio/recording-song-modiin/00000IMG_00000_BURST20200701191123548_COVER-scaled.webp":
    "זמר עם אוזניות מנגן בגיטרה אקוסטית מול מיקרופון בתא הקלטה",
  "studio/recording-song-modiin/אולפן-ההקלטות-2-scaled.webp":
    "עמדת הפקה באולפן עם מסכים, מוניטור, קלידים וקירות בידוד אקוסטי",
  /* שתי תמונות כמעט זהות של אותה סצנה; הניסוחים שונים כדי שהכפתורים בגלריה לא יישמעו אותו דבר */
  "studio/recording-song-modiin/אולפן הקלטות בירושלים והסביבה.webp":
    "זמר מקליט בתא זכוכית עם אוזניות, ומפיק יושב ליד קלידים ומסך",
  "studio/recording-song-modiin/אולפן-הקלטות-בירושלים-והסביבה.webp":
    "מפיק במשקפיים מוחא כפיים ליד מסך הקלטה ומוניטור, וזמר מקליט מאחורי הזכוכית",

  "video/photo-slideshow/ננו בננה 2 copy.webp":
    "הקלטת פודקאסט באולפן עם כמה משתתפים סביב מיקרופונים על זרועות",

  /* קריינות. "קרינות" בשם הקובץ הוא טעות הקלדה של "קריינות" */
  "voiceover/קרינות באולפן.webp": "אדם מצולם מאחור ליד שני מסכי אודיו ושולחן סאונד באולפן",
};

/**
 * F-54: תיאור קצר של תמונת ההירו בכל פוסט בבלוג. התמונה היא אחת מ-26 תמונות
 * ממוחזרות, וה-alt הקודם היה כותרת הפוסט, כלומר אותו טקסט פעמיים ברצף
 * (ה-h1 ואחריו ה-alt). המפתח הוא ה-thumbnail של הפוסט כפי שהוא ב-blog.ts,
 * אותו מפתח של BLOG_OG_BY_THUMBNAIL. alt נשאר לא ריק, ולכן מספר התמונות עם
 * alt (imagesWithAlt ב-audit:seo-diff) לא משתנה.
 */
export const BLOG_THUMBNAIL_ALTS: Readonly<Record<string, string>> = {
  "/images/services/academy/music-production/אולפן-הקלטה-במודיעין-יקיר-כהן-הפקות.webp":
    "שני משתתפים מקליטים פודקאסט מול מיקרופונים וקיר גרפיטי צבעוני",
  "/images/services/academy/music-production/אולפני יקיר כהן הפקות פודקאסט.webp":
    "גבר יושב בכורסה באולפן פודקאסט עם מצלמה ומיקרופון",
  "/images/services/academy/music-production/אולפני-הקלטות.webp":
    "זמר עם אוזניות מקליט בתא הקלטה עם דף מילים ומיקרופון",
  "/images/services/academy/music-production/הקלטה באולפן.webp":
    "אישה עם אוזניות עומדת בתא הקלטה ליד מיקרופון",
  "/images/services/dj-course/ידידיה קורס דיגיי גיל 50.webp":
    "גבר מחייך ליד קונטרולר DJ באולפן",
  "/images/services/events/attractions/cold-fireworks/זיקוקים קרים לחופה.webp":
    "חתן וכלה עומדים פנים אל פנים בין עמודי ניצוצות קרים וענן עשן",
  "/images/services/events/attractions/confetti-cannon/קונפטי-לאירועים.webp":
    "זוג רוקד בין בלוני לב לבנים ומטר קונפטי",
  "/images/services/events/attractions/wedding-smoking-machine/עשן כבד לחתונה.webp":
    "חתן וכלה רוקדים בענן עשן כבד באולם עם וילונות לבנים",
  "/images/services/events/dj-events/אירוע חברה עם מיתוג.webp":
    "עמדת DJ עם חזית לד ופנסים נעים ליד בר באירוע",
  "/images/services/events/dj-events/עמדה ותאורה יקירכהן באירוע.webp":
    "עמדת DJ עם חזית לד, פנסים נעים ולייזר ירוק באוהל אירועים",
  "/images/services/events/dj-events/עמדת די גיי ותאורה.webp":
    "עמדת DJ שחורה עם מסך לד על במה באולם",
  "/images/services/events/equipment/eq-מיקרופון להגברות מיוחדות.webp":
    "מיקרופון אולפן תלוי על זרוע מתכווננת על רקע כהה",
  "/images/services/events/equipment/singer-amplification/מיקרופון שור לזמרים.webp":
    "מיקרופון ידני מקרוב על רקע מטושטש של אורות במה",
  "/images/services/events/wedding-packages/חבילת סלואו יקיר כהן הפקות.webp":
    "חתן וכלה רוקדים סלואו בעשן וקונפטי מול עמדת DJ",
  "/images/services/events/wedding-packages/שירים-לאירועים.webp":
    "קהל מרים מקלות אור מול במה מוארת בכחול",
  "/images/services/photography/wedding/LEOM9008.webp": "חתן וכלה עומדים יד ביד מתחת לגג קש",
  "/images/services/photography/wedding/LEOM9080.webp": "חתן וכלה צועדים זה לצד זה ליד גדר שיחים",
  "/images/services/podcast/רואה חשבון באולפן.webp":
    "אורח בחולצה לבנה מתראיין באולפן פודקאסט ליד מצלמה",
  "/images/services/studio/blessings/bride-groom-blessing/הקלטה באולפן.webp":
    "אישה עם אוזניות עומדת בתא הקלטה ליד מיקרופון",
  "/images/services/studio/hub/אולפן פודקאסט - יקיר כהן 1.webp":
    "אולפן פודקאסט ריק עם שתי כורסאות ומיקרופון על זרוע",
  "/images/services/studio/recording-song-modiin/אוהד בוזגלו מקליט.webp":
    "זמר עם אוזניות ומיקרופון בתא הקלטה, ומסך הקלטה בקדמת התמונה",
  "/images/services/studio/recording-song-modiin/מתחם יקיר כהן הפקות.webp":
    "פינת ישיבה באולפן עם שתי ספות שחורות, גיטרה ותופי קונגה",
  "/images/services/video/corporate-video/הקלטת ילד בר מצווה.webp":
    "נער עם אוזניות שר מול מיקרופון עם מסנן פופ בתא הקלטה",
  "/images/services/voiceover/מיקרופון קריינות.webp":
    "מיקרופון אולפן תלוי על זרוע מתכווננת על רקע כהה",
  "/images/services/voiceover/קרינות באולפן.webp":
    "אדם מצולם מאחור ליד שני מסכי אודיו ושולחן סאונד",
  "/images/studio.svg": "שלט ניאון עם השם יקיר כהן על קיר בידוד אקוסטי, לצד מיקרופון",
};

/**
 * ה-alt של תמונת שירות: משפט כתוב ביד אם יש, אחרת הנגזר משם הקובץ.
 * relPath הוא הנתיב מ-public/images/services (למשל "events/dj-events/x.webp").
 */
export function resolvePortfolioImageAlt(relPath: string, ordinal = 0): string {
  return PORTFOLIO_IMAGE_ALTS[relPath] ?? deriveHebrewAlt(relPath, ordinal);
}

/** ה-alt של תמונת ההירו בפוסט; undefined כשאין תמונה ידועה, והקורא נופל לברירת מחדל. */
export function blogThumbnailAlt(thumbnail: string): string | undefined {
  return BLOG_THUMBNAIL_ALTS[thumbnail];
}
