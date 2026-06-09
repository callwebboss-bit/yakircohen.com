import ShowcaseVideoSection from "@/components/seo/ShowcaseVideoSection";
import ClientMaterialsLiabilityBanner from "@/components/seo/ClientMaterialsLiabilityBanner";
import BookPriceDual from "@/components/booking/BookPriceDual";
import {
  GROWTH_EXAMPLE_VIDEOS,
  GROWTH_SLIDESHOW_INCLUDED,
  GROWTH_SLIDESHOW_TIERS,
} from "@/lib/data/growth-slideshow-page";
import { buildWhatsAppHref } from "@/lib/whatsapp";

const growthWhatsappHref = buildWhatsAppHref({
  text: "שלום, מעוניין/ת במצגת גדילה AI. אשמח לשמוע על החבילות והזמינות.",
  utm_source: "website",
  utm_campaign: "growth_slideshow",
});

export default function GrowthSlideshowSection() {
  return (
    <section
      id="growth-slideshow"
      className="scroll-mt-24 space-y-12"
      aria-labelledby="growth-slideshow-heading"
    >
      <header className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
          שירות חדש
        </p>
        <h2
          id="growth-slideshow-heading"
          className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
        >
          מצגת גדילה - ציר זמן מילדות ב-AI
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
          תמונות מילדות ועד היום, עם אפקט גדילה מרגש שמראה את הילד גדל לאט לאט.
          מתאים לכל גיל - בר/בת מצווה, יום הולדת, חתונה ועוד. כולל פתיחה וסגירה
          מונפשות.
        </p>
      </header>

      <ShowcaseVideoSection
        heading="דוגמת מצגת גדילה"
        subheading="צפו בדוגמה מלאה - ציר זמן תמונות עם אפקט גדילה ב-AI"
        videos={[GROWTH_EXAMPLE_VIDEOS[0]]}
        sectionId="growth-video-primary"
        kicker="וידאו לדוגמה"
      />

      <div>
        <h3 className="text-center text-lg font-semibold text-foreground">
          חבילות לפי כמות תמונות
        </h3>
        <p className="mx-auto mt-2 max-w-xl text-center text-sm text-muted-foreground">
          כל החבילות כוללות פתיחה, סגירה, שיפור AI, מוזיקה ומסירה Full HD
        </p>
        <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {GROWTH_SLIDESHOW_TIERS.map((tier) => (
            <li
              key={tier.id}
              className="flex flex-col rounded-2xl border border-border bg-surface p-5"
            >
              <p className="text-2xl font-bold text-brand-red">{tier.photos}</p>
              <p className="text-xs font-medium text-muted-foreground">תמונות</p>
              <div className="mt-3">
                <BookPriceDual exVat={tier.exVat} size="sm" />
              </div>
              <p className="mt-2 flex-1 text-xs text-muted-foreground">{tier.note}</p>
            </li>
          ))}
        </ul>
      </div>

      <ul className="mx-auto grid max-w-2xl grid-cols-1 gap-2 sm:grid-cols-2">
        {GROWTH_SLIDESHOW_INCLUDED.map((item) => (
          <li
            key={item}
            className="flex gap-2 text-sm text-muted-foreground"
          >
            <span className="text-brand-red" aria-hidden>
              ✓
            </span>
            {item}
          </li>
        ))}
      </ul>

      <ShowcaseVideoSection
        heading="קליפ עם תמונות - דוגמה נוספת"
        subheading="שילוב תמונות וסרטון מרגש - מתאים גם כהשראה למצגת שלכם"
        videos={[GROWTH_EXAMPLE_VIDEOS[1]]}
        sectionId="growth-video-secondary"
      />

      <ClientMaterialsLiabilityBanner />

      <div className="text-center">
        <a
          href={growthWhatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex rounded-xl bg-brand-red px-6 py-3 text-sm font-semibold text-white hover:bg-brand-red-light"
        >
          הצעת מחיר למצגת גדילה ←
        </a>
      </div>
    </section>
  );
}
