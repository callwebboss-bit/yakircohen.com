import FullProductionBeforeAfter from "@/components/seo/FullProductionBeforeAfter";
import {
  FULL_PRODUCTION_COPY,
  FULL_PRODUCTION_LAYERS,
  type FullProductionCopyVariant,
} from "@/lib/data/full-production-showcase";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

type Props = {
  variant: FullProductionCopyVariant;
  className?: string;
  id?: string;
};

export default function FullProductionShowcaseSection({
  variant,
  className,
  id = "full-production-showcase",
}: Props) {
  const copy = FULL_PRODUCTION_COPY[variant];
  const waHref = buildWhatsAppHref({
    text: copy.whatsappText,
    utm_source: "website",
    utm_campaign: copy.utmCampaign,
  });

  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={cn("border-b border-border bg-surface py-12 sm:py-14", className)}
    >
      <div className="mx-auto max-w-[72rem] px-4 sm:px-6 lg:px-8">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
            {copy.eyebrow}
          </p>
          <h2
            id={`${id}-heading`}
            className="mt-3 font-serif text-xl font-semibold text-foreground sm:text-2xl"
          >
            {copy.title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {copy.subtitle}
          </p>
        </header>

        <div className="mx-auto mt-10 max-w-2xl">
          <FullProductionBeforeAfter playerNote={copy.playerNote} />
        </div>

        <div className="mx-auto mt-10 max-w-4xl">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
            מה נכנס להפקה
          </p>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FULL_PRODUCTION_LAYERS.map((layer) => (
              <li
                key={layer.title}
                className="rounded-2xl border border-border bg-background p-5 text-center transition-[border-color,box-shadow,transform] duration-normal ease-luxury hover:-translate-y-0.5 hover:border-brand-red/30 hover:shadow-md"
              >
                <h3 className="text-sm font-semibold text-foreground">
                  {layer.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  {layer.body}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <article className="mx-auto mt-10 max-w-3xl rounded-2xl border-2 border-brand-red/25 bg-gradient-to-br from-brand-red/5 to-background p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
            הרמוניות
          </p>
          <h3 className="mt-3 font-serif text-lg font-semibold text-foreground sm:text-xl">
            {copy.harmoniesTitle}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {copy.harmoniesBody}
          </p>
        </article>

        <div className="mt-10 text-center">
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-xl bg-brand-red px-7 py-3.5 text-sm font-semibold text-white hover:bg-brand-red-light"
          >
            {copy.ctaLabel} </a>
        </div>
      </div>
    </section>
  );
}
