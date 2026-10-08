import { cn } from "@/lib/utils";

type InfoTipProps = {
  text: string;
  className?: string;
};

/**
 * סימן שאלה קטן שנפתח בלחיצה ומראה הסבר.
 *
 * למה details ולא title (שונה 7.10.2026): הגרסה הקודמת הסתמכה על
 * מאפיין title של HTML. טולטיפ כזה נפתח רק בריחוף עכבר ולא נפתח כלל
 * במגע, ולכן בטלפון הוא לא קיים. ארבעת המופעים של הרכיב באתר יושבים
 * כולם במסכי הזמנה, ומחזיקים מידע שנחוץ בדיוק ברגע ההחלטה: תנאי
 * שמירת תאריך, מדיניות ביטולים, עלות מקליט נוסף, ומה כלול בחבילה.
 * כלומר בטלפון, ברגע ההזמנה, המידע הזה פשוט לא היה זמין.
 *
 * details ו-summary נייטיביים: נפתחים בלחיצה ובמקלדת, נגישים לקוראי
 * מסך, ולא דורשים JavaScript. ההסבר ממוקם absolute כדי שפתיחתו לא
 * תזיז את הפריסה סביבו.
 */
export default function InfoTip({ text, className }: InfoTipProps) {
  return (
    <details className={cn("group relative inline-block align-middle", className)}>
      <summary
        aria-label={text}
        className="flex h-4 w-4 cursor-help select-none list-none items-center justify-center rounded-full border border-border bg-surface text-[0.6rem] font-bold text-muted-foreground transition-colors marker:hidden hover:border-foreground/40 hover:text-foreground group-open:border-foreground/40 group-open:text-foreground [&::-webkit-details-marker]:hidden"
      >
        ?
      </summary>
      <span className="absolute start-0 top-5 z-30 block w-56 max-w-[min(14rem,70vw)] rounded-lg border border-border bg-surface p-2.5 text-start text-xs font-normal leading-relaxed text-foreground shadow-lg">
        {text}
      </span>
    </details>
  );
}
