/**
 * Legacy URL redirects (301 via next.config).
 *
 * SEO policy:
 * - **Active indexable pages** live only at canonical paths (see sitemap.ts).
 * - Redirects here are for **old inbound URLs** (Google Sites, analytics) or
 *   **true duplicates** - never to replace a page that should rank on its own.
 * - Do not add redirects between two URLs that both have full content.
 */

import { CANONICAL_REDIRECTS } from "./site-architecture";
import { SITE_URL } from "./site-url";

export type LegacyRedirect = {
  source: string;
  destination: string;
  permanent: true;
};

/** Map legacy path canonical path (before prefix rules) */
const LEGACY_PATH_MAP: Record<string, string> = {
  /**
   * כפילות אמיתית. שני פוסטים כיסו את אותה שאילתה בדיוק, ושניהם קצרים.
   * מוזג ב-2.10.2026 בהחלטת הבעלים: התוכן הייחודי עבר לפוסט ששרד,
   * ובלוק המחירים של זה שנמחק לא עבר כי הוא סתר את pricing-catalog
   * (500-1,400 מול external_mix_master = 1,750).
   */
  "/blog/mixing-vs-mastering-explained": "/blog/mixing-mastering-explained",
  /** Google Sites / קישורים ישנים - דף הבית הקנוני הוא `/` בלבד */
  "/home": "/",
  /** טופס העלאה שמעולם לא חובר לאחסון. הופנה לוואטסאפ, שם החומרים באמת מגיעים. */
  "/studio/upload":
    "https://wa.me/972587555456?text=%D7%A9%D7%9C%D7%95%D7%9D%2C%20%D7%A8%D7%95%D7%A6%D7%94%20%D7%9C%D7%A9%D7%9C%D7%95%D7%97%20%D7%97%D7%95%D7%9E%D7%A8%D7%99%20%D7%92%D7%9C%D7%9D%20%D7%9C%D7%A4%D7%A8%D7%95%D7%99%D7%A7%D7%98",
  "/recording": "/studio",
  "/studio-main": "/studio",
  "/online-studio": "/online",
  "/podcast-pricing": "/podcast",
  "/recording-studio": "/studio/recording-studio",
  "/studio-recording": "/studio/recording-studio",
  "/studio/blessings/studio-blessings": "/studio/blessings",
  "/studio/mobile-studio/home-phone-blessings": "/studio/blessings#home-recording",
  "/stuttering-treatment": "/clinic",
  "/stuttering-therapy": "/stuttering",
  "/academy-music": "/academy",
  "/bride-blessing": "/studio/blessings",
  "/groom-blessing": "/studio/blessings",
  "/photo-slider": "/photo-slideshow",
  "/podcast/podcast-studio/modiin-podcast-studio": "/podcast/podcast-studio-modiin",
  "/podcast/podcast-pricing": "/podcast",
  "/contact/whatsapp": "/contact",
  "/order": "/book",
  "/booking": "/book",
  "/book-studio": "/book",
  "/studio-booking": "/book",
  "/price": "/pricing",
  "/prices": "/pricing",
  "/pricing-page": "/pricing",
  "/מחירון": "/pricing",
  "/faq": "/about/faq",
  "/questions": "/about/faq",
  "/שאלות-נפוצות": "/about/faq",
  "/מונחון": "/glossary",
  "/online/online-pricing": "/online/online-ai-pricing",
  "/academy/ai-music.html": "/academy/ai-music",
  "/voucher": "/shop#vouchers",
  "/gift-card": "/shop#vouchers",
  "/gift-voucher": "/shop#vouchers",
  "/orders": "/shop#vouchers",
  "/equipment/used-gear": "/shop#used-gear",
  "/voice-over": "/voiceover",
  "/for-business": "/business",
  "/dj-events": "/events/dj-events",
  "/wedding-songs": "/blog/wedding-songs-chuppah",
  "/weddings-songs": "/blog/wedding-songs-chuppah",
  "/chupa": "/blog/wedding-songs-chuppah",
  "/chuppa": "/blog/wedding-songs-chuppah",
  "/bride": "/blog/wedding-songs-chuppah",
  "/groom": "/blog/wedding-songs-chuppah",
  "/wedding": "/blog/wedding-songs-chuppah",
  "/weddings": "/blog/wedding-songs-chuppah",
  "/חתונה": "/blog/wedding-songs-chuppah",
  "/כלה": "/blog/wedding-songs-chuppah",
  "/חתן": "/blog/wedding-songs-chuppah",
  "/שירים-לחתונה": "/blog/wedding-songs-chuppah",
  "/שיר-כניסה-לחופה": "/blog/wedding-songs-chuppah",
  /* היה מופנה לפוסט על שירי חתונה (PJ-34), ואחר כך זמנית לקטגוריית האירועים
     (ED-05). מ-4.10.2026 יש פוסט ייעודי שמאחד את ארבע הגרסאות של המאמר הישן. */
  "/שירים-לבת-מצווה-2": "/blog/bat-mitzvah-songs",
  "/bride-groom-blessing": "/studio/blessings/bride-groom-blessing",
  "/bar-mitzvah-clip": "/studio/blessings/video-clip",
  "/video/bar-mitzvah-clip": "/studio/blessings/video-clip",
};

/**
 * WordPress/WooCommerce migration redirects.
 * The site migrated from WP+WooCommerce to Next.js - these catch all the
 * old URL patterns that Google had indexed under the previous platform.
 */
/**
 * נתיבי WordPress מתים שמקבלים 410 Gone ב-proxy.ts ולא 301.
 *
 * למה: הפניה המונית של מאות כתובות מוצר שאינן קשורות לעמוד יחיד נחשבת אצל גוגל
 * soft 404, ולכן 1,030 העמודים "נסרקו ולא באינדקס" עלו במקום לרדת. 410 אומר
 * לגוגל שהתוכן הוסר לצמיתות, וזה מוציא אותו מתור הסריקה תוך שבועות.
 *
 * חשוב לסדר: redirects מ-next.config רצים לפני ה-proxy (שלב 2 מול שלב 3 בתיעוד
 * של Next 16), ולכן הדפוסים האלה חייבים לא להופיע ב-WORDPRESS_PATTERNS. אחרת
 * ה-301 תופס ראשון וה-410 לעולם לא נבדק.
 *
 * הרשימה משוכפלת כליטרל ב-proxy.ts כי Next דורש שה-matcher יהיה סטטי.
 */
export const GONE_PATH_PREFIXES = [
  "/product",
  "/product-tag",
  "/product-category",
  "/category",
  "/tag",
  /* /shop-2 עצמו מקבל 308 אל /shop ב-proxy.ts, כי יש לו מקבילה אמיתית.
     רק העומק מתחתיו מקבל 410. אל תגזרו את ההתנהגות מהרשימה הזו בלבד. */
  "/shop-2",
  "/wp-admin",
  "/wp-content",
  "/wp-json",
] as const;

/**
 * פרמטר עגלת WooCommerce שגוגל עדיין סורק מהאתר הישן (775 מתוך 1,000 השורות
 * בדוח "נסרק ולא באינדקס", ED-12). proxy.ts מפנה פעם אחת לאותו נתיב בלי
 * query בכלל: שאר הפרמטרים בכתובות האלה הם שרידי עגלה וקמפיין ישן
 * (quantity, fbclid, utm), ואין בהם ערך שמצדיק עוד גרסה של אותו עמוד.
 *
 * מחזיר true אם הפרמטר היה שם וה-query נוקה, false אם לא נגעו בכתובת.
 * מקבל כל אובייקט עם searchParams ו-search, כלומר גם URL וגם NextURL.
 */
/**
 * חריגים מה-410: כתובות מוצר ישנות שהביאו קליקים ויש להן עמוד מקביל אמיתי.
 * כמו /shop-2, הן מקבלות 308 ב-proxy.ts ולא 410. כל השאר תחת /product ממשיך
 * לקבל 410, כי ההנמקה למעלה נגד הפניה המונית לעמוד לא קשור לא השתנתה.
 *
 * המקור: Search Console, ישראל, 16 חודשים עד 29.9.2026 (נקרא 4.10.2026). נכנסו
 * רק כתובות עם 3 קליקים ומעלה שיש להן עמוד באותו נושא. המספר בהערה הוא הקליקים.
 *
 * זוגות ולא אובייקט: זו לא הפניה של next.config, ולכן audit-proxy-gone לא צריך
 * לראות כאן "מקור 301" שמצל על ה-410. הנתיבים לא מקודדים, ו-goneEquivalent
 * מפענח את ה-pathname לפני ההשוואה.
 */
const GONE_EQUIVALENT_PAIRS: ReadonlyArray<readonly [string, string]> = [
  ["/product/קורס-די-גיי-פרטי", "/academy/dj-course"], // 29
  ["/product/תותח-קונפטי-לאירועים", "/events/attractions/confetti-cannon"], // 27
  ["/product/צילום-פודקאסט", "/podcast/podcast-recording"], // 15
  ["/product/חבילת-סושיאל", "/business/social-media"], // 8
  ["/product/עמדת-דיגיי-לד-להשכרה", "/events/stage-led-dj"], // 6
  ["/product/חבילות-אטרקציות-לחתונה-חבילה-2", "/events/wedding-attractions-packages"], // 6
  ["/product/תקליטן-לאירוע-קטן", "/events/dj-events"], // 4
  /* נוספה ידנית, בלי נתון קליקים: קישור חי אליה נחת על 410 (הבעלים, 14.10.2026). */
  ["/product/תקליטן-לאירועים", "/events/dj-events"],
  /* 15.10.2026, אישור הבעלים: עוד מוצרים ישנים מהארכיון (Wayback) שהחזירו 410, עם עמוד באותו נושא. בלי נתון קליקים. */
  ["/product/2-זיקוקים-קרים-בכניסה", "/events/attractions/cold-fireworks"],
  ["/product/4-זיקוקים-קרים-בכניסה", "/events/attractions/cold-fireworks"],
  ["/product/6-זיקוקים-קרים-2", "/events/attractions/cold-fireworks"],
  ["/product/podcast-with-grandpa", "/podcast/podcast-with-grandpa"],
  ["/product/בועות-סבון-לאירוע", "/events/attractions/bubble-machine"],
  ["/product/בועות-סבון-לאירועים", "/events/attractions/bubble-machine"],
  ["/product/בלוני-ענק-לאירועים", "/events/attractions/giant-balloons"],
  ["/product/בלוני-ענק-לרחבה-כי-חגיגה-אמיתית-צריכה", "/events/attractions/giant-balloons"],
  ["/product/בלונים-מתפוצצים-בסלואו", "/events/attractions/giant-balloons"],
  ["/product/הפעלה-נוספת-של-תותח-קונפטי", "/events/attractions/confetti-cannon"],
  ["/product/הפקת-שיר-מקורי", "/studio/original-song"],
  ["/product/הקלטת-ברכות-לאירוע", "/studio/blessings"],
  ["/product/הקלטת-קליפ-באולפן", "/studio/blessings/video-clip"],
  ["/product/הקלטת-קליפ-באולפן-משפחה", "/studio/blessings/video-clip"],
  ["/product/הקלטת-שיר-מסלול-בסיסי", "/studio/recording-song-modiin"],
  ["/product/חבילת-הזיכרונות-הבלתי-נשכחים-מצגת-ת", "/photo-slideshow"],
  ["/product/חבילת-שיר-לאירוע", "/studio/recording-song-modiin"],
  ["/product/מיקס-מאסטרינג-לשירה-ביתית-חובבנית", "/online/vocal-fix/mixing"],
  ["/product/מכונת-בועות-סבון-עשן-שירות-הפעלה-לאירו", "/events/attractions/bubble-machine/smoke-bubble-machine-events"],
  ["/product/מצגת-תמונות-לאירוע", "/photo-slideshow"],
  ["/product/מצגת-תמונות-לאירוע-ai-בינה-מלאכותית-הפכ", "/photo-slideshow"],
  ["/product/עמדת-דיגיי-לד-לאירועים", "/events/stage-led-dj"],
  ["/product/עמדת-דיגיי-להשכרה", "/events/stage-led-dj"],
  ["/product/עשן-כבד-לאולם-קטן", "/events/attractions/wedding-smoking-machine/heavy-smoke-large-events"],
  ["/product/עשן-כבד-לאירועים-גדולים", "/events/attractions/wedding-smoking-machine/heavy-smoke-large-events"],
  ["/product/עשן-כבד-לסלואו", "/events/attractions/wedding-smoking-machine"],
  ["/product/ציוד-הגברה-מקצועי", "/events/equipment"],
  ["/product/צרו-את-הלחן-המושלם-לשיר-שלכם", "/studio/original-song"],
  ["/product/קריינות-לטלפון", "/business/professional-voiceover"],
  ["/product/קריינות-לסט-חבילה-5-משפטים", "/events/dj/voice-tags"],
  ["/product/שיפור-סאונד-הקלטה", "/online/vocal-fix"],
  ["/product/שיר-מקורי-ליום-ההולדת", "/studio/original-song"],
  ["/product/תוספת-בלוני-ענק-לאירוע", "/events/attractions/giant-balloons"],
  ["/product/תקליטן-מומלץ-לחתונה", "/events/dj-events"],
  ["/product/שיפור-איכות-הקלטה", "/online/vocal-fix"], // 4
  ["/product/הקלטת-שיר-באולפן-מסלול-חוויה", "/studio/recording-song-modiin"], // 3
  ["/product/2-רובי-עשן-לאירועים", "/events/attractions/smoke-cannons-for-events"], // 3
  /* 16.10.2026, אישור הבעלים לפי ההמלצה: הכתובות הסבירות (נושא קרוב, לא זהה). */
  ["/product/2-תותחי-עשן", "/events/attractions/smoke-cannons-for-events"],
  ["/product/4-תותחי-עשן", "/events/attractions/smoke-cannons-for-events"],
  ["/product/8-תותחי-עשן", "/events/attractions/smoke-cannons-for-events"],
  ["/product/אקדח-עשן-לאירועים", "/events/attractions/smoke-cannons-for-events"],
  ["/product/אקדח-קור", "/events/attractions/smoke-cannons-for-events"],
  ["/product/הוספת-אפקטים-לקריינות-שלכם-עם-אפקטים", "/voiceover"],
  ["/product/הפקת-סרטון-ויראלי", "/video"],
  ["/product/זמר-מפיק-די-גיי-הכל-מתחיל-כאן-שיעורים", "/academy/dj-course"],
  ["/product/חבילות-אטרקציות-לחתונה-חבילה-1", "/events/wedding-attractions-packages"],
  ["/product/חבילת-אטרקציות-לאירועים", "/events/wedding-attractions-packages"],
  ["/product/חבילת-פלייבק-מושלם", "/studio/recording-song-modiin"],
  ["/product/סטודיו-לצילום-במודיעין-הנציחו-את-הרגע", "/photography"],
  ["/product/פודקאסט-מצולם-עם-רון-נשר-תיאום-אישי-ד", "/podcast"],
  ["/product/צילום-קורסים-מקצועי-הפכו-את-הידע-שלכם", "/video/corporate-video"],
  ["/product/קורס-די-גיי-פרטי-2", "/academy/dj-course"],
  ["/product/קורס-פאנטון", "/voiceover/course"],
  ["/product/קריינות-בעברית", "/voiceover"],
  ["/product/קריינות-לכל-סוגי-האירועים", "/voiceover"],
  ["/product/קריינות-מקצועית-ומשכנעת", "/voiceover"],
  ["/product/קריינות-מקצועית-לסט", "/events/dj/voice-tags"],
  ["/product/קריינות-מקצועית-לסט-די-גיי-שלך-10-משפטים", "/events/dj/voice-tags"],
  ["/product/רובה-עשן-לאירועים", "/events/attractions/smoke-cannons-for-events"],
  ["/product/שיעור-10-למתקדמים", "/academy/dj-course"],
  ["/product/שיעור-2", "/academy/dj-course"],
  ["/product/שיעור-3", "/academy/dj-course"],
  ["/product/שיעור-4", "/academy/dj-course"],
  ["/product/שיעור-5", "/academy/dj-course"],
  ["/product/שיעור-6", "/academy/dj-course"],
  ["/product/שיעור-7", "/academy/dj-course"],
  ["/product/שיעור-8", "/academy/dj-course"],
  ["/product/שיעור-9", "/academy/dj-course"],
  ["/product/תותחי-עשן", "/events/attractions/smoke-cannons-for-events"],
];

