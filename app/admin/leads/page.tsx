import type { Metadata } from "next";
import { redirect } from "next/navigation";
import nextDynamic from "next/dynamic";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import { ADMIN_LOGIN_PATH, isAdminAuthenticated } from "@/lib/admin-auth";
import { listLeads } from "@/lib/leads/store";
import type { LeadRecord, LeadStatus, ServiceType } from "@/lib/leads/types";
import { leadMailStatusLabel } from "@/lib/leads/resend-events";
import { leadWaitingLabel } from "@/lib/leads/lead-response";
import { adminLogoutAction } from "@/app/admin/login/actions";
import { AdminLogoutForm } from "@/components/admin/SalesDesk";
import LeadContactLinks from "@/components/admin/LeadContactLinks";

export const metadata: Metadata = {
  title: "לידים | ניהול",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const LeadKanban = nextDynamic(() => import("./LeadKanban"), {
  loading: () => (
    <div className="mt-8 min-h-48 animate-pulse rounded-xl bg-muted/40" aria-hidden />
  ),
});

type SearchParams = Promise<{
  status?: string;
  service?: string;
  minScore?: string;
}>;

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  if (!(await isAdminAuthenticated())) {
    redirect(ADMIN_LOGIN_PATH);
  }
  const sp = await searchParams;

  let leads = await listLeads(150);
  /* זמן אחד לטבלה וללוח, כדי שהשרת והדפדפן יציגו את אותה המתנה */
  const now = new Date().getTime();
  if (sp.status) {
    leads = leads.filter((l) => l.status === (sp.status as LeadStatus));
  }
  if (sp.service) {
    leads = leads.filter((l) => l.serviceType === (sp.service as ServiceType));
  }
  if (sp.minScore) {
    const min = Number(sp.minScore);
    if (!Number.isNaN(min)) leads = leads.filter((l) => l.score >= min);
  }

  // Export link carries only filters - auth travels in the HttpOnly session cookie.
  const exportParams = new URLSearchParams();
  if (sp.status) exportParams.set("status", sp.status);
  if (sp.service) exportParams.set("service", sp.service);
  if (sp.minScore) exportParams.set("minScore", sp.minScore);
  const exportQuery = exportParams.toString();

  return (
    <article className="bg-background">
      <Section padding="sm">
        <Container className="max-w-6xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="font-serif text-2xl font-semibold text-foreground">לידים</h1>
            <div className="flex flex-wrap items-center gap-2">
              <a href="/admin/sales" className="inline-block rounded-md bg-brand-red px-3 py-1.5 text-sm font-semibold text-white hover:bg-brand-red-light">עמדת מחירים</a>
              <a
                href={`/api/admin/leads/export${exportQuery ? `?${exportQuery}` : ""}`}
                className="inline-block rounded-md border border-border bg-surface px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted/50"
              >
                ⬇ ייצוא לידים (JSON)
              </a>
              {/* מוחק גם את אישורי ההזמנה האחרונים מהדפדפן (עמדת המחירים) */}
              <AdminLogoutForm
                action={adminLogoutAction}
                className="rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted/50"
              />
            </div>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {leads.length} רשומות · סינון דרך query: status, service, minScore
          </p>

          <div className="mt-6 overflow-x-auto rounded-xl border border-border">
            <table className="min-w-full text-right text-sm">
              <thead className="bg-surface text-xs text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 font-semibold">תאריך</th>
                  <th className="px-3 py-2 font-semibold">ציון</th>
                  <th className="px-3 py-2 font-semibold">שירות</th>
                  <th className="px-3 py-2 font-semibold">שם</th>
                  <th className="px-3 py-2 font-semibold">טלפון</th>
                  <th className="px-3 py-2 font-semibold">סטטוס</th>
                  <th className="px-3 py-2 font-semibold">מייל אליך</th>
                  <th className="px-3 py-2 font-semibold">טופס</th>
                  <th className="px-3 py-2 font-semibold">נושא</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-t border-border">
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-muted-foreground">
                      {new Date(lead.createdAt).toLocaleString("he-IL")}
                      <WaitingBadge lead={lead} now={now} />
                    </td>
                    <td className="px-3 py-2 font-semibold">{lead.score}</td>
                    <td className="px-3 py-2">{lead.serviceType}</td>
                    <td className="px-3 py-2">{lead.name || " - "}</td>
                    <td className="px-3 py-2">
                      <span dir="ltr" className="block whitespace-nowrap">{lead.phone || " - "}</span>
                      <LeadContactLinks phone={lead.phone} className="mt-1" />
                    </td>
                    <td className="px-3 py-2">{lead.status}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{leadMailStatusLabel(lead)}</td>
                    <td className="px-3 py-2 text-xs text-muted-foreground" dir="ltr">{lead.formId}</td>
                    <td className="max-w-xs truncate px-3 py-2">{lead.subject}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <LeadKanban leads={leads} now={now} />
        </Container>
      </Section>
    </article>
  );
}

/** כמה זמן פנייה חדשה מחכה. אדום אחרי שעה, כמו ההבטחה באתר */
function WaitingBadge({ lead, now }: { lead: LeadRecord; now: number }) {
  const waiting = leadWaitingLabel(lead, now);
  if (!waiting) return null;
  return (
    <span className={`block font-semibold ${waiting.overdue ? "text-brand-red-text" : "text-foreground"}`}>
      מחכה, {waiting.text}
    </span>
  );
}
