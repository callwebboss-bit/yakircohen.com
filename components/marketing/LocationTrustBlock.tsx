import Link from "next/link";
import {
  STUDIO_ADDRESS_LINE,
  STUDIO_GOOGLE_MAPS_URL,
  BUSINESS_HOURS,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_E164,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

const SERVICE_CITIES = [
  "מודיעין",
  "ירושלים",
  "רמלה",
  "לוד",
  "שוהם",
  "רחובות",
];

export type LocationTrustBlockProps = {
  className?: string;
};

export default function LocationTrustBlock({ className }: LocationTrustBlockProps) {
  return (
    <section
      className={cn(
        "border-y border-border bg-surface py-8 sm:py-10",
        className,
      )}
      aria-label="אזור שירות וזמינות"
      dir="rtl"
    >
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 px-4 sm:grid-cols-3 sm:gap-6 sm:px-6 lg:px-8">

        {/* מיקום */}
        <div className="flex items-start gap-4 rounded-2xl border border-border bg-background px-5 py-5">
          <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-red/10 text-xl" aria-hidden="true">
            📍
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-red">
              בסיס מרכזי
            </p>
            <p className="mt-1 font-semibold text-foreground">מודיעין מכבים רעות</p>
            <Link
              href={STUDIO_GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block text-xs text-muted-foreground hover:text-brand-red"
            >
              {STUDIO_ADDRESS_LINE}
            </Link>
            <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
              מגיעים אליכם ב:&nbsp;
              {SERVICE_CITIES.join(" · ")} ועוד
            </p>
          </div>
        </div>

        {/* זמינות */}
        <div className="flex items-start gap-4 rounded-2xl border border-border bg-background px-5 py-5">
          <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-red/10 text-xl" aria-hidden="true">
            🕐
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-red">
              זמינות מקומית
            </p>
            <p className="mt-1 font-semibold text-foreground">ענו לנו ישירות</p>
            <a
              href={`tel:${CONTACT_PHONE_E164}`}
              className="mt-1 block text-sm font-semibold text-brand-red hover:underline"
            >
              {CONTACT_PHONE_DISPLAY}
            </a>
            <ul className="mt-3 space-y-0.5">
              {BUSINESS_HOURS.map((h) => (
                <li key={h.days} className="flex justify-between gap-4 text-xs text-muted-foreground">
                  <span>{h.days}</span>
                  <span className="font-medium text-foreground">{h.hours}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* היכרות עם השוק */}
        <div className="flex items-start gap-4 rounded-2xl border border-border bg-background px-5 py-5">
          <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-red/10 text-xl" aria-hidden="true">
            🎯
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-red">
              מכירים את השוק
            </p>
            <p className="mt-1 font-semibold text-foreground">20+ שנה בתעשייה</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              אירועים, אולפן ופודקאסט בישראל. יודעים מה עובד כאן -- לא מאמצים גנריים.
            </p>
            <ul className="mt-3 space-y-1">
              {[
                "חשבונית מס מסודרת",
                "תיאום ישיר -- ללא מתווכים",
                "עברית כשפה ראשונה",
              ].map((item) => (
                <li key={item} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="text-brand-red">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </section>
  );
}