const GONE_EQUIVALENTS = new Map(GONE_EQUIVALENT_PAIRS);

/** יעד מקביל לכתובת שאחרת הייתה מקבלת 410, או null. מקבל pathname מקודד או לא. */
export function goneEquivalent(pathname: string): string | null {
  let path = pathname.replace(/\/+$/, "");
  try {
    path = decodeURIComponent(path);
  } catch {
    return null;
  }
  return GONE_EQUIVALENTS.get(path) ?? null;
}

/**
 * 15.10.2026, אישור הבעלים: כתובות מהאתר הישן (Wayback) שנחתו על אינדקס הבלוג או
 * החזירו 404, ויש להן עמוד באותו נושא. כשלכתובת בלי התאריך כבר יש יעד במפה, היעד זהה לו.
 * כתובות בלי מקביל נשארות 404. ההצעות שלא אושרו: seo-handoff/old-urls-redirect-proposal-2026-10-15.csv
 *
 * למה ב-proxy ולא ב-next.config: Vercel מגביל ל-1,024 הפניות, וכל מקור בעברית נספר
 * פעמיים (withLowercaseHexTwin). 304 הכתובות האלה היו מביאות את הספירה ל-1,357.
 * ב-proxy זו טבלה אחת, ו-decodeURIComponent מכסה hex גדול וקטן ממילא.
 * כתובות שמתחילות באותיות לטיניות (asp, /Video) נשארו ב-WAYBACK_404_EQUIVALENTS,
 * כי ה-matcher של ה-proxy תופס רק נתיבים שמתחילים בעברית ונתיבי שנה.
 */
