"use client";

type SmartFormStandardsProps = {
  bullets: readonly string[];
};

/** סטנדרטים - לא השוואת "הכי טוב" */
export default function SmartFormStandards({ bullets }: SmartFormStandardsProps) {
  if (!bullets.length) return null;
  return (
    <div className="rounded-lg border border-border bg-white p-3 text-xs">
      <p className="font-medium text-foreground">
        מה ההבדל בין אולפן מקצועי לחובבני?
      </p>
      <p className="mt-1 text-muted-foreground">אלו הסטנדרטים שלנו:</p>
      <ul className="mt-2 list-disc space-y-1 pr-4 text-muted-foreground">
        {bullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
    </div>
  );
}
