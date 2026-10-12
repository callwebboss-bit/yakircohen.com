import { leadTelUrl, leadWhatsAppUrl } from "@/lib/leads/lead-response";
import { cn } from "@/lib/utils";

/**
 * וואטסאפ וחיוג ללקוח מתוך עמודי הניהול (12.10.2026). לחיצה אחת במקום להעתיק
 * מספר ולפתוח שיחה חדשה.
 *
 * data-lead-tracked: OutboundLeadTracker סופר כל קישור wa.me ו-tel: כפנייה של
 * גולש (whatsapp_cta_click, phone_call_click). כאן לוחץ יקיר, ולכן המדידה
 * מדלגת. קוד פנייה לא נכנס לקישור: ההחתמה חלה רק על קישור למספר של העסק
 * (lib/whatsapp.ts, splitBusinessWhatsAppText).
 */
const linkClass =
  "inline-flex min-h-9 items-center rounded-md border border-border bg-surface px-2.5 text-xs font-semibold text-foreground hover:bg-muted/50";

export default function LeadContactLinks({ phone, className }: { phone: string | undefined; className?: string }) {
  const wa = leadWhatsAppUrl(phone);
  const tel = leadTelUrl(phone);
  if (!wa && !tel) return null;
  return (
    <span data-lead-tracked className={cn("inline-flex flex-wrap gap-1.5", className)}>
      {wa ? (
        <a href={wa} target="_blank" rel="noopener noreferrer" className={linkClass}>
          וואטסאפ
        </a>
      ) : null}
      {tel ? (
        <a href={tel} className={linkClass}>
          חיוג
        </a>
      ) : null}
    </span>
  );
}
