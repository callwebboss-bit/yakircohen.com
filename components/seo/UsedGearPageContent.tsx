import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import ContextualIntroParagraph from "@/components/seo/ContextualIntroParagraph";
import ServiceHubLinks from "@/components/services/ServiceHubLinks";
import { buildWhatsAppHref } from "@/lib/whatsapp";

const WHATSAPP_TEXT =
  "שלום, הגעתי מעמוד הציוד באתר ואשמח לפרטים על...";

const CATEGORIES = [
  {
    id: "sound",
    title: "הגברה וסאונד",
    icon: "🔊",
    description:
      "רמקולים מוגברים RCF 745 עם סאבוופר פעיל. המערכת עבדה בהפקות שלנו ותוחזקה לפני כל אירוע. מתאימה לאולמות, חצרות ואירועים בינוניים.",
  },
  {
    id: "dj",
    title: "עמדות די ג'יי",
    icon: "🎛",
    description:
      "שני קונטרולרים Native Instruments Traktor S4 MK3 בתפקוד מלא. נבדקים לפני כל שימוש. מתאים לתקליטנים מקצועיים ולהפקות מוזיקה.",
  },
  {
    id: "led",
    title: "עמדות לד",
    icon: "💡",
    description:
      "סט עמדות LED לתאורה דינמית באירועים. ציוד שעבד בהפקות חיות ונשמר בקפידה. מתאים לחתונות, הצגות ורקע ויזואלי.",
  },
  {
    id: "studio",
    title: "אולפן ויצירה",
    icon: "🎙",
    description:
      "מוניטורי KRK Rokit 8, כרטיס קול UAD Twin ומיקרופון Sphere L22. ציוד אולפן יד שנייה שהופעל בסביבה מבוקרת. מתאים לאולפן ביתי רציני.",
  },
  {
    id: "effects",
    title: "תאורה ואפקטים",
    icon: "🌟",
    description:
      "מכונת עשן, מכונת בועות עשן, תותחי קיטור ותותח קונפטי. בנוסף ציוד תאורה לצילום פודקאסט ווידאו. הכל יצא להפקות בשטח.",
  },
  {
    id: "accessories",
    title: "אביזרים נלווים",
    icon: "🎚",
    description:
      "מקליט לפודקאסט, מיקרופונים, סטנדים וכבלים מקצועיים. ציוד בדוק ותקין, מוכן לעבודה. פתרון למי שמקים אולפן ביתי מאפס.",
  },
] as const;

const USED_GEAR_RELATED = [
  {
    href: "/studio",
    title: "אולפן הקלטות",
    description: "הקלטת שיר, ברכות ופודקאסט במודיעין.",
  },
  {
    href: "/events/dj-events",
    title: "DJ לאירועים",
    description: "תקליטן עם ציוד מהמלאי שאנחנו מוכרים כאן.",
  },
  {
    href: "/events/equipment",
    title: "השכרת הגברה",
    description: "מערכות הגברה לאירועים קטנים ובינוניים.",
  },
  {
    href: "/events/attractions",
    title: "אטרקציות לאירוע",
    description: "עשן כבד, זיקוקים קרים ובועות עם מפעיל.",
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
      <Section padding="sm" className="border-b border-border">
        <Container className="max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            ציוד מקצועי למכירה
          </p>
          <h1 className="text-hero mt-4 font-semibold text-foreground">
            ציוד מקצועי למכירה מבית יקיר כהן הפקות
          </h1>
          <p className="text-lead mt-4 text-muted-foreground">
            ציוד אולפן, הגברה ותאורה שעבד אצלנו בשטח
          </p>
          <ContextualIntroParagraph pathname="/equipment/used-gear" className="mt-4 max-w-2xl" />
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            כל פריט כאן יצא מהפקות שלנו. הרכישה כוללת הסבר על התפעול ועזרה ראשונית
            בהתקנה.
          </p>
        </Container>
      </Section>

      <Section padding="sm">
        <Container className="max-w-5xl space-y-20">
          <section aria-labelledby="inventory-heading">
            <header>
              <h2
                id="inventory-heading"
                className="font-serif text-section-title font-semibold text-foreground"
              >
                מה יש למכירה
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                הרשימה מתעדכנת לפי המלאי. כל פריט נבדק לפני מסירה.
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

          <section
            aria-labelledby="condition-heading"
            className="rounded-2xl border border-border bg-surface p-8"
          >
            <h2
              id="condition-heading"
              className="font-serif text-section-title font-semibold text-foreground"
            >
              שקיפות לגבי מצב הציוד
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              אנחנו מוסרים תיעוד: שנת ייצור, היסטוריית שימוש ומצב נוכחי. הציוד
              הגיע מעבודה אמיתית, לא ממחסן. יש לנו ידע ישיר על איך הוא מתנהג
              באירוע. הרכישה כוללת עזרה ראשונית בהתקנה ובהפעלה.
            </p>
          </section>

          <section
            aria-labelledby="cta-heading"
            className="rounded-2xl border border-brand-red/25 bg-surface px-6 py-12 text-center sm:px-10"
          >
            <h2
              id="cta-heading"
              className="font-serif text-section-title font-semibold text-foreground"
            >
              לפרטים נוספים
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
              לבדיקת מלאי ותיאום פגישה, שלחו הודעה בוואטסאפ.
            </p>
            <Button
              as="a"
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8"
              aria-label="שלחו הודעה בוואטסאפ לקבלת פרטים על ציוד מקצועי למכירה"
            >
              שלחו הודעה בוואטסאפ
            </Button>
          </section>

          <ServiceHubLinks
            headingId="used-gear-related-heading"
            heading="שירותים קשורים"
            subheading="ציוד יד שנייה שמשלים את מה שאנחנו מפעילים באירועים ובאולפן."
            links={USED_GEAR_RELATED}
            columns={2}
          />
        </Container>
      </Section>
    </article>
  );
}
