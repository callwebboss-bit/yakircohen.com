import Link from "next/link";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import { MATANOT_EVENT_CARDS } from "@/lib/data/matanot-page";

export default function HomeGiftsTeaser() {
  return (
    <Section className="border-b border-border bg-surface" ariaLabelledby="home-gifts-title">
      <Container className="py-12">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
            מתנות לפי אירוע
          </p>
          <h2 id="home-gifts-title" className="mt-3 font-serif text-2xl font-semibold text-foreground">
            מחפשים מתנה מוקלטת?
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            שיר, ברכה או פודקאסט אישי - לפי סוג האירוע ובלי לשנות את מה שכבר עובד.
          </p>
        </header>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {MATANOT_EVENT_CARDS.map((event) => (
            <Link
              key={event.id}
              href={`/matanot#${event.id}`}
              className="rounded-2xl border border-border bg-background p-5 text-start shadow-sm transition-[border-color,box-shadow,transform] duration-normal ease-luxury hover:-translate-y-0.5 hover:border-brand-red/30 hover:shadow-md"
            >
              <h3 className="text-lg font-semibold text-foreground">{event.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{event.ideas[0]}</p>
              <span className="mt-4 inline-flex text-sm font-semibold text-brand-red">
                מתנת {event.title}
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
