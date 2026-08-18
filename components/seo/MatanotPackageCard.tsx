import Button from "@/components/ui/Button";
import type { MatanotPackageData } from "@/lib/data/matanot-page";

export default function MatanotPackageCard({
  pkg,
}: {
  pkg: MatanotPackageData;
}) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-border bg-background p-6 shadow-sm">
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-foreground">{pkg.title}</h3>
        <p className="mt-3 text-sm font-semibold text-brand-red">{pkg.startingPrice}</p>
        {pkg.note ? <p className="mt-2 text-sm text-muted-foreground">{pkg.note}</p> : null}

        <ul className="mt-5 space-y-2 text-sm leading-relaxed text-muted-foreground">
          {pkg.items.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <Button
          as="a"
          href={pkg.whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          variant="secondary"
          className="min-h-12 w-full"
          aria-label={`שליחת הודעת וואטסאפ עבור חבילת ${pkg.title}`}
        >
          אני רוצה חבילה זו
        </Button>
      </div>
    </article>
  );
}
