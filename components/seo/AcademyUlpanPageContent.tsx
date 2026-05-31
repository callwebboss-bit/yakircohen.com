import Link from "next/link";
import AcademyTrialForm from "@/components/forms/AcademyTrialForm";
import { buildWhatsAppHref } from "@/lib/whatsapp";

const CTA_WHATSAPP_HREF = buildWhatsAppHref({
  text: "שלום, הגעתי מעמוד האקדמיה באתר ואשמח לפרטים על לימוד עברית פרונטלי",
  utm_source: "website",
  utm_campaign: "academy_ulpan_cta",
});

const VALUE_PROPS = [
  {
    id: "personal",
    icon: "🤝",
    title: "לימוד פרונטלי אישי",
    description:
      "פגישה אחד על אחד או בקבוצה קטנה, עם קשר אישי והתאמה לצרכים שלך",
  },
  {
    id: "pace",
    icon: "📅",
    title: "פעם בשבוע בלבד",
    description: "מתאים לקצב עבודה וחיים עמוסים, בלי עומס ובלי לחץ",
  },
  {
    id: "speaking",
    icon: "🗣",
    title: "שיפור דיבור וביטחון",
    description:
      "הדגש על עברית מדוברת ויישומית — שיעורי עברית פרונטליים שמתמקדים בשטח, לא בתיאוריה",
  },
  {
    id: "flex",
    icon: "🔓",
    title: "גמישות מלאה",
    description: "אפשר להפסיק מתי שרוצים, בלי התחייבות ארוכה",
  },
] as const;

const MONTHLY_FEATURES = [
  "שיעור פרונטלי אחד בשבוע",
  "גמישות מלאה — אפשר להפסיק מתי שרוצים",
  "ללא התחייבות שנתית",
  "ליווי והדרכה אישית",
] as const;

const ANNUAL_FEATURES = [
  "שיעור פרונטלי אחד בשבוע",
  `שיעור ניסיון ב-500 ש"ח (במקום 3,200 ש"ח)`,
  "חיסכון משמעותי לאורך השנה",
  "ליווי והדרכה אישית",
] as const;

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "פגישה ראשונית",
    description: "אבחון רמה וקביעת מטרות לימוד אישיות",
  },
  {
    step: "02",
    title: "שיעור שבועי פרונטלי",
    description:
      "מפגש אחד בשבוע עם דגש על דיבור, הבנה, ותרגול מעשי של עברית מדוברת",
  },
  {
    step: "03",
    title: "התקדמות וגמישות",
    description:
      "אפשר להפסיק מתי שרוצים, או להתקדם למסלול שנתי עם הטבה משמעותית",
  },
] as const;

