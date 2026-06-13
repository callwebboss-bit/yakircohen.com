import Link from "next/link";
import { FOOTER_LEGAL_LINKS } from "@/lib/constants";

export default function LegalTrustBlock() {
  return (
    <aside
      className="mt-16 rounded-2xl border border-border bg-surface p-6 sm:p-8"
      aria-labelledby="legal-trust-heading"
    >
      <p className="text-xs font-semibold tracking-[0.15em] text-brand-red uppercase">
        אולפן הקלטות - הפקת אירועים - DJ ואטרקציות
      </p>
      <h2 id="legal-trust-heading" className="mt-3 text-lg font-semibold text-foreground">
        מקום אחד לקול, סאונד וחוויית קהל
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        אולפן הקלטות, הפקת אירועים ושירותים דיגיטליים - עובדים בשקט, מסבירים בעברית
        פשוטה, ומסיימים עם קבצים מסודרים שאפשר לשחרר הלאה.
      </p>

      <div className="mt-8 border-t border-border pt-6">
        <h3 className="text-sm font-semibold text-foreground">אמון וביקורות</h3>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          <li>
            <a
              href="https://www.mit4mit.co.il"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center text-brand-red hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
            >
              Mit4Mit
            </a>
            {" - חיפוש פרופיל העסק באתר"}
          </li>
          <li>ביקורות באתר - יוצגו כשיאומתו מול המקור</li>
          <li>גוגל - מעל 280 ביקורות מאומתות</li>
        </ul>
      </div>

      <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
        {[
          ...FOOTER_LEGAL_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex min-h-11 items-center text-brand-red hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
            >
              {item.label}
            </Link>
          )),
          <Link
            key="contact"
            href="/contact"
            className="inline-flex min-h-11 items-center text-brand-red hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
          >
            צור קשר
          </Link>,
          <Link
            key="book"
            href="/book"
            className="inline-flex min-h-11 items-center text-brand-red hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
          >
            הזמנה מקוונת
          </Link>,
        ].map((node, index) => (
          <span key={index}>
            {index > 0 ? " - " : null}
            {node}
          </span>
        ))}
      </p>
    </aside>
  );
}
