const CHIPS = [
  "שתיה חופשית",
  "אווירה של סטודיו",
  "מתחם עם אולפן פודקאסט",
] as const;

export default function StudioValueChips() {
  return (
    <ul
      role="list"
      aria-label="מה מחכה באולפן"
      className="flex flex-wrap gap-2"
    >
      {CHIPS.map((label) => (
        <li key={label}>
          <span className="inline-block rounded-full border border-border/60 bg-background px-3 py-1.5 text-xs text-muted-foreground">
            {label}
          </span>
        </li>
      ))}
    </ul>
  );
}
