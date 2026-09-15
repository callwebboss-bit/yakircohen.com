import Link from "next/link";
import { FOOTER_LEGAL_LINKS } from "@/lib/constants";
import { FOOTER_LEGAL_ROW_LINKS } from "@/lib/footer-category-tree";

/* הרשימה יושבת ב-lib/footer-category-tree.ts כדי ש-audit:nav-coverage יקרא
   בדיוק את מה שמרונדר. הקישורים המשפטיים נכנסים לפני "מחירון", כמו קודם. */
const LEGAL_LINKS = [
  ...FOOTER_LEGAL_ROW_LINKS.slice(0, -1),
  ...FOOTER_LEGAL_LINKS,
  FOOTER_LEGAL_ROW_LINKS[FOOTER_LEGAL_ROW_LINKS.length - 1]!,
] as const;

export default function FooterLegalLinks() {
  return (
    <nav className="footer-zone" aria-label="מידע משפטי ותפעולי">
      <h2 className="text-sm font-semibold text-[var(--footer-fg)]">מידע משפטי</h2>
      <p className="mt-3 text-xs leading-6 text-[var(--footer-muted)]">
        מסירה דיגיטלית, התנהלות בלי נייר ככל הניתן, וחלק מהשירותים ניתנים מרחוק.{" "}
        <Link
          href="/sustainability"
          className="font-semibold text-[var(--footer-fg)] transition-colors hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
        >
          הצהרת מדיניות קיימות
        </Link>
      </p>
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
