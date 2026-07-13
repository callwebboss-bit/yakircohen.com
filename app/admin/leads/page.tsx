import type { Metadata } from "next";
import { notFound } from "next/navigation";
import nextDynamic from "next/dynamic";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import { listLeads } from "@/lib/leads/store";
import type { LeadStatus, ServiceType } from "@/lib/leads/types";

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
  token?: string;
  status?: string;
  service?: string;
  minScore?: string;
}>;

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const expected = process.env.ADMIN_LEADS_TOKEN?.trim();
  if (!expected || sp.token !== expected) {
    notFound();
  }

  let leads = await listLeads(150);
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

  return (
    <article className="bg-background">
      <Section padding="sm">
        <Container className="max-w-6xl">
          <h1 className="font-serif text-2xl font-semibold text-foreground">לידים</h1>
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
                  <th className="px-3 py-2 font-semibold">נושא</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-t border-border">
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-muted-foreground">
                      {new Date(lead.createdAt).toLocaleString("he-IL")}
                    </td>
                    <td className="px-3 py-2 font-semibold">{lead.score}</td>
                    <td className="px-3 py-2">{lead.serviceType}</td>
                    <td className="px-3 py-2">{lead.name || "—"}</td>
                    <td className="px-3 py-2" dir="ltr">
                      {lead.phone || "—"}
                    </td>
                    <td className="px-3 py-2">{lead.status}</td>
                    <td className="max-w-xs truncate px-3 py-2">{lead.subject}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <LeadKanban leads={leads} token={expected} />
        </Container>
      </Section>
    </article>
  );
}
