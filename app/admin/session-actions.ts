"use server";

import { renewAdminSessionCookieIfNeeded } from "@/lib/admin-auth";

/**
 * חידוש קוקי הניהול לפני שהוא פג (תוכנית עמדת המכירות, סעיף 9).
 *
 * עמוד המכירות קורא לזה פעם אחת כשהוא נטען. בלי חידוש, הקוקי פג 30 יום אחרי
 * הכניסה גם אם יקיר נכנס כל יום, והכניסה הבאה נופלת בדיוק כשלקוח מחכה.
 * הבדיקה שהקוקי הנוכחי תקף, והאפשרויות של הקוקי החדש, יושבות ב-lib/admin-auth.ts
 * ומשותפות לכניסה.
 *
 * טוב לדעת: Next מרנדר מחדש את העמוד הנוכחי אחרי פעולת שרת שכותבת קוקי
 * (node_modules/next/dist/docs/01-app/02-guides/server-actions.md). זה קורה רק
 * בפעם שבאמת חידשה, בערך פעם ב-23 יום, ואחריה shouldRenewSession מחזיר false.
 */
export async function renewAdminSessionIfNeeded(): Promise<boolean> {
  return renewAdminSessionCookieIfNeeded();
}
