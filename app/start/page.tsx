import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import PageBottomCta from "@/components/layout/PageBottomCta";
import {
  CheckIcon,
  ClockIcon,
  DownloadIcon,
  MicIcon,
  MusicIcon,
  RadioIcon,
  SearchIcon,
  ShieldIcon,
  SparklesIcon,
  WhatsAppIcon,
  ZapIcon,
} from "@/components/ui/Icons";
import {
  CLIENT_JOURNEY_VARIANTS,
  type JourneyVariant,
} from "@/lib/data/client-journey";
import { constructMetadata } from "@/lib/metadata";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { SITE_URL } from "@/lib/site-url";
import { cn } from "@/lib/utils";

export const metadata: Metadata = constructMetadata({
  title: "מה קורה אחרי שפונים",
  description:
    "3 שלבים ברורים: ניתוח, ביצוע ומסירה. אולפן, אירועים, פודקאסט ועריכה מרחוק - בלי הפתעות.",
  slug: "start",
  keywords: ["איך מתחילים", "שלבי עבודה", "אולפן מודיעין", "הזמנת שירות"],
});

const whatsappHref = buildWhatsAppHref({
  text: "שלום, קראתי על השלבים ורוצה להתחיל. מה הצעד הראשון?",
  utm_source: "website",
  utm_campaign: "start_page",
});

type IconComponent = (props: { size?: number; className?: string }) => ReactNode;

const VARIANT_META: Record<
  JourneyVariant,
  { icon: IconComponent; tagline: string }
> = {
  general: {
    icon: MicIcon,
    tagline: "לא בטוחים לאן זה משתייך? זה המסלול הכללי לכל פנייה.",
  },
  studio: {
    icon: MusicIcon,
    tagline: "שיר, ברכה או הקלטה - מהרעיון ועד קובץ מוכן להפצה.",
  },
  events: {
    icon: SparklesIcon,
    tagline: "DJ, הגברה ואטרקציות - מהזמנת התאריך ועד פירוק בסוף הערב.",
  },
  online: {
    icon: ZapIcon,
    tagline: "שולחים קובץ מכל מקום בארץ - מקבלים סאונד או תמונה משודרגים.",
  },
  podcast: {
    icon: RadioIcon,
    tagline: "מהפורמט הראשון ועד פרק מוקלט, ערוך ומוכן להעלאה.",
  },
};

const STEP_ICONS: Record<1 | 2 | 3, IconComponent> = {
  1: SearchIcon,
  2: ZapIcon,
  3: DownloadIcon,
};

const PROMISES = [
  {
    icon: ShieldIcon,
    title: "בלי הפתעות",
    description: "המחיר, ההיקף ולוח הזמנים סגורים מראש. מה שסיכמנו - זה מה שתקבלו.",
  },
  {
    icon: CheckIcon,
    title: "תהליך ברור",
    description: "כל שירות עובד באותם 3 שלבים: ניתוח, ביצוע ומסירה. תמיד יודעים איפה עומדים.",
  },
  {
    icon: ClockIcon,
    title: "מסירה בזמן",
    description: "קובץ מוכן לשימוש, עם גרסאות נוספות אם צריך - לפי התאריך שקבענו יחד.",
  },
] as const;

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "ראשי",
      item: SITE_URL,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "מה קורה אחרי שפונים",
      item: `${SITE_URL}/start`,
    },
  ],
};

