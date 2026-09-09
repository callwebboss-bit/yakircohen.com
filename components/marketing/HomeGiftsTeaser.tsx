import Link from "next/link";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import { MATANOT_EVENT_CARDS } from "@/lib/data/matanot-page";

export default function HomeGiftsTeaser() {
  return (
    <Section
      className="border-y border-catalog-gold/25 bg-surface"
      ariaLabelledby="home-gifts-title"
    >
      <Container className="py-12">
        <header className="mx-auto max-w-2xl text-center">
          <span
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-catalog-gold/40 bg-catalog-gold/10 text-3xl shadow-sm"
            aria-hidden="true"
          >
            🎁
          </span>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-catalog-gold">
            מתנות לפי אירוע
          </p>
          <h2
            id="home-gifts-title"
            className="mt-2 font-serif text-2xl font-semibold text-foreground sm:text-3xl"
          >
            מחפשים לעשות מתנה?
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            שיר, ברכה או פודקאסט אישי - מתנה מוקלטת שנשמרת לכל החיים, מותאמת לסוג
            האירוע.
          </p>
        </header>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {MATANOT_EVENT_CARDS.map((event) => (
            <li key={event.id} className="h-full">
              <Link
                href={`/matanot#${event.id}`}
                className="flex h-full flex-col rounded-2xl border border-border bg-background p-5 text-start shadow-sm transition-[border-color,box-shadow,transform] duration-normal ease-luxury hover:-translate-y-0.5 hover:border-catalog-gold/40 hover:shadow-md"
              >
                <h3 className="text-lg font-semibold text-foreground">
                  {event.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {event.ideas[0]}
                </p>
                <span className="mt-4 inline-flex text-sm font-semibold text-brand-red">
                  מתנת {event.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8 text-center">
          <Link
            href="/matanot"
            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-catalog-gold/40 bg-catalog-gold/10 px-7 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-catalog-gold/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-catalog-gold"
          >
            לכל רעיונות המתנה
          </Link>
        </div>
      </Container>
    </Section>
  );
}
