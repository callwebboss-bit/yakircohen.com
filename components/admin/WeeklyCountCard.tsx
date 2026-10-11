import {
  WEEKLY_MANUAL_FIELDS,
  type WeeklyFormCount,
  type WeeklyManualCounts,
} from "@/lib/leads/weekly-count";

/**
 * "השבוע" בעמדת המחירים (החלטת הבעלים D95, 11.10.2026): שורה אחת שאומרת אם
 * האתר מביא עבודה. הטפסים נספרים לבד, ואת החמישה האחרים יקיר מקליד פעם
 * בשבוע, למשל ביום ראשון בבוקר. רכיב שרת: הטופס נשלח ל-server action.
 */
export default function WeeklyCountCard({
  weekStart,
  weekLabel,
  forms,
  manual,
  previous,
  action,
}: {
  weekStart: string;
  weekLabel: string;
  forms: WeeklyFormCount;
  manual: WeeklyManualCounts;
  previous: readonly { label: string; forms: number; manual: WeeklyManualCounts }[];
  action: (formData: FormData) => Promise<void>;
}) {
  const services = Object.entries(forms.byService)
    .map(([service, n]) => `${service} ${n}`)
    .join(" · ");

  return (
    <section
      aria-labelledby="weekly-count-heading"
      className="mb-6 rounded-xl border border-border bg-surface p-4"
    >
      <h2 id="weekly-count-heading" className="text-base font-semibold text-foreground">
        השבוע · {weekLabel}
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        טפסים מהאתר (נספר לבד): <strong className="text-foreground">{forms.total}</strong>
        {services ? ` · ${services}` : ""}
      </p>

      <form action={action} className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <input type="hidden" name="weekStart" value={weekStart} />
        {WEEKLY_MANUAL_FIELDS.map(({ key, label }) => (
          <label key={key} className="flex flex-col gap-1 text-sm text-foreground">
            {label}
            <input
              name={key}
              inputMode="numeric"
              pattern="[0-9]{1,3}"
              defaultValue={manual[key] ?? ""}
              className="min-h-11 rounded-md border border-border bg-background px-3 text-base"
            />
          </label>
        ))}
        <div className="col-span-2 flex items-end sm:col-span-1">
          <button
            type="submit"
            className="min-h-11 w-full rounded-md bg-brand-red px-4 text-sm font-semibold text-white hover:bg-brand-red-light"
          >
            שמירה
          </button>
        </div>
      </form>

      {previous.length > 0 ? (
        <table className="mt-4 w-full text-right text-xs text-muted-foreground">
          <thead>
            <tr>
              <th className="px-1.5 py-1 font-semibold">שבוע</th>
              <th className="px-1.5 py-1 font-semibold">טפסים</th>
              <th className="px-1.5 py-1 font-semibold">וואטסאפ</th>
              <th className="px-1.5 py-1 font-semibold">שיחות (מהאתר)</th>
              <th className="px-1.5 py-1 font-semibold">עסקאות (עם קוד)</th>
            </tr>
          </thead>
          <tbody>
            {previous.map((row) => (
              <tr key={row.label} className="border-t border-border">
                <td className="px-1.5 py-1">{row.label}</td>
                <td className="px-1.5 py-1">{row.forms}</td>
                <td className="px-1.5 py-1">{row.manual.whatsappWithCode ?? " - "}</td>
                <td className="px-1.5 py-1">
                  {row.manual.callsNew ?? " - "} ({row.manual.callsFromSite ?? " - "})
                </td>
                <td className="px-1.5 py-1">
                  {row.manual.dealsPaid ?? " - "} ({row.manual.dealsWithCode ?? " - "})
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </section>
  );
}
