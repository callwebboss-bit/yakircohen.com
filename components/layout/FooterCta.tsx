import Link from "next/link";

const FOOTER_FUNCTIONAL_LINKS = [
  { href: "/events/equipment/dry-hire", label: "מחירון חומרה" },
  { href: "/terms", label: "תקנון פעילות" },
  { href: "/events/equipment", label: "רשימת ציוד" },
  { href: "/contact", label: "יצירת קשר" },
] as const;

export default function FooterCta() {
  return (
    <nav
      aria-label="קישורים מהירים"
      className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-border pt-6"
    >
      {FOOTER_FUNCTIONAL_LINKS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="inline-flex min-h-11 items-center text-sm text-muted-foreground transition-colors hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
