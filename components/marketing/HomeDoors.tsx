import Link from "@/components/ui/IntentLink";
import Button from "@/components/ui/Button";
import {
  HOME_DOORS,
  HOME_MORE_LINKS,
  type HomeDoor,
  type HomeDoorLink,
} from "@/lib/data/home-doors";
import { getExVat } from "@/lib/data/pricing-catalog";
import { formatPagePrice } from "@/lib/data/pricing-display";
import { cn } from "@/lib/utils";

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red";

/* צ'יפ קישור: 44px לפחות (D51), ובלי גוון אדום מתחת לטקסט אדום (F-06) */
const CHIP = cn(
  "inline-flex min-h-11 items-center rounded-full border border-border bg-background px-3.5 text-sm font-medium text-foreground",
  "transition-colors duration-200 touch-manipulation hover:border-brand-red/40 hover:text-brand-red-text",
  FOCUS,
);

/** מחיר אחד, כולל מע״מ, מהקטלוג (D86) */
function DoorPrice({ door, className }: { door: HomeDoor; className?: string }) {
  if (door.price) {
    const price = formatPagePrice(getExVat(door.price.id), { from: door.price.from });
    return (
      <p className={cn("font-semibold text-brand-red-text", className)}>
        {door.price.label}:{" "}
        <data value={String(price.totalWithVat)}>{price.headline}</data>
      </p>
    );
  }
  if (door.priceNote) {
    return <p className={cn("text-muted-foreground", className)}>{door.priceNote}</p>;
  }
  return null;
}

function DoorChips({
  door,
  links,
  className,
}: {
  door: HomeDoor["door"] | "more";
  links: readonly HomeDoorLink[];
  className?: string;
}) {
  if (links.length === 0) return null;
  return (
    <ul className={cn("flex flex-wrap gap-2", className)}>
      {links.map((link) => (
        <li key={link.id} data-door={door} data-door-item={link.id}>
          <Link href={link.href} className={CHIP}>
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function PrimaryDoor({ door }: { door: HomeDoor }) {
  return (
    <li className="flex flex-col rounded-2xl border border-brand-red/30 bg-surface p-5 shadow-sm sm:p-6">
      <h2 className="font-serif text-2xl font-semibold text-foreground sm:text-3xl">
        {door.title}
      </h2>
      <p className="mt-2 text-base leading-relaxed text-foreground/90">{door.sentence}</p>
      <DoorPrice door={door} className="mt-3 text-base" />
      <div className="mt-auto pt-4" data-door={door.door} data-door-item={door.itemId}>
        <Button as="link" href={door.href} className="w-full text-base sm:w-auto">
          {door.cta}
        </Button>
      </div>
      <DoorChips door={door.door} links={door.links} className="mt-3" />
    </li>
  );
}

function SecondaryDoor({ door }: { door: HomeDoor }) {
  return (
    <li className="flex flex-col rounded-xl border border-border bg-background p-4">
      <h2 className="text-lg font-bold text-foreground">
        <span data-door={door.door} data-door-item={door.itemId}>
          <Link
            href={door.href}
            className={cn(
              "inline-flex min-h-11 items-center gap-1 rounded-sm transition-colors hover:text-brand-red-text",
              FOCUS,
            )}
          >
            {door.title}
            <span aria-hidden="true">›</span>
          </Link>
        </span>
      </h2>
      <p className="text-sm leading-relaxed text-muted-foreground">{door.sentence}</p>
      <DoorPrice door={door} className="mt-1 text-sm" />
      <DoorChips door={door.door} links={door.links} className="mt-3" />
    </li>
  );
}

/**
 * הדלתות בראש דף הבית (D84, D85, D93). רכיב שרת, בלי JS משלו: המדידה
 * עוברת דרך data-door והמאזין הקיים (OutboundLeadTracker).
 */
export default function HomeDoors({ className }: { className?: string }) {
  const primary = HOME_DOORS.filter((d) => d.prominence === "primary");
  const secondary = HOME_DOORS.filter((d) => d.prominence === "secondary");

  return (
    <div id="home-doors" className={className} data-lead-surface="home_doors">
      <ul className="grid gap-4 lg:grid-cols-2">
        {primary.map((door) => (
          <PrimaryDoor key={door.door} door={door} />
        ))}
      </ul>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {secondary.map((door) => (
          <SecondaryDoor key={door.door} door={door} />
        ))}
      </ul>
      <div className="mt-5">
        <p className="text-sm font-semibold text-muted-foreground">עוד שירותים</p>
        <DoorChips door="more" links={HOME_MORE_LINKS} className="mt-2" />
      </div>
    </div>
  );
}
