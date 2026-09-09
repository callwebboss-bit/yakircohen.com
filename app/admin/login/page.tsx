import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import { ADMIN_HOME_PATH, isAdminAuthenticated } from "@/lib/admin-auth";
import { adminLoginAction } from "./actions";

export const metadata: Metadata = {
  title: "כניסה | ניהול",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ error?: string }>;

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  if (await isAdminAuthenticated()) {
    redirect(ADMIN_HOME_PATH);
  }
  const sp = await searchParams;
  const isRateLimited = sp.error === "rate";
  const hasError = sp.error === "1" || isRateLimited;
  /* בלי ההודעה הנפרדת, מי שנחסם על קצב היה חוזר לטופס בלי שום חיווי
     וממשיך לנסות, וכל ניסיון נוסף רק מאריך את החסימה. */
  const errorMessage = isRateLimited
    ? "יותר מדי ניסיונות. נסו שוב בעוד רבע שעה."
    : "מפתח לא תקין.";

  return (
    <article className="bg-background">
      <Section padding="sm">
        <Container className="max-w-sm">
          <h1 className="font-serif text-2xl font-semibold text-foreground">כניסה לניהול</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            הזינו את מפתח הניהול. הוא נשמר בעוגייה מאובטחת ל-30 יום.
          </p>
          <form action={adminLoginAction} className="mt-6 space-y-3">
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
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
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
        </Container>
      </Section>
    </article>
  );
}
