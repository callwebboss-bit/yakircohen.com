import Link from "next/link";
import ServicePageLayout from "@/components/services/ServicePageLayout";

const AI_SERVICES = [
  {
    name: "ניקוי רעשים בסיסי",
    price: "מ־₪350",
    note: "להקלטות קצרות עם רעש קבוע",
  },
  {
    name: "שחזור קול מלא",
    price: "מ־₪650",
    note: "פרק או ראיון עד שעה - ניקוי + איזון",
  },
  {
    name: "שיפור קול חכם",
    price: "מ־₪450",
    note: "הבהרה, נוכחות ועקביות לפודקאסט",
  },
  {
    name: "חבילת פרק שלם",
    price: "לפי הצעה",
    note: "עריכה + AI + מסירה מוכנה להעלאה",
  },
] as const;

export default function OnlineAiPricingPageContent() {
  return (
    <ServicePageLayout
      title="מחירון שירותי AI מקוונים"
      subtitle="תמחור שקוף לעריכה ושחזור קול מרחוק - המחיר הסופי תלוי באורך ההקלטה ובמצב הקובץ."
      features={[
        "הצעת מחיר לפני תחילת עבודה",
        "ללא התחייבות אחרי ייעוץ ראשון",
        "מסירה דיגיטלית בפורמט שאתם צריכים",
      ]}
      whatsappText="שלום, אשמח לקבל הצעת מחיר לשירותי AI"
      utmCampaign="online_ai_pricing"
    >
      <div className="mx-auto max-w-[72rem] px-4 py-12 sm:px-6 lg:px-8">
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          המחירים להמחשה - שולחים דוגמת קובץ בוואטסאפ ומקבלים הצעה מדויקת תוך יום עסקים.
        </p>

        <div className="mt-8 overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface text-right">
                <th className="px-4 py-3 font-semibold text-foreground">שירות</th>
                <th className="px-4 py-3 font-semibold text-foreground">מחיר התחלתי</th>
                <th className="hidden px-4 py-3 font-semibold text-foreground sm:table-cell">
                  הערות
                </th>
              </tr>
            </thead>
            <tbody>
              {AI_SERVICES.map((row) => (
                <tr key={row.name} className="border-b border-border last:border-0">
                  <td className="px-4 py-4 font-medium text-foreground">{row.name}</td>
                  <td className="px-4 py-4 font-bold text-brand-red">{row.price}</td>
                  <td className="hidden px-4 py-4 text-muted-foreground sm:table-cell">
                    {row.note}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          לעריכה מלאה של פודקאסט ראו גם{" "}
          <Link href="/podcast/podcast-editing" className="text-brand-red hover:underline">
            עריכת פודקאסט
          </Link>{" "}
          ו
          <Link href="/online" className="text-brand-red hover:underline">
            {" "}
            מרכז השירותים המקוונים
          </Link>
          .
        </p>
      </div>
    </ServicePageLayout>
  );
}
