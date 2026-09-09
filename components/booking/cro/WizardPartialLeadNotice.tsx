import Link from "next/link";
import { cn } from "@/lib/utils";

type WizardPartialLeadNoticeProps = {
  className?: string;
};

/**
 * גילוי נאות ליד שדות שם/טלפון בשלב הסיום של האשף.
 * useWizardGhostLead שולח את השם והטלפון לעסק עוד לפני לחיצה על "שליחה",
 * ולכן המשתמש חייב לדעת זאת במקום שבו הוא מקליד את הפרטים.
 */
export default function WizardPartialLeadNotice({ className }: WizardPartialLeadNoticeProps) {
  return (
    <p
      role="note"
      className={cn("text-xs leading-relaxed text-muted-foreground", className)}
    >
      השם והטלפון נשמרים אצלנו כבר בשלב הזה, כדי שנוכל לחזור אליכם גם אם לא תסיימו
      את ההזמנה. הפרטים לא מועברים לגורם שלישי.{" "}
      <Link href="/privacy" className="underline underline-offset-2 hover:text-foreground">
        מדיניות פרטיות
      </Link>
    </p>
  );
}
