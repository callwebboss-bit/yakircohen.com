import Link from "next/link";
import { FOOTER_LEGAL_LINKS } from "@/lib/constants";

const LEGAL_LINKS = [
  ...FOOTER_LEGAL_LINKS,
  { href: "/pricing", label: "מחירון" },
] as const;

export default function FooterLegalLinks() {
  return (
    <nav className="footer-zone" aria-label="מידע משפטי ותפעולי">
      <h2 className="text-sm font-semibold text-[var(--footer-fg)]">מידע משפטי</h2>
      <ul className="mt-4 space-y-2">
        {LEGAL_LINKS.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="inline-flex min-h-11 items-center text-xs text-[var(--footer-muted)] transition-colors hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