const WAYBACK_PROXY_PAIRS: ReadonlyArray<readonly [string, string]> = [
  ["/2019/07/22/תקליטן-בזכרון-יעקב", "/events/dj-events"],
  ["/2019/07/22/תקליטן-בחיפה", "/events/dj-events"],
  ["/2019/07/22/תקליטן-בטבריה", "/events/dj-events"],
  ["/2019/07/22/תקליטן-בנתניה", "/events/dj-events"],
  ["/2019/07/22/תקליטן-בצפון", "/events/dj-events"],
  ["/2019/07/22/תקליטן-לחתונה-בשרון", "/events/dj-events"],
  ["/2019/07/22/תקליטן-מהצפון", "/events/dj-events"],
  ["/2019/07/23/די-גיי-בתל-אביב", "/events/dj-events"],
  ["/2019/07/23/תקליטן-באשדוד", "/events/dj-events"],
  ["/2019/07/23/תקליטן-בבאר-שבע", "/events/dj-events"],
  ["/2019/07/23/תקליטן-בבית-שמש", "/events/dj-events"],
  ["/2019/07/23/תקליטן-בבת-ים", "/events/dj-events"],
  ["/2019/07/23/תקליטן-בגבעתיים", "/events/dj-events"],
  ["/2019/07/23/תקליטן-בגן-יבנה", "/events/dj-events"],
  ["/2019/07/23/תקליטן-בדרום", "/events/dj-events"],
  ["/2019/07/23/תקליטן-בהוד-השרון", "/events/dj-events"],
  ["/2019/07/23/תקליטן-בהרצליה", "/events/dj-events"],
  ["/2019/07/23/תקליטן-בחולון", "/events/dj-events"],
  ["/2019/07/23/תקליטן-ביהוד", "/events/dj-events"],
  ["/2019/07/23/תקליטן-בירושלים", "/dj-events/cities/jerusalem"],
  ["/2019/07/23/תקליטן-במודיעין", "/events/dj-events"],
  ["/2019/07/23/תקליטן-במרכז", "/events/dj-events"],
  ["/2019/07/23/תקליטן-בערד", "/events/dj-events"],
  ["/2019/07/23/תקליטן-בפתח-תקווה", "/events/dj-events"],
  ["/2019/07/23/תקליטן-בקרית-אונו", "/events/dj-events"],
  ["/2019/07/23/תקליטן-בקרית-גת", "/events/dj-events"],
  ["/2019/07/23/תקליטן-ברחובות", "/dj-events/cities/rehovot"],
  ["/2019/07/23/תקליטן-ברמת-גן", "/events/dj-events"],
  ["/2019/07/23/תקליטן-ברמת-השרון", "/events/dj-events"],
  ["/2019/07/23/תקליטן-ברעננה", "/events/dj-events"],
  ["/2019/07/23/תקליטן-בתל-אביב", "/events/dj-events"],
  ["/2019/07/23/תקליטן-לחינה-בירושלים", "/dj-events/cities/jerusalem"],
  ["/2019/07/23/תקליטן-לחתונה-באשקלון", "/events/dj-events"],
  ["/2019/07/24/dj-בחתונה", "/events/dj-events"],
  ["/2019/07/24/dj-דתי", "/events/dj-events"],
  ["/2019/07/24/dj-חרדי", "/events/dj-events"],
  ["/2019/07/24/dj-לאירוע", "/events/dj-events"],
  ["/2019/07/24/dj-לחתונה", "/events/dj-events"],
  ["/2019/07/24/די-ג-יי-לחתונה", "/events/dj-events"],
  ["/2019/07/24/די-גיי-במבצע", "/events/dj-events"],
  ["/2019/07/24/די-גיי-יקיר-כהן", "/events/dj-events"],
  ["/2019/07/24/די-גיי-לאירועים", "/events/dj-events"],
  ["/2019/07/24/די-גיי-לחתונה", "/events/dj-events"],
  ["/2019/07/24/די-גיי-לחתונה-דתית", "/events/dj-events"],
  ["/2019/07/24/די-גיי-לחתונות", "/events/dj-events"],
  ["/2019/07/24/דיגיי-לחתונה", "/events/dj-events"],
  ["/2019/07/24/הדי-גיי-הכי-טוב-בישראל", "/events/dj-events"],
  ["/2019/07/24/תקליטן-דתי", "/events/dj-events"],
  ["/2019/07/24/תקליטן-דתי-לחתונה", "/events/dj-events"],
  ["/2019/07/24/תקליטן-חתונה", "/events/dj-events"],
  ["/2019/07/24/תקליטן-טוב", "/events/dj-events"],
  ["/2019/07/24/תקליטן-לחינה", "/events/dj-events"],
  ["/2019/07/24/תקליטן-לחתונה", "/events/dj-events"],
  ["/2019/07/24/תקליטן-לחתונות", "/events/dj-events"],
  ["/2019/07/24/תקליטן-מבצע", "/events/dj-events"],
  ["/2019/07/24/תקליטן-מומלץ-לחתונה", "/events/dj-events"],
  ["/2019/07/24/תקליטנים", "/events/dj-events"],
  ["/2019/07/24/תקליטנים-לחתונה", "/events/dj-events"],
  ["/2019/07/25/תקליטן-במבצע", "/events/dj-events"],
  ["/2019/07/25/תקליטן-חתונות", "/events/dj-events"],
  ["/2019/07/25/תקליטן-לאירוע", "/events/dj-events"],
  ["/2019/07/25/תקליטן-לברית", "/events/dj-events"],
  ["/2019/07/25/תקליטן-לבריתה", "/events/dj-events"],
  ["/2019/07/25/תקליטן-ליום-הולדת", "/events/dj-events"],
  ["/2019/07/25/תקליטן-למסיבה", "/events/dj-events"],
  ["/2019/09/18/בועות-סבון", "/events/attractions/bubble-machine"],
  ["/2019/09/18/בלוני-אורז-ברחבת-הריקודים", "/events/attractions/giant-balloons"],
  ["/2019/09/18/עמדת-לד-לאירוע-מתאים-גם-לdj", "/events/stage-led-dj"],
  ["/2019/09/18/עשן-כבד-משטח-ענן", "/events/attractions/wedding-smoking-machine/heavy-smoke-large-events"],
  ["/2019/09/18/תותח-קונפטי-לאירועים", "/events/attractions/confetti-cannon"],
  ["/2019/09/24/תקליטן-זול-לחתונה-תקליטן-לחתונה-במח", "/events/dj-events"],
  ["/2019/10/02/בלוני-לד-לאירועים", "/events/attractions/giant-balloons"],
  ["/2019/10/22/עשן-לסלואו", "/events/attractions/wedding-smoking-machine"],
  ["/2019/10/22/קרח-יבש-לחתונה", "/events/attractions"],
  ["/2019/11/05/איך-בוחרים-תקליטן-לחתונה", "/events/dj-events"],
  ["/2019/11/05/גינגל", "/business/professional-voiceover"],
  ["/2019/11/05/די-גיי-טוב", "/events/dj-events"],
  ["/2019/11/05/מחיר-תקליטן-כמה-עולה-להזמין-תקליטן", "/events/dj-events"],
  ["/2019/11/05/מחיר-תקליטן-לחתונה", "/events/dj-events"],
  ["/2019/11/05/מיתוג-קולי-לעסק", "/business/professional-voiceover"],
  ["/2019/11/05/עשן-לחתונה-מחיר-כמה-עולה-עשן-לחתונה", "/events/attractions/wedding-smoking-machine"],
  ["/2019/11/05/פירוטכניקה-לחתונה-מה-זה-כולל-ומאיפה", "/events/attractions/cold-fireworks"],
  ["/2019/11/05/ציוד-הגברה-לתקליטנים", "/events/equipment"],
  ["/2019/11/05/צלם-חתונות-במרכז-מתחתנים-מזל-טוב", "/photography/wedding"],
  ["/2019/11/05/קורס-קריינות-רדיו", "/academy/voiceover"],
  ["/2019/11/05/קליפ-בת-מצווה-קליפ-לבת-מצווה", "/studio/blessings/bat-mitzvah-clip"],
  ["/2019/11/05/קריין-לסט", "/events/dj/voice-tags"],
  ["/2019/11/05/קריינות-בחינם-ל-dj", "/business/professional-voiceover"],
  ["/2019/11/05/קריינות-חינם-ספירה-לאחור-dj-סילבסטר", "/business/professional-voiceover"],
  ["/2019/11/05/קריינות-למרכזיה", "/business/professional-voiceover"],
  ["/2019/11/05/שיר-לחופה-מרגש-הבחירה-המדויקת-לשיר-החו", "/blog/wedding-songs-chuppah"],
  ["/2019/11/05/תכנון-חופה-ובחירת-שיר-מוצלח-ומרגש-במיו", "/blog/wedding-songs-chuppah"],
  ["/2019/11/05/תקליטן-או-להקה-תקליטן-חתונה-במקום-להקה", "/events/dj-events"],
  ["/2019/11/05/תקליטן-דתי-לחתונה-בירושלים", "/dj-events/cities/jerusalem"],
  ["/2019/11/05/תקליטן-הבית-מעוניינים-לחסוך-חשוב-שתדע", "/events/dj-events"],
  ["/2019/11/05/תקליטן-זול", "/blog/cheap-dj-for-a-wedding"],
  ["/2019/11/05/תקליטן-טרנס-לחתונה", "/events/dj-events"],
  ["/2019/11/05/תקליטן-לברית-בירושלים", "/dj-events/cities/jerusalem"],
  ["/2019/11/05/תקליטן-לברית-במודיעין", "/events/dj-events"],
  ["/2019/11/05/תקליטן-לבת-מצווה-בירושלים", "/dj-events/cities/jerusalem"],
  ["/2019/11/05/תקליטנים-בירושלים", "/dj-events/cities/jerusalem"],
  ["/2020/01/27/קומפרסור-במוזיקה", "/glossary/compression"],
  ["/2020/04/19/בלונים-מתפוצצים-בסלואו", "/events/attractions/giant-balloons"],
  ["/2020/05/03/תקליטן-באילת", "/events/dj-events"],
  ["/2020/08/16/הפקת-שיר-מקורי", "/studio/recording-song-modiin"],
  ["/2020/09/22/תיקון-זיופים", "/online/vocal-fix"],
  ["/2020/11/01/תקליטן-לחתונה-מומלץ", "/events/dj-events"],
  ["/2020/11/02/צליל-המתנה-עסקי", "/business/professional-voiceover"],
  ["/2020/11/03/תקליטן-חינה", "/events/dj-events"],
  ["/2020/11/06/הגברה-לאירועים", "/events/equipment/singer-amplification"],
  ["/2020/11/11/תקליטן-לחתונה-בירושלים", "/dj-events/cities/jerusalem"],
  ["/2020/11/14/פנטון", "/business/professional-voiceover"],
  ["/2020/11/15/צליל-עסקי-לנייד", "/business/professional-voiceover"],
  ["/2020/11/17/תקליטן-לאירועים", "/events/dj-events"],
  ["/2020/11/18/dj-חתונה-ממה-צריך-להיזהר-ומה-החשיבות", "/events/dj-events"],
  ["/2020/11/20/תותח-קונפטי-לאירועים-2", "/events/attractions/confetti-cannon"],
  ["/2020/11/22/קריינות-למרכזייה-הדגשים-שעליהם-חייבי", "/business/professional-voiceover"],
  ["/2020/11/23/קריינות-רדיו-וטיפים-לקריין-המתחיל-או-ל", "/voiceover"],
  ["/2020/12/01/סרטוני-בת-מצווה", "/studio/blessings/bat-mitzvah-clip"],
  ["/2020/12/02/תותח-קונפטי-מה-זה-ומה-ההבדלים", "/events/attractions/confetti-cannon"],
  ["/2020/12/18/הקלטת-שיר-חתונה", "/studio/recording-song-modiin"],
  ["/2021/01/06/מיקס-לשיר", "/online/vocal-fix/mixing"],
  ["/2021/01/08/מיקס-מאסטרינג", "/online/vocal-fix/mixing"],
  ["/2021/01/13/מיקס-ומאסטרינג", "/online/vocal-fix/mixing"],
  ["/2021/01/20/mp3-או-wav", "/blog/mp3-vs-wav-studio-guide"],
  ["/2021/01/20/פורמט-אודיו-מומלץ", "/blog/mp3-vs-wav-studio-guide"],
  ["/2021/01/27/מיקרופון-דינמי-למיקרופון-קונדנסר", "/glossary/condenser-microphone"],
  ["/2021/02/10/שיר-מקורי", "/studio/recording-song-modiin"],
  ["/2021/03/01/מחירון-אולפן-הקלטות", "/studio/pricing"],
  ["/2021/03/03/אולפן-הקלטות-זול", "/studio"],
  ["/2021/03/10/כמה-עולה-שעת-אולפן", "/studio/pricing"],
  ["/2021/03/17/תיקון-זיופים-בקיובייס", "/online/vocal-fix"],
  ["/2021/03/21/מכונת-עשן", "/events/attractions/wedding-smoking-machine"],
  ["/2021/03/31/אולפן-הקלטות-מחירים", "/studio/pricing"],
  ["/2021/03/31/להקליט-שיר-מחיר", "/studio/recording-song-modiin"],
  ["/2021/04/05/ההבדל-בין-מונו-לבין-סטריאו", "/glossary/stereo"],
  ["/2021/04/14/אולפן-הקלטות-ביתי", "/academy/home-studio"],
  ["/2021/06/08/להקים-אולפן-הקלטות", "/academy/home-studio"],
  ["/2021/08/15/מכונת-בועות-סבון-לאירועים", "/events/attractions/bubble-machine"],
  ["/2021/08/19/dj-לאירועים", "/events/dj-events"],
  ["/2021/08/19/צלם-חתונות-מרכז", "/photography/wedding"],
  ["/2021/09/06/אולפן-הקלטות-בירושלים-מחירים", "/studio/studio-jerusalem"],
  ["/2021/11/21/הפקת-שיר-מחיר", "/studio/recording-song-modiin"],
  ["/2022/05/02/אולפן-הקלטה-מחירים", "/studio/pricing"],
  ["/2022/05/02/אולפן-הקלטות-מחיר", "/studio/pricing"],
  ["/אזורי-פעילות", "/areas"],
  ["/איך-בוחרים-די-גיי-לחתונה", "/events/dj-events"],
  ["/איך-בוחרים-תקליטן-לחתונה/טיפים-לבחירת", "/events/dj-events"],
  ["/גיי-יקיר-כהן-תקליטן-בפתח-תקווה", "/events/dj-events"],
  ["/גיי-יקיר-כהן-תקליטן-לברית-ובריתה", "/events/dj-events"],
  ["/גיי-לאירוע-שלכם-ברמה-הכי-גבוהה-שיש", "/events/dj-events"],
  ["/גיי-לאירועים-תקליטן-לאירועים", "/events/dj-events"],
  ["/די-גיי-במבצע", "/events/dj-events"],
  ["/די-גיי-בתל-אביב", "/events/dj-events"],
  ["/די-גיי-יקיר-כהן", "/events/dj-events"],
  ["/די-גיי-לחתונה-ואירועים-רק-יקיר-כהן", "/events/dj-events"],
  ["/די-גיי-לחתונה/תקליטן-לחתונה", "/events/dj-events"],
  ["/דיגיי-לחתונה", "/events/dj-events"],
  ["/הדי-גיי-הכי-טוב-בישראל", "/events/dj-events"],
  ["/ההבדל-בין-מונו-לבין-סטריאו", "/glossary/stereo"],
  ["/ההבדלים-בין-סוגי-המיקרופונים-סוף-סוף-ת", "/glossary/condenser-microphone"],
  ["/המחיר-תקליטן-לאירוע", "/events/dj-events"],
  ["/המלצות-קריינות-לdj", "/events/dj/voice-tags"],
  ["/המלצות-קריינות-לסט-2", "/events/dj/voice-tags"],
  ["/המלצות-קריינות-לסט7", "/events/dj/voice-tags"],
  ["/הקלטת-ברכות-משפחה", "/studio/blessings"],
  ["/הקלטת-ברכת-כלה-2", "/studio/blessings/bride-groom-blessing"],
  ["/השכרת-הגברה-לאירועים-עד-250-איש", "/events/equipment"],
  ["/השכרת-ציוד-הגברה-ואו-תאורה", "/events/equipment"],
  ["/זוגות-מספרים-תקליטן-לחתונה", "/events/dj-events"],
  ["/זיקוקים-וקונפטי", "/events/attractions/cold-fireworks"],
  ["/חבילות-קריינות-לdj", "/events/dj/voice-tags"],
  ["/חולמים-להיות-קריינים-קורס-הקריינות-של", "/voiceover/course"],
  ["/טיפים/תקליטן-לחתונה-ההבדלים-בין-חובבן-למקצו", "/events/dj-events"],
  ["/יצירת-קשר", "/contact"],
  ["/יצירת-קשר-2", "/contact"],
  ["/יקיר-כהן-תקליטן-בחיפה-והקריות", "/events/dj-events"],
  ["/כל-מה-שרציתם-לדעת-על-בחירת-השיר-לחופה-של", "/blog/chuppah-song-guide-couples"],
  ["/כל-מה-שרציתם-לדעת-על-בחירת-שיר-כניסה-לחו", "/blog/chuppah-song-guide-couples"],
  ["/כמה-עולה-עשן-לחתונה-עשן-לחתונה-מחיר", "/events/attractions/wedding-smoking-machine"],
  ["/מה-זה-קומפרסור-כל-מה-שרציתם-לדעת-ולא-הע", "/glossary/compression"],
  ["/מוזיקה-לאירועים-יקיר-כהן", "/events/dj-events"],
  ["/מיקרופון-דינמי-למיקרופון-קונדנסר", "/glossary/condenser-microphone"],
  ["/מכונת-עשן-לאירוע", "/events/attractions/wedding-smoking-machine"],
  ["/מצגת-לאירוע", "/photo-slideshow"],
  ["/מצגת-תמונות-לאירוע", "/photo-slideshow"],
  ["/נוסח-ברכת-כלה", "/studio/blessings/bride-groom-blessing"],
  ["/ניווט-קולי-בטלפון", "/business/professional-voiceover"],
  ["/עמדת-led", "/events/stage-led-dj"],
  ["/עמוד-המלצת-קריינות-dj", "/events/dj/voice-tags"],
  ["/עשן-כבד-לאירועים", "/events/attractions/wedding-smoking-machine/heavy-smoke-large-events"],
  ["/עשן-לחתונה", "/events/attractions/wedding-smoking-machine"],
  ["/עשן-קרח-לחתונה", "/events/attractions/wedding-smoking-machine"],
  ["/פאנטון-לעסק", "/business/professional-voiceover"],
  ["/פאנטון-עסקי", "/business/professional-voiceover"],
  ["/פאנטון-עסקי-קריין-למרכזיה", "/business/professional-voiceover"],
  ["/פירוטכניקה-לחתונה-מה-זה-כולל", "/events/attractions/cold-fireworks"],
  ["/צליל-עסקי", "/business/professional-voiceover"],
  ["/קומפרסור-במוזיקה", "/glossary/compression"],
  ["/קורס-מוזיקה-וסאונד-ai", "/academy/ai-music"],
  ["/קריין-לסט", "/events/dj/voice-tags"],
  ["/קריינות-dj-בחינם", "/events/dj/voice-tags"],
  ["/קריינות-dj-לסט", "/events/dj/voice-tags"],
  ["/קריינות-ספירה-לאחור-סילבסטר", "/events/dj/voice-tags"],
  ["/קריינות-ספירה-לאחור-שנה-חדשה-סילבסטר", "/events/dj/voice-tags"],
  ["/תותח-קונפטי", "/events/attractions/confetti-cannon"],
  ["/תנאי-שימוש-יקיר-כהן-הפקות", "/terms"],
  ["/תקליטן-בבת-ים-די-גיי-בבת-ים", "/events/dj-events"],
  ["/תקליטן-בגבעתיים-גיי-בגבעתיים", "/events/dj-events"],
  ["/תקליטן-בגן-יבנה-גיי-בגן-יבנה", "/events/dj-events"],
  ["/תקליטן-בדרום-גיי-בדרום", "/events/dj-events"],
  ["/תקליטן-בהוד-השרון-גיי-בהוד-השרון", "/events/dj-events"],
  ["/תקליטן-בחולון-גיי-בחולון", "/events/dj-events"],
  ["/תקליטן-בטבריה-די-גיי-בטבריה", "/events/dj-events"],
  ["/תקליטן-ביהוד-גיי-ביהוד", "/events/dj-events"],
  ["/תקליטן-במבצע-תקליטן-לחתונה-במבצע", "/events/dj-events"],
  ["/תקליטן-במודיעין", "/events/dj-events"],
  ["/תקליטן-במרכז", "/events/dj-events"],
  ["/תקליטן-במרכז-גיי-במרכז", "/events/dj-events"],
  ["/תקליטן-בצפון-גיי-בצפון", "/events/dj-events"],
  ["/תקליטן-בקרית", "/events/dj-events"],
  ["/תקליטן-בראשון-לציון", "/events/dj-events"],
  ["/תקליטן-זול-לחתונה-תקליטן-לחתונה-במח", "/events/dj-events"],
  ["/תקליטן-זול-לחתונה-תקליטן-לחתונה-במחיר", "/events/dj-events"],
  ["/תקליטן-חתונה", "/events/dj-events"],
  ["/תקליטן-טרנס-לחתונה", "/events/dj-events"],
  ["/תקליטן-לברית-במודיעין", "/events/dj-events"],
  ["/תקליטן-לחתונה-בירושלים-גיי-לחתונה-ביר", "/dj-events/cities/jerusalem"],
  ["/תקליטן-לחתונה-גיי-לחתונה-מחירים", "/events/dj-events"],
  ["/תקליטן-לחתונה/מחיר-תקליטן-לחתונה", "/events/dj-events"],
  ["/תקליטן-לחתונה/מחירון-תקליטן-כמה-עולה-להזמין-תקליטן", "/events/dj-events"],
  ["/תקליטן-לחתונה/תקליטן-באשדוד-גיי-באשדוד", "/events/dj-events"],
  ["/תקליטן-ליום-הולדת", "/events/dj-events"],
  ["/תקליטן-למסיבה", "/events/dj-events"],
  ["/תקליטן-למסיבה-גיי-למסיבה", "/events/dj-events"],
  ["/תקליטן-מומלץ-לחתונה-די-גיי-מומלץ-לחתו", "/events/dj-events"],
  ["/תקליטן/יתרונות-להזמין-תקליטן-לחתונה-במקום-לה", "/events/dj-events"],
  ["/תקליטן/תקליטן-דתי-לחתונה-2", "/events/dj-events"],
  ["/תקליטנים", "/events/dj-events"],
  /* 16.10.2026, אישור הבעלים לפי ההמלצה: הכתובות הסבירות (נושא קרוב, לא זהה). */
  ["/2019/07/24/די-גיי-לבר-מצווה", "/events/dj-events"],
  ["/2019/07/24/מנחה-לאירוע-ותקליטן", "/events/host"],
  ["/2019/07/24/קורס-dj", "/academy/dj-course"],
  ["/2019/07/24/תקליטן-בר-מצווה", "/events/dj-events"],
  ["/2019/07/24/תקליטן-דתי-לבר-מצווה", "/events/dj-events"],
  ["/2019/07/24/תקליטן-ומפעיל-לבר-מצווה", "/events/dj-events"],
  ["/2019/09/18/guns-effect-תותחי-תאורה", "/events/attractions/smoke-cannons-for-events"],
  ["/2019/11/05/אטרקציות-לחתונה", "/events/attractions"],
  ["/2019/11/05/המלצות-לרמקולים", "/glossary/monitor-speakers"],
  ["/2019/11/05/כמה-עולה-קריינות", "/voiceover"],
  ["/2019/11/05/מאסטרינג-וההפקה-המוזיקלית", "/online/vocal-fix/mixing"],
  ["/2019/11/05/פרסום-ברדיו", "/voiceover"],
  ["/2019/11/05/פרסומת-ברדיו", "/business/professional-voiceover"],
  ["/2019/11/05/קריין-חדשות", "/voiceover"],
  ["/2019/11/05/שיר-שבירת-כוס-מהו-על-מה-חשוב-להקפיד-ואי", "/blog/wedding-song-2026"],
  ["/2019/11/05/שירותי-קריינות", "/voiceover"],
  ["/2019/11/05/שירים-לחתונה", "/blog/wedding-songs-chuppah"],
  ["/2019/11/05/תקליטן-לחתונה-וקריין-פרסומות-איך-הכל-ה", "/voiceover"],
  ["/2020/04/10/אולפן", "/studio"],
  ["/2020/05/05/אולפן-הקלטות-לילדים", "/studio"],
  ["/2020/05/05/בית-ספר-לאומנות-הבמה", "/academy/dj-course"],
  ["/2020/11/04/קריינות", "/voiceover"],
  ["/2020/11/26/רמקולים-או-מוניטורים", "/glossary/monitor-speakers"],
  ["/2021/01/04/לתקלט-חתונות", "/academy/dj-course"],
  ["/2021/01/05/אולפן-הקלטות-בשילת", "/studio"],
  ["/2021/01/11/איזה-מוניטורים-לקנות-לאולפן-הקלטות", "/glossary/monitor-speakers"],
  ["/2021/01/18/מיקרופון-זול-וטוב", "/blog/home-mic-guide"],
  ["/2021/02/01/רעשים-באולפן-הקלטות", "/glossary/acoustic-room"],
  ["/2021/02/03/איזו-תוכנת-הפקה-הכי-טובה", "/glossary/daw"],
  ["/2021/02/08/אקוסטיקה-לוכדי-באס", "/glossary/acoustic-room"],
  ["/2021/03/08/מזגן-באולפן-הקלטות", "/glossary/acoustic-room"],
  ["/2021/03/10/קורס-הפקה-מוזיקלית", "/academy/music-production"],
  ["/2021/03/24/איך-להפיק-שיר", "/studio/recording-song-modiin"],
  ["/2021/04/12/רמקול-אקטיבי-לרמקול-פסיבי", "/glossary/monitor-speakers"],
  ["/2021/08/15/אולפני-הקלטות", "/studio"],
  ["/2021/08/22/קריינות-בעברית-חינם", "/voiceover"],
  ["/2021/08/28/אולפן-הקלטות-בראשון", "/studio"],
  ["/2021/11/21/איך-להקליט-שיר-כל-מה-שרציתם-לדעת", "/studio/recording-song-modiin"],
  ["/2023/07/20/מדריך-לדי-גיי-המתחיל-כל-מה-שחשוב-לדעת-ל", "/academy/dj-course"],
  ["/אולפן-הקלטות-המדריך-המלא-לכל-אולפן-שמכ", "/studio"],
  ["/אטרקציות-לחתונה-בירושלים", "/events/wedding-attractions-packages"],
  ["/אטרקציות-לחתונה/בובות-אלכוהול", "/events/wedding-attractions-packages"],
  ["/איזה-מוניטורים-לקנות-לאולפן-הקלטות", "/glossary/monitor-speakers"],
  ["/איזו-תוכנת-הפקה-הכי-טובה", "/glossary/daw"],
  ["/איך-מתכוננים-להקלטת-שיר-באולפן-הקלטות", "/blog/studio-session-prep-checklist"],
  ["/אקוסטיקה-לאולפן-הקלטות", "/glossary/acoustic-room"],
  ["/אקוסטיקה-לוכדי-באס", "/glossary/acoustic-room"],
  ["/בית-ספר-לאומנות-הבמה", "/academy/dj-course"],
  ["/די-גיי-יקיר-כהן-די-גיי-לבר-מצווה-שמחה-ו", "/events/bar-mitzvah"],
  ["/הזמנת-קריינות", "/voiceover"],
  ["/הילדה-שלי-רוצה-להקליט-שיר-איך-להפוך-א", "/studio/recording-song-modiin"],
  ["/המלצות-לרמקולים", "/glossary/monitor-speakers"],
  ["/המלצות-מתחתנים", "/testimonials"],
  ["/המלצות-שירים", "/blog/wedding-song-2026"],
  ["/המלצות-תקליטן-לבר-מצווה", "/events/bar-mitzvah"],
  ["/המלצות-תקליטן-לבת-מצווה", "/events/bar-mitzvah"],
  ["/הנחיית-ערב", "/events/host"],
  ["/למה-דווקא-יקיר-כהן-ולא-קריין-אחר", "/voiceover"],
  ["/לתקלט-חתונות", "/academy/dj-course"],
  ["/מזגן-באולפן-הקלטות", "/glossary/acoustic-room"],
  ["/ממליצים", "/testimonials"],
  ["/משוב", "/testimonials"],
  ["/סטודיו-לצילום-במודיעין", "/photography"],
  ["/סרטון-חתונה-ai-לפי-דרישה", "/video"],
  ["/פרסום-ברדיו", "/voiceover"],
  ["/קורס-dj", "/academy/dj-course"],
  ["/קורס-תקליטנות-קורס-די-גיי", "/academy/dj-course"],
  ["/קריין-יקיר-כהן", "/voiceover"],
  ["/קריין-מומלץ", "/voiceover"],
  ["/קריין-מומלץ-לקוחות-ממליצים/חבילת-קריינות-לרדיו-המדינה-91fm", "/voiceover"],
  ["/קריין-מומלץ-לקוחות-ממליצים/קריינות-לרדיו-102fm-רדיו-קול-הים-האדום-אילת", "/voiceover"],
  ["/קריין-מומלץ-לקוחות-ממליצים/קריינות-לרדיו-icaster-חבילת-אותות-שלמה", "/voiceover"],
  ["/קריין-מומלץ-לקוחות-ממליצים/קריינות-לרדיו-ישראל-חם-אש", "/voiceover"],
  ["/קריין-מומלץ-לקוחות-ממליצים/קריינות-לרדיו-מזרחית", "/voiceover"],
  ["/קריין-מומלץ-לקוחות-ממליצים/קריינות-לרדיו-קול-עכו", "/voiceover"],
  ["/קריין-מקצועי/קריין-מקצועי", "/voiceover"],
  ["/קריין-מקצועי/קריינות-מקצועית", "/voiceover"],
  ["/קריינות-2", "/voiceover"],
  ["/קריינות-ai-אנושית", "/online/voice-cloning"],
  ["/קריינות-לפרסומות", "/voiceover"],
  ["/רמקול-אקטיבי-לרמקול-פסיבי", "/glossary/monitor-speakers"],
  ["/רמקול-פסיבי-או-אקטיבי-הבדלים-יתרונות-ו", "/glossary/monitor-speakers"],
  ["/רמקולים-או-מוניטורים", "/glossary/monitor-speakers"],
  ["/רעשים-באולפן-הקלטות", "/glossary/acoustic-room"],
  ["/שיר-שבירת-כוס-מהו-על-מה-חשוב-להקפיד-ואי", "/blog/wedding-song-2026"],
  ["/תכונות-מתקדמות-להפקת-מוזיקה-ורמיקסים", "/academy/music-production"],
  ["/תנאי-הקלטה-באולפן", "/blog/studio-session-prep-checklist"],
  ["/תקליטן-לבר-מצווה", "/events/bar-mitzvah"],
  ["/תקליטן-לבת-מצווה", "/events/bar-mitzvah"],
  ["/תקליטן-לחתונה-וקריין-פרסומות-איך-הכל-ה", "/voiceover"],
  ["/תקליטן-לחתונה/גיי-יקיר-כהן-תקליטן-לחתונה-מצווה-וברית", "/events/bar-mitzvah"],
  /* 16.10.2026, הבעלים: פרקי "זמן להכיר עם יקיר כהן" (הכותרות נבדקו בארכיון) הולכים ל-/podcast,
     ועמודי "המלצות די ג'יי" (תקליטנים שממליצים על הקריינות לסטים) לתג הקולי. */
  ["/2021/11/07/אמיר-חצרוני", "/podcast"],
  ["/2021/11/14/אוהד-בוזגלו", "/podcast"],
  ["/2021/11/24/גילי-כהן", "/podcast"],
  ["/2021/12/04/רון-נשר", "/podcast"],
  ["/2021/12/29/ישראל-אהרוני", "/podcast"],
  ["/2022/01/04/קובי-סוויסה", "/podcast"],
  ["/2022/01/09/רגב-הוד", "/podcast"],
  ["/2022/01/11/דניס-צרקוב", "/podcast"],
  ["/2022/01/23/גקו-אייזנברג", "/podcast"],
  ["/2022/02/17/דורון-מירן", "/podcast"],
  ["/2022/03/14/דניאל-יונה", "/podcast"],
  ["/2022/04/06/ניר-בנילוש", "/podcast"],
  ["/2022/05/18/צחי-נוי", "/podcast"],
  ["/2022/06/09/יצחק-בצרי", "/podcast"],
  ["/קובי-סוויסה", "/podcast"],
  ["/רון-נשר", "/podcast"],
  ["/2019/11/05/המלצות-djs", "/events/dj/voice-tags"],
  ["/המלצות-די-גיי/גיי-ליאור-רטה-lior-rata", "/events/dj/voice-tags"],
  ["/המלצות-די-גיי/גיי-עידן-כהן-idan-ice", "/events/dj/voice-tags"],
  ["/המלצות-די-גיי/גיי-עידן-ציפרוט-idan-chiprut", "/events/dj/voice-tags"],
  ["/המלצות-די-גיי/גיי-ציון-דמרי-tzion-demri", "/events/dj/voice-tags"],
  ["/המלצות-די-גיי/גיי-קובי-מור-kobi-mor", "/events/dj/voice-tags"],
  ["/המלצות-די-גיי/גיי-רובי-כהן-robi-cohen", "/events/dj/voice-tags"],
  ["/המלצות-די-גיי/גיי-רוי-טליאס-roy-talias", "/events/dj/voice-tags"],
  ["/המלצות-די-גיי/גיי-שגיא-דבח-sagi-dabach", "/events/dj/voice-tags"],
  ["/המלצות-די-גיי/גיי-שרון-טלקר-sharon-talker", "/events/dj/voice-tags"],
  ["/המלצות-די-גיי/חברת-המוזיקה-רטרו-גיי-אוריאן-שיטרית", "/events/dj/voice-tags"],
];

