import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BLUR_DATA_URL } from "@/lib/blur";
import { constructMetadata } from "@/lib/metadata";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { SITE_NAME } from "@/lib/constants";


export const metadata: Metadata = constructMetadata({
  title: "אודות יקיר כהן הפקות",
  description:
    "מעל 20 שנה של אהבה לסאונד. אולפן הקלטות במודיעין, הפקת פודקאסטים, אטרקציות לאירועים ושירותי DJ. הכירו את יקיר כהן והמשפחה המקצועית שלנו.",
  slug: "about",
});


const SERVICE_CARDS = [
  {
    href: "/podcast",
    imageSrc: "/images/services/podcast/אולפן פודקאסט - יקיר כהן הפקות.webp",
    imageAlt: "אולפן הפודקאסט של יקיר כהן הפקות",
    label: "פודקאסטים",
    cta: "דבר איתי עכשיו",
  },
  {
    href: "/events/attractions",
    imageSrc: "/images/services/events/attractions/cold-fireworks/Cold Sparkler Entrance.webp",
    imageAlt: "אטרקציות לאירועים  -  זיקוקים קרים",
    label: "אטרקציות לאירוע",
    cta: "לפרטים",
  },
  {
    href: "/studio",
    imageSrc: "/images/services/studio/hub/אמא מקליטה באולפן.webp",
    imageAlt: "הפקת שיר באולפן יקיר כהן הפקות",
    label: "הפקת שיר באולפן",
    cta: "לפרטים",
  },
  {
    href: "/events/dj-events",
    imageSrc: "/images/services/events/attractions/led-booth/יקיר כהן באירוע.webp",
    imageAlt: "תקליטן לחתונה  -  יקיר כהן",
    label: "תקליטן לחתונה",
    cta: "לפרטים",
  },
] as const;

const VALUES = [
  {
    title: "שקט נפשי מוחלט",
    body: "כשסוגרים איתנו חבילה, אפשר לנשום. אנחנו דואגים להכול, מהתיאום מול האולם ועד הרגע האחרון ברחבה. אתם רק נהנים.",
  },
  {
    title: "מקצועיות בלי פשרות",
    body: "אנחנו מדברים כמו חברים אבל עובדים כמו הפקה גדולה. ציוד מהשורה הראשונה, גיבוי לכל תרחיש, הקפדה על כל פרט.",
  },
  {
    title: "חיבור אישי לפני הכול",
    body: "הכול מתחיל בשיחה בגובה העיניים. כשאנחנו מבינים אתכם לעומק, אנחנו יודעים לדייק את החוויה בדיוק לכם.",
  },
] as const;

const WHY_US = [
  "שקט נפשי אמיתי: מישהו חושב על כל פרט בשבילכם.",
  "שילוב שירותים במקום אחד: אולפן, תקליטנים, אטרקציות, תאורה וסאונד, הכול תחת קורת גג אחת.",
  "התאמה אישית מלאה: אין חבילות גנריות. כל אירוע נבנה סביב הטעם, הסגנון והחלומות שלכם.",
] as const;

