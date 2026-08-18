import Button from "@/components/ui/Button";
import type { MatanotEventCardData } from "@/lib/data/matanot-page";

export default function MatanotEventCard({
  event,
}: {
  event: MatanotEventCardData;
}) {
  return (
    <article
      id={event.id}
      className="flex h-full flex-col rounded-2xl border border-border bg-background p-6 shadow-sm transition-[border-color,box-shadow,transform] duration-normal ease-luxury hover:-translate-y-0.5 hover:border-brand-red/30 hover:shadow-md"
    >
      <div className="flex-1">
        <h3 className="text-xl font-semibold text-foreground">{event.title}</h3>

        <div className="mt-5">
          <p className="text-sm font-semibold text-foreground">למי מתאים</p>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
            {event.suitedFor.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6">
          <p className="text-sm font-semibold text-foreground">רעיונות למתנה</p>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
            {event.ideas.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6">
        <Button
          as="a"
          href={event.whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="min-h-12 w-full"
          aria-label={`שליחת הודעת וואטסאפ עבור מתנת ${event.title}`}
        >
          {`מתנת ${event.title}`}
        </Button>
      </div>
    </article>
  );
}
