import Link from "next/link";
import { buildWhatsAppHref } from "@/lib/whatsapp";

const WHATSAPP_TEXT =
  "שלום, הגעתי מעמוד הציוד באתר ואשמח לפרטים על...";

const CATEGORIES = [
  {
    id: "sound",
    title: "הגברה וסאונד",
    icon: "🔊",
    description:
      "רמקולים מוגברים RCF 745 כולל סאבוופר פעיל — ציוד הגברה שנבחר לעבוד בהפקות מקצועיות. המערכת תוחזקה ברמת פרימיום לאורך כל חיי השירות שלה. מתאימה לאולמות, מרחבים פתוחים ואירועים בכל גודל.",
  },
  {
    id: "dj",
    title: "עמדות די ג'יי",
    icon: "🎛",
    description:
      "שני קונטרולרים Native Instruments Traktor S4 MK3 בתפקוד מלא — ציוד די ג'יי שנשמר בקפידה ובדוק לפני כל שימוש. עמדת תקלוט מוכנה לעבודה, מתאימה לתקלוטנים מקצועיים ולהפקות מוסיקה.",
  },
  {
    id: "led",
    title: "עמדות לד",
    icon: "💡",
    description:
      "סט עמדות LED מקצועיות לתאורה דינמית ואפקטים ויזואליים. ציוד תאורה שעבד בהפקות חיות ושמור בצורה מדוקדקת. מתאים לאירועים, הצגות ותאורת רקע ויזואלית.",
  },
  {
    id: "studio",
    title: "אולפן ויצירה",
    icon: "🎙",
    description:
      "מוניטורי KRK Rokit 8, כרטיס קול אולפני UAD Twin ומיקרופון Sphere L22. ציוד אולפן יד שנייה ברמה גבוהה, שהופעל בסביבה מבוקרת ותוחזק כהלכה. מתאים לאולפן ביתי ברמת פרימיום.",
  },
  {
    id: "effects",
    title: "תאורה ואפקטים",
    icon: "🌟",
    description:
      "מכונת עשן, מכונת בועות עשן, תותחי קיטור לרגעי שיא ותותח קונפטי. בנוסף, ציוד תאורה ייעודי לצילום פודקאסט ווידיאו. כל הציוד יצא להפקות שטח ממשיות.",
  },
  {
    id: "accessories",
    title: "אביזרים נלווים",
    icon: "🎚",
    description:
      "מקליט לפודקאסט, מיקרופונים מקצועיים, סטנדים וכבלים מקצועיים בכמות. ציוד בדוק ותקין, מוכן לעבודה. פתרון מלא למי שמקים אולפן ביתי מאפס.",
  },
] as const;

export default function UsedGearPageContent() {
  const whatsappHref = buildWhatsAppHref({
    text: WHATSAPP_TEXT,
    utm_source: "website",
    utm_campaign: "used_gear_cta",
  });

  return (
    <article>
      {/* Hero */}
      <header className="border-b border-border px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            ציוד מקצועי למכירה
          </p>
          <h1 className="mt-4 text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl sm:leading-snug lg:text-5xl">
            ציוד מקצועי למכירה מבית יקיר כהן הפקות
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            ציוד אולפן, הגברה ותאורה מתוחזק ברמת פרימיום
          </p>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
            כל הציוד המוצע כאן עבד בהפקות שלנו ותוחזק בקפידה. הרכישה כוללת
            הדרכה מלאה, עזרה ראשונית בתפעול, וטיפים מאנשי מקצוע.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-5xl space-y-20 px-4 py-16 sm:px-6 lg:px-8">
        {/* Trust line 1 */}
        <p className="max-w-xl border-s-2 border-brand-red ps-4 text-sm text-muted-foreground">
          ציוד שנבחר, נשמר והופעל על ידי אנשי מקצוע
        </p>

        {/* Inventory categories */}
        <section aria-labelledby="inventory-heading">
          <header>
            <h2
              id="inventory-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              מה יש למכירה
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              כל הפריטים הגיעו מהפקות פעילות — לא מאחסון. הרשימה מתעדכנת בהתאם
              למלאי הקיים.
            </p>
          </header>
          <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((cat) => (
              <li
                key={cat.id}
                className="rounded-2xl border border-border bg-surface p-6"
              >
                <p className="text-2xl" aria-hidden>
                  {cat.icon}
                </p>
                <h3 className="mt-3 font-semibold text-foreground">
                  {cat.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {cat.description}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* Trust line 2 */}
        <p className="max-w-xl border-s-2 border-brand-red ps-4 text-sm text-muted-foreground">
          כל פריט נבדק, כויל ותוחזק בסביבה מקצועית
        </p>

        {/* Condition and transparency */}
        <section
          aria-labelledby="condition-heading"
          className="rounded-2xl border border-border bg-surface p-8"
        >
          <h2
            id="condition-heading"
            className="text-xl font-semibold text-foreground sm:text-2xl"
          >
            שקיפות לגבי מצב הציוד
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            אנחנו מוסרים את הציוד עם תיעוד מלא — שנת ייצור, היסטוריית שימוש
            ומצב נוכחי. הציוד הגיע מעבודה אמיתית בשטח, לא מאחסון, וזה אומר
            שיש לנו ידע ישיר על ביצועיו. הרכישה כוללת עזרה ראשונית בהתקנה
            ובהפעלה, ממה שנלמד בניסיון שטח אמיתי.
          </p>
        </section>

        {/* Trust line 3 */}
        <p className="max-w-xl border-s-2 border-brand-red ps-4 text-sm text-muted-foreground">
          הציוד הגיע מעבודה אמיתית בשטח, לא מאחסון
        </p>

        {/* CTA */}
        <section
          aria-labelledby="cta-heading"
          className="rounded-2xl border border-brand-red/25 bg-surface px-6 py-12 text-center sm:px-10"
        >
          <h2
            id="cta-heading"
            className="text-xl font-semibold text-foreground sm:text-2xl"
          >
            לפרטים נוספים
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
            לפרטים נוספים, בדיקת מלאי ותיאום פגישה, שלחו לנו הודעה.
          </p>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex rounded-md bg-brand-red px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-red-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
            aria-label="שלחו הודעה בוואטסאפ לקבלת פרטים על ציוד מקצועי למכירה"
          >
            שלחו הודעה בוואטסאפ
          </a>
        </section>

        {/* Related services */}
        <nav aria-label="שירותים קשורים">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            שירותים קשורים
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/studio"
              className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-brand-red/40 hover:text-brand-red"
            >
              אולפן הקלטות
            </Link>
            <Link
              href="/events/dj-events"
              className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-brand-red/40 hover:text-brand-red"
            >
              אירועי DJ
            </Link>
          </div>
        </nav>
      </div>
    </article>
  );
}
