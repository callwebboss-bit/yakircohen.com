import type { ReactNode } from "react";
import InlineServiceLink from "@/components/marketing/InlineServiceLink";
import {
  getPriceById,
  getPriceTransparencyById,
  type PriceItemId,
  type PriceTransparency,
} from "@/lib/data/pricing-catalog";
import {
  GLOSSARY_PATHNAME,
  getGlossaryTermBySlug,
} from "@/lib/data/glossary";
import { cn } from "@/lib/utils";

type CatalogOfferPanelProps = {
  catalogId?: PriceItemId;
  transparency?: PriceTransparency;
  className?: string;
  compact?: boolean;
};

function listFromCatalogIds(ids: readonly PriceItemId[]): string[] {
  return ids.map((id) => getPriceById(id).label);
}

function GlossaryLinks({ slugs }: { slugs: readonly string[] }) {
  const terms = slugs
    .map((slug) => getGlossaryTermBySlug(slug))
    .filter((term): term is NonNullable<typeof term> => term != null);
  if (terms.length === 0) return null;
  return (
    <ul className="mt-1 flex flex-wrap gap-x-3 gap-y-1">
      {terms.map((term) => (
        <li key={term.slug}>
          <InlineServiceLink href={`${GLOSSARY_PATHNAME}/${term.slug}`}>
            {term.termHe}
          </InlineServiceLink>
        </li>
      ))}
    </ul>
  );
}

function Disclosure({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <details className="group rounded-lg border border-catalog-gold/35 bg-background/50 open:border-catalog-gold/55 open:bg-background/80 [interpolate-size:allow-keywords]">
      <summary className="flex min-h-12 cursor-pointer list-none items-center px-2.5 py-2 font-semibold text-foreground marker:content-none [&::-webkit-details-marker]:hidden">
        {title}
      </summary>
      <div className="border-t border-border/50 px-2.5 py-2">{children}</div>
    </details>
  );
}

export default function CatalogOfferPanel({
  catalogId,
  transparency,
  className,
  compact = false,
}: CatalogOfferPanelProps) {
  const resolved =
    transparency ?? (catalogId ? getPriceTransparencyById(catalogId) : null);
  if (!resolved) return null;

  const addons = listFromCatalogIds(resolved.addons);
  const textClass = compact ? "text-[0.7rem]" : "text-xs";
  const boxClass = compact ? "mt-2 space-y-1.5" : "mt-3 space-y-2";

  return (
    <div className={cn(boxClass, textClass, "text-muted-foreground", className)}>
      <Disclosure title="מה כלול">
        {resolved.included.length > 0 ? (
          <ul className="list-disc space-y-1 pe-4">
            {resolved.included.map((line) => (
              <li key={line} className="leading-relaxed">
                {line}
              </li>
            ))}
          </ul>
        ) : (
          <p>אין פירוט נוסף למסלול הזה.</p>
        )}
      </Disclosure>
      <Disclosure title="מה לא כלול">
        {resolved.excluded.length > 0 ? (
          <ul className="list-disc space-y-1 pe-4">
            {resolved.excluded.map((line) => (
              <li key={line} className="leading-relaxed">
                {line}
              </li>
            ))}
          </ul>
        ) : (
          <p>אין פירוט נוסף למסלול הזה.</p>
        )}
      </Disclosure>
      {resolved.glossaryTermSlugs?.length ? (
        <Disclosure title="מונחון">
          <GlossaryLinks slugs={resolved.glossaryTermSlugs} />
        </Disclosure>
      ) : null}
      {addons.length > 0 ? (
        <p className="leading-relaxed">
          <span className="font-semibold text-foreground">תוספות אפשריות: </span>
          {addons.join(" · ")}
        </p>
      ) : null}
      {resolved.scopeNote ? (
        <p className="leading-relaxed text-foreground/85">{resolved.scopeNote}</p>
      ) : null}
    </div>
  );
}
