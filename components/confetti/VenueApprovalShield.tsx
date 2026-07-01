import { ShieldCheckIcon, DownloadIcon } from "@/components/ui/Icons";

type Props = {
  compact?: boolean;
};

export default function VenueApprovalShield({ compact = false }: Props) {
  if (compact) {
    return (
      <div className="mt-2 flex items-start gap-2 rounded-lg border border-green-200 bg-green-50/50 px-3 py-2 dark:border-green-800/30 dark:bg-green-950/20">
        <ShieldCheckIcon size={14} className="mt-0.5 shrink-0 text-green-600" />
        <p className="text-[0.65rem] leading-relaxed text-green-800 dark:text-green-300">
          מאושר על ידי כל האולמות בארץ - חומרים מתכלים, ללא סימני צבע, אישור בטיחות אש רשמי
        </p>
      </div>
    );
  }

  return (
    <section
      className="rounded-xl border border-green-200 bg-green-50/50 p-5 dark:border-green-800/30 dark:bg-green-950/20 sm:p-6"
      aria-label="אישור אולם לקונפטי"
    >
      <div className="flex items-start gap-4">
        <ShieldCheckIcon size={28} className="mt-0.5 shrink-0 text-green-600" />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-green-900 dark:text-green-200">
            מאושר על ידי כל האולמות בארץ
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-green-800 dark:text-green-300">
            הקונפטי שלנו עשוי 100% חומרים מתכלים, אינו משאיר סימני צבע על הרצפה, וכולל אישור
            בטיחות אש רשמי - ניתן להציגו למנהל האירוע שלכם.
          </p>
          <a
            href="/venue-approval.pdf"
            download
            className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-green-300 bg-white px-4 py-2 text-sm font-medium text-green-800 transition-colors hover:bg-green-50 dark:border-green-700 dark:bg-transparent dark:text-green-300 dark:hover:bg-green-900/30"
          >
            <DownloadIcon size={14} />
            הורדת דף אישור לאולם
          </a>
        </div>
      </div>
    </section>
  );
}
