import { REEL_FACTORY_TERMS } from "@/lib/data/reel-factory";
import { CheckIcon } from "@/components/ui/Icons";

export default function ReelFactoryTermsBlock() {
  return (
    <section
      className="rounded-2xl border border-border bg-surface p-6 sm:p-8"
      aria-labelledby="reel-terms-heading"
    >
      <h2 id="reel-terms-heading" className="text-lg font-semibold text-foreground">
        תנאים כלליים
      </h2>
      <ul className="mt-4 space-y-3">
        {REEL_FACTORY_TERMS.items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
            <CheckIcon size={18} className="mt-0.5 shrink-0 text-brand-red" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-muted-foreground">* {REEL_FACTORY_TERMS.vatNote}</p>
    </section>
  );
}
