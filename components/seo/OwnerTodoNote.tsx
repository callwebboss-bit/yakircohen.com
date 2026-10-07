/**
 * מציג בעמוד סימון "חסר מידע מהבעלים". הטקסט עצמו מגיע מקובץ הנתונים
 * (lib/data/kids-birthday.ts), ולא נכתב כאן: השער audit:owner-todos סורק את
 * הקוד אחרי הסימון, ורכיב שמחזיק אותו היה מכשיל את השער לתמיד.
 *
 * כשהשדה מולא ה-todo ריק, והרכיב לא מציג כלום.
 */
export default function OwnerTodoNote({ text }: { text: string }) {
  if (!text.trim()) return null;
  return (
    <span
      data-owner-todo=""
      className="inline-block rounded-md border border-dashed border-amber-700/60 bg-amber-100 px-2 py-1 text-sm font-medium leading-snug text-amber-950"
    >
      {text}
    </span>
  );
}
