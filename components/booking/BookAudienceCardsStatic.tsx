import { BOOK_AUDIENCE_ROUTES } from "@/lib/data/book-audience-routes";

/**
 * Server-rendered audience route copy for crawlers (initial HTML).
 * Visually hidden - interactive cards in BookAudienceRouter are the primary UI.
 */
export default function BookAudienceCardsStatic() {
  return (
    <section
      id="book-audience-static"
      className="sr-only"
      aria-label="כל כיווני ההזמנה והמחירים"
    >
      <div className="mx-auto max-w-[72rem] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {BOOK_AUDIENCE_ROUTES.map((route) => (
            <article
              key={route.id}
              id={`book-route-${route.id}`}
              className="rounded-xl border border-border bg-background p-4"
            >
              <p className="text-xs font-bold uppercase tracking-wide text-brand-red">
                {route.tag}
              </p>
              <h3 className="mt-2 font-serif text-base font-semibold leading-snug text-foreground">
                {route.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {route.description}
              </p>
              <p className="mt-2 text-sm font-medium text-foreground">
                {route.startingPriceDual}
                {route.priceNote ? (
                  <span className="font-normal text-muted-foreground">
                    {" "}
                    - {route.priceNote}
                  </span>
                ) : null}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
