"use server";

import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  parseWeeklyCount,
  saveWeeklyManualCounts,
  WEEKLY_MANUAL_FIELDS,
  type WeeklyManualCounts,
} from "@/lib/leads/weekly-count";

/** שמירת הספירה השבועית (D95). ספירות בלבד, ורק למשתמש מחובר */
export async function saveWeeklyCountsAction(formData: FormData): Promise<void> {
  if (!(await isAdminAuthenticated())) {
    throw new Error("unauthorized");
  }
  const weekStart = String(formData.get("weekStart") || "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(weekStart)) {
    throw new Error("invalid");
  }
  const counts: WeeklyManualCounts = {};
  for (const { key } of WEEKLY_MANUAL_FIELDS) {
    const value = parseWeeklyCount(formData.get(key));
    if (value === null) throw new Error("invalid");
    if (value !== undefined) counts[key] = value;
  }
  await saveWeeklyManualCounts(weekStart, counts);
  revalidatePath("/admin/sales");
}
