import type { ReactNode } from "react";
import Link from "@/components/ui/IntentLink";
import LazyYouTubeEmbed from "@/components/marketing/LazyYouTubeEmbed";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import { CONTACT_PHONE_DISPLAY, CONTACT_PHONE_E164 } from "@/lib/constants";
import {
  LEGACY_CTA,
  LEGACY_DELIVERABLES,
  LEGACY_FAQS,
  LEGACY_OWNER_FACTS,
  LEGACY_PRACTICAL_DETAILS,
  LEGACY_PREP_INTRO,
  LEGACY_PREP_TIPS,
  LEGACY_QUESTION_TOPICS,
  LEGACY_QUESTIONS_COUNT,
  LEGACY_QUESTIONS_NOTE,
  LEGACY_QUESTIONS_PDF,
  LEGACY_RECORDING_SLUG,
  LEGACY_RECORDING_SUBTITLE,
  LEGACY_RECORDING_TITLE,
  LEGACY_SAMPLE,
  LEGACY_WHY_NOW,
} from "@/lib/data/legacy-recording";
import { youtubeEmbedUrl } from "@/lib/data/youtube-embeds";
import { buildServiceWhatsAppText, buildWhatsAppHref } from "@/lib/whatsapp";

/*
 * דף שקט ורגיש: בלי hero מסחרי, בלי ServicePageLayout. התבנית ההיא מוסיפה
 * סרגל אמון, כפתורי CTA בראש העמוד ובתחתיתו, והבטחת מענה. כאן יש קריאה אחת,
 * בסוף. הדפוס הוא של components/seo/StudioVirtualTourPageContent.tsx:
 * Section + Container, בלי עטיפה.
 */

const H2 = "font-serif text-2xl font-semibold text-foreground sm:text-3xl";
const PROSE = "text-base leading-8 text-muted-foreground sm:text-lg";
const QUIET_LINK =
  "text-base font-semibold text-[var(--service-accent-ink,var(--accent-ink-default))] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--service-accent,var(--color-brand-red))]";

/*
 * עובדה שחסרה מוצגת כמו שהיא כתובה בנתונים, אבל מודגשת כדי שהבעלים יראה
 * בתצוגה מקדימה כל מקום שעוד צריך מילוי. הביטוי הרגולרי לא מכיל את מחרוזת
 * הסימון המלאה, כדי ש-grep על הסימון לא ימצא את הקובץ הזה.
 */