export default function AboutPage() {
  const whatsappHref = buildWhatsAppHref({
    text: "היי יקיר! קראתי על יקיר כהן הפקות ורוצה לשמוע יותר. מה הצעד הראשון?",
    utm_source: "about",
    utm_campaign: "about_hero_cta",
  });

  return (
    <div className="bg-background">
        {/* ── Hero ── */}
        <section className="relative overflow-hidden border-b border-border bg-background">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_-10%,rgba(212,43,43,0.12),transparent_55%)]"
            aria-hidden="true"
          />

          <div className="relative mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
            <nav aria-label="ניווט ארגוני" className="mb-6">
              <ol className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <li>
                  <Link
                    href="/"
                    className="transition-colors duration-fast ease-luxury hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
                  >
                    ראשי
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="font-medium text-foreground" aria-current="page">
                  אודות
                </li>
              </ol>
            </nav>

            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
              {SITE_NAME}
            </p>

            <h1 className="mt-3 font-serif text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              נעים להכיר.
              <br />
              אנחנו יקיר כהן הפקות
            </h1>

            <p className="mt-4 text-sm font-medium text-muted-foreground sm:text-base">
              מפיק מוזיקלי &nbsp;•&nbsp; איש סאונד &nbsp;•&nbsp; דיג&#39;יי
            </p>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              אוהבים לעשות שמח כבר מעל 20 שנה. אולפן הקלטות במודיעין, הפקות
              פודקאסט, אטרקציות לאירועים ושירותי עריכת סאונד ברמה הגבוהה ביותר.
            </p>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-brand-red px-7 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(212,43,43,0.3)] transition-[background-color,box-shadow] duration-normal ease-luxury hover:bg-brand-red-light hover:shadow-[0_0_32px_rgba(212,43,43,0.45)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
                aria-label="פתיחת שיחת וואטסאפ עם יקיר כהן הפקות"
              >
                דברו איתנו בוואטסאפ ←
              </a>
              <Link
                href="/about/faq"
                className="text-sm font-medium text-muted-foreground underline-offset-4 transition-colors duration-fast ease-luxury hover:text-brand-red hover:underline"
              >
                שאלות נפוצות
              </Link>
            </div>
          </div>
        </section>

        {/* ── Service snapshot grid ── */}
        <section
          className="mx-auto max-w-[72rem] px-4 py-14 sm:px-6 sm:py-16 lg:px-8"
          aria-label="השירותים שלנו"
        >
          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {SERVICE_CARDS.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="group relative overflow-hidden rounded-2xl bg-surface"
                aria-label={card.label}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={card.imageSrc}
                    alt={card.imageAlt}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 280px"
                    className="object-cover transition-transform duration-normal ease-luxury group-hover:scale-105"
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent"
                    aria-hidden="true"
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-3">
                  <p className="text-sm font-semibold leading-snug text-white">
                    {card.label}
                  </p>
                  <p className="mt-0.5 text-xs text-white/70 transition-colors duration-fast group-hover:text-brand-red">
                    {card.cta} ←
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Philosophy ── */}
        <section className="border-y border-border bg-surface py-16 sm:py-20">
          <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
              איך אני רואה מוזיקה היום
            </p>

            <blockquote className="mt-6">
              <p className="font-serif text-xl font-medium leading-relaxed text-foreground sm:text-2xl">
                &quot;אני כבר לא חייב להיות זה שעומד על הבמה כדי להרגיש את
                הקסם.&quot;
              </p>
              <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                עם השנים למדתי שאני מעדיף לעמוד בתוך הרחבה, עם האנשים, ולראות
                את המוזיקה שלי מתעוררת לחיים דרך אחרים. מצידי שדיג&#39;יי אחר
                יקבל את הקרדיט. מה שמרגש אותי הוא הרגע שבו מישהו בוחר לקחת קטע
                שלי, לשים עליו את החותמת שלו, ולהוביל איתו את הקהל.
              </p>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                המוזיקה שלי כבר לא רק שלי. היא הופכת להיות חלק מהחוויה שלכם.
                וזה, מבחינתי, השלב הכי יפה במסע.
              </p>
              <footer className="mt-5 text-xs font-semibold uppercase tracking-widest text-brand-red">
                יקיר כהן
              </footer>
            </blockquote>
          </div>
        </section>

        {/* ── Origin story ── */}
        <section className="mx-auto max-w-[72rem] px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
                מי שלא מכיר
              </p>

              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                זה התחיל כבדיחה פרטית
              </h2>

              <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                רדיו ביתי קטן, מיקרופון מקרטע ומחשב ישן שהריץ מוזיקה ושיחות
                למעגל חברים מצומצם. לא היה בזה עסק, לא הייתה כוונה, רק אהבה
                אמיתית לצליל.
              </p>

              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                אבל אז הגיעו החברים של החברים. ועוד אנשים ששמעו. ועוד כאלה
                שסיפרו. ברגע אחד הבנתי שיש פה משהו גדול יותר.
              </p>

              <h3 className="mt-8 text-lg font-semibold text-foreground">
                הדרך לאולפן
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                הדרך לאולפן ההקלטות במודיעין הייתה טבעית. רציתי לתת לאחרים
                בדיוק את מה שחיפשתי אז, במה אמיתית להתחיל ממנה.
              </p>

              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                מאז עברו בדלת שלנו עשרות אמנים. חלקם מופיעים היום מול אלפי
                אנשים, חלקם עדיין בדרך. אבל כולם נשמעים אחרת אחרי שעוברים כאן.
              </p>

              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                וכששיר שנולד אצלנו מתנגן פתאום ברדיו? זו תזכורת למה התחלתי:
                לתת למוזיקה של אנשים הזדמנות אמיתית להישמע.
              </p>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-surface lg:aspect-square">
              <Image
                src="/images/services/studio/hub/ישראל אהרוני באולפן.webp"
                alt="יקיר כהן באולפן הקלטות במודיעין"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                loading="lazy"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
              />
            </div>
          </div>
        </section>

        {/* ── Values ── */}
        <section className="border-t border-border bg-surface py-14 sm:py-16">
          <div className="mx-auto max-w-[72rem] px-4 sm:px-6 lg:px-8">
            <header className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
                הגישה שלנו
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                מקצועיות של הפקה גדולה, עם שירות של חבר טוב
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                אנחנו לא עוד ספק. אנחנו השותפים שלכם למסע, מהשיחה הראשונה ועד
                הרגע האחרון ברחבה.
              </p>
            </header>

            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {VALUES.map((v) => (
                <div
                  key={v.title}
                  className="rounded-2xl border border-border bg-background p-6"
                >
                  <h3 className="font-semibold text-foreground">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {v.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Team ── */}
        <section className="mx-auto max-w-[72rem] px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-surface">
              <Image
                src="/images/services/studio/hub/משפחה מקליטה באולפן הקלטות יקיר כהן הפקות.webp"
                alt="הצוות המקצועי של יקיר כהן הפקות"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                loading="lazy"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
              />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
                הצוות שלנו
              </p>

              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                המשפחה המקצועית
              </h2>

              <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                הסוד הגדול שלנו הוא האנשים. כמעט כל תקליטן, מפעיל או טכנאי
                אצלנו הוא בוגר קורס DJ או הפקה שעבר אצלי. במשך השנים הכשרתי
                מאות אנשי מקצוע באולפן במודיעין.
              </p>

              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                את הטובים ביותר, אלה עם הניצוץ, הדיוק והלב, צירפתי למשפחה של
                יקיר כהן הפקות.
              </p>

              <p className="mt-5 text-sm font-semibold text-foreground">
                מה זה אומר בשבילכם?
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                אתם מקבלים איש מקצוע שעבר סינון קפדני, מכיר את הסטנדרטים שלנו,
                ומחויב להצלחה שלכם בדיוק כמוני.
              </p>
            </div>
          </div>
        </section>

        {/* ── Why us ── */}
        <section className="border-t border-border bg-surface py-14 sm:py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              מדוע לבחור דווקא בנו?
            </h2>

            <ul className="mt-6 space-y-4">
              {WHY_US.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-red/10 text-xs font-bold text-brand-red"
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                  <span className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Magazine ── */}
        <section className="border-t border-border bg-background py-14 sm:py-16">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
              המגזין שלנו
            </p>

            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              ידע מקצועי בחינם, בלי סודות מקצועיים
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              אני מאמין שידע צריך להיות נגיש. הבחירה מגיעה מתוך ידע, ומי
              שבוחר בלי ידע אין לזה משמעות אמיתית. לכן הקמתי את המגזין: בחירת
              אטרקציות, טיפים להקלטה, תובנות על הפקה, הכול פתוח לכולם.
            </p>

            <Link
              href="/blog"
              className="mt-6 inline-flex items-center gap-2 rounded-xl border border-brand-red/40 bg-brand-red/8 px-6 py-3 text-sm font-semibold text-foreground transition-[background-color,border-color] duration-fast ease-luxury hover:border-brand-red/60 hover:bg-brand-red/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
            >
              לכל המאמרים ←
            </Link>
          </div>
        </section>

        {/* ── Podcast promo ── */}
        <section className="border-t border-border bg-surface py-14 sm:py-16">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
              הפודקאסט שלנו
            </p>

            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              למה יש שירים שנשמעים דומים?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              מאיפה מגיע הדמיון? השראה? טרנדים? נוסחאות? בפודקאסט אני מפרק את
              זה לגורמים, בצורה פשוטה ומעניינת, עם הרבה אוזן מוזיקלית מאחורי
              הקלעים.
            </p>

            <Link
              href="/podcast"
              className="mt-6 inline-flex items-center gap-2 rounded-xl border border-brand-red/40 bg-brand-red/8 px-6 py-3 text-sm font-semibold text-foreground transition-[background-color,border-color] duration-fast ease-luxury hover:border-brand-red/60 hover:bg-brand-red/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
            >
              לכל הפרקים ←
            </Link>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="border-t border-border bg-background py-16 sm:py-20">
          <div className="mx-auto max-w-[72rem] px-4 text-center sm:px-6 lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
              מוכנים להתחיל?
            </p>

            <h2 className="mt-3 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              הפכו את האירוע הבא שלכם למשהו בלתי נשכח
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
              שאלו, תארו את החלום, ואנחנו נדאג לשאר. אין כאן בוטים. יקיר מגיב
              בעצמו.
            </p>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-brand-red px-7 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(212,43,43,0.3)] transition-[background-color,box-shadow] duration-normal ease-luxury hover:bg-brand-red-light hover:shadow-[0_0_32px_rgba(212,43,43,0.45)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
              aria-label="פתיחת שיחת וואטסאפ עם יקיר כהן הפקות"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-4 w-4 shrink-0"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              בואו נדבר בוואטסאפ
            </a>
          </div>
        </section>
      </div>
  );
}
