"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { isRateLimitedDurable } from "@/lib/api-guard";
import {
  ADMIN_LOGIN_PATH,
  adminLoginUrl,
  clearAdminSessionCookie,
  resolveAdminNextPath,
  setAdminSessionCookie,
  verifyAdminToken,
} from "@/lib/admin-auth";

/**
 * הגבלת קצב על הכניסה. בלעדיה אפשר להריץ ניחושים על ADMIN_LEADS_TOKEN בקצב
 * הרשת מול הכתובת החיה, וסוד שהוא ביטוי אנושי נשבר במילון. שאר הנתיבים תחת
 * /admin אינם מכוסים על ידי ה-matcher של proxy.ts, ולכן ההגנה חייבת לשבת כאן.
 */
const LOGIN_MAX_ATTEMPTS = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;

async function clientIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return h.get("x-real-ip")?.trim() || "unknown";
}

export async function adminLoginAction(formData: FormData): Promise<void> {
  /* next מגיע מהטופס, כלומר מהלקוח. adminLoginUrl ו-resolveAdminNextPath
     מעבירים אותו הלאה רק כשהוא נתיב תחת /admin/ באותו אתר (lib/admin-next-path.ts),
     ולכן אי אפשר להשתמש בכניסה כדי לשלוח את יקיר לאתר אחר. */
  const next = formData.get("next");
  const ip = await clientIp();
  if (await isRateLimitedDurable(`rl:admin-login:${ip}`, LOGIN_MAX_ATTEMPTS, LOGIN_WINDOW_MS)) {
    redirect(adminLoginUrl(next, "rate"));
  }

  const token = String(formData.get("token") || "").trim();
  if (!verifyAdminToken(token)) {
    redirect(adminLoginUrl(next, "1"));
  }
  await setAdminSessionCookie(token);
  redirect(resolveAdminNextPath(next));
}

export async function adminLogoutAction(): Promise<void> {
  await clearAdminSessionCookie();
  redirect(ADMIN_LOGIN_PATH);
}