const WAYBACK_PROXY = new Map(WAYBACK_PROXY_PAIRS);

/**
 * נתיבי השנה של WordPress. עד 15.10.2026 היו כאן הפניות קבועות של "/2019/:path*" ודומיו
 * אל /blog, אבל הפניה ב-next.config רצה לפני ה-proxy, ולכן היא הייתה מסתירה את WAYBACK_PROXY.
 * ה-proxy שולח עכשיו ל-/blog כל כתובת שנה שאין לה יעד אחר. ההפניות הקבועות עם התאריך
 * שב-WORDPRESS_PATTERNS עדיין רצות ראשונות, וזה בסדר: יש להן יעד משלהן.
 * ה-matcher ב-proxy.ts משכפל את הרשימה, ו-scripts/audit-proxy-gone.mjs אוכף שהם לא נפרדים.
 */
export const PROXY_YEAR_PREFIXES = ["/2017", "/2018", "/2019", "/2020", "/2021", "/2022", "/2023", "/2024"] as const;

/** יעד לכתובת ישנה שה-proxy מפנה (Wayback, ונתיבי שנה), או null. מקבל pathname מקודד או לא. */
export function waybackEquivalent(pathname: string): string | null {
  let path = pathname.replace(/\/+$/, "");
  try {
    path = decodeURIComponent(path);
  } catch {
    return null;
  }
  const hit = WAYBACK_PROXY.get(path);
  if (hit) return hit;
  return PROXY_YEAR_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`)) ? "/blog" : null;
}

export const CART_QUERY_KEY = "add-to-cart";

export function clearCartQuery(url: { searchParams: URLSearchParams; search: string }): boolean {
  if (!url.searchParams.has(CART_QUERY_KEY)) return false;
  url.search = "";
  return true;
}

export const GONE_EXACT_PATHS = ["/xmlrpc.php", "/index.aspx", "/main.asp"] as const;

const WORDPRESS_PATTERNS: Array<{ source: string; destination: string }> = [
  /* נתיבי השנה (/2017 עד /2024) עברו ל-proxy ב-15.10.2026, ראו PROXY_YEAR_PREFIXES.
     ההפניות עם התאריך שכאן רצות לפני ה-proxy, ולכן הן עדיין קובעות את היעד שלהן. */
  /* /product, /product-tag, /product-category, /category, /tag, /shop-2, /wp-*
     ו-/xmlrpc.php הועברו ל-410 ב-proxy.ts. ראו GONE_PATH_PREFIXES למעלה. */
  /* הכתובות עם התאריך של מדריך הסלואו (Wayback). לפני /2019 ו-/2021. */
  { source: "/2019/11/05/שירי-סלואו-לחתונה", destination: "/blog/wedding-slow-songs" },
  { source: "/2019/11/05/שירים-לקבלת-פנים", destination: "/blog/reception-songs" },
  { source: "/2019/11/05/רעיונות-למסיבת-רווקות", destination: "/studio/group-session" }, // 11.10.2026, כמו הכתובת בלי התאריך
  { source: "/2022/05/17/דרשה-לבר-מצווה-קצר-ולעניין", destination: "/blog/bar-mitzvah-speech" },
  { source: "/2021/08/25/שירי-סלואו", destination: "/blog/wedding-slow-songs" },
  /* D57 (11.10.2026): ארבע גרסאות עם תאריך של מדריכי החופה הישנים, והדרשה.
     בלי השורות האלה הן נפלו ל-"/2019/:path*" ונחתו על אינדקס הבלוג. */
  { source: "/2019/11/05/שיר-כניסה-לחופה", destination: "/blog/wedding-songs-chuppah" },
  { source: "/2019/11/05/שירים-חופה-ההמלצות-של-די-גיי-יקיר-כהן", destination: "/blog/wedding-songs-chuppah" },
  { source: "/2019/11/05/בחירת-שיר-כניסה-לחופה-כל-מה-שרציתם-לדע", destination: "/blog/wedding-songs-chuppah" },
  { source: "/2019/11/05/שירים-לחופה-איך-לבחור-זמר-איכותי", destination: "/blog/wedding-songs-chuppah" },
  { source: "/2019/11/26/הקלטת-דרשה-לבר-מצווה", destination: "/blog/bar-mitzvah-speech" },
  /* שתי הכתובות עם התאריך של אותו מאמר (Wayback, 2021). לפני /2021/:path*,
     שאחרת תופס אותן ושולח לאינדקס הבלוג. */
  { source: "/2021/05/15/שירים-לבת-מצווה", destination: "/blog/bat-mitzvah-songs" },
  { source: "/2021/09/06/רשימת-שירים-לבת-מצווה", destination: "/blog/bat-mitzvah-songs" },
  { source: "/privacy-policy/:path*",    destination: "/privacy" },
  { source: "/privacy-policy",           destination: "/privacy" },
  { source: "/feed",                     destination: "/blog" },
  { source: "/feed/:path*",              destination: "/blog" },
  { source: "/author/:path*",            destination: "/about" },
  { source: "/page/:path*",              destination: "/blog" },
];

/** Hebrew-slug service pages from the old WordPress site */
const HEBREW_SERVICE_SLUGS: Record<string, string> = {
  // DJ & Events
  "/תקליטן-לחתונה": "/events/dj-events",
  "/תקליטן-לחתונה-בירושלים": "/dj-events/cities/jerusalem",
  "/תקליטן-לחתונה-מומלץ": "/events/dj-events",
  "/תקליטן-לחתונות": "/events/dj-events",
  "/תקליטן-לאירועים": "/events/dj-events",
  "/תקליטן-לאירועים-2": "/events/dj-events",
  "/תקליטן-לאירוע-קטן-חתונה-דתית-יום-הולדת": "/events/dj-events",
  "/תקליטן-דתי": "/events/dj-events",
  "/תקליטן-דתי-לבר-מצווה": "/events/dj-events",
  "/תקליטן-בר-מצווה": "/events/dj-events",
  "/תקליטן-ומפעיל-לבר-מצווה": "/events/dj-events",
  "/תקליטן-חתונות": "/events/dj-events",
  "/תקליטן-מבצע": "/events/dj-events",
  "/תקליטן-טוב": "/events/dj-events",
  "/תקליטן-מהצפון": "/events/dj-events",
  "/תקליטן-בדרום": "/events/dj-events",
  "/תקליטן": "/events/dj-events",
  "/תקליטנים-לחתונה": "/events/dj-events",
  "/תקליטנים-בירושלים": "/dj-events/cities/jerusalem",
  "/תקליטן-בירושלים": "/dj-events/cities/jerusalem",
  "/תקליטן-דתי-לחתונה-בירושלים": "/dj-events/cities/jerusalem",
  "/תקליטן-לחינה-בירושלים": "/dj-events/cities/jerusalem",
  "/תקליטן-באשדוד": "/events/dj-events",
  "/תקליטן-באילת": "/events/dj-events",
  "/תקליטן-בבאר-שבע": "/events/dj-events",
  "/תקליטן-בבית-שמש": "/events/dj-events",
  "/תקליטן-בגבעתיים": "/events/dj-events",
  "/תקליטן-בהוד-השרון": "/events/dj-events",
  "/תקליטן-בהרצליה": "/events/dj-events",
  "/תקליטן-ביהוד": "/events/dj-events",
  "/תקליטן-בחולון": "/events/dj-events",
  "/תקליטן-בחיפה": "/events/dj-events",
  "/תקליטן-בטבריה": "/events/dj-events",
  "/תקליטן-בקרית-גת": "/events/dj-events",
  "/תקליטן-בקרית-אונו": "/events/dj-events",
  "/תקליטן-בערד": "/events/dj-events",
  "/תקליטן-בפתח-תקווה": "/events/dj-events",
  "/תקליטן-ברעננה": "/events/dj-events",
  "/תקליטן-בתל-אביב": "/events/dj-events",
  "/תקליטן-לחינה": "/events/dj-events",
  "/תקליטן-לבר-מצווה-במרכז": "/events/dj-events",
  "/תקליטן-מומלץ": "/events/dj-events",
  "/דיגיי-חתונה": "/events/dj-events",
  "/dj-בחתונה": "/events/dj-events",
  "/dj-דתי": "/events/dj-events",
  "/dj-לאירוע": "/events/dj-events",
  "/dj-לאירועים": "/events/dj-events",
  "/די-גיי-לחתונה": "/events/dj-events",
  "/די-גיי-לחתונות": "/events/dj-events",
  "/די-גיי-לחתונה-דתית": "/events/dj-events",
  "/די-גיי-לאירועים": "/events/dj-events",
  "/די-גיי-טוב": "/events/dj-events",
  "/די-ג-יי-לחתונה": "/events/dj-events",
  "/מחיר-תקליטן-כמה-עולה-להזמין-תקליטן": "/events/dj-events",
  "/מחיר-תקליטן-לחתונה": "/events/dj-events",
  "/איך-בוחרים-תקליטן-לחתונה": "/events/dj-events",
  "/מנחה-לאירועים": "/events/host",
  "/הגברה-לאירועים": "/events/equipment/singer-amplification",
  "/ציוד-הגברה-לתקליטנים": "/events/equipment",
  "/השכרת-ציוד-הגברה-לאירועים": "/events/equipment",
  "/תופים-לחתונה": "/events/dj-events",
  "/אטרקציות-לחתונה": "/events/attractions",
  "/אטרקציות-לאירוע-הכי-יפות-איכותיות-ובמ": "/events/attractions",
  "/אטרקציות-לבר-מצווה": "/events/attractions",
  "/אטרקציות-לחתונה-לרחבה": "/events/attractions",
  "/גימיקים-לחתונה": "/events/attractions",
  "/הפתעות-לרחבה": "/events/attractions",
  "/חבילת-אטרקציות-לחתונה": "/events/wedding-attractions-packages",
  "/ארגון-חתונה": "/events",
  "/אירגון-חתונה": "/events",
  "/מה-צריך-לחתונה": "/events",
  "/מה-כדאי-לעשות-בחתונה": "/events",
  "/אירוע-באולם-קטן-בירושלים": "/events",
  "/מעגלי-מתופפים-באירועים": "/events",
  "/תאורה-למסיבות-מה-אתם-חייבים-לדעת-על-תו": "/events",
  "/השכרת-תאורה-למסיבות-בירושלים": "/events",
  "/אולמות-אירועים-מומלצים-בירושלים": "/dj-events/cities/jerusalem",
  "/אולמות-אירועים-בירושלים": "/dj-events/cities/jerusalem",
  // Smoke & effects
  "/מכונת-עשן": "/events/attractions/wedding-smoking-machine",
  "/עשן-כבד-לחתונה": "/events/attractions/wedding-smoking-machine",
  "/עשן-לסלואו": "/events/attractions/wedding-smoking-machine",
  "/עשן-קרח-יבש": "/events/attractions/wedding-smoking-machine",
  "/עשן-כבד-משטח-ענן": "/events/attractions/wedding-smoking-machine/heavy-smoke-large-events",
  "/מכונת-בועות-סבון-עשן-שירות-הפעלה-לאירו": "/events/attractions/bubble-machine",
  "/תותחי-עשן-לאירועים-ולחתונה": "/events/attractions/smoke-cannons-for-events",
  "/רובה-עשן-ותותחי-קור-לאירועים": "/events/attractions/smoke-cannons-for-events",
  "/רובה-עשן-לאירועים": "/events/attractions/smoke-cannons-for-events",
  "/תותח-קונפטי-לאירועים": "/events/attractions/confetti-cannon",
  "/בלוני-ענק-לאירועים": "/events/attractions/giant-balloons",
  "/בלוני-לד-לאירועים": "/events/attractions/giant-balloons",
  "/בלוני-אורז-ברחבת-הריקודים": "/events/attractions/giant-balloons",
  "/בלונים-לאירועים": "/events/attractions/giant-balloons",
  "/בלונים-מתפוצצים-בסלואו": "/events/attractions/giant-balloons",
  "/סידור-בלונים-לאירוע": "/events/attractions/giant-balloons",
  "/מתקנים-מתנפחים": "/events/attractions/giant-balloons",
  "/בועות-סבון": "/events/attractions/bubble-machine",
  "/מכונת-בועות-סבון-לאירועים": "/events/attractions/bubble-machine",
  "/בועות-סבון-לחתונה": "/events/attractions/bubble-machine",
  "/זיקוקים-קרים-לחופה": "/events/attractions/cold-fireworks",
  "/זיקוקים-לחופה": "/events/attractions/cold-fireworks",
  "/זיקוקים-בטיחותי": "/events/attractions/cold-fireworks",
  "/זיקוקים-פירוטכניקה-לחתונה-מה-זה-כולל-ומאיפה": "/events/attractions/cold-fireworks",
  "/פירוטכניקה-לחתונה-מה-זה-כולל-ומאיפה": "/events/attractions/cold-fireworks",
  "/קרח-יבש-לאירועים": "/events/attractions",
  "/קרח-יבש-לחתונה": "/events/attractions",
  "/עמדת-לד-לאירוע-מתאים-גם-לdj": "/events/stage-led-dj",
  // Studio & Recording
  "/אולפן-הקלטות-במודיעין": "/studio",
  "/studiomodiindati": "/studio",
  "/אולפן-הקלטות-זול": "/studio",
  "/אולפן-הקלטות-מחירים": "/studio/pricing",
  "/כמה-עולה-שעת-אולפן": "/studio/pricing",
  "/אולפן-הקלטות-בירושלים": "/studio/studio-jerusalem",
  "/אולפן-הקלטות-2": "/studio",
  "/אולפן-הקלטות-באילת": "/studio",
  "/אולפן-הקלטות-באלעד": "/studio",
  "/אולפן-הקלטות-ביתי": "/academy/home-studio",
  "/אולפן-הקלטות-בלוד": "/studio",
  "/אולפן-הקלטות-בנס-ציונה": "/studio",
  "/אולפן-הקלטות-בראשון": "/studio",
  "/אולפן-הקלטות-בראשון-לציון": "/studio",
  "/אולפן-הקלטות-ברחובות": "/studio/studio-rehovot",
  "/אולפן-הקלטות-ברמלה": "/studio",
  "/אולפן-הקלטות-בשוהם": "/studio/studio-shoham",
  "/אולפן-הקלטות-בשילת": "/studio",
  "/אולפן-הקלטות-בירושלים-מחירים": "/studio/studio-jerusalem",
  "/להקים-אולפן-הקלטות": "/academy/home-studio",
  "/תכנון-אולפן-ביתי-מדריך-5-צעדים": "/academy/home-studio",
  "/הקלטת-שיר-באולפן": "/studio/recording-song-modiin",
  "/הקלטת-שיר-חתונה": "/studio/recording-song-modiin",
  "/הקלטת-שיר-בר-מצווה": "/studio/recording-song-modiin",
  "/הקלטת-ברכות-לאירוע": "/studio/blessings",
  "/הקלטת-ברכות-באולפן-הקלטות-חוויה-מקצ": "/studio/blessings",
  "/הקלטת-דרשה-לבר-מצווה": "/studio/blessings/bar-mitzvah",
  /* 301 קליקים ו-7,905 הופעות ב-Search Console. מי שחיפש "דרשה לבר מצווה
     קצר ולעניין" חיפש עזרה בכתיבה, ולכן מ-5.10.2026 היעד הוא המדריך, שמקשר
     לשירות. הבעלים: "תמשיך עם מדריך הדרשה". */
  "/דרשה-לבר-מצווה-קצר-ולעניין": "/blog/bar-mitzvah-speech",
  "/קליפ-בת-מצווה": "/studio/blessings/bat-mitzvah-clip",
  "/סרטוני-בת-מצווה": "/studio/blessings/bat-mitzvah-clip",
  "/סרטון-קליפ-לבת-מצווה-הפקה-מרגשת-תוך-24-ש": "/studio/blessings/bat-mitzvah-clip",
  "/קליפ-לחתונה-חתן-שר-שיר-לכלה-ומכניס-אות": "/studio/blessings/video-clip",
  "/מיקס-ומאסטרינג": "/online/vocal-fix/mixing",
  "/מיקס-מאסטרינג": "/online/vocal-fix/mixing",
  "/מיקס-לשיר": "/online/vocal-fix/mixing",
  "/מאסטרינג-וההפקה-המוזיקלית": "/online/vocal-fix/mixing",
  "/תיקון-זיופים": "/online/vocal-fix",
  "/תיקון-זיופים-בקיובייס": "/online/vocal-fix",
  "/שחזור-שמע-דיגיטלי": "/online/vocal-fix",
  "/שיפור-איכות-הקלטה": "/online/vocal-fix",
  "/הפקת-שיר-מקורי": "/studio/recording-song-modiin",
  "/הפקת-שיר-מקורי-ai": "/studio/recording-song-modiin",
  "/הפקת-שיר-מחיר": "/studio/recording-song-modiin",
  "/שיר-מקורי": "/studio/recording-song-modiin",
  "/כמה-עולה-להיות-זמר": "/studio/recording-song-modiin",
  "/הפקה-מוזיקלית": "/academy/music-production",
  "/מפיק-מוזיקלי-האיש-מאחורי-הקלעים-של-כ": "/academy/music-production",
  "/רמיקס-לאירועים": "/academy/music-production",
  "/מיתוג-לדיגיי-אומן": "/business/professional-voiceover",
  "/סטודיו-לצילום": "/photography",
  // Voiceover & Branding
  "/קריינות": "/voiceover",
  "/קריינות-מקצועית": "/voiceover",
  "/קריין-מקצועי": "/voiceover",
  "/קריין-פרסומות": "/voiceover",
  "/קריינות-פרסומות": "/voiceover",
  "/קריינות-בחינם-ל-dj": "/business/professional-voiceover",
  "/קריינות-ל-dj": "/business/professional-voiceover",
  "/קריינות-לדי-גיי": "/business/professional-voiceover",
  "/קריינות-dj-והזמנה": "/business/professional-voiceover",
  "/קריינות-למרכזיה": "/business/professional-voiceover",
  "/קריינות-למרכזיה-2": "/business/professional-voiceover",
  "/קריינות-לרדיו": "/voiceover",
  "/קריין-חדשות": "/voiceover",
  "/שירותי-קריינות": "/voiceover",
  "/הזמנת-קריינות-בעברית": "/voiceover",
  "/קריינות-סרטי-תדמית-והדרכה": "/voiceover",
  "/קריינות-בעברית": "/voiceover",
  "/קריינות-חינם-ספירה-לאחור-dj-סילבסטר": "/business/professional-voiceover",
  "/קריינות-רדיו-וטיפים-לקריין-המתחיל-או-ל": "/voiceover",
  "/מיתוג-קולי-לעסק": "/business/professional-voiceover",
  "/גינגל": "/business/professional-voiceover",
  "/פרסומת-ברדיו": "/business/professional-voiceover",
  "/הקלטת-נתב-שיחות-מקצועי": "/business/professional-voiceover",
  // Academy & Courses
  "/קורס-קריינות": "/academy/voiceover",
  "/קורס-קריינות-אונליין-מחיר": "/academy/voiceover",
  "/קורס-קריינות-רדיו": "/academy/voiceover",
  "/קורסים-ל-djs": "/academy/dj-course",
  "/קורס-די-גיי-המדריך-המלא-איך-להפוך-תשוק": "/academy/dj-course",
  "/קורס-הפקה-מוזיקלית": "/academy/music-production",
  "/מדריך-לדי-גיי-המתחיל-כל-מה-שחשוב-לדעת-ל": "/academy/dj-course",
  "/איך-לשבור-את-חוקי-המשחק-במוזיקה-מיתוסי": "/academy/dj-course",
  "/רוצה-לעשות-פודקאסט-עם-רון-נשר": "/podcast/podcast-with-grandpa",
  // General / About
  "/ממליצים-עלינו": "/about",
  "/האמנים-שלנו": "/about",
  "/המלצות-djs": "/events/dj/voice-tags", // 16.10.2026, כמו הגרסה עם התאריך
  "/reviews": "/about",
  "/מי": "/about",
  "/about-us": "/about",
  "/who-we-are": "/about",
  "/\\+6": "/contact",
  // Old portfolio pages. פרקי "זמן להכיר" הולכים ל-/podcast (הבעלים, 16.10.2026)
  "/דניאל-יונה": "/podcast",
  "/גקו-אייזנברג": "/podcast",
  "/ניר-בנילוש": "/podcast",
  "/אוהד-בוזגלו": "/podcast",
  "/רגב-הוד": "/podcast",
  "/צחי-נוי": "/portfolio",
  "/גילי-כהן": "/podcast",
  "/יקיר-איזמירלי": "/portfolio",
  "/ישראל-אהרוני": "/podcast",
  "/ליאור-מיארה": "/portfolio",
  "/אמיר-חצרוני": "/podcast",
  "/דורון-מירן": "/podcast",
  "/דניס-צרקוב": "/podcast",
  "/דניס-צ׳רקוב": "/podcast",
};

/**
 * נתיבים עבריים מדוח "נסרק - לא נכלל באינדקס" של Search Console (טבלה.csv),
 * שלא היו במפה בכלל. נוספו ב-2.10.2026 (ED-01): מתוך 195 נתיבי תוכן עבריים
 * בדוח, 68 היו במפה ו-127 לא. כאן רק אלה שיש להם יעד ברור, לפי אותו היגיון
 * של המפה למעלה (סלאג עירוני של תקליטן הולך לעמוד התקליטן, וכו').
 * נתיבים עמומים, בעיקר פוסטים ישנים בלי מקבילה, נשארו בחוץ בכוונה: הפניה
 * לעמוד לא קשור נחשבת אצל גוגל soft 404 בדיוק כמו ההפניה ההמונית שהוחלפה ב-410.
 */
const HEBREW_GSC_NOT_INDEXED: Record<string, string> = {
  // אודות ויצירת קשר
  "/אודות": "/about",
  "/אודותינו": "/about",
  "/קצת-עלינו": "/about",
  "/צרו-קשר": "/contact",
  "/יקיר-כהן-yakir-cohen-שירותי-מוזיקה": "/",
  "/יקיר-כהן-yakir-cohen-שירותי-מוזיקה/2": "/",
  "/המגזין": "/blog",
  "/טופס-הרשמה-הזמנה-הקלטת-שיר-וקליפ-באולפ": "/book",
  // תקליטן
  "/dj-דתי/2": "/events/dj-events",
  "/dj-חרדי": "/events/dj-events",
  "/dj-חרדי/2": "/events/dj-events",
  "/magazin/תקליטן-לאירועים": "/events/dj-events",
  "/בחירת-דיגיי": "/events/dj-events",
  "/די-גיי-לבר-מצווה": "/events/dj-events",
  "/תופים-אלקטרוניים-לאירוע-זה-באמת-מוסיף": "/events/dj-events",
  "/תקליטן-או-להקה-תקליטן-חתונה-במקום-להקה": "/events/dj-events",
  "/תקליטן-בבת-ים": "/events/dj-events",
  "/תקליטן-בגן-יבנה": "/events/dj-events",
  "/תקליטן-בזכרון-יעקב": "/events/dj-events",
  "/תקליטן-במבצע": "/events/dj-events",
  "/תקליטן-במבצע/feed": "/events/dj-events",
  "/תקליטן-בנתניה": "/events/dj-events",
  "/תקליטן-בצפון": "/events/dj-events",
  "/תקליטן-ברחובות": "/dj-events/cities/rehovot",
  "/תקליטן-ברמת-גן": "/events/dj-events",
  "/תקליטן-ברמת-השרון": "/events/dj-events",
  "/תקליטן-דתי-לבר-מצווה/2": "/events/dj-events",
  "/תקליטן-דתי-לחתונה": "/events/dj-events",
  "/תקליטן-דתי-לחתונה/2": "/events/dj-events",
  "/תקליטן-הבית-מעוניינים-לחסוך-חשוב-שתדע": "/events/dj-events",
  "/תקליטן-זול": "/blog/cheap-dj-for-a-wedding",
  "/תקליטן-חינה": "/events/dj-events",
  "/תקליטן-חרדי": "/events/dj-events",
  "/תקליטן-טוב/2": "/events/dj-events",
  "/תקליטן-לאירוע": "/events/dj-events",
  "/תקליטן-לברית": "/events/dj-events",
  "/תקליטן-לברית-בירושלים": "/dj-events/cities/jerusalem",
  "/תקליטן-לבריתה": "/events/dj-events",
  "/תקליטן-לחתונה-באשקלון": "/events/dj-events",
  "/תקליטן-לחתונה-בשרון": "/events/dj-events",
  "/תקליטן-מבצע/2": "/events/dj-events",
  "/מנחה-לאירוע-ותקליטן": "/events/host",
  // אטרקציות וצילום
  "/אטרקציות-לחתונה-2": "/events/attractions",
  "/בובות-מרקדות-לאירועים": "/events/attractions",
  "/קרח-יבש-לחתונות-ואירועים": "/events/attractions",
  "/בלוני-לד-לאירועים/בלונים-1": "/events/attractions/giant-balloons",
  "/בלוני-לד-לאירועים/בלונים-2": "/events/attractions/giant-balloons",
  "/בלוני-לד-לאירועים/בלונים-3": "/events/attractions/giant-balloons",
  "/בלוני-לד-לאירועים/בלונים-4": "/events/attractions/giant-balloons",
  "/בלוני-לד-לאירועים/עיצוב-בלונים": "/events/attractions/giant-balloons",
  "/תותח-קונפטי-לאירועים-2": "/events/attractions/confetti-cannon",
  "/תותח-קונפטי-מה-זה-ומה-ההבדלים": "/events/attractions/confetti-cannon",
  "/ארגון-חתונה-אחרי-הצעת-הנישואין-ארגון-א": "/events",
  "/צילום-לאירועים": "/photography/events",
  "/צלם-חתונות-מרכז": "/photography/wedding",
  "/צלם-חתונות-במרכז-מתחתנים-מזל-טוב": "/photography/wedding",
  /* מגנטים לאורחים הם תוספת במחשבון הצילום, שיושב ב-/photography */
  "/מגנטים-לאירועים-בירושלים": "/photography",
  "/מגנטים-לאירועים-מחיר": "/photography",
  "/טיפים-לחתונה-טיפים-לאירוע-מוצלח": "/blog/tips-for-perfect-wedding",
  // שירים לחופה ולבת מצווה
  "/בחירת-שיר-כניסה-לחופה-כל-מה-שרציתם-לדע": "/blog/wedding-songs-chuppah",
  "/שיר-לחופה-מרגש-הבחירה-המדויקת-לשיר-החו": "/blog/wedding-songs-chuppah",
  "/תכנון-חופה-ובחירת-שיר-מוצלח-ומרגש-במיו": "/blog/wedding-songs-chuppah",
  "/שירים-לחופה-איך-לבחור-זמר-איכותי": "/blog/wedding-songs-chuppah",
  /* כמו "/שירים-לבת-מצווה-2" ב-LEGACY_PATH_MAP: הפוסט הייעודי, לא פוסט חתונה. */
  "/שירים-לבת-מצווה": "/blog/bat-mitzvah-songs",
  "/רשימת-שירים-לבת-מצווה": "/blog/bat-mitzvah-songs",
  "/שירי-בת-מצווה-להרים-את-הרחבה-ולשמח-את-כ": "/blog/bat-mitzvah-songs",
  // אולפן והקלטות
  "/אולפן-הקלטות": "/studio",
  "/אולפני-הקלטה": "/studio",
  "/אולפני-הקלטות": "/studio",
  "/שירות-אולפן-הקלטות": "/studio",
  "/אולפן-הקלטות-לילדים": "/studio",
  "/אולפן-הקלטות-בבאר-יעקוב": "/studio",
  "/אולפן-הקלטות-בגדרה": "/studio",
  "/אולפן-הקלטות-בבית-שמש": "/studio/studio-beit-shemesh",
  "/אולפני-הקלטות-בירושלים": "/studio/studio-jerusalem",
  "/מחירון-אולפן-הקלטות": "/studio/pricing",
  "/להקליט-שיר-מחיר": "/studio/recording-song-modiin",
  "/הקלטת-שיר-מקורי": "/studio/recording-song-modiin",
  "/הקלטת-שיר-לבת-מצווה": "/studio/recording-song-modiin",
  "/איך-להקליט-שיר-כל-מה-שרציתם-לדעת": "/studio/recording-song-modiin",
  "/איך-להפיק-שיר": "/studio/recording-song-modiin",
  "/הפקת-סינגל-כמה-זה-באמת-עולה-ומה-צריך-לד": "/studio/recording-song-modiin",
  "/שיר-במתנה": "/studio/recording-song-modiin/gifts",
  "/שיר-מתנה-לאמא-מלים-מוזיקה-ולב-אחד-גדו": "/studio/recording-song-modiin/gifts",
  /* עוד עמוד "שיר מתנה" מהאתר הישן, אותו נושא כמו שתי השורות למעלה. החזיר 404
     באתר החי ב-8.10.2026 (curl, בלי הפניה בכלל). תשובות הבעלים 8.10.2026,
     תשובה 1: "שיר במתנה" חי בעמוד המתנות. */
  "/שיר-מתנה-לחתן-ולכלה-להעניק-להם-רגע-מה": "/studio/recording-song-modiin/gifts",
  "/הקלטת-ברכות": "/studio/blessings",
  "/הקלטת-ברכת-כלה": "/studio/blessings",
  "/קליפ-בת-מצווה-2": "/studio/blessings/bat-mitzvah-clip",
  "/קליפ-בת-מצווה-קליפ-לבת-מצווה": "/studio/blessings/bat-mitzvah-clip",
  "/מיקרופון-זול-וטוב": "/blog/home-mic-guide",
  "/פורמט-אודיו-מומלץ": "/blog/mp3-vs-wav-studio-guide",
  // קריינות
  "/כמה-עולה-קריינות": "/voiceover",
  "/קריינות-בעברית-חינם": "/voiceover",
  "/קריין-פרסומות/2": "/voiceover",
  "/קריינות-לרדיו/2": "/voiceover",
  "/קריינות-ל-dj/2": "/business/professional-voiceover",
  "/קריינות-חינם-ספירה-לאחור-dj-סילבסטר/2": "/business/professional-voiceover",
  "/הקלטת-נתב-שיחות": "/business/professional-voiceover",
  // תיק עבודות ישן
  "/צחי-נוי-2": "/portfolio",
  /* אושר על ידי הבעלים 4.10.2026. ארבע כתובות שהחזירו 404 באתר החי (curl
     באותו יום). התוכן הישן נבדק בארכיון האינטרנט, והיעד הוא עמוד באותו נושא:
     "קליפ בר מצווה" היה עמוד שירות (75 קליקים ב-Search Console), "יצחק בצרי"
     היה פרק פודקאסט שעדיין ביוטיוב (jBa06DNRXw0). "שירים לבר מצווה" היה
     מדריך, והיעד זמני עד שהמדריך יחזור. */
  "/קליפ-בר-מצווה": "/studio/blessings/video-clip",
  "/studio-podcasters": "/podcast/podcast-studio-modiin",
  "/יצחק-בצרי": "/podcast",
  "/שירים-לבר-מצווה": "/blog/bar-mitzvah-song-recording-guide",
  /* הארכיון חסם את קריאת העמוד, ולכן התוכן הישן לא ידוע. היעד הוא השירות
     שבסרטון היחיד באתר עם המילה "סטנדאפ": "דרשה שילד עושה סטנדאפ" (KzmhWvM8EEM,
     תגית blessings-bar-mitzvah). הבעלים 4.10.2026: "מה שצריך לתקן, נתקן". */
  "/סטנדאפ": "/studio/blessings/bar-mitzvah",
  /* Search Console, ישראל, 16 חודשים (4.10.2026): כתובות ישנות עם קליקים שהחזירו
     404, ויש להן עמוד באותו נושא. המספר הוא קליקים והופעות. */
  "/אולפן-הקלטה-מחירים": "/studio/pricing", // 4, 511
  "/zikukim-karim-leiruim": "/events/attractions/cold-fireworks", // 4, 187
  "/studio-rishon": "/studio", // 3, 304. כמו /אולפן-הקלטות-בראשון
  "/מוזיקה-בירושלים": "/dj-events/cities/jerusalem", // 3, 242
  "/אולפן-הקלטות-לבת-מצווה": "/studio/blessings/bat-mitzvah-clip", // 3, 919. Wayback: "אולפן הקלטות לבת מצווה"
  /* המדריך הישן "שירי סלואו לחתונה" (89 קליקים ב-Search Console) ושתי גרסאות
     שלו מ-Wayback. מ-4.10.2026 יש פוסט ייעודי. /שירי-סלואו-לחתונה-לועזי לא
     כאן: הפוסט עברי בלבד, והפניה אליו לא תענה על החיפוש. */
  "/שירי-סלואו-לחתונה": "/blog/wedding-slow-songs",
  "/שירי-סלואו-לחתונה-2": "/blog/wedding-slow-songs",
  "/שירי-סלואו": "/blog/wedding-slow-songs",
  /* המדריך הישן "שירים לקבלת פנים" (7 קליקים, 865 הופעות), ועותק כפול שלו
     מ-Wayback. מ-4.10.2026 יש פוסט ייעודי. */
  "/שירים-לקבלת-פנים": "/blog/reception-songs",
  "/שירים-לקבלת-פנים/שירים-לקבלת-פנים": "/blog/reception-songs",
  /* הבעלים 5.10.2026: כתובת עם מעט קליקים לא מקבלת מדריך משלה, אלא הפניה
     לעמוד שעשוי לעניין את מי שחיפש אותה. המספרים: קליקים והופעות, Search
     Console, ישראל, 16 חודשים. */
  /* מ-11.10.2026 יש עמוד ייעודי למסיבת רווקות באולפן (אישור הבעלים לפרסום) */
  "/רעיונות-למסיבת-רווקות": "/studio/group-session", // 5, 932
  "/כמה-עדים-צריך-לחתונה-לחופה": "/blog/tips-for-perfect-wedding", // 5, 1,297
  "/דניאל-גרין": "/portfolio", // 4, 392. כמו שאר שמות האמנים מהאתר הישן
  "/שירי-סלואו-לחתונה-לועזי": "/blog/wedding-slow-songs",
  /* היה 410 מ-4.10 (מדריך על סכום המתנה, לא קשור לשירות). הבעלים 5.10.2026:
     גם הוא לפי הכלל של כתובות עם מעט קליקים, ולכן הפניה לעמוד שעשוי לעניין. */
  "/כמה-לתת-לחתונה-כמה-להביא-לחתונה": "/blog/tips-for-perfect-wedding", // 17, 3,306
  /* D57, תוכנית 11.10.2026 סעיף 4 צעד 2: שש כתובות ישנות שעדיין החזירו 404
     (curl, 11.10.2026). הגרסאות שלהן עם התאריך יושבות ב-WORDPRESS_PATTERNS. */
  "/שיר-כניסה-לחופה-הקלטת-ווקאלית-מקצועית": "/studio/recording-song-modiin",
  "/הקלטת-שיר-בר-בת-מצווה": "/studio/recording-song-modiin",
  "/שירים-לחופה": "/blog/wedding-songs-chuppah",
  "/שירים-חופה": "/blog/wedding-songs-chuppah",
  "/הקלטת-דרשה-לבר-בת-מצווה": "/blog/bar-mitzvah-speech",
  "/שיר-כניסה-לחופה-איך-לבחור-זמר-איכותי": "/blog/wedding-songs-chuppah",
};

/**
 * 15.10.2026, אישור הבעלים: כתובות מהאתר הישן (Wayback) שמתחילות באותיות לטיניות
 * (asp, /Video, /dj-...) והחזירו 404. הפניות קבועות רגילות, כי ה-matcher של ה-proxy לא
 * תופס אותן. את השאר ראו WAYBACK_PROXY_PAIRS.
 */
const WAYBACK_404_EQUIVALENTS: Record<string, string> = {
  "/DjSite/HowToChooseADj.asp": "/events/dj-events",
  "/DjSite/OrderProccess.asp": "/events/dj-events",
  "/DjSite/RentEquipment.asp": "/events/equipment",
  "/DjSite/contactus.asp": "/contact",
  "/DjSite/index.asp": "/events/dj-events",
  "/DjSite/workcase.asp": "/events/dj-events",
  "/Video/funtone-eli-belisha-צליל-המתנה": "/business/professional-voiceover",
  "/Video/המתנה-נעימה-פאנטון-עוד-עוזי-נקש": "/business/professional-voiceover",
  "/Video/פאנטון-מירן-שירותי-ניקיון": "/business/professional-voiceover",
  "/Video/פאנטון-קריינות-מקצועית": "/business/professional-voiceover",
  "/Video/פרסומת-לטלפון-קריינות": "/business/professional-voiceover",
  "/Video/צליל-בהמתנה-2": "/business/professional-voiceover",
  "/Video/צליל-המתנה-לטלפון-הקלטה-לנתב-שיחות-2": "/business/professional-voiceover",
  "/Video/צליל-עסקי-לטלפון": "/business/professional-voiceover",
  "/Video/קריינות-באנגלית-לטלפון": "/business/professional-voiceover",
  "/Video/קריינות-למרכזיה-2": "/business/professional-voiceover",
  "/Video/קריינות-לסלולר": "/business/professional-voiceover",
  "/VocalSite/contactus.asp": "/contact",
  "/VocalSite/djpacks.asp": "/events/dj/voice-tags",
  "/VocalSite/funtone.asp": "/business/professional-voiceover",
  "/atraktsiot-le-iruim-bubbles": "/events/attractions/bubble-machine",
  "/contact-us": "/contact",
  "/dj-חתונה-ממה-צריך-להיזהר-ומה-החשיבות": "/events/dj-events",
  "/dj-לחתונה": "/events/dj-events",
  "/dj-לחתונה-למה-כדאי-לנו-להזמין-די-גי-לחת": "/events/dj-events",
  "/dj-לחתונה/דיגיי-לחתונה": "/events/dj-events",
  "/dj.asp": "/events/dj-events",
  "/fantone.asp": "/business/professional-voiceover",
  "/mp3-או-wav": "/blog/mp3-vs-wav-studio-guide",
  "/terms.asp": "/terms",
  "/uncategorized/צליל-עסקי": "/business/professional-voiceover",
  /* 16.10.2026, אישור הבעלים לפי ההמלצה: הכתובות הסבירות (נושא קרוב, לא זהה). */
  "/VocalSite/BroadcastPrices.asp": "/voiceover",
  "/VocalSite/DifferenceJingleBroadcast.asp": "/voiceover",
  "/VocalSite/HowToChooseABroadCaster.asp": "/voiceover",
  "/VocalSite/index.asp": "/voiceover",
  "/VocalSite/studiojerusalem.asp": "/studio/studio-jerusalem",
  "/feedback": "/testimonials",
  "/guns-effect-תותחי-תאורה": "/events/attractions/smoke-cannons-for-events",
  "/karianot.asp": "/voiceover",
  "/studio-modiin": "/studio",
  "/tmlscategory/המלצות-תקליטן-לבר-מצווה": "/events/bar-mitzvah",
  "/tmlscategory/המלצות-תקליטן-לבת-מצווה": "/events/bar-mitzvah",
  "/vocal.asp": "/voiceover",
};

/** Old English slugs used before the current route structure */
const OLD_ENGLISH_SLUGS: Record<string, string> = {
  "/bubble-machine": "/events/attractions/bubble-machine",
  "/confetti-cannon": "/events/attractions/confetti-cannon",
  "/cold-fireworks": "/events/attractions/cold-fireworks",
  "/stage-led-dj": "/events/stage-led-dj",
  "/wedding-smoking-machine": "/events/attractions/wedding-smoking-machine",
  "/smoke-bubble-machine-events": "/events/attractions/bubble-machine",
  "/giant-balloons": "/events/attractions/giant-balloons",
  "/foam-cannon": "/events/attractions/bubble-machine",
  "/smoke-gun": "/events/attractions/smoke-cannons-for-events",
  "/colored-smoke": "/events/attractions/smoke-cannons-for-events",
  "/dry-ice-events": "/events/attractions",
  "/recording-song-modiin": "/studio/recording-song-modiin",
  "/podcast-studio-modiin": "/podcast/podcast-studio-modiin",
  "/studio-jerusalem": "/studio/studio-jerusalem",
  "/studio-shoham": "/studio/studio-shoham",
  "/studio-rehovot": "/studio/studio-rehovot",
  "/gifts": "/studio/recording-song-modiin/gifts",
  "/wedding-attractions-packages": "/events/wedding-attractions-packages",
  "/music-production": "/academy/music-production",
  "/vocal-fix": "/online/vocal-fix",
  "/professional-voiceover": "/business/professional-voiceover",
  "/corporate-voiceover": "/business/professional-voiceover",
  "/dj-voiceover": "/business/professional-voiceover",
  "/dj-drops": "/business/professional-voiceover",
  "/home-studio": "/academy/home-studio",
  "/mixing": "/online/vocal-fix/mixing",
  "/equipment": "/events/equipment",
  "/video/wedding": "/video/event-filming",
  "/online/pitch-correction": "/online/vocal-fix",
  "/online/audio-repair": "/online/vocal-fix",
  "/services/mixing-mastering": "/online/vocal-fix/mixing",
  "/podcast-ron-nesher": "/podcast/podcast-with-grandpa",
  "/original-gift-for-grandpa": "/podcast/podcast-with-grandpa",
  "/link-to-clip-package": "/studio/blessings/video-clip",
  "/link-to-experience-package": "/book",
  "/dj-events/cities": "/events/dj-events",
  "/course-filming": "/academy",
  "/standup": "/events/host",
};

/** /attractions/* /events/attractions/* (with specific overrides) */
const ATTRACTIONS_OVERRIDES: Record<string, string> = {
  "/attractions": "/events/attractions",
  "/attractions/wedding-photography": "/photography/wedding",
  "/attractions/Wedding-photography": "/photography/wedding",
  "/attractions/event-attractions-pricing": "/events/attractions",
  "/attractions/heavy-smoke-large-events":
    "/events/attractions/wedding-smoking-machine/heavy-smoke-large-events",
  "/attractions/wedding-smoking-machine/heavy-smoke-large-events":
    "/events/attractions/wedding-smoking-machine/heavy-smoke-large-events",
  "/attractions/smoke-bubble-machine-events":
    "/events/attractions/bubble-machine/smoke-bubble-machine-events",
  "/attractions/bubble-machine/smoke-bubble-machine-events":
    "/events/attractions/bubble-machine/smoke-bubble-machine-events",
  "/attractions/attractions2026": "/events/attractions",
  "/attractions/wedding-smoking-machine":
    "/events/attractions/wedding-smoking-machine",
  "/attractions/bubble-machine": "/events/attractions/bubble-machine",
  "/attractions/cold-fireworks": "/events/attractions/cold-fireworks",
  "/attractions/confetti-cannon": "/events/attractions/confetti-cannon",
  "/attractions/giant-balloons": "/events/attractions/giant-balloons",
  "/attractions/led-booth": "/events/stage-led-dj",
  "/attractions/stage-led-dj": "/events/stage-led-dj",
  "/events/attractions/led-booth": "/events/stage-led-dj",
  "/events/led-booth": "/events/stage-led-dj",
  "/attractions/smoke-cannons-for-events":
    "/events/attractions/smoke-cannons-for-events",
};

/**
 * ה-source בצורה שהנתב של Next באמת משווה אליה: תווים שאינם ASCII מקודדים
 * באחוזים (הצורה של encodeURI), וכל השאר נשאר כמו שהוא.
 *
 * למה: הנתב משווה את ה-regex של ה-redirect מול parsedUrl.pathname, שהוא
 * הנתיב כפי שהגיע בבקשה, כלומר מקודד (/%D7%AA...). מקור בעברית גולמית לא
 * תאם אף פעם, ולכן כל 214 המפתחות העבריים במפה החזירו 404 באתר החי (ED-01).
 * ראו node_modules/next/dist/server/lib/router-utils/resolve-routes.js:
 * parseUrl(req.url) בשורה 91 ו-route.match(curPathname) בשורה 238. רק
 * ה-matcher של ה-proxy מנסה גם את הצורה המפוענחת (שורות 335-341).
 *
 * מחליפים ולא מוסיפים רשומה שנייה: הצורה הגולמית לא תואמת אף פעם, ושכפול רק
 * היה מנפח את מספר ההפניות (ב-Vercel יש תקרה של 1,024, ראו
 * node_modules/next/dist/docs/01-app/02-guides/redirecting.md:292).
 *
 * מקודדים רק את רצפי ה-non-ASCII ולא את כל המחרוזת, כדי שתחביר הדפוסים
 * (`:path*`, `\\+`) יישאר שלם. לרצף עברי זה בדיוק encodeURI, כלומר hex באותיות
 * גדולות (%D7). קידוד באותיות קטנות (%d7) לא תואם את ה-source הזה ב-Vercel,
 * ולכן כל מקור מקודד מקבל תאום. ראו withLowercaseHexTwin למטה.
 */
export function toNextSource(source: string): string {
  return source.replace(/[^\x00-\x7F]+/g, (run) => encodeURI(run));
}

/**
 * כל מקור מקודד מקבל תאום באותיות hex קטנות (%d7 לצד %D7), מיד אחריו ועם אותו יעד.
 *
 * למה: WordPress הוציא את הקישורים שלו בקידוד באותיות קטנות, וכך הם יושבים
 * היום באתרים חיצוניים ובגוגל. בצילום Wayback של דף הבית הישן
 * (web.archive.org/web/20211225132510/https://www.yakircohen.com/) כל 54
 * הקישורים העבריים הם %d7 באותיות קטנות, כולם עם www וכולם עם סלאש בסוף.
 * באתר החי, 8.10.2026 (curl): /שיר-במתנה באותיות גדולות קיבל 308 לעמוד המתנות,
 * ובאותיות קטנות 404. הסיבה: Next בונה את ה-regex עם sensitive: false, אבל
 * שומר ב-routes-manifest רק את compiled.source, בלי הדגל i
 * (node_modules/next/dist/lib/build-custom-route.js:17, 24, 28), ו-Vercel מנתב
 * לפי ה-regex הזה. ההערה הקודמת כאן טענה שאותיות קטנות תואמות, והבדיקה בדקה רק
 * את ה-matcher של next start, שכן מקבל את הדגל.
 *
 * למה לא בפענוח ב-proxy.ts, כמו goneEquivalent: redirects רצים לפני ה-proxy
 * (node_modules/next/dist/docs/01-app/02-guides/redirecting.md:293). כתובת
 * WordPress מגיעה עם סלאש ולעתים עם www, ואז כלל הסלאש או כלל ה-www
 * (next.config.ts:141-158) תופסים אותה קודם, וה-proxy היה נותן קפיצה שנייה
 * (נבדק ב-curl: הצורה עם הסלאש קיבלה 308 לאותה כתובת בלי סלאש, ואז 404).
 * כתובת עם תאריך הייתה נופלת ל-"/2019/:path*" ומגיעה לאינדקס הבלוג במקום
 * למדריך (נבדק ב-curl: /2019/11/05/שירי-סלואו-לחתונה/ באותיות קטנות הגיע ל-/blog).
 * התאום יושב באותו מקום ברשימה כמו המקור, ולכן שלושת המקרים מגיעים ליעד בקפיצה אחת.
 *
 * המחיר: 337 כללים נוספים (8.10.2026: 472 מקורות, 809 כללים יחד עם התאומים).
 * סך הכל עדיין מתחת ל-1,000, הסף שבו Next מזהיר
 * (node_modules/next/dist/lib/load-custom-routes.js:473), ומתחת לתקרה של 1,024
 * ב-Vercel. הבדיקה ב-legacy-redirects.test.ts שומרת על שני הספים.
 * קידוד מעורב (%D7%a9) לא מכוסה: אף מקור מוכר לא מייצר אותו.
 */
export function withLowercaseHexTwin(redirect: LegacyRedirect): LegacyRedirect[] {
  const lower = redirect.source.replace(/%[0-9A-F]{2}/g, (escape) => escape.toLowerCase());
  return lower === redirect.source ? [redirect] : [redirect, { ...redirect, source: lower }];
}

/**
 * קפיצה אחת במקום שלוש.
 *
 * כתובת ישנה מ-WordPress מגיעה כמו www.yakircohen.com/צרו-קשר/ (עם www ועם
 * סלאש). עד עכשיו היא עברה שלוש הפניות: Next הוריד את הסלאש, כלל ה-www
 * העביר לדומיין בלי www, ורק אז המפה הזו הפנתה ליעד. 308, 308, 308 ואז 200.
 *
 * עכשיו כל כלל במפה תופס את הכתובת עם סלאש ובלעדיו (`{/}?`, התחביר מהתיעוד
 * של Next: node_modules/next/dist/docs/01-app/02-guides/self-hosting.md:250),
 * ומפנה ליעד מלא עם הדומיין הקנוני. הכלל לא מוגבל ל-host, ולכן הוא תופס גם
 * את www וגם את הדומיין בלי www, וכל אחד מהם מגיע ליעד בקפיצה אחת. זה עובד
 * רק כי next.config.ts מכבה את הסרת הסלאש האוטומטית (skipTrailingSlashRedirect)
 * ומציב את הכללים האלה לפני כלל ה-www.
 */
export function withOptionalTrailingSlash(source: string): string {
  const trimmed = source.length > 1 ? source.replace(/\/+$/, "") : source;
  return trimmed === "/" ? trimmed : `${trimmed}{/}?`;
}

export function toAbsoluteDestination(destination: string): string {
  return /^https?:\/\//.test(destination) ? destination : `${SITE_URL}${destination}`;
}

function toRedirect(source: string, destination: string): LegacyRedirect {
  return {
    source: withOptionalTrailingSlash(toNextSource(source)),
    destination: toAbsoluteDestination(destination),
    permanent: true as const,
  };
}

/**
 * יעד עם query (היום רק /studio/upload לוואטסאפ) מקבל שני כללים מפורשים,
 * עם סלאש ובלעדיו, במקום `{/}?`. זו בדיוק הצורה שעובדת היום באתר החי (308
 * לוואטסאפ, נבדק 4.10), ולא מכניסים לה קבוצה שאי אפשר לבדוק מקומית.
 *
 * למה אי אפשר לבדוק מקומית: ב-next start, השרת של Next בונה מחדש את ה-query
 * של היעד ומקודד רק ערכים שהגיעו מהבקשה עצמה
 * (node_modules/next/dist/server/server-route-utils.js:13-27). הטקסט העברי
 * של הוואטסאפ יוצא גולמי, ו-Node זורק ERR_INVALID_CHAR (500). ב-Vercel
 * ההפניות רצות משכבת הניתוב ולא מהשרת הזה, ולכן באתר החי זה תקין.
 */
function toRedirects(source: string, destination: string): LegacyRedirect[] {
  if (!destination.includes("?")) return [toRedirect(source, destination)];
  const exact = toNextSource(source.length > 1 ? source.replace(/\/+$/, "") : source);
  const absolute = toAbsoluteDestination(destination);
  return [
    { source: exact, destination: absolute, permanent: true as const },
    { source: `${exact}/`, destination: absolute, permanent: true as const },
  ];
}

export function getLegacyRedirects(): LegacyRedirect[] {
  const fromMap = Object.entries(LEGACY_PATH_MAP).flatMap(([source, destination]) =>
    toRedirects(source, destination),
  );

  const fromCanonical = Object.entries(CANONICAL_REDIRECTS).map(
    ([source, destination]) => toRedirect(source, destination),
  );

  const fromAttractions = Object.entries(ATTRACTIONS_OVERRIDES).map(
    ([source, destination]) => toRedirect(source, destination),
  );

  const fromHebrewSlugs = Object.entries(HEBREW_SERVICE_SLUGS).map(
    ([source, destination]) => toRedirect(source, destination),
  );

  const fromGscHebrew = Object.entries(HEBREW_GSC_NOT_INDEXED).map(
    ([source, destination]) => toRedirect(source, destination),
  );

  const fromWayback404 = Object.entries(WAYBACK_404_EQUIVALENTS).map(
    ([source, destination]) => toRedirect(source, destination),
  );

  const fromOldEnglishSlugs = Object.entries(OLD_ENGLISH_SLUGS).map(
    ([source, destination]) => toRedirect(source, destination),
  );

  const fromWordpressPatterns: LegacyRedirect[] = WORDPRESS_PATTERNS.map(
    ({ source, destination }) => toRedirect(source, destination),
  );

  /** Catch-all: any other /attractions/:path /events/attractions/:path */
  const attractionsCatchAll = toRedirect(
    "/attractions/:path*",
    "/events/attractions/:path*",
  );

  return [
    ...fromWordpressPatterns,
    ...fromMap,
    ...fromHebrewSlugs,
    ...fromGscHebrew,
    ...fromWayback404,
    ...fromOldEnglishSlugs,
    ...fromCanonical,
    ...fromAttractions,
    attractionsCatchAll,
  ].flatMap(withLowercaseHexTwin);
}