const TODO_SPLIT = /(\[\[TODO[^\]]*\]\])/;
const TODO_PART = /^\[\[TODO/;

function WithTodos({ text }: { text: string }) {
  return (
    <>
      {text.split(TODO_SPLIT).map((part, index) =>
        TODO_PART.test(part) ? (
          <mark
            key={index}
            className="rounded-sm bg-amber-500/15 px-1 text-amber-900"
          >
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  );
}

function pagesLabel(pages: number): string {
  if (pages === 1) return "עמוד אחד";
  return `${pages} עמודים`;
}

/*
 * עטיפה בלבד: Section + Container + עמודה צרה. ה-h2 נכתב בכל קטע בנפרד, כדי
 * ש-scripts/audit-headings.mjs (שקורא את סדר התגיות בקובץ) יראה היררכיה תקינה.
 */
function Band({
  id,
  tinted = false,
  children,
}: {
  id: string;
  tinted?: boolean;
  children: ReactNode;
}) {
  return (
    <Section
      id={id}
      padding="sm"
      ariaLabelledby={`${id}-title`}
      className={
        tinted
          ? "border-t border-border bg-surface"
          : "border-t border-border bg-background"
      }
    >
      <Container>
        <div className="mx-auto max-w-3xl">{children}</div>
      </Container>
    </Section>
  );
}

function FileIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6 shrink-0"
      aria-hidden="true"
    >
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6M9 17h6" />
    </svg>
  );
}

export default function LegacyRecordingPageContent() {
  const whatsappHref = buildWhatsAppHref({
    text: buildServiceWhatsAppText(LEGACY_CTA.whatsappText),
    utm_source: "website",
    utm_campaign: LEGACY_CTA.utmCampaign,
    source: LEGACY_RECORDING_SLUG,
  });

  const pdfKb = Math.max(1, Math.round(LEGACY_QUESTIONS_PDF.sizeBytes / 1024));
  const pdfSummary = `PDF, ${pagesLabel(LEGACY_QUESTIONS_PDF.pages)}, ${pdfKb} KB`;

  /* מספר השאלה הראשונה בכל נושא, כדי שהמספור ימשיך בין הנושאים */
  const topicsWithStart = LEGACY_QUESTION_TOPICS.map((topic, index) => ({
    ...topic,
    start:
      LEGACY_QUESTION_TOPICS.slice(0, index).reduce(
        (sum, earlier) => sum + earlier.questions.length,
        0,
      ) + 1,
  }));

  return (
    <>
      <Section
        padding="sm"
        className="bg-background"
        ariaLabelledby="legacy-recording-title"
      >
        <Container>
          <div className="mx-auto max-w-3xl">
            <h1
              id="legacy-recording-title"
              className="font-serif text-3xl font-semibold leading-tight text-foreground sm:text-4xl lg:text-5xl"
            >
              {LEGACY_RECORDING_TITLE}
            </h1>
            <p className={`mt-5 ${PROSE}`}>{LEGACY_RECORDING_SUBTITLE}</p>
            <p className="mt-6">
              <a
                href="#questions"
                className="text-sm font-semibold text-[var(--service-accent-ink,var(--accent-ink-default))] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--service-accent,var(--color-brand-red))]"
              >
                לרשימת {LEGACY_QUESTIONS_COUNT} השאלות המוצעות
              </a>
            </p>
          </div>
        </Container>
      </Section>

      <Band id="why-now">
        <h2 id="why-now-title" className={H2}>
          למה עכשיו
        </h2>
        <div className="mt-6 space-y-5">
          {LEGACY_WHY_NOW.map((paragraph) => (
            <p key={paragraph} className={PROSE}>
              {paragraph}
            </p>
          ))}
        </div>
      </Band>

      <Band id="prepare" tinted>
        <h2 id="prepare-title" className={H2}>
          איך מתכוננים
        </h2>
        <p className={`mt-6 ${PROSE}`}>{LEGACY_PREP_INTRO}</p>
        <ul className="mt-5 list-disc space-y-3 ps-6 marker:text-[var(--service-accent-ink,var(--accent-ink-default))]">
          {LEGACY_PREP_TIPS.map((tip) => (
            <li key={tip} className={PROSE}>
              {tip}
            </li>
          ))}
        </ul>
        <p className="mt-6">
          <a href="#questions" className={QUIET_LINK}>
            לרשימת {LEGACY_QUESTIONS_COUNT} השאלות להורדה
          </a>
        </p>
      </Band>

      <Band id="questions">
        <h2 id="questions-title" className={H2}>
          {`${LEGACY_QUESTIONS_COUNT} שאלות מוצעות`}
        </h2>
        <p className={`mt-6 ${PROSE}`}>{LEGACY_QUESTIONS_NOTE}</p>

        <div className="mt-8 space-y-8">
          {topicsWithStart.map((topic) => (
            <div key={topic.id}>
              <h3 className="text-lg font-semibold text-foreground">{topic.title}</h3>
              <ol
                start={topic.start}
                className="mt-3 list-decimal space-y-3 ps-7 marker:font-semibold marker:text-[var(--service-accent-ink,var(--accent-ink-default))]"
              >
                {topic.questions.map((question) => (
                  <li key={question} className={PROSE}>
                    {question}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-5 rounded-2xl border border-border bg-surface p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-start gap-4">
            <span className="mt-0.5 text-[var(--service-accent-ink,var(--accent-ink-default))]">
              <FileIcon />
            </span>
            <div>
              <p className="font-semibold text-foreground">
                הרשימה להדפסה ולשליחה מראש
              </p>
              {/* שורה לשם הקובץ ושורה לסוג, אורך וגודל. בשורה אחת ערבוב עברית,
                  לטינית ומספרים סידר את הרכיבים בסדר שגוי במובייל. */}
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                <bdi>{LEGACY_QUESTIONS_PDF.downloadName}</bdi>
              </p>
              <p className="text-sm leading-6 text-muted-foreground">
                <bdi dir="ltr">PDF</bdi>
                {" · "}
                {pagesLabel(LEGACY_QUESTIONS_PDF.pages)}
                {" · "}
                <bdi dir="ltr">{pdfKb} KB</bdi>
              </p>
            </div>
          </div>
          <Button
            as="a"
            href={LEGACY_QUESTIONS_PDF.path}
            download={LEGACY_QUESTIONS_PDF.downloadName}
            type="application/pdf"
            variant="secondary"
            className="w-full shrink-0 sm:w-auto"
            aria-label={`הורדת רשימת ${LEGACY_QUESTIONS_COUNT} השאלות, קובץ ${pdfSummary}`}
          >
            הורדת הרשימה
          </Button>
        </div>
      </Band>

      <Band id="length" tinted>
        <h2 id="length-title" className={H2}>
          אורך טיפוסי
        </h2>
        <p className={`mt-6 ${PROSE}`}>אלה אורכים טיפוסיים, לא התחייבות.</p>
        <dl className="mt-5 divide-y divide-border rounded-2xl border border-border bg-background">
          <div className="grid gap-1 px-5 py-4 sm:grid-cols-[10rem_1fr] sm:gap-6">
            <dt className="font-semibold text-foreground">הראיון</dt>
            <dd className={PROSE}>
              <WithTodos text={LEGACY_OWNER_FACTS.interviewLength} />
            </dd>
          </div>
          <div className="grid gap-1 px-5 py-4 sm:grid-cols-[10rem_1fr] sm:gap-6">
            <dt className="font-semibold text-foreground">הקובץ הערוך</dt>
            <dd className={PROSE}>
              <WithTodos text={LEGACY_OWNER_FACTS.editedFileLength} />
            </dd>
          </div>
        </dl>
      </Band>

      <Band id="deliverables">
        <h2 id="deliverables-title" className={H2}>
          מה מקבלים
        </h2>
        <p className={`mt-6 ${PROSE}`}>בסוף הראיון מקבלים שני דברים.</p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {LEGACY_DELIVERABLES.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-border bg-surface p-5 sm:p-6"
            >
              <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
              <p className="mt-2 text-base leading-7 text-muted-foreground">{item.body}</p>
              {item.details.length > 0 ? (
                <dl className="mt-4 space-y-3 border-t border-border pt-4">
                  {item.details.map((detail) => (
                    <div key={detail.label}>
                      <dt className="text-sm font-semibold text-foreground">{detail.label}</dt>
                      <dd className="mt-0.5 text-base leading-7 text-muted-foreground">
                        <WithTodos text={detail.value} />
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : null}
            </div>
          ))}
        </div>

        <h3 className="mt-12 text-xl font-semibold text-foreground">פרטים מעשיים</h3>
        <dl className="mt-5 divide-y divide-border rounded-2xl border border-border bg-surface">
          {LEGACY_PRACTICAL_DETAILS.map((row) => (
            <div
              key={row.label}
              className="grid gap-1 px-5 py-4 sm:grid-cols-[10rem_1fr] sm:gap-6"
            >
              <dt className="font-semibold text-foreground">{row.label}</dt>
              <dd className="text-base leading-7 text-muted-foreground">
                <WithTodos text={row.value} />
                {row.link ? (
                  <>
                    {" "}
                    <Link href={row.link.href} className={QUIET_LINK}>
                      {row.link.label}
                    </Link>
                  </>
                ) : null}
              </dd>
            </div>
          ))}
        </dl>
      </Band>

      <Band id="sample" tinted>
        <h2 id="sample-title" className={H2}>
          {LEGACY_SAMPLE.heading}
        </h2>
        <p className={`mt-6 ${PROSE}`}>{LEGACY_SAMPLE.caption}</p>
        {/* הנגן הקיים באתר (נטען רק בלחיצה), כמו בעמוד סיור האולפן והפודקאסט */}
        <LazyYouTubeEmbed
          embedUrl={youtubeEmbedUrl(LEGACY_SAMPLE.video.videoId) ?? ""}
          title={LEGACY_SAMPLE.video.title}
          className="mt-6 aspect-video overflow-hidden rounded-2xl"
        />
        <p className="mt-5">
          <Link href="/podcast/podcast-with-grandpa" className={QUIET_LINK}>
            לעמוד פודקאסט עם סבא וסבתא
          </Link>
        </p>
      </Band>

      <Band id="faq">
        <h2 id="faq-title" className={H2}>
          שאלות ותשובות
        </h2>
        <div className="mt-6 divide-y divide-border rounded-2xl border border-border bg-surface">
          {LEGACY_FAQS.map((faq) => (
            <div key={faq.id} className="px-5 py-5 sm:px-6">
              <h3 className="text-lg font-semibold text-foreground">{faq.question}</h3>
              <p
                className="faq-answer mt-2 text-base leading-7 text-muted-foreground"
                data-speakable
              >
                <WithTodos text={faq.answer} />
              </p>
            </div>
          ))}
        </div>
      </Band>

      <Section
        padding="sm"
        className="border-t border-border bg-surface"
        ariaLabelledby="legacy-contact-title"
      >
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 id="legacy-contact-title" className={H2}>
              {LEGACY_CTA.heading}
            </h2>
            <p className={`mt-4 ${PROSE}`}>{LEGACY_CTA.body}</p>
            <div
              data-lead-surface="legacy_recording_close"
              className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center"
            >
              <Button
                as="a"
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
                className="w-full sm:w-auto"
              >
                {LEGACY_CTA.whatsappLabel}
              </Button>
              <a
                href={`tel:${CONTACT_PHONE_E164}`}
                className="text-base font-medium text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--service-accent,var(--color-brand-red))]"
              >
                או להתקשר: <bdi>{CONTACT_PHONE_DISPLAY}</bdi>
              </a>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
