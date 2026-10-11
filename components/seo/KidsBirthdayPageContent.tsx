import Link from "next/link";
import MediaGallery from "@/components/marketing/MediaGallery";
import AnswerBlock from "@/components/seo/AnswerBlock";
import FaqPageSchema from "@/components/seo/FaqPageSchema";
import KidsBirthdayOrderForm from "@/components/seo/KidsBirthdayOrderForm";
import SpeakableSchema from "@/components/seo/SpeakableSchema";
import FAQAccordion from "@/components/ui/FAQAccordion";
import Container from "@/components/ui/Container";
import {
  KIDS_BIRTHDAY_AEO,
  KIDS_BIRTHDAY_CAPACITY,
  KIDS_BIRTHDAY_DURATION_LABEL,
  KIDS_BIRTHDAY_FORM_ANCHOR,
  KIDS_BIRTHDAY_GALLERY,
  KIDS_BIRTHDAY_HERO,
  KIDS_BIRTHDAY_LOCATION,
  KIDS_BIRTHDAY_PATH,
  KIDS_BIRTHDAY_PREPARATION,
  KIDS_BIRTHDAY_STAGES,
  buildKidsBirthdayFaqs,
} from "@/lib/data/kids-birthday";
import { safeJsonLdStringify } from "@/lib/safe-json-ld";
import { buildServicePageEntitySchema } from "@/lib/seo/page-schema";
import { absoluteUrl } from "@/lib/site-url";

/**
 * /studio/kids-birthday. כל מה שמוצג כאן מגיע מ-lib/data/kids-birthday.ts,
 * ושם לכל עובדה יש מקור. אין כאן עובדה או הבטחה שלא באה משם.
 *
 * מעטפת משלו ולא ServicePageLayout, בכוונה: ה-layout המשותף מוסיף לכל עמוד
 * אולפן בלוק "מה באמת צריך מכם" (טענות על השירות כמו "ההדרכה, ההקלטה והליטוש
 * קורים באותו סשן"), שורת מענה, נתוני אמון ו-CTA תחתון שמבטיח "הצעת מחיר
 * מותאמת". הבעלים לא אמר אף אחד מהם על יום ההולדת. הסכמה (Service ללא offers
 * ו-FAQPage) נבנית כאן מאותם בונים של שאר העמודים. אין כאן נתיב חזרה לפריטים
 * שהוסרו: ראו הערת הפתיחה ב-lib/data/kids-birthday.ts.
 */

const CARD_CLASS = "rounded-xl border border-border bg-surface p-5 sm:p-6";
const CARD_TITLE_CLASS = "text-base font-semibold text-foreground";

