import Link from "next/link";
import FaqPageSchema from "@/components/seo/FaqPageSchema";
import ContextualIntroParagraph from "@/components/seo/ContextualIntroParagraph";
import FAQAccordion from "@/components/ui/FAQAccordion";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import { CTA_LABELS, SKEPTICISM_CTA } from "@/lib/data/conversion-copy";
import {
  INDUSTRY_2026_CITATION,
  INDUSTRY_2026_DATASET_SCHEMA,
  INDUSTRY_2026_FAQS,
  INDUSTRY_2026_METHODOLOGY,
  INDUSTRY_2026_OFFERS,
  INDUSTRY_2026_PATHNAME,
  INDUSTRY_2026_QUICK_ANSWERS,
  INDUSTRY_2026_SECTIONS,
  INDUSTRY_2026_TITLE,
  INDUSTRY_2026_UPDATED_AT,
  INDUSTRY_2026_VAT_NOTE,
} from "@/lib/data/industry-2026";
import { buildPricingOffersSchema } from "@/lib/seo/page-schema";
import { absoluteUrl } from "@/lib/site-url";
import { safeJsonLdStringify } from "@/lib/safe-json-ld";
import { buildWhatsAppHref } from "@/lib/whatsapp";

const primaryCtaClass =
  "inline-flex min-h-12 items-center justify-center rounded-xl bg-brand-red px-5 py-3 text-sm font-semibold text-white hover:bg-brand-red-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red";
const secondaryCtaClass =
  "inline-flex min-h-12 items-center justify-center rounded-xl border border-border bg-background px-5 py-3 text-sm font-semibold text-foreground hover:border-brand-red/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red";

const faqSchemaItems = INDUSTRY_2026_FAQS.map((item) => ({
  question: item.question,
  answer: item.answer,
}));

const pricingOffersSchema = buildPricingOffersSchema(
  absoluteUrl(INDUSTRY_2026_PATHNAME.replace(/^\/+/, "")),
  INDUSTRY_2026_OFFERS,
);

const quickJumpLinks = INDUSTRY_2026_SECTIONS.map((section) => ({
  id: section.id,
  label: section.title.replace(/\?$/, ""),
}));

