import Link from "next/link";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import PageBottomCta from "@/components/layout/PageBottomCta";
import ServiceBlogStrip from "@/components/blog/ServiceBlogStrip";
import MatanotEventCard from "@/components/seo/MatanotEventCard";
import MatanotPackageCard from "@/components/seo/MatanotPackageCard";
import { getBlogPostsBySlugs } from "@/lib/data/blog";
import {
  MATANOT_EVENT_CARDS,
  MATANOT_FINAL_CTA,
  MATANOT_HERO,
  MATANOT_PACKAGES,
  MATANOT_PRODUCT_NOTES,
  MATANOT_STEPS,
} from "@/lib/data/matanot-page";
import { buildWebPageSchema } from "@/lib/seo/page-schema";
import { safeJsonLdStringify } from "@/lib/safe-json-ld";

const MATANOT_BLOG_SLUGS = [
  "headphones-purpose-guide",
  "unique-gift-recording-ideas-2026",
  "recorded-blessing-gift",
] as const;

const PAGE_SCHEMA = buildWebPageSchema({
  slug: "/matanot",
  title: MATANOT_HERO.title,
  description: MATANOT_HERO.description,
});

export default function MatanotPageContent() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(PAGE_SCHEMA) }}
      />

      <Section className="border-b border-border bg-background" ariaLabelledby="matanot-hero-title">
        <Container className="py-12 text-center sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
            מתנות מהאולפן
          </p>
          <h1
            id="matanot-hero-title"
            className="mx-auto mt-3 max-w-3xl font-serif text-3xl font-semibold leading-tight text-foreground sm:text-4xl"
          >
            {MATANOT_HERO.title}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {MATANOT_HERO.description}
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button as="a" href="#event-cards" className="min-h-12 min-w-[14rem]">
              {MATANOT_HERO.primaryLabel}
            </Button>
            <Button
              as="a"
              href={MATANOT_HERO.secondaryHref}
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
              className="min-h-12 min-w-[14rem]"
            >
              {MATANOT_HERO.secondaryLabel}
            </Button>
          </div>
        </Container>
      </Section>

      <Section id="event-cards" className="bg-surface" ariaLabelledby="event-cards-title">
        <Container className="py-12 sm:py-16">
          <header className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
              לפי סוג האירוע
            </p>
            <h2 id="event-cards-title" className="mt-3 font-serif text-2xl font-semibold text-foreground">
              בחרו את סוג האירוע
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              כל כרטיס מוביל ישר לשיחה בוואטסאפ עם טקסט מוכן. אם עוד לא סגורים על
              הכיוון, אפשר להתחיל ברעיון כללי.
            </p>
          </header>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {MATANOT_EVENT_CARDS.map((event) => (
              <MatanotEventCard key={event.id} event={event} />
            ))}
          </div>
        </Container>
      </Section>

      <Section className="border-y border-border bg-background" ariaLabelledby="matanot-steps-title">
        <Container className="py-12 sm:py-16">
          <header className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
              איך זה עובד
            </p>
            <h2 id="matanot-steps-title" className="mt-3 font-serif text-2xl font-semibold text-foreground">
              תהליך קצר וברור
            </h2>
          </header>

          <ol className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            {MATANOT_STEPS.map((step) => (
              <li key={step.step} className="rounded-2xl border border-border bg-surface p-5">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-brand-red text-sm font-bold text-white">
                  {step.step}
                </span>
                <h3 className="mt-4 text-base font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section className="bg-surface" ariaLabelledby="gift-packages-title">
        <Container className="py-12 sm:py-16">
          <header className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
              מארזי מתנה
            </p>
            <h2 id="gift-packages-title" className="mt-3 font-serif text-2xl font-semibold text-foreground">
              אפשר גם להגיש את ההקלטה כמארז
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              הקובץ הדיגיטלי נשאר הבסיס. המארזים מוסיפים דרך מסירה מסודרת יותר לפי
              האירוע והתקציב.
            </p>
            <p className="mt-2 text-sm font-medium text-foreground">
              המארזים הם תוספת למחיר ההפקה שבוחרים.
            </p>
          </header>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {MATANOT_PACKAGES.map((pkg) => (
              <MatanotPackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {MATANOT_PRODUCT_NOTES.map((item) => (
              <article key={item.title} className="rounded-2xl border border-border bg-background p-5">
                <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </article>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-brand-red/20 bg-background p-6 text-center">
            <h3 className="text-lg font-semibold text-foreground">מחפשים קודם שובר מתנה?</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              אם אתם רוצים להתחיל משובר פתוח למימוש, יש גם עמוד נפרד של{" "}
              <Link href="/studio/recording-song-modiin/gifts" className="font-semibold text-brand-red hover:underline">
                שוברים ורעיונות מהאולפן
              </Link>
              .
            </p>
          </div>
        </Container>
      </Section>

      <Section className="border-t border-border bg-background" ariaLabelledby="service-blog-heading">
        <Container>
          <ServiceBlogStrip posts={getBlogPostsBySlugs(MATANOT_BLOG_SLUGS)} />
        </Container>
      </Section>

      <PageBottomCta
        layout="section"
        variant="whatsapp"
        heading={MATANOT_FINAL_CTA.title}
        description="אם עוד לא ברור אם עדיף שיר, ברכה, קליפ או פודקאסט - שולחים כמה פרטים בסיסיים וממשיכים משם."
        whatsappHref={MATANOT_FINAL_CTA.href}
        whatsappLabel="שלחו הודעה בוואטסאפ"
        showBookContact={false}
      />
    </>
  );
}
