import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import {
  isAdminAuthenticated,
  isAdminTokenConfigured,
  resolveAdminNextPath,
  safeAdminNextPath,
} from "@/lib/admin-auth";
import { adminLoginAction } from "./actions";

export const metadata: Metadata = {
  title: "כניסה | ניהול",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ error?: string; next?: string | string[] }>;

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  /* העמוד שביקשו לפני הכניסה. מערך (next כפול ב-URL) או נתיב לא בטוח נפסלים,
     ואז חוזרים לדף הבית של הניהול כמו קודם. */
  const nextPath = safeAdminNextPath(sp.next);
  if (await isAdminAuthenticated()) {
    redirect(resolveAdminNextPath(nextPath));
  }
  const isRateLimited = sp.error === "rate";
  const hasError = sp.error === "1" || isRateLimited;
  /* בלי ההודעה הנפרדת, מי שנחסם על קצב היה חוזר לטופס בלי שום חיווי
     וממשיך לנסות, וכל ניסיון נוסף רק מאריך את החסימה. */
  const errorMessage = isRateLimited
    ? "יותר מדי ניסיונות. נסו שוב בעוד רבע שעה."
    : "מפתח לא תקין.";
  /*
   * רק ב-next dev. כניסה מקומית שנכשלה בלי סיבה נראית (12.10.2026) לא נבעה
   * מהקוקי: הוא Secure רק ב-production, בלי __Host- ובלי domain, ועובד על
   * http://localhost. מה ששובר אותה הוא שרת שלא רואה את הסוד: שרת dev שרץ
   * מתיקייה אחרת בלי .env.development.local, או סוד עם $ או #. Next טוען את
   * קובצי ה-env עם dotenv-expand, ולכן "abc$def" נקרא "abc" (גם בתוך מרכאות
   * בודדות), ו-# בלי מרכאות פותח הערה. ב-Vercel הערך נקרא כמו שהוא, ולכן שם
   * הכניסה עובדת. בייצור לא מוצג כאן כלום.
   */
  const devHint =
    process.env.NODE_ENV === "development"
      ? isAdminTokenConfigured()
        ? hasError && "פיתוח מקומי: אם מפתח נכון נדחה, בדקו שבסוד ב-.env.development.local אין $ או # (Next קורא אותו קטוע), ושהשרת רץ מהתיקייה שבה הקובץ."
        : "פיתוח מקומי: לשרת הזה אין ADMIN_LEADS_TOKEN, ולכן כל מפתח נדחה. הוסיפו אותו ל-.env.development.local בתיקייה שממנה רץ next dev."
      : null;

  return (
    <article className="bg-background">
      <Section padding="sm">
        <Container className="max-w-sm">
          <h1 className="font-serif text-2xl font-semibold text-foreground">כניסה לניהול</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            הזינו את מפתח הניהול. הכניסה נשמרת בעוגייה מאובטחת ומתחדשת לבד כשמשתמשים בה, עד 90 יום מהכניסה.
          </p>
          <form action={adminLoginAction} className="mt-6 space-y-3">
            {nextPath ? <input type="hidden" name="next" value={nextPath} /> : null}
            <label htmlFor="admin-token" className="block text-xs font-semibold text-foreground">
              מפתח ניהול
            </label>
            <input
              id="admin-token"
              name="token"
              type="password"
              autoComplete="current-password"
              required
              dir="ltr"
              aria-invalid={hasError}
              aria-describedby={hasError ? "admin-token-error" : undefined}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            {hasError ? (
              <p id="admin-token-error" className="text-xs text-red-500" role="alert">
                {errorMessage}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={isRateLimited}
              className="inline-flex min-h-12 w-full items-center justify-center rounded-md bg-brand-red px-4 py-2 text-sm font-semibold text-white hover:bg-brand-red-light disabled:cursor-not-allowed disabled:opacity-50"
            >
              כניסה
            </button>
          </form>
          {devHint ? (
            <p className="mt-4 rounded-md bg-muted p-2 text-xs text-muted-foreground" data-testid="admin-dev-hint">
              {devHint}
            </p>
          ) : null}
        </Container>
      </Section>
    </article>
  );
}
