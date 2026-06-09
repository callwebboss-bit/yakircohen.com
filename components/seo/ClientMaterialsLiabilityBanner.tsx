import Link from "next/link";
import { ONLINE_LIABILITY_FORM_URL } from "@/lib/data/online-send-file-page";

type ClientMaterialsLiabilityBannerProps = {
  className?: string;
};

export default function ClientMaterialsLiabilityBanner({
  className = "",
}: ClientMaterialsLiabilityBannerProps) {
  return (
    <aside
      className={`rounded-xl border border-amber-200/80 bg-amber-50/80 px-4 py-4 dark:border-amber-900/50 dark:bg-amber-950/30 sm:px-5 sm:py-5 ${className}`}
      role="note"
      aria-labelledby="liability-banner-heading"
    >
      <p
        id="liability-banner-heading"
        className="text-sm font-semibold text-amber-900 dark:text-amber-100"
      >
        שולחים תמונות או קבצי סאונד?
      </p>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
        לפני שליחת חומרים, יש למלא טופס אישור הצהרת אחריות ותנאי שירות.
      </p>
      <div className="mt-3 flex flex-wrap gap-3">
        <a
          href={ONLINE_LIABILITY_FORM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center rounded-lg bg-brand-red px-4 py-2 text-xs font-semibold text-white hover:bg-brand-red-light"
        >
          מילוי טופס אישור ←
        </a>
        <Link
          href="/online/vocal-fix/send-file"
          className="inline-flex items-center rounded-lg border border-border bg-background px-4 py-2 text-xs font-semibold text-foreground hover:border-brand-red/40 hover:text-brand-red"
        >
          פרטים נוספים
        </Link>
      </div>
    </aside>
  );
}
