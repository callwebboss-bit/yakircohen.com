import Link from "next/link";
import ContextualIntroParagraph from "@/components/seo/ContextualIntroParagraph";
import FaqPageSchema from "@/components/seo/FaqPageSchema";
import FAQAccordion from "@/components/ui/FAQAccordion";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import {
  ALT_WORK_VALUE,
  DEFAULT_HOURS,
  DEFAULT_WORK_VALUE,
  SCENARIO_HOURS,
  SONG_HOURS,
  SOURCE_KIND_LABEL,
  STUDIO_COST_CATEGORIES,
  STUDIO_COST_CITATION,
  STUDIO_COST_DESCRIPTION,
  STUDIO_COST_DATASET_SCHEMA,
  STUDIO_COST_METHODOLOGY,
  STUDIO_COST_PATHNAME,
  STUDIO_COST_SLUG,
  STUDIO_COST_TITLE,
  STUDIO_COST_UPDATED_AT,
  VOICE_CARDS,
  categoryMonthly,
  consumerPrice,
  fullRouteConsumerPrice,
  hourCost,
  monthlyFixedCost,
  nis,
  songBreakdown,
  speakableAnswer,
  studioCostFaqs,
} from "@/lib/data/studio-cost-model";
import { safeJsonLdStringify } from "@/lib/safe-json-ld";
import { buildWebPageSchema } from "@/lib/seo/page-schema";
import { buildWhatsAppHref } from "@/lib/whatsapp";

const primaryCtaClass =
  "inline-flex min-h-12 items-center justify-center rounded-xl bg-brand-red px-5 py-3 text-sm font-semibold text-white hover:bg-brand-red-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red";
const secondaryCtaClass =
  "inline-flex min-h-12 items-center justify-center rounded-xl border border-border bg-background px-5 py-3 text-sm font-semibold text-foreground hover:border-brand-red/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red";

/* Server Component בכוונה: כל המספרים חייבים להיות ב-HTML בלי JavaScript,
   כמו PriceFactorsSection. אין כאן state ואין מחשבון בצד הלקוח. */
