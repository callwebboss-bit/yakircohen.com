import type { TechBarrierReliefConfig } from "@/lib/data/tech-barrier-relief";

export default function TechBarrierReliefSection({
  config,
  className = "",
}: {
  config: TechBarrierReliefConfig;
  className?: string;
}) {
  return (
    <section className={`border-b border-border bg-surface py-10 sm:py-12 ${className}`}>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
            חסמים טכנולוגיים
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {config.title}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {config.intro}
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {config.items.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-border bg-background p-5"
            >
              <h3 className="text-base font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {item.body}
              </p>
            </article>
          ))}
        </div>

        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-foreground/80 sm:text-base">
          {config.closer}
        </p>
      </div>
    </section>
  );
}