export default function Industry2026PageContent() {
  const waHref = buildWhatsAppHref({
    text: "שלום, ראיתי את נתוני תעשייה 2026 ואשמח להבין מה מתאים לי לפי התקציב.",
    utm_source: "website",
    utm_campaign: "industry_2026_page",
  });

  return (
    <>
      <FaqPageSchema items={faqSchemaItems} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(INDUSTRY_2026_DATASET_SCHEMA) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(pricingOffersSchema) }}
      />

      <article className="bg-background">
        <Section padding="sm" className="border-b border-border bg-background">
          <Container className="max-w-4xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
              Digital PR
            </p>
            <h1 className="text-hero mt-4 font-serif font-semibold text-foreground">
              {INDUSTRY_2026_TITLE}
            </h1>
            <p className="text-lead mx-auto mt-4 max-w-3xl text-muted-foreground" data-speakable>
              הקלטת שיר מתחילה ב-590 ₪, פודקאסט אודיו ב-950 ₪, קליפ מלא ב-4,500 ₪
              ואטרקציה בודדת ב-1,750 ₪ - לפני מע&quot;מ.
            </p>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              ריכוז אחד לשאלות &quot;כמה עולה&quot; ב-2026, מבוסס על מחירון האתר ועל טווחי
              שוק שכבר פורסמו אצלנו במדריכים. {INDUSTRY_2026_VAT_NOTE}
            </p>
            <p className="mt-4 text-xs text-muted-foreground">
              עודכן: {new Date(INDUSTRY_2026_UPDATED_AT).toLocaleDateString("he-IL")}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/book" className={primaryCtaClass}>
                {CTA_LABELS.bookTransparent}
              </Link>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className={secondaryCtaClass}
              >
                {CTA_LABELS.whatsappQuote}
              </a>
            </div>
          </Container>
        </Section>

        <Section padding="sm" className="border-b border-border bg-surface/40">
          <Container className="max-w-5xl">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
                    מתודולוגיה
                  </p>
                  <h2 className="mt-3 font-serif text-section-title font-semibold text-foreground">
                    איך לקרוא את המספרים
                  </h2>
                </div>
                <ContextualIntroParagraph pathname={INDUSTRY_2026_PATHNAME} className="max-w-3xl" />
                <ul className="space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {INDUSTRY_2026_QUICK_ANSWERS.map((answer) => (
                    <li key={answer} className="rounded-xl border border-border bg-background px-4 py-3">
                      {answer}
                    </li>
                  ))}
                </ul>
              </div>

              <aside className="rounded-2xl border border-border bg-background p-6">
                <h2 className="font-serif text-xl font-semibold text-foreground">איך מצטטים</h2>
                <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
                  {INDUSTRY_2026_METHODOLOGY.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
                <p className="mt-5 rounded-xl border border-brand-red/20 bg-brand-red/5 px-4 py-3 text-sm font-medium text-foreground">
                  {INDUSTRY_2026_CITATION}
                </p>
              </aside>
            </div>
          </Container>
        </Section>

        <Section padding="sm">
          <Container className="max-w-6xl">
            <nav
              aria-label="קפיצה לחלקי עמוד נתוני תעשייה"
              className="flex flex-wrap gap-3 text-sm font-medium"
            >
              {quickJumpLinks.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  className="rounded-full border border-border bg-surface px-4 py-2 hover:border-brand-red/40 hover:text-brand-red"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="mt-10 space-y-10">
              {INDUSTRY_2026_SECTIONS.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="rounded-3xl border border-border bg-surface p-6 sm:p-8"
                >
                  <div className="max-w-3xl">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
                      {section.kicker}
                    </p>
                    <h2 className="mt-3 font-serif text-2xl font-semibold text-foreground">
                      {section.title}
                    </h2>
                    <p className="mt-4 text-base leading-relaxed text-foreground">{section.intro}</p>
                    {section.note ? (
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {section.note}
                      </p>
                    ) : null}
                  </div>

                  <div className="mt-8 overflow-hidden rounded-2xl border border-border">
                    <table className="w-full border-collapse text-sm">
                      <thead className="bg-background">
                        <tr className="text-right">
                          <th className="px-4 py-3 font-semibold text-foreground">סעיף</th>
                          <th className="px-4 py-3 font-semibold text-foreground">מחיר</th>
                          <th className="px-4 py-3 font-semibold text-foreground">הערה</th>
                          <th className="px-4 py-3 font-semibold text-foreground">מקור</th>
                        </tr>
                      </thead>
                      <tbody>
                        {section.rows.map((row) => (
                          <tr key={`${section.id}-${row.label}`} className="border-t border-border align-top">
                            <td className="px-4 py-4 font-medium text-foreground">{row.label}</td>
                            <td className="px-4 py-4">
                              <p className="font-semibold text-foreground">{row.primary}</p>
                              {row.scopeLine ? (
                                <p className="mt-1 text-xs text-muted-foreground">{row.scopeLine}</p>
                              ) : null}
                              {row.vatLine ? (
                                <p className="mt-1 text-xs text-muted-foreground">{row.vatLine}</p>
                              ) : null}
                            </td>
                            <td className="px-4 py-4 text-muted-foreground">{row.note ?? "-"}</td>
                            <td className="px-4 py-4 text-muted-foreground">{row.sourceLabel}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                    {section.links.map((link) => (
                      <Link key={`${section.id}-${link.href}`} href={link.href} className={secondaryCtaClass}>
                        {link.label}
                      </Link>
                    ))}
                  </div>

                  <p className="mt-5 text-sm font-medium text-foreground">{SKEPTICISM_CTA}</p>
                </section>
              ))}
            </div>
          </Container>
        </Section>

        <FAQAccordion
          className="border-t border-border"
          title="שאלות חיפוש על מחירי 2026"
          subtitle="תשובות קצרות לשאלות שהעמוד הזה מיועד לענות עליהן"
          items={INDUSTRY_2026_FAQS.map((item) => ({
            id: item.id,
            question: item.question,
            answer: item.answer,
          }))}
        />
      </article>
    </>
  );
}
