/**
 * השוואת סטנדרט ליד מחירים - לא "הכי טוב".
 */
export default function PricingStandardsStrip() {
  return (
    <div className="mb-6 rounded-lg border border-border bg-surface/40 p-4 text-sm">
      <p className="font-medium text-foreground">
        מה ההבדל בין אולפן מקצועי לחובבני?
      </p>
      <p className="mt-1 text-xs text-muted-foreground">אלו הסטנדרטים שלנו:</p>
      <ul className="mt-2 list-disc space-y-1 pr-4 text-xs text-muted-foreground">
        <li>חדר מבודד רעשים וציוד הקלטה מקצועי</li>
        <li>עריכה ומיקס בישיבה - לא שליחה הביתה בלי ביקורת</li>
        <li>מסירה באותו יום: מייל, וואטסאפ, קישור הורדה, וצפייה לא רשומה ביוטיוב</li>
      </ul>
    </div>
  );
}
