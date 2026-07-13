import { createHash } from "node:crypto";
import { redisCommand, redisGet, redisSet } from "@/lib/leads/redis";

const DUP_TTL_SECONDS = 60 * 60 * 24; // 24h

function fingerprint(parts: Array<string | undefined>): string {
  const raw = parts
    .map((p) => (p || "").trim().toLowerCase())
    .filter(Boolean)
    .join("|");
  return createHash("sha256").update(raw).digest("hex").slice(0, 24);
}

export type DuplicateCheckInput = {
  phone?: string;
  email?: string;
  ipHash?: string;
  formId?: string;
};

export type DuplicateCheckResult = {
  isDuplicate: boolean;
  existingLeadId?: string;
  key: string;
};

export async function checkAndMarkDuplicate(
  input: DuplicateCheckInput,
  leadId: string,
): Promise<DuplicateCheckResult> {
  const phoneKey = input.phone?.replace(/\D/g, "");
  const key = `lead:dup:${fingerprint([phoneKey, input.email, input.ipHash, input.formId])}`;

  const existing = await redisGet(key);
  if (existing) {
    return { isDuplicate: true, existingLeadId: existing, key };
  }

  await redisSet(key, leadId, DUP_TTL_SECONDS);
  // Secondary indexes for phone/email alone (broader spam catch)
  if (phoneKey && phoneKey.length >= 9) {
    const phoneDup = `lead:dup:phone:${phoneKey}`;
    const prior = await redisGet(phoneDup);
    if (prior && prior !== leadId) {
      return { isDuplicate: true, existingLeadId: prior, key: phoneDup };
    }
    await redisSet(phoneDup, leadId, DUP_TTL_SECONDS);
  }
  if (input.email?.includes("@")) {
    const emailDup = `lead:dup:email:${input.email.trim().toLowerCase()}`;
    const prior = await redisGet(emailDup);
    if (prior && prior !== leadId) {
      return { isDuplicate: true, existingLeadId: prior, key: emailDup };
    }
    await redisSet(emailDup, leadId, DUP_TTL_SECONDS);
  }

  return { isDuplicate: false, key };
}

export async function touchDuplicateMarker(key: string, leadId: string): Promise<void> {
  await redisCommand(["SET", key, leadId, "EX", String(DUP_TTL_SECONDS)]);
}
