import { ShieldCheckIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { buildWhatsAppHref } from "@/lib/whatsapp";

type Props = {
  compact?: boolean;
};

export default function VenueApprovalShield({ compact = false }: Props) {
  if (compact) {
    return (
      <div className="mt-2 flex items-start gap-2 rounded-lg border border-green-200 bg-green-50/50 px-3 py-2 dark:border-green-800/30 dark:bg-green-950/20">
        <ShieldCheckIcon size={14} className="mt-0.5 shrink-0 text-green-600" />
        <p className="text-[0.65rem] leading-relaxed text-green-800 dark:text-green-300">
          עומד בדרישות הבטיחות של אולמות - חומרים מתכלים, בלי סימני צבע על הרצפה
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
            עומד בדרישות הבטיחות של אולמות
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-green-800 dark:text-green-300">
            הקונפטי שלנו עשוי מחומרים מתכלים ואינו משאיר סימני צבע על הרצפה. אם מנהל
            האירוע מבקש אישורי בטיחות, נשלח לו את המסמכים שלנו לפני האירוע.
          </p>
          {/* היה כאן קישור הורדה ל-/venue-approval.pdf שלא קיים ב-public ומחזיר 404.
              עד שיועלה קובץ אמיתי, שולחים את האישור בוואטסאפ לפי בקשה. */}
          <a
            href={buildWhatsAppHref({
              text: "שלום, אשמח לקבל את אישור הבטיחות של הקונפטי להצגה מול האולם",
              utm_source: "website",
              utm_campaign: "venue_approval_request",
            })}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex min-h-12 items-center gap-1.5 rounded-md border border-green-300 bg-white px-4 py-2 text-sm font-medium text-green-800 transition-colors hover:bg-green-50 dark:border-green-700 dark:bg-transparent dark:text-green-300 dark:hover:bg-green-900/30"
          >
            <WhatsAppIcon size={14} />
            לקבלת דף האישור לאולם
          </a>
        </div>
      </div>
    </section>
  );
}
