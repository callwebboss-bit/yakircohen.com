import type { BlessingsWhyCard } from "@/lib/data/blessings-subpages";

export type BlessingsWhyGridProps = {
  items: readonly BlessingsWhyCard[];
};

export default function BlessingsWhyGrid({ items }: BlessingsWhyGridProps) {
  return (
    <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <li
          key={item.title}
          className="rounded-2xl border border-border bg-surface p-6 transition-[border-color,box-shadow,transform] duration-normal ease-luxury hover:-translate-y-0.5 hover:border-brand-red/30 hover:shadow-md"
        >
          <p className="text-2xl" aria-hidden>
            {item.emoji}
          </p>
          <h3 className="mt-3 text-base font-semibold text-foreground">{item.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {item.description}
          </p>
        </li>
      ))}
    </ul>
  );
}
