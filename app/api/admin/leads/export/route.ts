import { NextResponse } from "next/server";
import { isAdminRequestAuthorized } from "@/lib/admin-auth";
import { guardRateLimit } from "@/lib/api-guard";
import { listLeads } from "@/lib/leads/store";
import type { LeadStatus, ServiceType } from "@/lib/leads/types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // 500 records of PII per call - throttle before touching auth or storage.
  const guard = await guardRateLimit(request, { bucket: "admin-leads-export", max: 6 });
  if (!guard.ok) return guard.response;

  // Session cookie (browser) or Bearer ADMIN_LEADS_TOKEN (local Closer). Never a query param.
  if (!(await isAdminRequestAuthorized(request))) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 404 });
  }

  const url = new URL(request.url);
  const statusFilter = url.searchParams.get("status") as LeadStatus | null;
  const serviceFilter = url.searchParams.get("service") as ServiceType | null;
  const minScoreParam = url.searchParams.get("minScore");
  const minScore = minScoreParam ? Number(minScoreParam) : null;

  let leads = await listLeads(500);
  if (statusFilter) leads = leads.filter((l) => l.status === statusFilter);
  if (serviceFilter) leads = leads.filter((l) => l.serviceType === serviceFilter);
  if (minScore !== null && !Number.isNaN(minScore)) {
    leads = leads.filter((l) => l.score >= minScore);
  }

  // Business fields only - no enrichment/IP/user-agent/internal tracking data.
  const rows = leads.map((lead) => ({
    id: lead.id,
    date: lead.createdAt,
    name: lead.name ?? null,
    phone: lead.phone ?? null,
    email: lead.email ?? null,
    service: lead.serviceType,
    status: lead.status,
    subject: lead.subject,
    score: lead.score,
  }));

  const filename = `leads-export-${new Date().toISOString().slice(0, 10)}.json`;

  return new NextResponse(
    JSON.stringify(
      { exportedAt: new Date().toISOString(), count: rows.length, leads: rows },
      null,
      2,
    ),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    },
  );
}
