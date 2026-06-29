import Link from "next/link";
import ContextualIntroParagraph from "@/components/seo/ContextualIntroParagraph";
import PageRelatedFooter from "@/components/seo/PageRelatedFooter";
import ServiceBlogStrip from "@/components/blog/ServiceBlogStrip";
import { getBlogPostsByServiceSlug } from "@/lib/data/blog";
import PodcastZoomProofSection from "@/components/seo/PodcastZoomProofSection";
import SoundImprovementShowcase from "@/components/seo/SoundImprovementShowcase";
import FAQAccordion from "@/components/ui/FAQAccordion";
import ServicePageLayout from "@/components/services/ServicePageLayout";
import ServiceShowcaseSections from "@/components/services/ServiceShowcaseSections";
import { resolvePodcastFolderHero } from "@/lib/service-portfolio-hero";
import { withServicePageHeroDefaults } from "@/lib/service-page-ui";
import {
  PODCAST_EDITING_AUDIENCES,
  PODCAST_EDITING_FAQS,
  PODCAST_EDITING_HERO_FEATURES,
  PODCAST_EDITING_PRICE_LABEL,
  PODCAST_EDITING_PRICE_NOTE,
  PODCAST_EDITING_SERVICES,
  PODCAST_EDITING_WHY_US,
  PODCAST_EDITING_WORKFLOW,
} from "@/lib/data/podcast-editing-page";
import { buildServiceWhatsAppText, buildWhatsAppHref } from "@/lib/whatsapp";

const EDITING_TITLE = "עריכת פודקאסט מלאה";
const pageHero = resolvePodcastFolderHero(EDITING_TITLE);
const heroProps = withServicePageHeroDefaults(pageHero);

