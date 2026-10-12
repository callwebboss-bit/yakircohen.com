"use client";

import type { LeadRecord, LeadStatus } from "@/lib/leads/types";
import { updateLeadStatusAction } from "@/app/admin/leads/actions";
import LeadContactLinks from "@/components/admin/LeadContactLinks";
import { leadWaitingLabel } from "@/lib/leads/lead-response";

const COLUMNS: { status: LeadStatus; title: string }[] = [
  { status: "new", title: "חדש" },
  { status: "contacted", title: "נוצר קשר" },
  { status: "qualified", title: "מוסמך" },
  { status: "won", title: "נסגר" },
  { status: "lost", title: "אבוד" },
  { status: "spam", title: "ספאם" },
];

/* now מגיע מהשרת: חישוב זמן בדפדפן בזמן הרינדור היה יוצא שונה מהשרת (hydration) */
export default function LeadKanban({ leads, now }: { leads: LeadRecord[]; now: number }) {
  return (
    <div className="mt-8 grid gap-4 lg:grid-cols-3 xl:grid-cols-6">
      {COLUMNS.map((col) => {
        const items = leads.filter((l) => l.status === col.status);
        return (
          <section
            key={col.status}
            className="min-h-48 rounded-xl border border-border bg-surface p-3"
            aria-label={col.title}
          >
            <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {col.title} ({items.length})
            </h2>
            <ul className="mt-3 space-y-2">
              {items.map((lead) => (
                <li
                  key={lead.id}
                  className="rounded-lg border border-border bg-background p-2 text-xs"
                >
                  <p className="font-semibold text-foreground">
                    {lead.name || lead.phone || lead.formId}
                  </p>
                  <p className="text-muted-foreground">ציון {lead.score}</p>
                  <WaitingLine lead={lead} now={now} />
                  <p className="mt-1 line-clamp-2 text-muted-foreground">{lead.subject}</p>
                  <LeadContactLinks phone={lead.phone} className="mt-2" />
                  <form action={updateLeadStatusAction} className="mt-2">
                    <input type="hidden" name="id" value={lead.id} />
                    <label className="sr-only" htmlFor={`status-${lead.id}`}>
                      סטטוס
                    </label>
                    <select
                      id={`status-${lead.id}`}
                      name="status"
                      defaultValue={lead.status}
                      onChange={(e) => e.currentTarget.form?.requestSubmit()}
                      className="mt-1 w-full rounded-md border border-input bg-background px-2 py-1 text-xs"
                    >
                      {COLUMNS.map((c) => (
                        <option key={c.status} value={c.status}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                  </form>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

function WaitingLine({ lead, now }: { lead: LeadRecord; now: number }) {
  const waiting = leadWaitingLabel(lead, now);
  if (!waiting) return null;
  return (
    <p className={waiting.overdue ? "font-semibold text-brand-red-text" : "text-foreground"}>
      מחכה, {waiting.text}
    </p>
  );
}
