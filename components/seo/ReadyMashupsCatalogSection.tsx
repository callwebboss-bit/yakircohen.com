import Link from "next/link";
import { READY_MASHUPS_CATALOG } from "@/lib/data/ready-mashups-catalog";
import { formatFromPriceDual } from "@/lib/data/pricing-catalog";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export default function ReadyMashupsCatalogSection({ embedded = false }: { embedded?: boolean }) {
  const priceLabel = formatFromPriceDual(READY_MASHUPS_CATALOG[0]?.priceExVat ?? 650);

  return (
    <section
      id="ready-mashups"
      className="scroll-mt-24"
      aria-labelledby={embedded ? undefined : "ready-mashups-heading"}
    >
      {embedded ? null : (
        <>
          <h2 id="ready-mashups-heading" className="text-2xl font-semibold text-foreground">
            מאגר מוכן. קנה ונגן
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            גרסאות שכבר ערוכו ונבדקו. לא צריך לחכות לעריכה. בוחרים מהרשימה ומקבלים קובץ.
            {` `}
            <span className="text-foreground/80">{priceLabel} לשילוב.</span>
          </p>
        </>
      )}

      <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", embedded ? "mt-0" : "mt-6")}>
        {READY_MASHUPS_CATALOG.map((item) => {
          const waHref = buildWhatsAppHref({
            text: `שלום, רוצה לרכוש את המאשאפ המוכן:\n${item.title}`,
            utm_source: "website",
            utm_campaign: "dj_ready_mashup",
          });
          return (
            <article
              key={item.id}
              className="flex flex-col rounded-xl border border-border bg-surface p-5"
            >
              <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{item.description}</p>
              {item.tags.length ? (
                <p className="mt-3 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </p>
              ) : null}
              <p className="mt-3 text-sm font-semibold text-brand-red">
                {formatFromPriceDual(item.priceExVat)}
              </p>
              <div className="mt-4 flex flex-col gap-2">
                <Link
                  href="#mashup-ideas"
                  className="text-center text-xs font-medium text-brand-red hover:underline"
                >
                  ראו את הרעיון בקטלוג
                </Link>
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-10 items-center justify-center rounded-lg bg-brand-red px-4 text-sm font-semibold text-white hover:bg-brand-red-light"
                >
                  רכישה
                </a>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
