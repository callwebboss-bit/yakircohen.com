import Link from "next/link";
import { HOME_FAQ_ITEMS } from "@/lib/data/home-faq";

const FOOTER_FAQ_IDS = ["song-studio-price", "delivery-time"] as const;

export default function FooterMicroFaq() {
  const items = HOME_FAQ_ITEMS.filter((item) =>
    (FOOTER_FAQ_IDS as readonly string[]).includes(item.id),
  );

  return (
    <section className="footer-zone" aria-label="שאלות נפוצות">
      <h2 className="text-sm font-semibold text-[var(--footer-fg)]">שאלות נפוצות</h2>
      <div className="mt-4 space-y-2">
        {items.map((item) => (
          <details
            key={item.id}
            className="group rounded-lg border border-[var(--footer-border)] bg-white/[0.03] open:bg-white/[0.05]"
          >
            <summary className="cursor-pointer list-none px-3 py-3 text-xs font-medium text-[var(--footer-fg)] marker:content-none [&::-webkit-details-marker]:hidden">
              <span className="flex items-center justify-between gap-2">
                {item.question}
                <span
                  className="text-[var(--footer-muted)] transition-transform group-open:rotate-180"
                  aria-hidden
                >
                  ▾
                </span>
              </span>
            </summary>
            <p className="border-t border-[var(--footer-border)] px-3 py-3 text-xs leading-relaxed text-[var(--footer-muted)]">
              {item.answerPlain}
            </p>
          </details>
        ))}
      </div>
      <Link
        href="/about/faq"
        className="mt-3 inline-flex min-h-11 items-center text-xs text-[var(--footer-muted)] transition-colors hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
      >
        כל השאלות והתשובות
      </Link>
    </section>
  );
}
