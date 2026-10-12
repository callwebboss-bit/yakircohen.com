import { updateLeadStatusAction } from "@/app/admin/leads/actions";
import { cn } from "@/lib/utils";

/**
 * "עניתי" (12.10.2026): לחיצה אחת מעבירה פנייה חדשה ל"נוצר קשר", במקום לבחור
 * מרשימה. ככה הפנייה יורדת מהמונה "פניות מחכות" בעמדת המחירים, והמונה נשאר
 * אמין. אותה פעולת שרת כמו הרשימה בלוח.
 */
export default function LeadRepliedButton({ leadId, className }: { leadId: string; className?: string }) {
  return (
    <form action={updateLeadStatusAction} className={className}>
      <input type="hidden" name="id" value={leadId} />
      <input type="hidden" name="status" value="contacted" />
      <button
        type="submit"
        className={cn(
          "inline-flex min-h-9 items-center rounded-md border border-border bg-background px-2.5 text-xs font-semibold text-foreground hover:bg-muted/50",
        )}
      >
        עניתי
      </button>
    </form>
  );
}
