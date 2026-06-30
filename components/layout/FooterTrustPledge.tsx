const PLEDGE_ITEMS = [
  "איכות סאונד מובטחת",
  "זמן אספקה מהיר, 24-48 שעות",
  "שירות אישי",
] as const;

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden>
      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M6.5 10l2.5 2.5 4.5-5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function FooterTrustPledge() {
  return (
    <div
      className="rounded-xl border border-[var(--footer-border)] bg-white/[0.04] px-4 py-4"
      aria-label="התחייבות שירות"
    >
      <p className="text-xs font-semibold text-[var(--footer-fg)]">מה מקבלים אצלנו</p>
      <ul className="mt-3 space-y-2">
        {PLEDGE_ITEMS.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2 text-xs text-[var(--footer-muted)]"
          >
            <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