export default function StudioCostPageContent() {
  const breakdown = songBreakdown();
  const faqs = studioCostFaqs();
  const fixed = monthlyFixedCost();
  const songPrice = consumerPrice("song_recording");
  const pitchPrice = consumerPrice("song_pitch_coaching");
  const fullRoute = fullRouteConsumerPrice();
  const maxAmount = Math.max(...breakdown.map((r) => r.amount));

  const waHref = buildWhatsAppHref({
    text: "שלום, קראתי את פירוק המחיר של הקלטת שיר ואשמח לקבוע סשן.",
    utm_source: "website",
    utm_campaign: "studio_cost_page",
  });

  return (
    <>
      <FaqPageSchema items={faqs.map((f) => ({ question: f.question, answer: f.answer }))} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(STUDIO_COST_DATASET_SCHEMA) }}
      />
      {/* צומת WebPage אחד עם @id ו-speakable, לפי buildWebPageSchema. לא SpeakableSchema,
          שפולט WebPage אנונימי נוסף (pre-mortem 4.10.2026, ממצא 3). */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLdStringify(
            buildWebPageSchema({
              slug: STUDIO_COST_SLUG,
              title: STUDIO_COST_TITLE,
              description: STUDIO_COST_DESCRIPTION,
            }),
          ),
        }}
      />

      <article className="bg-background">
        <Section padding="sm" className="border-b border-border bg-background">
          <Container className="max-w-4xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
              שקיפות מחיר
            </p>
            <h1 className="text-hero mt-4 font-serif font-semibold text-foreground">
              {STUDIO_COST_TITLE}
            </h1>
            <p className="text-lead mx-auto mt-4 max-w-3xl text-muted-foreground" data-speakable>
              {speakableAnswer()}
            </p>
            <p className="mt-4 text-xs text-muted-foreground">
              עודכן: {new Date(STUDIO_COST_UPDATED_AT).toLocaleDateString("he-IL")}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/studio/recording-song-modiin" className={primaryCtaClass}>
                להקלטת שיר
              </Link>
              <a href={waHref} target="_blank" rel="noopener noreferrer" className={secondaryCtaClass}>
                לשאלה בוואטסאפ
              </a>
            </div>
          </Container>
        </Section>

        <Section padding="sm" className="border-b border-border bg-surface/40" id="breakdown">
          <Container className="max-w-5xl">
            <h2 className="font-serif text-section-title font-semibold text-foreground">
              לאן הולכים {nis(songPrice)}
            </h2>
            <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted-foreground">
              לפי המודל, כשהאולפן עובד {DEFAULT_HOURS} שעות בחודש עם לקוחות. כל קטגוריה נפתחת
              לשורות, ולכל שורה יש נוסחה ומקור.
            </p>

            <ol className="mt-8 space-y-3">
              {breakdown.map((row) => (
                <li key={row.id} className="rounded-2xl border border-border bg-background p-4">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="font-semibold text-foreground">{row.label}</span>
                    <span className="shrink-0 whitespace-nowrap font-semibold tabular-nums text-foreground">{nis(row.amount, 2)}</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-surface" aria-hidden>
                    <div
                      className="h-2 rounded-full bg-brand-red"
                      style={{ width: `${Math.max(2, (row.amount / maxAmount) * 100)}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{row.note}</p>

                  {row.parts ? (
                    <ul className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                      {row.parts.map((part) => (
                        <li key={part.label} className="flex justify-between gap-3 rounded-lg bg-surface px-3 py-2">
                          <span className="text-muted-foreground">{part.label}</span>
                          <span className="tabular-nums text-foreground">{nis(part.amount, 2)}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {row.lines ? (
                    <details className="mt-3">
                      <summary className="cursor-pointer text-sm font-medium text-brand-red">
                        השורות והמקורות
                      </summary>
                      <div className="mt-3 overflow-x-auto">
                        <table className="w-full border-collapse text-sm">
                          <thead>
                            <tr className="text-right text-muted-foreground">
                              <th className="px-2 py-2 font-medium">שורה</th>
                              <th className="px-2 py-2 font-medium">₪ לחודש</th>
                              <th className="px-2 py-2 font-medium">נוסחה</th>
                              <th className="px-2 py-2 font-medium">סוג</th>
                            </tr>
                          </thead>
                          <tbody>
                            {row.lines.map((line) => (
                              <tr key={line.label} className="border-t border-border align-top">
                                <td className="px-2 py-2 text-foreground">
                                  {line.sourceUrl ? (
                                    <a
                                      href={line.sourceUrl}
                                      target="_blank"
                                      rel="noopener noreferrer nofollow"
                                      className="underline decoration-dotted underline-offset-2 hover:text-brand-red"
                                    >
                                      {line.label}
                                    </a>
                                  ) : (
                                    line.label
                                  )}
                                </td>
                                <td className="px-2 py-2 tabular-nums text-foreground">
                                  {line.monthly.toLocaleString("he-IL", { minimumFractionDigits: 2 })}
                                </td>
                                <td className="px-2 py-2 text-muted-foreground" dir="ltr">
                                  {line.formula}
                                </td>
                                <td className="px-2 py-2 text-muted-foreground">
                                  {line.kinds.map((k) => SOURCE_KIND_LABEL[k]).join(", ")}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </details>
                  ) : null}
                </li>
              ))}
            </ol>
            <p className="mt-4 text-sm text-muted-foreground">
              סך ההוצאות החודשיות במודל: {nis(fixed, 2)} לפני מע״מ. הפיצול של זמן העבודה למסים
              מחושב לפי השיעורים של שווי זמן עבודה של {DEFAULT_WORK_VALUE.toLocaleString("he-IL")} ₪
              בחודש (הנחת מודל).
            </p>
          </Container>
        </Section>

        <Section padding="sm" className="border-b border-border" id="hour-cost">
          <Container className="max-w-4xl">
            <h2 className="font-serif text-section-title font-semibold text-foreground">
              כמה עולה שעת עבודה באולפן מקצועי
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              עלות שעה היא ההוצאות החודשיות ועוד שווי זמן העבודה, חלקי השעות עם לקוחות בחודש.
            </p>
            <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
              <table className="w-full border-collapse text-sm">
                <thead className="bg-surface">
                  <tr className="text-right">
                    <th className="px-4 py-3 font-semibold text-foreground">שעות עם לקוחות בחודש</th>
                    <th className="px-4 py-3 font-semibold text-foreground">
                      עלות שעה (שווי עבודה {DEFAULT_WORK_VALUE.toLocaleString("he-IL")} ₪)
                    </th>
                    <th className="px-4 py-3 font-semibold text-foreground">
                      עלות שעה (שווי עבודה {ALT_WORK_VALUE.toLocaleString("he-IL")} ₪, הנחת מודל)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {SCENARIO_HOURS.map((h) => (
                    <tr key={h} className="border-t border-border">
                      <td className="px-4 py-3 text-foreground">{h}</td>
                      <td className="px-4 py-3 font-semibold tabular-nums text-foreground">
                        {nis(hourCost(h), 2)}
                      </td>
                      <td className="px-4 py-3 tabular-nums text-muted-foreground">
                        {nis(hourCost(h, ALT_WORK_VALUE), 2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              שיר לוקח בערך {SONG_HOURS} שעות עבודה, לפי הערכת האולפן.
            </p>
          </Container>
        </Section>

        <Section padding="sm" className="border-b border-border bg-surface/40" id="full-route">
          <Container className="max-w-4xl">
            <h2 className="font-serif text-section-title font-semibold text-foreground">
              שיר ותיקון זיופים: {nis(fullRoute)} כולל מע״מ
            </h2>
            <p className="mt-3 text-base leading-relaxed text-foreground">
              הבסיס, {nis(songPrice)}, הוא הקלטה, מיקס ומאסטר בסשן של שעה. תיקון זיופים וטכנאי
              שמכוון ומנחה בזמן ההקלטה הם עוד {nis(pitchPrice)}. ביחד, {nis(fullRoute)} כולל מע״מ,
              זה המחיר המלא של העבודה. לפי הערכת האולפן, רוב לקוחות השיר מוסיפים תיקון זיופים.
            </p>
          </Container>
        </Section>

        <Section padding="sm" className="border-b border-border" id="why">
          <Container className="max-w-5xl">
            <h2 className="font-serif text-section-title font-semibold text-foreground">
              למה כל שורה שם, במילים של יקיר
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {VOICE_CARDS.map((card) => {
                const category = STUDIO_COST_CATEGORIES.find((c) => c.id === card.categoryId);
                const share = category ? (categoryMonthly(category) / DEFAULT_HOURS) * SONG_HOURS : 0;
                return (
                  <figure key={card.categoryId} className="rounded-2xl border border-border bg-surface p-5">
                    <p className="text-sm font-semibold text-brand-red">
                      {card.title}, {nis(Math.round(share))} מהשיר
                    </p>
                    <blockquote className="mt-3 text-base leading-relaxed text-foreground">
                      &quot;{card.quote}&quot;
                    </blockquote>
                  </figure>
                );
              })}
            </div>
          </Container>
        </Section>

        <Section padding="sm" className="border-b border-border bg-surface/40" id="methodology">
          <Container className="max-w-4xl">
            <h2 className="font-serif text-section-title font-semibold text-foreground">
              מתודולוגיה
            </h2>
            <ContextualIntroParagraph pathname={STUDIO_COST_PATHNAME} className="mt-4 max-w-3xl" />
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {STUDIO_COST_METHODOLOGY.map((line) => (
                <li key={line} className="rounded-xl border border-border bg-background px-4 py-3">
                  {line}
                </li>
              ))}
            </ul>
            <p className="mt-5 rounded-xl border border-brand-red/20 bg-brand-red/5 px-4 py-3 text-sm font-medium text-foreground">
              {STUDIO_COST_CITATION}
            </p>
          </Container>
        </Section>

        <FAQAccordion
          className="border-t border-border"
          title="שאלות על מחיר הקלטת שיר"
          subtitle="תשובות קצרות, לפי המודל והמקורות בעמוד"
          items={faqs}
        />
      </article>
    </>
  );
}
