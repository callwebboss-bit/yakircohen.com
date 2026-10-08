import Link from "next/link";
import MediaGallery from "@/components/marketing/MediaGallery";
import AnswerBlock from "@/components/seo/AnswerBlock";
import FaqPageSchema from "@/components/seo/FaqPageSchema";
import KidsBirthdayOrderForm from "@/components/seo/KidsBirthdayOrderForm";
import OwnerTodoNote from "@/components/seo/OwnerTodoNote";
import SpeakableSchema from "@/components/seo/SpeakableSchema";
import FAQAccordion from "@/components/ui/FAQAccordion";
import Container from "@/components/ui/Container";
import {
  KIDS_BIRTHDAY,
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
  getAnsweredFaqs,
  getKidsBirthdayLimits,
  type OwnerField,
} from "@/lib/data/kids-birthday";
import { safeJsonLdStringify } from "@/lib/safe-json-ld";
import { buildServicePageEntitySchema } from "@/lib/seo/page-schema";
import { absoluteUrl } from "@/lib/site-url";

/**
 * /studio/kids-birthday. כל ערך שהבעלים לא נתן מגיע כ-null מ-lib/data/kids-birthday.ts
 * ומוצג כאן כסימון TODO. אין כאן עובדה שלא באה משם.
 *
 * מעטפת משלו ולא ServicePageLayout, בכוונה: ה-layout המשותף מוסיף לכל עמוד
 * אולפן בלוק "מה באמת צריך מכם" (טענות על השירות כמו "ההדרכה, ההקלטה והליטוש
 * קורים באותו סשן"), שורת מענה, נתוני אמון ו-CTA תחתון שמבטיח "הצעת מחיר
 * מותאמת". הבעלים לא אמר אף אחד מהם על יום ההולדת. הסכמה (Service ללא offers
 * ו-FAQPage) נבנית כאן מאותם בונים של שאר העמודים.
 */

const CARD_CLASS = "rounded-xl border border-border bg-surface p-5 sm:p-6";
const CARD_TITLE_CLASS = "text-base font-semibold text-foreground";

/** ערך השדה, או סימון ה-TODO שלו */
function FieldText({ field }: { field: OwnerField<string> }) {
  return field.value !== null ? (
    <span>{field.value}</span>
  ) : (
    <OwnerTodoNote text={field.todo} />
  );
}

function FieldList({ field }: { field: OwnerField<readonly string[]> }) {
  if (field.value === null || field.value.length === 0) {
    return <OwnerTodoNote text={field.todo} />;
  }
  return (
    <ul className="space-y-1.5">
      {field.value.map((item) => (
        <li key={item} className="flex gap-2">
          <span className="text-brand-red" aria-hidden>
            •
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function KidsBirthdayPageContent() {
  const faqs = buildKidsBirthdayFaqs();
  const limits = getKidsBirthdayLimits();

  const answeredFaqs = getAnsweredFaqs(faqs);
  /* Service בלי offers: אין מחיר עד שהבעלים ימלא, והצעה בלי מחיר היא צומת
     שבור בעיני גוגל. FAQPage רק מהשאלות שיש להן תשובה, בלי שאלות עם TODO. */
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
      <FaqPageSchema items={answeredFaqs} />
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
          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className={CARD_CLASS}>
              <h3 className={CARD_TITLE_CLASS}>לאיזה גיל</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                <FieldText field={KIDS_BIRTHDAY.ageRange} />
              </p>
            </div>

            <div className={CARD_CLASS}>
              <h3 className={CARD_TITLE_CLASS}>כמה ילדים</h3>
              <dl className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
                <div>
                  <dt className="inline font-medium text-foreground">מינימום: </dt>
                  <dd className="inline">
                    {KIDS_BIRTHDAY.minChildren.value !== null ? (
                      `${KIDS_BIRTHDAY.minChildren.value} ילדים`
                    ) : (
                      <OwnerTodoNote text={KIDS_BIRTHDAY.minChildren.todo} />
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="inline font-medium text-foreground">קיבולת: </dt>
                  <dd className="inline">{KIDS_BIRTHDAY_CAPACITY.note}</dd>
                </div>
              </dl>
            </div>

            <div className={CARD_CLASS}>
              <h3 className={CARD_TITLE_CLASS}>הכנה לפני</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {KIDS_BIRTHDAY_PREPARATION}
              </p>
            </div>

            <div className={CARD_CLASS}>
              <h3 className={CARD_TITLE_CLASS}>מה הילד לוקח הביתה בסוף היום</h3>
              <div className="mt-3 text-sm leading-relaxed text-muted-foreground">
                <FieldList field={KIDS_BIRTHDAY.takeHome} />
              </div>
            </div>

            <div className={CARD_CLASS}>
              <h3 className={CARD_TITLE_CLASS}>מה ההורים צריכים להביא</h3>
              <div className="mt-3 text-sm leading-relaxed text-muted-foreground">
                <FieldList field={KIDS_BIRTHDAY.parentsBring} />
              </div>
            </div>

            <div className={CARD_CLASS}>
              <h3 className={CARD_TITLE_CLASS}>איפה</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {KIDS_BIRTHDAY_LOCATION.text}{" "}
                <Link
                  href={KIDS_BIRTHDAY_LOCATION.mobileStudio.href}
                  className="inline-flex min-h-12 items-center font-semibold text-brand-red hover:underline"
                >
                  {KIDS_BIRTHDAY_LOCATION.mobileStudio.label}
                </Link>
              </p>
            </div>

            <div className={`${CARD_CLASS} md:col-span-2`}>
              <h3 className={CARD_TITLE_CLASS}>מחיר</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                <FieldText field={KIDS_BIRTHDAY.price} />
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
            <KidsBirthdayOrderForm limits={limits} />
          </div>
        </section>

        <FAQAccordion
          items={faqs.map((faq) => ({
            id: faq.id,
            question: faq.question,
            answer: faq.answer ?? <OwnerTodoNote text={faq.todo} />,
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
