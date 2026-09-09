import HubDecisionMatrix from "@/components/seo/HubDecisionMatrix";
import ProcessSteps from "@/components/marketing/ProcessSteps";
import ServicePageFromRegistry from "@/components/services/ServicePageFromRegistry";
import {
  BAR_MITZVAH_DECISIONS,
  BAR_MITZVAH_TIMELINE,
  BAR_MITZVAH_WHAT_MATTERS,
  BAR_VS_BAT_MITZVAH,
} from "@/lib/data/bar-mitzvah-page";
import { getEventsService } from "@/lib/data/services";

const service = getEventsService("events-bar-mitzvah");

/**
 * /events/bar-mitzvah - עמוד שירות לפי סוג אירוע.
 * Service + FAQPage נפלטים פעם אחת ב-ServicePageFromRegistry (שגם מכבה את
 * צומת ה-Service הכפול של ServicePageLayout), ולכן אין כאן JSON-LD נוסף.
 * pricingSource="registry": ההצעה הראשית היא תקליטן וחבילות, לא אטרקציה בודדת.
 */
export default function BarMitzvahPageContent() {
  return (
    <ServicePageFromRegistry
      service={service}
      /* התמונות והוידאו מגיעים מתיקיית events/dj-events, ולכן התווית מתארת
         אירועים באופן כללי ולא מציגה אותם כתיק עבודות של בר מצווה. */
      portfolioLabel="אירועים שהפקנו"
      pricingSource="registry"
      valueFrame="תקליטן, הגברה לדרשה, אפקטים ומצגת מאותו צוות. הצעה אחת, תיאום אחד."
    >
      <div className="space-y-12">
        <ProcessSteps
          steps={[...BAR_MITZVAH_TIMELINE]}
          heading="איך נראה הערב, שלב אחרי שלב"
          subheading="מה שנסגר בפגישת התכנון"
          className="py-0 sm:py-0 lg:py-0"
        />

        <section
          className="rounded-2xl border border-border bg-surface p-6 sm:p-8"
          aria-labelledby="bm-matters-heading"
        >
          <h2
            id="bm-matters-heading"
            className="font-serif text-xl font-semibold text-foreground sm:text-2xl"
          >
            מה קובע אם ההפקה עובדת
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            אלה הדברים שנסגרים לפני יום האירוע, כי בשטח כבר אין זמן לתקן אותם.
          </p>
          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            {BAR_MITZVAH_WHAT_MATTERS.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-border bg-background p-5"
              >
                <dt className="text-base font-semibold text-foreground">
                  {item.title}
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section
          className="rounded-2xl border border-border bg-surface p-6 sm:p-8"
          aria-labelledby="bm-compare-heading"
        >
          <h2
            id="bm-compare-heading"
            className="font-serif text-xl font-semibold text-foreground sm:text-2xl"
          >
            בר מצווה מול בת מצווה
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            הציוד וההגברה זהים. מה שמשתנה הוא מבנה הערב והרפרטואר.
          </p>

          <div className="mt-6 hidden overflow-x-auto rounded-2xl border border-border bg-background md:block">
            <table className="w-full text-sm">
              <caption className="sr-only">בר מצווה מול בת מצווה, מה משתנה בתכנון</caption>
              <thead>
                <tr className="border-b border-border bg-surface text-start">
                  <th scope="col" className="px-4 py-3 font-semibold text-foreground">
                    מה משתנה
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold text-foreground">
                    בר מצווה
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold text-foreground">
                    בת מצווה
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {BAR_VS_BAT_MITZVAH.map((row) => (
                  <tr key={row.aspect} className="align-top">
                    <th
                      scope="row"
                      className="px-4 py-4 text-start font-medium text-foreground"
                    >
                      {row.aspect}
                    </th>
                    <td className="px-4 py-4 leading-relaxed text-muted-foreground">
                      {row.bar}
                    </td>
                    <td className="px-4 py-4 leading-relaxed text-muted-foreground">
                      {row.bat}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="mt-6 space-y-3 md:hidden">
            {BAR_VS_BAT_MITZVAH.map((row) => (
              <li
                key={row.aspect}
                className="rounded-2xl border border-border bg-background p-4"
              >
                <p className="text-sm font-semibold text-foreground">{row.aspect}</p>
                <p className="mt-3 text-xs font-semibold tracking-[0.14em] text-muted-foreground">
                  בר מצווה
                </p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {row.bar}
                </p>
                <p className="mt-3 text-xs font-semibold tracking-[0.14em] text-muted-foreground">
                  בת מצווה
                </p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {row.bat}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <HubDecisionMatrix
          rows={BAR_MITZVAH_DECISIONS}
          heading="מה לבחור עכשיו"
          headingId="bm-decision-heading"
        />
      </div>
    </ServicePageFromRegistry>
  );
}