export default function KidsBirthdayPageContent() {
  const faqs = buildKidsBirthdayFaqs();
  /* Service בלי offers: אין מחיר בעמוד, והצעה בלי מחיר היא צומת שבור בעיני
     גוגל. ה-FAQPage נבנה מאותן שאלות שמוצגות בעמוד. */
  const serviceSchema = buildServicePageEntitySchema({
    pagePath: KIDS_BIRTHDAY_PATH,
    title: KIDS_BIRTHDAY_HERO.title,
    description: KIDS_BIRTHDAY_HERO.metaDescription,
  });

  return (
    <article className="bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(serviceSchema) }}
      />
      <FaqPageSchema items={faqs} />
      <SpeakableSchema
        url={absoluteUrl(KIDS_BIRTHDAY_PATH)}
        cssSelector={["h1", `#${KIDS_BIRTHDAY_AEO.id}`]}
      />

      <header
        className="border-b border-border bg-surface"
        aria-labelledby="kids-birthday-title"
      >
        <Container className="py-12 text-center sm:py-16">
          <h1
            id="kids-birthday-title"
            className="mx-auto max-w-3xl font-serif text-3xl font-semibold leading-tight text-foreground sm:text-4xl"
          >
            {KIDS_BIRTHDAY_HERO.title}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
            {KIDS_BIRTHDAY_HERO.subtitle}
          </p>
          <a
            href={`#${KIDS_BIRTHDAY_FORM_ANCHOR}`}
            className="mt-8 inline-flex min-h-12 items-center justify-center rounded-xl bg-brand-red px-8 py-3 text-sm font-semibold text-white hover:bg-brand-red-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
          >
            {KIDS_BIRTHDAY_HERO.ctaLabel}
          </a>
        </Container>
      </header>

      <div className="border-b border-border px-4 pb-6 pt-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-3">
          <p className="text-sm font-semibold text-foreground">
            {KIDS_BIRTHDAY_AEO.question}
          </p>
          <AnswerBlock id={KIDS_BIRTHDAY_AEO.id}>{KIDS_BIRTHDAY_AEO.text}</AnswerBlock>
        </div>
      </div>

      <div className="mx-auto max-w-[72rem] space-y-16 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <section aria-labelledby="kids-birthday-stages-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="kids-birthday-stages-heading"
              className="font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              מה קורה ב{KIDS_BIRTHDAY_DURATION_LABEL}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              חמישה שלבים, לפי הסדר.
            </p>
          </header>
          <ol className="mx-auto mt-10 grid max-w-3xl gap-4">
            {KIDS_BIRTHDAY_STAGES.map((stage, index) => (
              <li
                key={stage.id}
                className={`${CARD_CLASS} flex gap-4 sm:gap-5`}
              >
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand-red/40 text-sm font-bold text-brand-red"
                  aria-hidden="true"
                >
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className={CARD_TITLE_CLASS}>{stage.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {stage.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="kids-birthday-facts-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="kids-birthday-facts-heading"
              className="font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              הפרטים לפני שמזמינים
            </h2>
          </header>
          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className={CARD_CLASS}>
              <h3 className={CARD_TITLE_CLASS}>כמה אנשים</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {KIDS_BIRTHDAY_CAPACITY.note}
              </p>
            </div>

            <div className={CARD_CLASS}>
              <h3 className={CARD_TITLE_CLASS}>הכנה לפני</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {KIDS_BIRTHDAY_PREPARATION}
              </p>
            </div>

            <div className={CARD_CLASS}>
              <h3 className={CARD_TITLE_CLASS}>איפה</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {KIDS_BIRTHDAY_LOCATION}
              </p>
            </div>
          </div>
        </section>

        <div>
          <header className="mx-auto max-w-2xl text-center">
            <h2 className="font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              מהאולפן
            </h2>
          </header>
          {/* הבעלים יוסיף תמונות במערך KIDS_BIRTHDAY_GALLERY ב-lib/data/kids-birthday.ts */}
          {KIDS_BIRTHDAY_GALLERY.length > 0 ? (
            <MediaGallery
              images={KIDS_BIRTHDAY_GALLERY.map((image) => ({ ...image }))}
              heading="מהאולפן"
              embedded
              noPriority
              className="mt-8"
            />
          ) : null}
        </div>

        <section
          id={KIDS_BIRTHDAY_FORM_ANCHOR}
          className="scroll-mt-24"
          aria-labelledby="kids-birthday-form-heading"
        >
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="kids-birthday-form-heading"
              className="font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              הזמנת יום הולדת
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              תאריך ומספר ילדים, והטופס פותח וואטסאפ עם הודעה מוכנה.
            </p>
          </header>
          <div className="mx-auto mt-8 max-w-3xl">
            <KidsBirthdayOrderForm />
          </div>
        </section>

        <FAQAccordion
          items={faqs.map((faq) => ({
            id: faq.id,
            question: faq.question,
            answer: faq.answer,
          }))}
          title="שאלות ותשובות"
          subtitle="לפני שמזמינים יום הולדת לילדים"
          defaultOpenId={faqs[0]?.id}
          className="py-0"
        />

        <nav
          aria-label="עמודים קרובים"
          className="flex flex-wrap justify-center gap-3"
        >
          <Link
            href="/studio/recording-song-modiin"
            className="inline-flex min-h-12 items-center rounded-full border border-border bg-surface px-5 text-sm font-medium hover:border-brand-red/40 hover:text-brand-red"
          >
            הקלטת שיר במודיעין
          </Link>
          <Link
            href="/matanot"
            className="inline-flex min-h-12 items-center rounded-full border border-border bg-surface px-5 text-sm font-medium hover:border-brand-red/40 hover:text-brand-red"
          >
            מתנות לפי אירוע
          </Link>
          <Link
            href="/studio"
            className="inline-flex min-h-12 items-center rounded-full border border-border bg-surface px-5 text-sm font-medium hover:border-brand-red/40 hover:text-brand-red"
          >
            כל שירותי האולפן
          </Link>
        </nav>
      </div>
    </article>
  );
}
