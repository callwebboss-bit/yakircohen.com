import Link from "next/link";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import ServiceCard from "@/components/marketing/ServiceCard";
import { HOME_QUICK_PATHS } from "@/lib/data/home-quick-paths";
import { catalogWithVat, getExVat } from "@/lib/data/pricing-catalog";

export default function HomeQuickPaths() {
  return (
    <Section
      padding="sm"
      className="border-b border-border bg-surface"
      ariaLabelledby="quick-paths-heading"
    >
      <Container>
        <header className="mx-auto mb-10 max-w-2xl text-center">
          <h2
            id="quick-paths-heading"
            className="font-serif text-section-title font-semibold tracking-tight text-foreground"
          >
            מסלולי שירותי סאונד מקצועיים - מחירון שקוף
          </h2>
          <div
            className="mx-auto mt-3 h-1 w-12 rounded-full bg-brand-red"
            aria-hidden="true"
          />
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
            בחרו את מסלול האודיו המדויק לצרכים שלכם. כל התוכניות כוללות ציוד
            קצה, ליווי מקצועי ומחיר פתיחה קבוע.
          </p>
        </header>

        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {HOME_QUICK_PATHS.map((path) => {
            const priceExVat =
              path.fromPriceExVat ??
              (path.priceId ? getExVat(path.priceId) : 0);
            const priceWithVat = catalogWithVat(priceExVat);

            return (
              <li key={path.id} className="h-full">
                <ServiceCard
                  title={path.title}
                  description={path.description}
                  href={path.href}
                  icon={
                    <span className="text-2xl" aria-hidden>
                      {path.emoji}
                    </span>
                  }
                  suitedFor={path.suitedFor}
                  fromPrice={`החל מ-${priceExVat.toLocaleString("he-IL")} ₪`}
                  fromPriceSubline={`כולל מע״מ: ${priceWithVat.toLocaleString("he-IL")} ₪`}
                  ctaLabel="לפרטים והרשמה"
                />
              </li>
            );
          })}
        </ul>

        <div className="mt-12 rounded-2xl border border-border bg-background p-8 shadow-sm md:p-10">
          <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-8 text-right lg:flex-row">
            <div className="lg:max-w-2xl">
              <h3 className="text-xl font-bold text-foreground md:text-2xl">
                שירות שיפור סאונד ועריכת אודיו מרחוק
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                יש לכם קובץ קיים שצריך שדרוג? אנחנו מבצעים תיקון זיופים, ניקוי
                רעשי רקע, מיקס ומאסטרינג אונליין. שלחו את הקובץ שלכם ותקבלו
                תוצאה מוכנה תוך שעות בודדות, בלי להגיע לאולפן.
              </p>
            </div>
            <Link
              href="/online"
              prefetch
              aria-label="שלח קובץ לבדיקה חינם - שירות עריכה מרחוק"
              className="inline-flex min-h-12 w-full shrink-0 items-center justify-center whitespace-nowrap rounded-xl bg-brand-red px-8 py-4 text-base font-bold text-white shadow-md transition-all hover:bg-brand-red-light hover:shadow-lg active:scale-[0.98] lg:w-auto"
            >
              שלח קובץ לבדיקה חינם
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
