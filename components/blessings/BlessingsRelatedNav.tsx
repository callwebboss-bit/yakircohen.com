import Link from "next/link";

export type BlessingsRelatedNavProps = {
  links: readonly { href: string; label: string }[];
};

export default function BlessingsRelatedNav({ links }: BlessingsRelatedNavProps) {
  return (
    <section className="flex flex-wrap justify-center gap-3 pb-4 pt-2">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-medium transition-[border-color,color,box-shadow] duration-normal ease-luxury hover:border-brand-red/40 hover:text-brand-red hover:shadow-sm"
        >
          {link.label}
        </Link>
      ))}
    </section>
  );
}
