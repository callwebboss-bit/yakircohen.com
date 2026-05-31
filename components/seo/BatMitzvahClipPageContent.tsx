import Link from "next/link";
import TrustStatsBar from "@/components/marketing/TrustStatsBar";
import BatMitzvahClipShowcase from "@/components/seo/BatMitzvahClipShowcase";
import PageBottomCta from "@/components/layout/PageBottomCta";
import FAQWithCtaLinks, { type FaqCtaItem } from "@/components/ui/FAQWithCtaLinks";
import ShareButton from "@/components/ui/ShareButton";
import {
  BAT_MITZVAH_CLIP_FAQ,
  BAT_MITZVAH_CLIP_TYPES,
  BAT_MITZVAH_PRODUCTION_STYLES,
  BAT_MITZVAH_STARTING_PRICE,
} from "@/lib/data/bat-mitzvah-gifts-page";
import { SITE_NAME } from "@/lib/constants";
import { buildGoogleAggregateRatingSchema } from "@/lib/google-trust";
import { buildWhatsAppHref } from "@/lib/whatsapp";

const MAIN_CTA = buildWhatsAppHref({
  text: "היי יקיר! מעוניינים בקליפ לבת מצווה - תמונות ילדות, סרטונים וקליפ מהאולפן. אשמח לפרטים.",
  utm_source: "website",
  utm_campaign: "bat_mitzvah_clip_main_cta",
});

const SERVICE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "קליפ בת מצווה - תמונות ילדות וקליפ מהאולפן",
  description:
    "הפקת קליפ לבת מצווה עם שילוב תמונות ילדות, סרטונים מהבית והקלטה באולפן מקצועי במודיעין. שיר אישי, צילום, עריכה ומיקס.",
  provider: {
    "@type": "LocalBusiness",
    name: SITE_NAME,
    address: {
      "@type": "PostalAddress",
      addressLocality: "מודיעין-מכבים-רעות",
      addressCountry: "IL",
    },
    areaServed: ["מודיעין", "ירושלים", "מרכז"],
  },
  serviceType: "קליפ בת מצווה",
  aggregateRating: buildGoogleAggregateRatingSchema(),
};

export default function BatMitzvahClipPageContent() {
  const faqItems: FaqCtaItem[] = BAT_MITZVAH_CLIP_FAQ.map((item) => ({
    id: item.id,
    question: item.question,
    answer: item.answer,
    ctaText: "שאלו בוואטסאפ",
    whatsappMessage: item.whatsappText,
    utm_campaign: item.utmCampaign,
  }));

  const faqSchemaItems = BAT_MITZVAH_CLIP_FAQ.map((item) => ({
    question: item.question,
    answer: item.answer,
  }));

  return (
    <div className="bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SERVICE_JSON_LD) }}
      />

      <section className="relative overflow-hidden border-b border-border">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_-10%,rgba(212,43,43,0.12),transparent_55%)]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
          <nav aria-label="ניווט" className="mb-6">
            <ol className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-brand-red">
                  ראשי
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href="/studio" className="hover:text-brand-red">
                  אולפן
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href="/studio/blessings" className="hover:text-brand-red">
                  ברכות
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="font-medium text-foreground" aria-current="page">
                קליפ בת מצווה
              </li>
            </ol>
          </nav>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
            {SITE_NAME}
          </p>
          <h1 className="mt-3 font-serif text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
            קליפ בת מצווה - תמונות ילדות, סרטונים וקליפ מהאולפן
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            הפקה מלאה במודיעין: שיר אישי, שילוב תמונות ילדות וסרטונים מהבית,
            צילום באולפן ועריכה מקצועית - מתנה שהאולם לא ישכח.
          </p>
          <p className="mt-4 text-sm font-semibold text-foreground">
            החל מ-{BAT_MITZVAH_STARTING_PRICE} ₪ · ניתן גם כשובר מתנה
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={MAIN_CTA}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full max-w-xs items-center justify-center rounded-xl bg-brand-red px-7 py-3.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(212,43,43,0.3)] hover:bg-brand-red-light sm:w-auto"
            >
              הצעת מחיר בוואטסאפ
            </a>
            <Link
              href="/studio/recording-song-modiin/gifts"
              className="inline-flex w-full max-w-xs items-center justify-center rounded-xl border border-border px-7 py-3.5 text-sm font-semibold text-foreground hover:border-brand-red/40 sm:w-auto"
            >
              שובר מתנה
            </Link>
          </div>
        </div>
      </section>

      <TrustStatsBar variant="compact" className="border-b" />

      <div className="mx-auto max-w-[72rem] space-y-16 px-4 py-14 sm:px-6 lg:px-8">
        <BatMitzvahClipShowcase
          showHeader={false}
          faqItems={faqSchemaItems}
        />

        <section aria-labelledby="bat-mitzvah-types-heading">
          <header className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
              סגנונות
            </p>
            <h2
              id="bat-mitzvah-types-heading"
              className="mt-3 font-serif text-xl font-semibold text-foreground sm:text-2xl"
            >
              איזה סוג קליפ מתאים לכם?
            </h2>
          </header>
          <div className="mt-8 space-y-8">
            {BAT_MITZVAH_CLIP_TYPES.map((type) => (
              <article
                key={type.id}
                className="rounded-2xl border border-border bg-surface p-6 sm:p-8"
              >
                <h3 className="text-lg font-semibold text-foreground">
                  {type.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {type.intro}
                </p>
                <ul className="mt-4 space-y-2">
                  {type.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex gap-2 text-sm text-muted-foreground"
                    >
                      <span className="text-brand-red">-</span>
                      {bullet}
                    </li>
                  ))}
                </ul>
                {type.note ? (
                  <p className="mt-4 text-sm font-medium text-foreground">
                    {type.note}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-border pt-12">
          <h2 className="font-serif text-xl font-semibold text-foreground">
            סגנונות הפקה
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-3">
            {BAT_MITZVAH_PRODUCTION_STYLES.map((item) => (
              <li
                key={item.title}
                className="rounded-xl border border-border bg-surface p-5"
              >
                <h3 className="text-sm font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mx-auto max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
            שאלות נפוצות
          </p>
          <h2 className="mb-6 mt-3 font-serif text-xl font-semibold text-foreground">
            שאלות על קליפ בת מצווה
          </h2>
          <FAQWithCtaLinks items={faqItems} />
        </section>

        <section className="flex flex-wrap justify-center gap-3">
          <Link
            href="/studio/blessings/bar-mitzvah"
            className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium hover:border-brand-red/40 hover:text-brand-red"
          >
            ברכות בר/בת מצווה
          </Link>
          <Link
            href="/studio/blessings/video-clip"
            className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium hover:border-brand-red/40 hover:text-brand-red"
          >
            שיר + קליפ
          </Link>
          <Link
            href="/studio/pricing"
            className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium hover:border-brand-red/40 hover:text-brand-red"
          >
            מחירון
          </Link>
          <ShareButton title="קליפ בת מצווה | יקיר כהן הפקות" />
        </section>
      </div>

      <PageBottomCta
        layout="section"
        variant="whatsapp"
        heading="מוכנים לקליפ שכלת בת המצווה תזכור?"
        description="שילוב תמונות ילדות, סרטונים וקליפ מהאולפן - נתאים סגנון ונלווה עד המסירה."
        headingId="bat-mitzvah-clip-cta-heading"
        whatsappHref={MAIN_CTA}
        whatsappLabel="דברו איתנו בוואטסאפ"
        whatsappAriaLabel="דברו איתנו בוואטסאפ - קליפ בת מצווה"
        showBookContact
      />
    </div>
  );
}
