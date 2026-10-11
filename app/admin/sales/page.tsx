import type { Metadata } from "next";
import { redirect } from "next/navigation";
import SalesDesk, { AdminLogoutForm } from "@/components/admin/SalesDesk";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import { adminLoginUrl, isAdminAuthenticated } from "@/lib/admin-auth";
import { buildSalesBook } from "@/lib/sales/sales-book";
import { adminLogoutAction } from "@/app/admin/login/actions";
import WeeklyCountCard from "@/components/admin/WeeklyCountCard";
import { saveWeeklyCountsAction } from "@/app/admin/sales/actions";
import { listLeads } from "@/lib/leads/store";
import {
  addDays,
  countWeeklyFormLeads,
  getWeeklyManualCounts,
  weekStartIsrael,
} from "@/lib/leads/weekly-count";

/**
 * עמדת המחירים לוואטסאפ (תוכנית עמדת המכירות, סעיף 1). מאחורי הכניסה הקיימת,
 * בלי אינדוקס.
 *
 * הכרטיסים נבנים מהקטלוג בשרת בכל טעינה ועוברים לרכיב הלקוח כנתונים. אין כאן
 * עותק של מחיר: שינוי בקטלוג ופריסה, והעמוד מעודכן. ה-hash בכותרת זהה ל-
 * docs/pricing-export.json, כדי שאפשר יהיה לראות במבט שהמחירון הוא האחרון.
 */

export const metadata: Metadata = {
  title: "עמדת מחירים | ניהול",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const SALES_PATH = "/admin/sales";
/* שמונה תווים מספיקים להשוואה בעין מול docs/pricing-export.json */
const HASH_PREVIEW_LENGTH = 8;

export default async function AdminSalesPage() {
  if (!(await isAdminAuthenticated())) {
    redirect(adminLoginUrl(SALES_PATH));
  }
  const book = buildSalesBook();

  /* השבוע ושלושת השבועות שלפניו (D95). הלידים נשמרים 90 יום, ולכן 4 שבועות
     תמיד בתוך הטווח */
  const weekStart = weekStartIsrael(new Date());
  const leads = await listLeads(200);
  const weekLabelOf = (start: string) =>
    `${start.slice(8, 10)}.${start.slice(5, 7)} עד ${addDays(start, 6).slice(8, 10)}.${addDays(start, 6).slice(5, 7)}`;
  const previousStarts = [1, 2, 3].map((n) => addDays(weekStart, -7 * n));
  const [manual, ...previousManual] = await Promise.all(
    [weekStart, ...previousStarts].map((start) => getWeeklyManualCounts(start)),
  );
  const previous = previousStarts.map((start, i) => ({
    label: weekLabelOf(start),
    forms: countWeeklyFormLeads(leads, start).total,
    manual: previousManual[i],
  }));

  return (
    <article className="bg-background">
      <Section padding="sm">
        <Container className="max-w-3xl">
          <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="font-serif text-2xl font-semibold text-foreground">עמדת מחירים</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                <span dir="ltr" className="font-mono">
                  {book.contentHash.slice(0, HASH_PREVIEW_LENGTH)}
                </span>{" "}
                · מחירון מעודכן מהקטלוג · {book.cards.length} שירותים
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <a
                href="/admin/leads"
                className="inline-flex min-h-11 items-center rounded-md border border-border px-3 text-sm text-foreground hover:bg-muted/50"
              >
                לידים
              </a>
              {/* היציאה מוחקת גם את 20 האישורים האחרונים מהדפדפן */}
              <AdminLogoutForm action={adminLogoutAction} />
            </div>
          </header>
          <WeeklyCountCard
            weekStart={weekStart}
            weekLabel={weekLabelOf(weekStart)}
            forms={countWeeklyFormLeads(leads, weekStart)}
            manual={manual}
            previous={previous}
            action={saveWeeklyCountsAction}
          />
          <SalesDesk book={book} />
        </Container>
      </Section>
    </article>
  );
}