export default function StartPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="bg-background">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border bg-surface">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-brand-red/[0.07] to-transparent"
          />
          <div className="relative mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
            <nav aria-label="ניווט ארגוני" className="mb-8">
              <ol className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <li>
                  <Link href="/" className="hover:text-brand-red">
                    ראשי
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="font-medium text-foreground" aria-current="page">
                  מה קורה אחרי שפונים
                </li>
              </ol>
            </nav>

            <p className="inline-flex items-center gap-2 rounded-full border border-brand-red/20 bg-brand-red/5 px-4 py-1.5 text-xs font-semibold tracking-wide text-brand-red">
              <SparklesIcon size={14} />3 שלבים. אפס בלגן.
            </p>

            <h1 className="mt-6 font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              מה קורה מרגע הפנייה ועד הקובץ המוכן
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              כל שירות אצלנו עובד באותם שלושה שלבים פשוטים -{" "}
              <span className="font-medium text-foreground">ניתוח, ביצוע ומסירה</span>
              . בחרו את סוג השירות שלכם וראו בדיוק מה מצפה לכם.
            </p>

            <nav
              className="mt-9 flex flex-wrap items-center justify-center gap-2.5"
              aria-label="סוגי שירות"
            >
              {CLIENT_JOURNEY_VARIANTS.map((v) => {
                const Icon = VARIANT_META[v.id].icon;
                return (
                  <a
                    key={v.id}
                    href={`#${v.anchor}`}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors duration-normal ease-luxury hover:border-brand-red/40 hover:text-brand-red"
                  >
                    <Icon size={16} className="text-brand-red" />
                    {v.label}
                  </a>
                );
              })}
            </nav>

            <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "inline-flex w-full items-center justify-center gap-2 rounded-md bg-brand-red px-8 py-3 text-sm font-semibold text-white sm:w-auto",
                  "shadow-[0_0_20px_rgba(212,43,43,0.25)] transition-colors duration-normal ease-luxury hover:bg-brand-red-light hover:shadow-[0_0_32px_rgba(212,43,43,0.4)]",
                )}
              >
                <WhatsAppIcon size={18} />
                התחילו בוואטסאפ
              </a>
              <Link
                href="/book"
                className="inline-flex w-full items-center justify-center rounded-md border border-border bg-surface px-8 py-3 text-sm font-medium text-foreground transition-colors duration-normal ease-luxury hover:border-brand-red/40 hover:text-brand-red sm:w-auto"
              >
                הזמנה מקוונת
              </Link>
            </div>
          </div>
        </section>

        {/* Promise strip */}
        <section
          className="border-b border-border bg-background py-12 sm:py-16"
          aria-labelledby="start-promise-heading"
        >
          <div className="mx-auto max-w-[72rem] px-4 sm:px-6 lg:px-8">
            <h2 id="start-promise-heading" className="sr-only">
              ההבטחה שלנו
            </h2>
            <ul className="grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-6">
              {PROMISES.map((promise) => {
                const Icon = promise.icon;
                return (
                  <li
                    key={promise.title}
                    className="flex flex-col items-center rounded-xl border border-border bg-surface p-6 text-center sm:items-start sm:text-start"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-red/10 text-brand-red">
                      <Icon size={22} />
                    </span>
                    <h3 className="mt-4 text-base font-semibold text-foreground">
                      {promise.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {promise.description}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* Per-service journeys */}
        {CLIENT_JOURNEY_VARIANTS.map((variant, index) => {
          const VariantIcon = VARIANT_META[variant.id].icon;
          const isAlt = index % 2 === 1;
          return (
            <section
              key={variant.id}
              id={variant.anchor}
              className={cn(
                "scroll-mt-24 border-b border-border py-14 sm:py-18",
                isAlt ? "bg-surface" : "bg-background",
              )}
              aria-labelledby={`journey-${variant.id}-heading`}
            >
              <div className="mx-auto max-w-[72rem] px-4 sm:px-6 lg:px-8">
                <header className="mx-auto max-w-2xl text-center">
                  <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-red/20 bg-brand-red/5 text-brand-red">
                    <VariantIcon size={26} />
                  </span>
                  <h2
                    id={`journey-${variant.id}-heading`}
                    className="mt-5 font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
                  >
                    {variant.label}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {VARIANT_META[variant.id].tagline}
                  </p>
                </header>

                <ol className="relative mt-12 grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
                  {/* Connecting line (desktop) */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-[16.6%] top-7 hidden h-px bg-gradient-to-l from-transparent via-brand-red/30 to-transparent md:block"
                  />
                  {variant.steps.map((step) => {
                    const StepIcon = STEP_ICONS[step.number];
                    return (
                      <li
                        key={step.number}
                        className="relative flex flex-col items-center rounded-2xl border border-border bg-background p-6 text-center transition-[border-color,box-shadow,transform] duration-normal ease-luxury hover:-translate-y-0.5 hover:border-brand-red/40 hover:shadow-md md:items-start md:text-start"
                      >
                        <div className="flex w-full items-center justify-between">
                          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-base font-bold text-brand-red ring-1 ring-brand-red/40">
                            {step.number}
                          </span>
                          <StepIcon
                            size={22}
                            className="text-muted-foreground/50"
                          />
                        </div>
                        <h3 className="mt-5 text-lg font-semibold text-foreground">
                          {step.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {step.description}
                        </p>
                      </li>
                    );
                  })}
                </ol>

                <div className="mt-10 text-center">
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-brand-red underline-offset-4 hover:underline"
                  >
                    <WhatsAppIcon size={16} />
                    יש לי שאלה על {variant.label}
                  </a>
                </div>
              </div>
            </section>
          );
        })}

        <PageBottomCta
          variant="whatsapp"
          layout="section"
          whatsappHref={whatsappHref}
          heading="מוכנים לצעד הראשון?"
          description="שיחה קצרה בוואטסאפ - נבין מה צריך, נציע מחיר מותאם ונסביר בדיוק מה הלאה."
        />
      </div>
    </>
  );
}
