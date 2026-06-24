import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ClientJourneySteps from "@/components/marketing/ClientJourneySteps";
import HubPageSchema from "@/components/seo/HubPageSchema";
import PersonAboutSchema from "@/components/seo/PersonAboutSchema";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import { BLUR_DATA_URL } from "@/lib/blur";
import {
  ABOUT_HUB_SEO,
  hubSchemaPropsFromSeo,
  metadataForHubSeo,
} from "@/lib/seo/hub-pages";
import { buildWhatsAppHref } from "@/lib/whatsapp";


export const metadata: Metadata = metadataForHubSeo(ABOUT_HUB_SEO);


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
    title: "מחיר שקוף",
    body: "טווח מחיר ברור לפני שמתחילים. בלי הפתעות בסוף.",
  },
  {
    title: "ציוד מקצועי",
    body: "מיקרופונים, הגברה ועריכה ברמה אולפנית - עם גיבוי לכל תרחיש.",
  },
  {
    title: "מסירה מהירה",
    body: "לוח זמנים מוגדר בשיחה הראשונה. קובץ מוכן בזמן שנקבע.",
  },
] as const;

const HERO_BULLETS = [
  "אולפן הקלטות, פודקאסט, DJ ואטרקציות - במקום אחד",
  "מודיעין + הגעה לאירועים בירושלים והמרכז",
  "20+ שנות ניסיון, 5,000+ לקוחות",
] as const;

