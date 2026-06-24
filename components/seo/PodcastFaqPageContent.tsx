import Link from "next/link";
import ContextualIntroParagraph from "@/components/seo/ContextualIntroParagraph";
import PageRelatedFooter from "@/components/seo/PageRelatedFooter";
import { PodcastCalculatorLazy } from "@/components/calculators/lazy";
import FAQAccordion from "@/components/ui/FAQAccordion";
import TableOfContents from "@/components/ui/TableOfContents";
import ServicePageLayout from "@/components/services/ServicePageLayout";
import ServiceHubLinks from "@/components/services/ServiceHubLinks";
import { resolvePodcastFolderHero } from "@/lib/service-portfolio-hero";
import { withServicePageHeroDefaults } from "@/lib/service-page-ui";
import {
  PODCAST_FAQ_HERO_FEATURES,
  PODCAST_FAQ_SECTIONS,
  PODCAST_FAQ_SERVICE_LINKS,
  PODCAST_FAQ_TITLE,
  PODCAST_FAQ_TOC,
  PODCAST_PREP_CHECKLIST,
} from "@/lib/data/podcast-faq-page";
import {
  youtubeEmbedUrl,
  YOUTUBE_SERVICE_EMBED_IDS,
} from "@/lib/data/youtube-embeds";
import { buildServiceWhatsAppText, buildWhatsAppHref } from "@/lib/whatsapp";

const pageHero = resolvePodcastFolderHero(
  PODCAST_FAQ_TITLE,
  youtubeEmbedUrl(YOUTUBE_SERVICE_EMBED_IDS["podcast-example-1"]),
);
const heroProps = withServicePageHeroDefaults(pageHero);

const whatsappHref = buildWhatsAppHref({
  text: buildServiceWhatsAppText(
    "שלום, יש לי שאלה על הפקת פודקאסט - אשמח להכוונה לשירות המתאים.",
  ),
  utm_source: "website",
  utm_campaign: "podcast_faq_cta",
});

export default function PodcastFaqPageContent() {
  return (
    <ServicePageLayout
      title={PODCAST_FAQ_TITLE}
      subtitle="ריכזנו את השאלות שמקבלים הכי הרבה על מחירים, אולפן במודיעין, עריכה והפצה - עם קישורים ישירים לכל שירות, למחשבון ולהזמנה."
      features={PODCAST_FAQ_HERO_FEATURES}
      whatsappText="שלום, יש לי שאלה נוספת על הפקת פודקאסט"
      utmCampaign="podcast_faq"
      corporateShareLabel="שירותי פודקאסט"
      bookSlug="podcast/faq"
      ctaLabel="שאלתכם לא כאן? דברו איתנו"
      {...heroProps}
    >
      <div className="mx-auto max-w-[72rem] space-y-16 px-4 sm:px-6 lg:px-8">
        <ContextualIntroParagraph pathname="/podcast/faq" className="max-w-3xl" />

        <TableOfContents entries={PODCAST_FAQ_TOC} className="max-w-md" />

        <ServiceHubLinks
          heading="לאן לפנות?"
          subheading="בחרו את המסלול שמתאים לכם - כל הקישורים מובילים לעמודי שירות מלאים עם מחירון ודוגמאות."
          links={PODCAST_FAQ_SERVICE_LINKS}
          headingId="podcast-faq-services"
        />

        <section
          id="podcast-faq-calculator"
          className="scroll-mt-24"
          aria-labelledby="podcast-faq-calculator-heading"
        >
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="podcast-faq-calculator-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              מחשבון מחיר לפודקאסט
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              בחרו חבילה, הוסיפו זמן אם צריך - וקבלו הערכת מחיר לפני שמדברים איתנו.
            </p>
          </header>
          <PodcastCalculatorLazy className="mt-8" />
          <p className="mt-6 text-center text-sm text-muted-foreground">
            לפרטים מלאים ודוגמאות מהאולפן -{" "}
            <Link href="/podcast" className="font-semibold text-brand-red hover:underline">
              מרכז הפודקאסט
            </Link>
          </p>
        </section>

        <section
          className="rounded-2xl border border-border bg-surface p-6 sm:p-8"
          aria-labelledby="podcast-prep-heading"
        >
          <h2
            id="podcast-prep-heading"
            className="text-xl font-semibold text-foreground sm:text-2xl"
          >
            צ׳ק-ליסט הכנה להקלטה
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            לפני שמגיעים לאולפן - כמה דקות הכנה חוסכות זמן יקר ביום ההקלטה.
          </p>
          <ul className="mt-6 space-y-3">
            {PODCAST_PREP_CHECKLIST.map((item) => (
              <li
                key={item}
                className="flex gap-3 text-sm leading-relaxed text-foreground"
              >
                <span className="mt-0.5 shrink-0 text-brand-red" aria-hidden>
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-muted-foreground">
            מדריך מורחב:{" "}
            <Link
              href="/blog/prepare-voice-podcast-studio"
              className="font-semibold text-brand-red hover:underline"
            >
              איך להכין את הקול לפודקאסט באולפן
            </Link>
          </p>
        </section>

        {PODCAST_FAQ_SECTIONS.map((section) => (
          <div key={section.id} id={section.id} className="scroll-mt-24">
            <FAQAccordion
              items={[...section.items]}
              title={section.title}
              subtitle={section.subtitle}
              className="py-0 sm:py-0"
              allowMultiple
              defaultOpenId={section.items[0]?.id}
            />
          </div>
        ))}

        <section
          className="rounded-2xl border border-brand-red/25 bg-brand-red/5 px-6 py-10 text-center sm:px-10"
          aria-labelledby="podcast-faq-cta-heading"
        >
          <h2
            id="podcast-faq-cta-heading"
            className="text-xl font-semibold text-foreground sm:text-2xl"
          >
            לא מצאתם תשובה?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
            נשמח להסביר בוואטסאפ, לתאם ביקור באולפן או להפנות אתכם לעמוד השירות המדויק.
          </p>
          <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl bg-brand-red px-6 py-3.5 text-sm font-semibold text-white hover:bg-brand-red-light"
            >
              שאלה בוואטסאפ
            </a>
            <Link
              href="/podcast/podcast-recording"
              className="inline-flex items-center justify-center rounded-xl border border-border bg-background px-6 py-3.5 text-sm font-semibold text-foreground hover:border-brand-red/40 hover:text-brand-red"
            >
              הפקה מלאה - פרטים ומחיר
            </Link>
            <Link
              href="/book"
              className="inline-flex items-center justify-center rounded-xl border border-border bg-background px-6 py-3.5 text-sm font-semibold text-foreground hover:border-brand-red/40 hover:text-brand-red"
            >
              הזמנה מקוונת
            </Link>
          </div>
        </section>

        <PageRelatedFooter pathname="/podcast/faq" />
      </div>
    </ServicePageLayout>
  );
}
