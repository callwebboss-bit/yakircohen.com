"use client";

import type { LeadRecord, LeadStatus } from "@/lib/leads/types";
import { updateLeadStatusAction } from "@/app/admin/leads/actions";

const COLUMNS: { status: LeadStatus; title: string }[] = [
  { status: "new", title: "חדש" },
  { status: "contacted", title: "נוצר קשר" },
  { status: "qualified", title: "מוסמך" },
  { status: "won", title: "נסגר" },
  { status: "lost", title: "אבוד" },
  { status: "spam", title: "ספאם" },
];

export default function LeadKanban({
  leads,
  token,
}: {
  leads: LeadRecord[];
  token: string;
}) {
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
                  <p className="mt-1 line-clamp-2 text-muted-foreground">{lead.subject}</p>
                  <form action={updateLeadStatusAction} className="mt-2">
                    <input type="hidden" name="token" value={token} />
                    <input type="hidden" name="id" value={lead.id} />
                    <label className="sr-only" htmlFor={`status-${lead.id}`}>
                      סטטוס
                    </label>
                    <select
                      id={`status-${lead.id}`}
                      name="status"
                      defaultValue={lead.status}
                      onChange={(e) => e.currentTarget.form?.requestSubmit()}
                      className="mt-1 w-full rounded-md border border-border bg-background px-2 py-1 text-xs"
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
