import Link from "next/link";
import ServiceHubLinks from "@/components/services/ServiceHubLinks";
import ServicePageLayout from "@/components/services/ServicePageLayout";
import BookPriceDual from "@/components/booking/BookPriceDual";
import FAQAccordion from "@/components/ui/FAQAccordion";
import { resolvePodcastFolderHero } from "@/lib/service-portfolio-hero";
import { withServicePageHeroDefaults } from "@/lib/service-page-ui";
import {
  SELF_SERVICE_CHECKLIST,
  SELF_SERVICE_COMPARISON,
  SELF_SERVICE_FAQS,
  SELF_SERVICE_HERO_FEATURES,
  SELF_SERVICE_PRICE,
  SELF_SERVICE_RELATED,
} from "@/lib/data/podcast-self-service-page";
import {
  youtubeEmbedUrl,
  YOUTUBE_SERVICE_EMBED_IDS,
} from "@/lib/data/youtube-embeds";
import { buildWhatsAppHref } from "@/lib/whatsapp";

const pageHero = resolvePodcastFolderHero(
  "אולפן שירות עצמי",
  youtubeEmbedUrl(YOUTUBE_SERVICE_EMBED_IDS["podcast-studio"]),
);
const heroProps = withServicePageHeroDefaults(pageHero);

export default function PodcastSelfServicePageContent() {
  const waHref = buildWhatsAppHref({
    text: "שלום, מעוניין/ת באולפן שירות עצמי (650 ₪/שעה). אשמח לבדוק זמינות.",
    utm_source: "website",
    utm_campaign: "podcast_self_service",
  });

  return (
    <ServicePageLayout
      title="אולפן פודקאסט שירות עצמי"
      subtitle="650 ₪ לשעה. מגיעים עם לפטופ, מקליטים, לוקחים קבצים גולמיים. בלי עריכה, בלי ליווי. אולפן אקוסטי במודיעין."
      features={SELF_SERVICE_HERO_FEATURES}
      whatsappText="שלום, מעוניין/ת באולפן שירות עצמי"
      utmCampaign="podcast_self_service"
      bookSlug="podcast/self-service-studio"
      scarcityLabel="🔌 שירות עצמי"
      ctaLabel="בדיקת זמינות בוואטסאפ"
      pagePath="/podcast/self-service-studio"
      faqs={SELF_SERVICE_FAQS.map((faq) => ({
        question: faq.question,
        answer: typeof faq.answer === "string" ? faq.answer : "",
      }))}
      {...heroProps}
    >
      <div className="mx-auto max-w-[72rem] space-y-16 px-4 sm:px-6 lg:px-8">
        <section
          className="rounded-xl border border-brand-red/30 bg-brand-red/5 p-6 sm:p-8"
          aria-label="מחיר"
        >
          <p className="text-sm font-semibold text-brand-red">מחיר לשעה</p>
          <p className="mt-2 text-3xl font-bold text-foreground">
            {SELF_SERVICE_PRICE.toLocaleString("he-IL")} ₪
            <span className="text-base font-normal text-muted-foreground">
              {" "}
              + מע״מ
            </span>
          </p>
          <BookPriceDual exVat={SELF_SERVICE_PRICE} className="mt-1" />
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-brand-red px-6 py-3 text-sm font-semibold text-white hover:bg-brand-red-light"
          >
            הזמנה בוואטסאפ
          </a>
        </section>

        <section aria-labelledby="compare-heading">
          <h2
            id="compare-heading"
            className="font-serif text-section-title font-semibold text-foreground"
          >
            השוואת חבילות
          </h2>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[480px] text-sm">
              <thead>
                <tr className="border-b border-border text-right">
                  <th className="py-3 pe-4 font-semibold">חבילה</th>
                  <th className="py-3 pe-4 font-semibold">עריכה</th>
                  <th className="py-3 pe-4 font-semibold">ליווי</th>
                  <th className="py-3 font-semibold">מתאים ל</th>
                </tr>
              </thead>
              <tbody>
                {SELF_SERVICE_COMPARISON.map((row) => (
                  <tr key={row.label} className="border-b border-border/60">
                    <td className="py-3 pe-4 font-medium text-foreground">
                      {row.label}
                    </td>
                    <td className="py-3 pe-4 text-muted-foreground">{row.editing}</td>
                    <td className="py-3 pe-4 text-muted-foreground">{row.support}</td>
                    <td className="py-3 text-muted-foreground">{row.ideal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            מחפשים תוכן עסקי (רילז)?{" "}
            <Link href="/business/content-studio" className="text-brand-red hover:underline">
              סושיאל דאמפ
            </Link>
            . לא שירות עצמי.
          </p>
        </section>

        <section aria-labelledby="checklist-heading">
          <h2
            id="checklist-heading"
            className="font-serif text-section-title font-semibold text-foreground"
          >
            מה להביא
          </h2>
          <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-muted-foreground">
            {SELF_SERVICE_CHECKLIST.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <FAQAccordion
          title="שאלות נפוצות, שירות עצמי"
          items={SELF_SERVICE_FAQS}
        />

        <ServiceHubLinks
          headingId="self-service-related-heading"
          heading="שירותים קשורים"
          subheading="מסלולים נוספים אם DIY לא מתאים לכם."
          links={SELF_SERVICE_RELATED.map((link) => ({
            href: link.href,
            title: link.title,
            description: link.description,
          }))}
        />
      </div>
    </ServicePageLayout>
  );
}
