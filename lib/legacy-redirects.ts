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
  ["/product/שיפור-איכות-הקלטה", "/online/vocal-fix"], // 4
  ["/product/הקלטת-שיר-באולפן-מסלול-חוויה", "/studio/recording-song-modiin"], // 3
  ["/product/2-רובי-עשן-לאירועים", "/events/attractions/smoke-cannons-for-events"], // 3
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

export const CART_QUERY_KEY = "add-to-cart";

export function clearCartQuery(url: { searchParams: URLSearchParams; search: string }): boolean {
  if (!url.searchParams.has(CART_QUERY_KEY)) return false;
  url.search = "";
  return true;
}

/* req.nextUrl.pathname מגיע מקודד, ולכן נתיב עברי נרשם כאן מקודד.
   "/%D7%9B%D7%9E%D7%94-..." הוא /כמה-לתת-לחתונה-כמה-להביא-לחתונה: מדריך ישן
   על סכום המתנה בחתונה (17 קליקים), בלי קשר לשירות. אושר כ-410 על ידי
   הבעלים 4.10.2026, כי הפניה לעמוד לא קשור נספרת אצל גוגל כ-soft 404. */
export const GONE_EXACT_PATHS = [
  "/xmlrpc.php",
  "/index.aspx",
  "/main.asp",
  "/%D7%9B%D7%9E%D7%94-%D7%9C%D7%AA%D7%AA-%D7%9C%D7%97%D7%AA%D7%95%D7%A0%D7%94-%D7%9B%D7%9E%D7%94-%D7%9C%D7%94%D7%91%D7%99%D7%90-%D7%9C%D7%97%D7%AA%D7%95%D7%A0%D7%94",
] as const;

const WORDPRESS_PATTERNS: Array<{ source: string; destination: string }> = [
  /* /product, /product-tag, /product-category, /category, /tag, /shop-2, /wp-*
     ו-/xmlrpc.php הועברו ל-410 ב-proxy.ts. ראו GONE_PATH_PREFIXES למעלה. */
  /* הכתובות עם התאריך של מדריך הסלואו (Wayback). לפני /2019 ו-/2021. */
  { source: "/2019/11/05/שירי-סלואו-לחתונה", destination: "/blog/wedding-slow-songs" },
  { source: "/2021/08/25/שירי-סלואו", destination: "/blog/wedding-slow-songs" },
  { source: "/2019/:path*",              destination: "/blog" },
  { source: "/2020/:path*",              destination: "/blog" },
  /* שתי הכתובות עם התאריך של אותו מאמר (Wayback, 2021). לפני /2021/:path*,
     שאחרת תופס אותן ושולח לאינדקס הבלוג. */
  { source: "/2021/05/15/שירים-לבת-מצווה", destination: "/blog/bat-mitzvah-songs" },
  { source: "/2021/09/06/רשימת-שירים-לבת-מצווה", destination: "/blog/bat-mitzvah-songs" },
  { source: "/2021/:path*",              destination: "/blog" },
  { source: "/2022/:path*",              destination: "/blog" },
  { source: "/privacy-policy/:path*",    destination: "/privacy" },
  { source: "/privacy-policy",           destination: "/privacy" },
  { source: "/feed",                     destination: "/blog" },
  { source: "/feed/:path*",              destination: "/blog" },
  { source: "/author/:path*",            destination: "/about" },
  { source: "/page/:path*",              destination: "/blog" },
  { source: "/2018/:path*",              destination: "/blog" },
  { source: "/2017/:path*",              destination: "/blog" },
  { source: "/2023/:path*",              destination: "/blog" },
  { source: "/2024/:path*",              destination: "/blog" },
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
  "/דרשה-לבר-מצווה-קצר-ולעניין": "/studio/blessings/bar-mitzvah",
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
  "/המלצות-djs": "/about",
  "/reviews": "/about",
  "/מי": "/about",
  "/about-us": "/about",
  "/who-we-are": "/about",
  "/\\+6": "/contact",
  // Old portfolio pages
  "/דניאל-יונה": "/portfolio",
  "/גקו-אייזנברג": "/portfolio",
  "/ניר-בנילוש": "/portfolio",
  "/אוהד-בוזגלו": "/portfolio",
  "/רגב-הוד": "/portfolio",
  "/צחי-נוי": "/portfolio",
  "/גילי-כהן": "/portfolio",
  "/יקיר-איזמירלי": "/portfolio",
  "/ישראל-אהרוני": "/portfolio",
  "/ליאור-מיארה": "/portfolio",
  "/אמיר-חצרוני": "/portfolio",
  "/דורון-מירן": "/portfolio",
  "/דניס-צרקוב": "/portfolio",
  "/דניס-צ׳רקוב": "/portfolio",
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
 * (`:path*`, `\\+`) יישאר שלם. לרצף עברי זה בדיוק encodeURI. ה-regex נבנה
 * עם sensitive: false (node_modules/next/dist/lib/build-custom-route.js:17),
 * ולכן גם קידוד באותיות קטנות (%d7) תואם.
 */
export function toNextSource(source: string): string {
  return source.replace(/[^\x00-\x7F]+/g, (run) => encodeURI(run));
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
    ...fromOldEnglishSlugs,
    ...fromCanonical,
    ...fromAttractions,
    attractionsCatchAll,
  ];
}
