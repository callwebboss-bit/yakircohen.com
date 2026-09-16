/**
 * template-pages.mjs - רשימת 12 התבניות שכל שער מדידה רץ עליהן.
 *
 * למה רשימה משותפת ולא רשימה לכל כלי: בסבב הקודם audit:a11y בדק 8 עמודים,
 * cypress בדק 6 אחרים, ו-Lighthouse נמדד על 5. שלוש רשימות שונות אומרות
 * שאי אפשר להשוות מדידה למדידה. אחת בלבד, וכל כלי מייבא ממנה.
 *
 * הבחירה: תבנית אחת מכל משפחת רינדור באתר, לא העמודים הפופולריים.
 * עמוד שהוא היחיד מסוגו יכול להישבר בלי שאף מדידה אחרת תרגיש.
 *
 * מה זה לא: זו אינה רשימת העמודים החשובים מסחרית ואינה מפת האתר.
 * audit:seo-diff רץ על כל 315 הכתובות. הרשימה הזו היא לכלים יקרים
 * שאי אפשר להריץ על הכל, כלומר צילומי מסך, Lighthouse ו-axe.
 */

/** @type {{path: string, why: string}[]} */
export const TEMPLATE_PAGES = [
  { path: "/", why: "עמוד הבית, HomePageSections" },
  { path: "/studio", why: "hub שירות דרך ServicePageLayout" },
  { path: "/studio/recording-song-modiin", why: "עלה שירות עם גלריה ומחירון" },
  { path: "/podcast", why: "hub שני, אימות שה-hub אינו מקרה יחיד" },
  { path: "/events", why: "hub אירועים, הצפוף ביותר בסכמה" },
  { path: "/events/dj-events", why: "עמוד עם טבלה גלילה ו-scrollable region" },
  { path: "/events/attractions", why: "EventsBookingWizard, מסלול ההכנסה" },
  { path: "/book", why: "אשף ההזמנה, הרכיב האינטראקטיבי הגדול" },
  { path: "/pricing", why: "PricingComparisonTable ו-sticky bar" },
  { path: "/contact", why: "טופס, מפה, ו-address" },
  { path: "/about", why: "תוכן ארוך, blockquote, ותמונות" },
  { path: "/blog/prepare-voice-podcast-studio", why: "תבנית מאמר, dangerouslySetInnerHTML" },
  { path: "/blog/category/podcast", why: "עמוד קטגוריה סטטי (16.9.2026): ArticleFeed מלא ושבבי קטגוריות" },
];

/** רוחבי הצילום. 375 נייד, 768 טאבלט, 1440 דסקטופ. */
export const VIEWPORTS = [
  { name: "375", width: 375, height: 812 },
  { name: "768", width: 768, height: 1024 },
  { name: "1440", width: 1440, height: 900 },
];

export const PATHS = TEMPLATE_PAGES.map((p) => p.path);

/**
 * חמשת העמודים ש-Lighthouse רץ עליהם.
 *
 * למה חמישה ולא שנים עשר: הרצה עם devtools throttling לוקחת כדקה לעמוד,
 * וכל עמוד נמדד שלוש פעמים כדי לקחת חציון. שנים עשר עמודים היו הופכים
 * כל מדידת לפני ואחרי לשעה, וזה מבטיח שהיא לא תרוץ.
 *
 * למה דווקא אלה: חמש משפחות רינדור שונות, לא חמשת העמודים הפופולריים.
 * עמוד שני מאותה משפחה מוסיף זמן ולא מוסיף מידע.
 */
export const LIGHTHOUSE_PAGES = [
  { path: "/", why: "עמוד הבית, תמונת hero ומסלול ה-LCP הכבד ביותר" },
  { path: "/studio", why: "hub שירות, נציג 9 ה-hubs" },
  { path: "/studio/recording-song-modiin", why: "עלה שירות עם גלריה ומחירון" },
  { path: "/book", why: "אשף ההזמנה, המשקל הגדול ביותר של JS בצד לקוח" },
  { path: "/blog/prepare-voice-podcast-studio", why: "תבנית מאמר, נציגת 87 הפוסטים" },
];