export default function AboutPage() {
  const whatsappHref = buildWhatsAppHref({
    text: "היי יקיר! קראתי על יקיר כהן הפקות ורוצה לשמוע יותר. מה הצעד הראשון?",
    utm_source: "about",
    utm_campaign: "about_hero_cta",
  });

  return (
    <>
      <HubPageSchema {...hubSchemaPropsFromSeo(ABOUT_HUB_SEO)} />
      <PersonAboutSchema />
      <div className="bg-background">
        {/* ── Hero ── */}
        <Section
          padding="none"
          className="relative overflow-hidden border-b border-border bg-background"
        >
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_-10%,rgba(212,43,43,0.12),transparent_55%)]"
            aria-hidden="true"
          />

          <Container className="relative max-w-3xl py-16 text-center sm:py-20">
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

            <h1 className="text-hero mt-3 font-serif font-semibold text-foreground">
              אולפן, אירועים וסאונד
              <br />
              הכול במקום אחד במודיעין
            </h1>

            <ul className="mx-auto mt-6 max-w-xl space-y-2 text-sm text-muted-foreground sm:text-base">
              {HERO_BULLETS.map((item) => (
                <li key={item} className="flex items-start justify-center gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button
                as="a"
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl px-7 shadow-[0_0_20px_rgba(212,43,43,0.3)] hover:shadow-[0_0_32px_rgba(212,43,43,0.45)]"
                aria-label="פתיחת שיחת וואטסאפ עם יקיר כהן הפקות"
              >
                קבלו הצעת מחיר בוואטסאפ </Button>
              <Link
                href="/start"
                className="inline-flex min-h-11 items-center text-sm font-medium text-muted-foreground underline-offset-4 transition-colors duration-fast ease-luxury hover:text-brand-red hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
              >
                מה קורה אחרי שפונים
              </Link>
              <Link
                href="/about/faq"
                className="inline-flex min-h-11 items-center text-sm font-medium text-muted-foreground underline-offset-4 transition-colors duration-fast ease-luxury hover:text-brand-red hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
              >
                שאלות נפוצות
              </Link>
            </div>
          </Container>
        </Section>

        <Section padding="sm" ariaLabelledby="about-services-heading">
          <Container>
          <h2 id="about-services-heading" className="sr-only">
            השירותים שלנו
          </h2>
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
                    className="group-hover-scale-md object-cover motion-reduce:transform-none"
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
                    {card.cta} </p>
                </div>
              </Link>
            ))}
          </div>
          </Container>
        </Section>

        <ClientJourneySteps variant="general" display="compact" />

        <Section padding="sm" className="border-t border-border bg-surface">
          <Container>
            <header className="mx-auto max-w-2xl text-center">
              <h2 className="font-serif text-section-title font-semibold text-foreground">
                למה לבחור בנו
              </h2>
            </header>

            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {VALUES.map((v) => (
                <div
                  key={v.title}
                  className="rounded-2xl border border-border bg-background p-6 shadow-sm transition-[box-shadow,border-color] duration-normal ease-luxury hover:border-brand-red/30 hover:shadow-md"
                >
                  <h3 className="font-semibold text-foreground">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {v.body}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </Section>

        <Section padding="sm" className="border-t border-border">
          <Container className="max-w-3xl">
            <blockquote className="rounded-2xl border border-brand-red/20 bg-brand-red/5 px-8 py-8 text-center">
              <p className="font-serif text-xl font-medium leading-relaxed text-foreground sm:text-2xl">
                &quot;אני מאמין שכל רעיון,
                <br />
                גם הקטן ביותר,
                <br />
                יכול להפוך ליצירה גדולה.&quot;
              </p>
              <footer className="mt-5 text-sm font-semibold uppercase tracking-widest text-brand-red">
                - יקיר כהן
              </footer>
            </blockquote>
          </Container>
        </Section>

        <Section padding="sm">
          <Container className="max-w-3xl">
          <details className="group rounded-2xl border border-border bg-surface">
            <summary className="min-h-11 cursor-pointer list-none px-6 py-5 text-lg font-semibold text-foreground marker:content-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red [&::-webkit-details-marker]:hidden">
              עוד עלינו
              <span className="ms-2 text-sm font-normal text-muted-foreground">
                (ביוגרפיה וצוות)
              </span>
            </summary>
            <div className="space-y-10 border-t border-border px-6 py-8">
              <blockquote>
                <p className="font-serif text-lg font-medium leading-relaxed text-foreground">
                  &quot;אני כבר לא חייב להיות זה שעומד על הבמה כדי להרגיש את
                  הקסם.&quot;
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  עם השנים למדתי שאני מעדיף לעמוד בתוך הרחבה, עם האנשים, ולראות
                  את המוזיקה מתעוררת לחיים דרך אחרים.
                </p>
                <footer className="mt-3 text-xs font-semibold uppercase tracking-widest text-brand-red">
                  יקיר כהן
                </footer>
              </blockquote>

              <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    זה התחיל כבדיחה פרטית
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    רדיו ביתי קטן, מיקרופון מקרטע ומחשב ישן. לא היה בזה עסק -
                    רק אהבה לצליל. הדרך לאולפן במודיעין הייתה טבעית.
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    מאז עברו בדלת שלנו עשרות אמנים. חלקם מופיעים היום מול אלפי
                    אנשים, חלקם עדיין בדרך.
                  </p>
                </div>
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-surface">
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

              <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-surface lg:order-first">
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
                  <h3 className="text-lg font-semibold text-foreground">
                    המשפחה המקצועית
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    כמעט כל תקליטן, מפעיל או טכנאי אצלנו הוא בוגר קורס DJ או
                    הפקה. את הטובים ביותר צירפתי לצוות - מכירים את הסטנדרטים
                    ומחויבים לתוצאה שלכם.
                  </p>
                </div>
              </div>
            </div>
          </details>
          </Container>
        </Section>

        <Section className="border-t border-border bg-background text-center">
          <Container>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
              מוכנים להתחיל?
            </p>

            <h2 className="mt-3 font-serif text-section-title font-semibold text-foreground">
              מוכנים להתחיל?
            </h2>

            <p className="text-lead mx-auto mt-3 max-w-lg text-muted-foreground">
              שלחו הודעה בוואטסאפ - נחזור עם הצעת מחיר ותאריך.
            </p>

            <Button
              as="a"
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 gap-2 rounded-xl px-7 shadow-[0_0_20px_rgba(212,43,43,0.3)] hover:shadow-[0_0_32px_rgba(212,43,43,0.45)]"
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
            </Button>
          </Container>
        </Section>
      </div>
    </>
  );
}