export default function PodcastEditingPageContent() {
  const whatsappHref = buildWhatsAppHref({
    text: buildServiceWhatsAppText(
      "שלום, הקלטתי פרק פודקאסט ואשמח לעריכה מקצועית מלאה. אשמח לשמוע על מחיר וזמני עבודה.",
    ),
    utm_source: "website",
    utm_campaign: "podcast_editing_cta",
  });

  return (
    <ServicePageLayout
      title="עריכת פודקאסט מלאה"
      subtitle="הקלטתם פרק אבל הוא צריך עריכה מקצועית? אנחנו עורכים, מנקים ומשפרים  -  ואתם מקבלים פרק מוכן לפרסום."
      features={PODCAST_EDITING_HERO_FEATURES}
      whatsappText="שלום, מעוניין/ת בעריכת פודקאסט מקצועית לפרק שהקלטתי"
      utmCampaign="podcast_editing"
      corporateShareLabel="שירות עריכת פודקאסט"
      bookSlug="podcast/podcast-editing"
      ctaLabel="שליחת פרק לעריכה בוואטסאפ"
      scarcityLabel={`${PODCAST_EDITING_PRICE_LABEL} - ${PODCAST_EDITING_PRICE_NOTE}`}
      pagePath="/podcast/podcast-editing"
      faqs={PODCAST_EDITING_FAQS}
      {...heroProps}
    >
      <div className="mx-auto max-w-[72rem] space-y-16 px-4 sm:px-6 lg:px-8">
        <ContextualIntroParagraph pathname="/podcast/podcast-editing" className="max-w-3xl" />

        <p className="max-w-2xl border-r-[3px] border-brand-red/40 pr-4 text-sm italic leading-relaxed text-foreground/80 sm:text-base">
          יש לך פרק מוקלט, אבל עריכה היא עולם שלם: לחתוך את הגמגומים, לאזן
          בין דוברים, להוסיף ג&apos;ינגל, לייצא לכל הפלטפורמות. אתה יודע
          שההקלטה לקחה שעות - ועכשיו עריכה תיקח עוד כמה. אני מבין את זה -
          ולכן אתה שולח לי את הקובץ ומקבל בחזרה פרק מוכן לפרסום.
        </p>

        <section className="max-w-3xl" aria-labelledby="editing-intro-heading">
          <h2
            id="editing-intro-heading"
            className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            מה כלול בעריכת פודקאסט מלאה?
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            עריכת פודקאסט זה לא סתם &quot;חיתוך שתיקות&quot;. זה תהליך מקיף
            שהופך הקלטה גולמית לפרק מקצועי שכיף להקשיב לו  -  מההקלטה הגולמית
            לפרק מושלם.
          </p>
        </section>

        <section aria-labelledby="editing-services-heading">
          <header className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
              מה אנחנו עושים
            </p>
            <h2
              id="editing-services-heading"
              className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              הנה בדיוק מה כלול
            </h2>
          </header>
          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PODCAST_EDITING_SERVICES.map((item) => (
              <li
                key={item.title}
                className="rounded-xl border border-border bg-surface p-5"
              >
                <h3 className="font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section
          id="podcast-zoom-demo"
          aria-labelledby="editing-zoom-heading"
        >
          <header className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
              שמעו את ההבדל
            </p>
            <h2
              id="editing-zoom-heading"
              className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              ניקוי פודקאסט / זום - לפני ואחרי
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              דוגמה טיפוסית: הקלטת זום או חדר ביתי עם רעשי רקע - אחרי ניקוי,
              EQ ו-normalize לפרסום.
            </p>
          </header>
          <div className="mx-auto mt-8 max-w-3xl">
            <PodcastZoomProofSection />
          </div>
        </section>

        <section
          id="restoration-demo"
          aria-labelledby="editing-restoration-heading"
        >
          <header className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
              שחזור ארכיון
            </p>
            <h2
              id="editing-restoration-heading"
              className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              שחזור הקלטה פגומה - לפני ואחרי
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              דוגמה אמיתית: פודקאסט ישן, הרצאה או ארכיון שנפגם. שחזור כזה
              אפשרי - אבל קשה, ותלוי מאוד באיכות המקור.
            </p>
          </header>
          <div className="mx-auto mt-8 max-w-3xl">
            <SoundImprovementShowcase
              demoId="weber-restoration"
              variant="restoration"
              showDisclaimer
            />
          </div>
        </section>

        <section aria-labelledby="editing-audience-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="editing-audience-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              למי זה מתאים?
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              לכל מי שמקליט תוכן דיבור ורוצה שיישמע ברמה הגבוהה ביותר
            </p>
          </header>
          <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {PODCAST_EDITING_AUDIENCES.map((item) => (
              <li
                key={item.title}
                className="flex gap-4 rounded-xl border border-border bg-background p-5"
              >
                <span className="text-3xl" aria-hidden>
                  {item.emoji}
                </span>
                <div>
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="editing-workflow-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="editing-workflow-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              איך זה עובד?
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              התהליך פשוט וברור
            </p>
          </header>
          <ol className="mt-10 space-y-5">
            {PODCAST_EDITING_WORKFLOW.map((step) => (
              <li
                key={step.step}
                className="flex gap-5 rounded-2xl border border-border bg-surface p-6"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-red/10 text-sm font-bold text-brand-red">
                  {step.step}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="why-editing-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="why-editing-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              למה לבחור בנו לעריכת פודקאסט?
            </h2>
          </header>
          <ul className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {PODCAST_EDITING_WHY_US.map((item) => (
              <li
                key={item}
                className="flex gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-sm leading-relaxed"
              >
                <span className="shrink-0 text-brand-red" aria-hidden>
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <ServiceShowcaseSections
          assetsFolder="podcast"
          mediaType="gallery"
          galleryLabel="דוגמאות מהאולפן"
        />

        <FAQAccordion
          items={[...PODCAST_EDITING_FAQS]}
          title="שאלות נפוצות  -  עריכת פודקאסט"
          className="py-0"
        />

        <section
          className="rounded-2xl border border-border bg-surface p-8 text-center"
          aria-labelledby="editing-cta-heading"
        >
          <h2
            id="editing-cta-heading"
            className="text-xl font-semibold text-foreground sm:text-2xl"
          >
            מוכנים לשלוח פרק לעריכה?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
            שלחו את הקובץ הגולמי  -  נחזור עם הצעה וזמן מסירה. רוצים גם להקליט
            אצלנו? אפשר לשלב עם{" "}
            <Link
              href="/podcast/podcast-studio-modiin"
              className="font-medium text-brand-red hover:underline"
            >
              השכרת סטודיו במודיעין
            </Link>
            .
          </p>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-brand-red px-7 py-3 text-sm font-semibold text-white hover:bg-brand-red-light"
          >
            שליחת פרק לעריכה בוואטסאפ </a>
        </section>

        <section className="flex flex-wrap justify-center gap-3" aria-label="קישורים קשורים">
          <Link
            href="/podcast"
            className="rounded-full border border-border px-4 py-2 text-sm font-medium hover:border-brand-red/40 hover:text-brand-red"
          >
            הפקת פודקאסט מלאה
          </Link>
          <Link
            href="/podcast/podcast-studio-modiin"
            className="rounded-full border border-border px-4 py-2 text-sm font-medium hover:border-brand-red/40 hover:text-brand-red"
          >
            אולפן במודיעין
          </Link>
          <Link
            href="/podcast/bulk-production"
            className="rounded-full border border-border px-4 py-2 text-sm font-medium hover:border-brand-red/40 hover:text-brand-red"
          >
            פס ייצור לעסקים
          </Link>
          <Link
            href="/online/online-ai-pricing"
            className="rounded-full border border-border px-4 py-2 text-sm font-medium hover:border-brand-red/40 hover:text-brand-red"
          >
            שירותי AI לסאונד
          </Link>
        </section>
              <Link
                href="/blog/podcast-needs-professional-editing"
                className="flex items-start gap-4 rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-brand-red/40"
              >
                <span className="mt-0.5 text-2xl" aria-hidden>📖</span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-red">מאמר קשור</p>
                  <p className="mt-1 font-semibold text-foreground">5 סימנים שהפרק שלכם צריך עריכה מקצועית - לא רק חיתוך</p>
                  <p className="mt-1 text-sm text-muted-foreground">לפני שמחליטים לערוך לבד - לקריאה </p>
                </div>
              </Link>
              <ServiceBlogStrip posts={getBlogPostsByServiceSlug("podcast/podcast-editing")} />
              <PageRelatedFooter pathname="/podcast/podcast-editing" />

            </div>
    </ServicePageLayout>
  );
}
