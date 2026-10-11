import { cn } from "@/lib/utils";

/* החלטות הבעלים 11.10.2026: "סבב תיקונים אחד כלול" ירד מברירת המחדל (היא
   מוצגת במחשבון ה-DJ, שאין בו עריכה, ובשיר כלולים 2 סבבים). "גיבוי ענן לכל
   החיים" ירד מכל האתר: אין התחייבות לשמירה בחינם, שמירה קבועה היא התוספת
   cloud_storage_permanent. המספרים לכל שירות ב-lib/data/revision-policy.ts */
const DEFAULT_BADGES = [
  { icon: "🅿️", label: "חנייה חופשית בשפע" },
  { icon: "🌙", label: "תיאום גמיש בשעות הערב" },
] as const;

type BookTrustBadgesProps = {
  badges?: readonly { icon: string; label: string }[];
  className?: string;
};

export default function BookTrustBadges({
  badges = DEFAULT_BADGES,
  className,
}: BookTrustBadgesProps) {
  return (
    <ul
      className={cn(
        "flex flex-wrap gap-2",
        className,
      )}
    >
      {badges.map((badge) => (
        <li
          key={badge.label}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground"
        >
          <span aria-hidden="true">{badge.icon}</span>
          {badge.label}
        </li>
      ))}
    </ul>
  );
}
