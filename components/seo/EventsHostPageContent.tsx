import Link from "next/link";
import ContextualIntroParagraph from "@/components/seo/ContextualIntroParagraph";
import PageRelatedFooter from "@/components/seo/PageRelatedFooter";
import ServicePageLayout from "@/components/services/ServicePageLayout";
import ServiceShowcaseSections from "@/components/services/ServiceShowcaseSections";
import FAQAccordion from "@/components/ui/FAQAccordion";
import {
  EVENT_HOST_PROCESS,
  EVENT_HOST_WHY,
} from "@/lib/data/events-host-page";
import { getEventsService } from "@/lib/data/services";
import { resolveServicePageHeroFromEntity } from "@/lib/service-portfolio-hero";
import { withServicePageHeroDefaults } from "@/lib/service-page-ui";
import { cn } from "@/lib/utils";

const service = getEventsService("events-host");
const pageHero = resolveServicePageHeroFromEntity(service);
const heroProps = withServicePageHeroDefaults(pageHero);

export default function EventsHostPageContent() {
  return (
    <ServicePageLayout
      title={service.title}
      subtitle={service.subtitle}
      features={service.features}
      whatsappText={service.whatsappText}
      utmCampaign={service.utmCampaign}
      bookSlug={service.slug}
      scarcityLabel={service.scarcityLabel}
      pagePath="/events/host"
      metaDescription={service.metaDescription}
      faqs={service.faqs}
      {...heroProps}
    >
      <div className="mx-auto max-w-[72rem] space-y-14 px-4 sm:px-6 lg:px-8">
        <ContextualIntroParagraph pathname="/events/host" className="max-w-3xl" />

        <p className="max-w-2xl border-r-[3px] border-brand-red/40 pr-4 text-sm italic leading-relaxed text-foreground/80 sm:text-base">
          אתה מתכנן אירוע מושקע - אבל בלי מנחה, כל אחד מוביל חלק אחר: DJ
          מחכה, צלם מחפש רגע, משפחה לוחצת על הזמנים - וכולם מסתכלים עליך.
          אני מבין את הלחץ הזה - מנחה טוב לא &quot;עוד עלות&quot;, הוא מה
          שמשחרר אותך לחגוג.
        </p>

        <section className="max-w-3xl" aria-labelledby="host-why-heading">
          <h2
            id="host-why-heading"
            className="text-2xl font-semibold text-foreground"
          >
            למה מנחה מקצועי משנה את האירוע?
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            בלי מנחה, כל אחד מנהל חלק אחר: DJ מחכה, צלם מחפש רגע, משפחה לוחצת על
            הזמנים. מנחה טוב מחבר את הכל לזרימה אחת, שומר על כבוד ושמחה, ומשאיר
            לכם מקום לחוות את הערב.
          </p>
        </section>

        <section aria-labelledby="host-blocks-heading">
          <h2 id="host-blocks-heading" className="sr-only">
            יתרונות
          </h2>
          <div className="grid auto-rows-fr gap-4 sm:gap-5 md:grid-cols-3">
            {EVENT_HOST_WHY.map((block, index) => (
              <article
                key={block.title}
                className={cn(
                  "hover-lift rounded-3xl border border-border bg-surface p-5 transition-[border-color,background-color,box-shadow] duration-normal ease-luxury hover:border-[var(--service-accent,#d42b2b)]/20 hover:bg-[var(--service-accent,#d42b2b)]/[0.02] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_0_20px_color-mix(in_srgb,var(--service-accent,#d42b2b)_6%,transparent)] sm:p-6 lg:p-8",
                  index === 0 && "md:col-span-2",
                )}
              >
                <h3 className="font-semibold tracking-tight text-foreground">{block.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground/90">{block.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="host-process-heading">
          <h2
            id="host-process-heading"
            className="text-xl font-semibold text-foreground"
          >
            איך זה עובד
          </h2>
          <ol className="mt-6 space-y-3">
            {EVENT_HOST_PROCESS.map((item) => (
              <li
                key={item.step}
                className="flex items-start gap-4 rounded-2xl border border-border bg-surface p-5 transition-transform duration-fast ease-luxury active:scale-[0.99] sm:gap-5 sm:p-6 lg:p-7"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--service-accent,#d42b2b)]/10 text-base font-bold text-[var(--service-accent-ink,#8a1c1c)] sm:h-12 sm:w-12 sm:text-lg">
                  {item.step}
                </span>
                <div>
                  <h3 className="font-semibold tracking-tight text-foreground">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground/90">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {service.faqs.length > 0 ? (
          <section aria-labelledby="host-faq-heading">
            <h2 id="host-faq-heading" className="text-xl font-semibold text-foreground">
              שאלות ששואלים אותנו הרבה לפני שמזמינים מנחה
            </h2>
            <div className="mt-4">
              <FAQAccordion items={[...service.faqs]} />
            </div>
          </section>
        ) : null}

        <div className="rounded-2xl border border-[var(--service-accent,#d42b2b)]/20 bg-[var(--service-accent,#d42b2b)]/[0.04] p-6 text-center">
          <p className="text-sm font-semibold text-foreground">
            רוצים לשלב גם DJ ואטרקציות?
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            אפשר לבנות חבילה משולבת ולחסוך בעלויות.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Link
              href="/events/dj-events"
              className="rounded-xl bg-brand-red px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-red-light"
            >
              DJ וחבילות אירועים
            </Link>
            <Link
              href="/book#events"
              className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:border-[var(--service-accent,#d42b2b)]/40"
            >
              הזמנת אטרקציות
            </Link>
          </div>
        </div>

        <ServiceShowcaseSections
          assetsFolder={service.assetsFolder}
          playlistEmbedUrl={service.playlistEmbedUrl}
          mediaType={service.mediaType}
          galleryLabel="מנחה אירועים"
          videoTitle="דוגמה מהשטח - אירוע חי"
          videoHeading="צפו בדוגמה"
          videoDescription="הוידאו נטען בלחיצה"
          galleryLayout="masonry"
        />
        <PageRelatedFooter pathname="/events/host" />
      </div>
    </ServicePageLayout>
  );
}
