"use server";

import { updateLead } from "@/lib/leads/store";
import type { LeadStatus } from "@/lib/leads/types";
import { revalidatePath } from "next/cache";

const ALLOWED: LeadStatus[] = [
  "new",
  "contacted",
  "qualified",
  "won",
  "lost",
  "spam",
];

export async function updateLeadStatusAction(formData: FormData): Promise<void> {
  const token = String(formData.get("token") || "");
  const expected = process.env.ADMIN_LEADS_TOKEN?.trim();
  if (!expected || token !== expected) {
    throw new Error("unauthorized");
  }

  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "") as LeadStatus;
  if (!id || !ALLOWED.includes(status)) {
    throw new Error("invalid");
  }

  await updateLead(id, { status });
  revalidatePath("/admin/leads");
}