export default function AcademyUlpanPageContent() {
  return (
    <article>
      {/* Hero */}
      <header className="border-b border-border px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            לימוד עברית פרונטלי — יקיר כהן
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            ללמוד עברית פעם בשבוע — להעמיק ולחזק את השפה עם יקיר כהן
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            פגישה פרונטלית אחת בשבוע, בקצב שלך, עם מדריך מקצועי שמבין את
            הצרכים שלך
          </p>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
            תוכנית לימוד עברית למבוגרים שמתאימה לחיים עמוסים. פעם בשבוע,
            פגישה פרונטלית אישית שמתמקדת בדיבור, בהבנה, וביטחון בשפה.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-5xl space-y-20 px-4 py-16 sm:px-6 lg:px-8">
        {/* Value Propositions */}
        <section aria-labelledby="value-heading">
          <h2
            id="value-heading"
            className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            למה לימוד עברית עם יקיר
          </h2>
          <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {VALUE_PROPS.map((item) => (
              <li
                key={item.id}
                className="rounded-2xl border border-border bg-surface p-6"
              >
                <p className="text-2xl" aria-hidden="true">
                  {item.icon}
                </p>
                <h3 className="mt-3 font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* Pricing */}
        <section aria-labelledby="pricing-heading">
          <header>
            <h2
              id="pricing-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              מסלולי לימוד גמישים
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              כל המסלולים כוללים שיעור פרונטלי אחד בשבוע עם יקיר כהן, ליווי
              אישי ותמיכה שוטפת
            </p>
          </header>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* Monthly */}
            <div className="rounded-2xl border border-border bg-surface p-6">
              <h3 className="font-semibold text-foreground">מסלול חודשי</h3>
              <p className="mt-4">
                <span className="text-3xl font-semibold text-foreground">
                  {`3,200 ש"ח`}
                </span>
                <span className="me-1 text-sm text-muted-foreground"> לחודש</span>
              </p>
              <ul className="mt-6 space-y-3">
                {MONTHLY_FEATURES.map((f) => (
                  <li key={f} className="flex gap-3 text-sm text-muted-foreground">
                    <span className="shrink-0 text-brand-red" aria-hidden="true">
                      ✓
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Annual */}
            <div className="relative rounded-2xl border border-brand-red/40 bg-brand-red/5 p-6 ring-1 ring-brand-red/20">
              <span className="absolute start-4 top-4 rounded-full bg-brand-red px-2.5 py-0.5 text-[0.65rem] font-bold text-white">
                מומלץ
              </span>
              <h3 className="mt-1 font-semibold text-foreground">מסלול שנתי</h3>
              <p className="mt-4">
                <span className="text-3xl font-semibold text-foreground">
                  {`11,520 ש"ח`}
                </span>
                <span className="me-1 text-sm text-muted-foreground"> לשנה</span>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {`שיעור ניסיון ב-500 ש"ח בלבד (במקום 3,200 ש"ח לחודש הראשון)`}
              </p>
              <ul className="mt-6 space-y-3">
                {ANNUAL_FEATURES.map((f) => (
                  <li key={f} className="flex gap-3 text-sm text-muted-foreground">
                    <span className="shrink-0 text-brand-red" aria-hidden="true">
                      ✓
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Trial Signup Form */}
        <section
          aria-labelledby="trial-heading"
          className="rounded-2xl border-2 border-brand-red/35 bg-surface p-6 sm:p-8"
        >
          <header>
            <h2
              id="trial-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              {`הרשמה לשיעור ניסיון ב-500 ש"ח`}
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              מלאו פרטים ונתאם מועד לשיעור ראשוני. לאחר השלמה, ניצור איתך
              קשר כדי לאשר את המועד ולשלוח פרטי תשלום.
            </p>
            <p className="mt-1.5 text-xs text-muted-foreground">
              ניתן לרשום לשיעור ניסיון אחד בלבד. מקומות מוגבלים — יש להמתין
              לאישור.
            </p>
          </header>
          <div className="mt-8">
            <AcademyTrialForm />
          </div>
        </section>

        {/* About Instructor */}
        <section
          aria-labelledby="about-heading"
          className="rounded-2xl border border-border bg-surface p-6 sm:p-8"
        >
          <h2
            id="about-heading"
            className="text-xl font-semibold text-foreground sm:text-2xl"
          >
            על המדריך
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            יקיר כהן — מדריך מקצועי ללימוד עברית למבוגרים, עם ניסיון בהוראה
            פרונטלית ובפיתוח תוכניות לימוד אישיות. המטרה היא לחזק את השפה
            העברית, לשפר את הביטחון בדיבור, ולתת כלים מעשיים לחיים יומיומיים
            בישראל.
          </p>
        </section>

        {/* Testimonial */}
        <section aria-labelledby="testimonial-heading">
          <h2
            id="testimonial-heading"
            className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            מה תלמידים אומרים
          </h2>
          <figure className="mt-8 rounded-2xl border border-border bg-surface p-6 sm:p-8">
            <blockquote className="text-sm leading-relaxed text-muted-foreground">
              <p>
                הגעתי ליקיר לשיפור השפה העברית. למדתי ואני עדיין לומד אצל
                יקיר כהן כבר שנה 6 ברצף (עם הפסקה בקורונה ובמלחמה) והעברית
                שלי השתפרה פלאים. ממליץ בחום.
              </p>
            </blockquote>
            <figcaption className="mt-6 border-t border-border pt-4">
              <p className="text-sm font-semibold text-foreground">
                שוואקת אוויסט
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                שפות: ערבית, אנגלית
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                מטרה: לדבר בשפה מקצועית בעבודה, להבין מילים ולהעמיק את
                החשיבה מאחוריהן
              </p>
            </figcaption>
          </figure>
        </section>

        {/* How It Works */}
        <section aria-labelledby="how-heading">
          <h2
            id="how-heading"
            className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            איך זה עובד
          </h2>
          <ol className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {HOW_IT_WORKS.map((item) => (
              <li
                key={item.step}
                className="rounded-2xl border border-border bg-surface p-6"
              >
                <p className="text-xs font-bold tracking-widest text-brand-red">
                  {item.step}
                </p>
                <h3 className="mt-2 font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </li>
            ))}
          </ol>
        </section>

        {/* Related Services */}
        <nav aria-label="שירותים קשורים">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            שירותים קשורים
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/studio"
              className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-brand-red/40 hover:text-brand-red"
            >
              אולפן הקלטות
            </Link>
            <Link
              href="/events/dj-events"
              className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-brand-red/40 hover:text-brand-red"
            >
              אירועי DJ
            </Link>
            <Link
              href="/shop"
              className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-brand-red/40 hover:text-brand-red"
            >
              ציוד מקצועי למכירה
            </Link>
          </div>
        </nav>

        {/* CTA WhatsApp */}
        <section
          aria-labelledby="cta-heading"
          className="rounded-2xl border border-brand-red/25 bg-surface px-6 py-12 text-center sm:px-10"
        >
          <h2
            id="cta-heading"
            className="text-xl font-semibold text-foreground sm:text-2xl"
          >
            רוצה להתחיל ללמוד עברית פעם בשבוע
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
            שלחו הודעה ונתאם פגישה ראשונית.
          </p>
          <a
            href={CTA_WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex rounded-md bg-brand-red px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-red-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
            aria-label="שלחו הודעה בוואטסאפ לגבי לימוד עברית פרונטלי עם יקיר כהן"
          >
            שלחו הודעה בוואטסאפ
          </a>
        </section>
      </div>
    </article>
  );
}
