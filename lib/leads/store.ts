import { LEAD_INDEX_KEY, LEAD_TTL_SECONDS, type LeadRecord } from "@/lib/leads/types";
import { redisCommand, redisGet, redisSet } from "@/lib/leads/redis";

const memoryIndex: string[] = [];

function leadKey(id: string): string {
  return `lead:${id}`;
}

export async function saveLead(lead: LeadRecord): Promise<void> {
  await redisSet(leadKey(lead.id), JSON.stringify(lead), LEAD_TTL_SECONDS);
  const score = Date.parse(lead.createdAt) || Date.now();
  try {
    await redisCommand(["ZADD", LEAD_INDEX_KEY, score, lead.id]);
  } catch {
    if (!memoryIndex.includes(lead.id)) memoryIndex.unshift(lead.id);
  }
}

export async function getLead(id: string): Promise<LeadRecord | null> {
  const raw = await redisGet(leadKey(id));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as LeadRecord;
  } catch {
    return null;
  }
}

export async function updateLead(
  id: string,
  patch: Partial<LeadRecord>,
): Promise<LeadRecord | null> {
  const existing = await getLead(id);
  if (!existing) return null;
  const next = { ...existing, ...patch, id: existing.id };
  await saveLead(next);
  return next;
}

export async function listLeads(limit = 100): Promise<LeadRecord[]> {
  let ids: string[] = [];
  try {
    const result = await redisCommand([
      "ZREVRANGE",
      LEAD_INDEX_KEY,
      0,
      Math.max(0, limit - 1),
    ]);
    if (Array.isArray(result)) {
      ids = result.map(String);
    }
  } catch {
    ids = memoryIndex.slice(0, limit);
  }

  if (ids.length === 0 && memoryIndex.length) {
    ids = memoryIndex.slice(0, limit);
  }

  const leads: LeadRecord[] = [];
  for (const id of ids) {
    const lead = await getLead(id);
    if (lead) leads.push(lead);
  }
  return leads;
}

export async function listLeadsNeedingFollowUp(
  olderThanMs: number,
): Promise<LeadRecord[]> {
  const all = await listLeads(200);
  const cutoff = Date.now() - olderThanMs;
  return all.filter((l) => {
    if (l.followUpSentAt || l.openedAt) return false;
    if (l.status !== "new") return false;
    return Date.parse(l.createdAt) <= cutoff;
  });
}
