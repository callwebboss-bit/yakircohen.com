import Container from "@/components/ui/Container";
import { BOOK_INTENT_PATHS } from "@/lib/data/book-intent-paths";
import { catalogWithVat, getExVat } from "@/lib/data/pricing-catalog";
import { TIME_CLAIMS } from "@/lib/data/conversion-copy";
import { buildWhatsAppHref } from "@/lib/whatsapp";

const consultHref = buildWhatsAppHref({
  text: "שלום, אני עוד לא בטוח/ה איזה שירות מתאים לי - אשמח להתייעץ.",
  utm_source: "website",
  utm_campaign: "book_intent_consult",
});

/**
 * כניסה לפי כוונה מעל הראוטר הקיים: 5 מסלולים עם תווית קצרה,
 * שורת הבדל, עוגן מחיר ו-CTA תוצאתי אחד. בלי URL חדש - hash בלבד.
 */
export default function BookIntentPaths() {
  return (
    <section
      id="book-intent-paths"
      aria-labelledby="book-intent-heading"
      className="border-b border-border bg-surface py-10 sm:py-12"
    >
      <Container className="max-w-5xl">
        <div className="flex flex-col items-center gap-3 text-center">
          <h2
            id="book-intent-heading"
            className="font-serif text-xl font-semibold text-foreground sm:text-2xl"
          >
            יודעים מה אתם צריכים? בחרו מסלול
          </h2>
          <p className="text-sm text-muted-foreground">
            עוד מתלבטים?{" "}
            <a
              href={consultHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center font-semibold text-brand-red hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
            >
              דברו איתנו בוואטסאפ - {TIME_CLAIMS.waResponseMinutes}
            </a>
          </p>
        </div>

        <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {BOOK_INTENT_PATHS.map((path) => {
            const exVat = path.priceId ? getExVat(path.priceId) : null;

            return (
              <li key={path.id} className="h-full">
                <div className="flex h-full flex-col rounded-2xl border border-border bg-background p-4 transition-colors hover:border-brand-red/40">
                  <p className="text-base font-bold text-foreground">
                    <span aria-hidden="true">{path.emoji} </span>
                    {path.title}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {path.difference}
                  </p>
                  {exVat != null ? (
                    <p className="mt-2 text-xs font-semibold text-brand-red">
                      החל מ-{exVat.toLocaleString("he-IL")} ₪ + מע״מ
                      <span className="block font-normal text-muted-foreground">
                        כולל מע״מ: {catalogWithVat(exVat).toLocaleString("he-IL")} ₪
                      </span>
                    </p>
                  ) : (
                    <p className="mt-2 text-xs text-muted-foreground">
                      הצעה מותאמת, {TIME_CLAIMS.quote24h}
                    </p>
                  )}
                  {/* עוגן רגיל ולא next/link - כדי ש-hashchange יפתח את הוויזארד */}
                  <a
                    href={path.href}
                    className="mt-auto inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-brand-red px-3 pt-3 pb-3 text-center text-xs font-bold text-white transition-colors hover:bg-brand-red-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red sm:text-sm"
                  >
                    {path.ctaLabel}
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
