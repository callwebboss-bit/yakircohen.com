import Link from "next/link";
import { cn } from "@/lib/utils";
import { publishedServiceLinks, type ServiceOfferPath } from "@/lib/data/service-offers/status";

/**
 * שורת קישורים מעמוד קיים לשירותים החדשים (lib/data/service-offers). בלי כותרת
 * (h2/h3), כדי לא לשנות את מבנה העמוד הקיים. מציג רק עמודים שפורסמו, ולכן עד
 * הפרסום לא נראה כלום.
 */
export default function NewServicesLinks({
  paths,
  label = "עוד שירותים שיכולים להתאים",
  className,
}: {
  paths: readonly ServiceOfferPath[];
  label?: string;
  className?: string;
}) {
  const links = publishedServiceLinks(paths);
  if (!links.length) return null;
  return (
    <nav aria-label={label} className={cn("mx-auto max-w-3xl px-4 py-6 text-center", className)}>
      <p className="text-sm font-semibold text-foreground">{label}</p>
      <ul className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="font-semibold text-brand-red hover:underline">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
