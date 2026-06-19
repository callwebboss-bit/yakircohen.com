import type { Metadata } from "next";
import Link from "next/link";
import PrivateSessionPricing from "@/components/academy/PrivateSessionPricing";
import { constructMetadata } from "@/lib/metadata";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { SITE_NAME } from "@/lib/constants";
import ShareButton from "@/components/ui/ShareButton";

export const metadata: Metadata = constructMetadata({
  title: "שיעור פרטי במוזיקה",
  description:
    "שיעור פרטי 1:1 באולפן במודיעין - Pro Session 90 דקות או שיעור מלא 60 דק. DJ, הפקה, קול, פסנתר, גיטרה. הקלטה בתוספת, תמיכה בוואטסאפ.",
  slug: "academy/private-lessons",
  keywords: [
    "שיעור פרטי מוזיקה",
    "שיעור מלא 990",
    "Pro Session אולפן",
    "לימוד פרטי DJ",
    "שיעור פיתוח קול",
    "שיעורי פסנתר מודיעין",
  ],
});

const SUBJECTS = [
  { icon: "🎤", label: "פיתוח קול מקצועי" },
  { icon: "🎛️", label: "אמנות התקלוט (DJ)" },
  { icon: "🎚️", label: "הפקה מוזיקלית (DAW)" },
  { icon: "🎹", label: "פסנתר וקלידים" },
  { icon: "🎸", label: "גיטרה (בסיס / ליווי)" },
  { icon: "🎼", label: "תיאוריה מוזיקלית ותווים" },
] as const;

const INCLUDED = [
  {
    icon: "⏱️",
    title: "90 דקות מלאות של 1 על 1",
    body: "שיעור ארוך מהסטנדרט - העמקה, תרגול מעשי וזמן לשאלות. ב-Pro Session כל תשומת הלב מופנית אליכם.",
  },
  {
    icon: "🎛️",
    title: "ציוד מקצועי רלוונטי",
    body: "פיתוח קול מול מיקרופון אולפני, תיקלוט על קונטרולרים מתקדמים, או הפקה בתחנת עבודה מאובזרת - לומדים על הציוד האמיתי.",
  },
  {
    icon: "🎙️",
    title: "הקלטת השיעור (בתוספת)",
    body: "שמע ולעיתים וידאו בסיסי - נשלח אליכם בסיום לחזרה, תרגול ושינון בקצב שלכם.",
  },
  {
    icon: "📱",
    title: "תמיכה בוואטסאפ בין השיעורים",
    body: "שאלה, הבהרה או תקיעה? יש למי לפנות גם בין המפגשים - מענה מהיר וענייני.",
  },
  {
    icon: "🗺️",
    title: "תוכנית התקדמות אישית",
    body: "מגדירים יחד מטרות, צעדים הבאים ותרגילים להמשך - עצמאי או לקראת השיעור הבא.",
  },
] as const;

export default function PrivateLessonsPage() {
  const ctaHref = buildWhatsAppHref({
    text: "היי יקיר! אני מעוניין/ת בשיעור פרטי באולפן. אשמח לייעוץ בין שיעור מלא (60 דק) ל-Pro Session (90 דק).",
    utm_source: "academy",
    utm_campaign: "private_lessons_cta",
  });

  return (
    <div className="bg-background">
      <section className="relative overflow-hidden border-b border-border bg-background">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_-10%,rgba(212,43,43,0.12),transparent_55%)]"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
          <nav aria-label="ניווט ארגוני" className="mb-6">
            <ol className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
              <li>
                <Link
                  href="/"
                  className="hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
                >
                  ראשי
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href="/academy"
                  className="hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
                >
                  האקדמיה
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="font-medium text-foreground" aria-current="page">
                שיעור פרטי
              </li>
            </ol>
          </nav>

          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
            {SITE_NAME}
          </p>

          <h1 className="mt-3 font-serif text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            שיעור מוזיקה פרטי
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            קחו את הכישרון שלכם לשלב הבא - שיעור פרטי ממוקד ואישי עם יקיר כהן.
            90 דקות אינטנסיביות של 1:1 בתחום שתבחרו.
          </p>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            מרגישים תקועים? השיעורים הקבוצתיים לא מספיקים? זו הדרך המהירה
            והמדויקת ביותר ללטש יכולות, להגיע למטרות ולהתקדם בקצב שלכם -
            מותאם בדיוק לידע ולרצון שלכם.
          </p>

          <p className="mx-auto mt-3 max-w-lg text-xs text-muted-foreground">
            * מספר המקומות מוגבל כדי להבטיח איכות ותשומת לב מרבית.
          </p>
        </div>
      </section>

      <PrivateSessionPricing showPrivateLessonsLink={false} />

      <section className="mx-auto max-w-[72rem] px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <header className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
            תחומי הלימוד
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            התקדמו במה שבוער בכם
          </h2>
        </header>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {SUBJECTS.map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-background p-5 text-center"
            >
              <span className="text-2xl" aria-hidden="true">
                {s.icon}
              </span>
              <span className="text-xs font-semibold leading-snug text-foreground">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-surface py-14 sm:py-16">
        <div className="mx-auto max-w-[72rem] px-4 sm:px-6 lg:px-8">
          <header className="mb-8 text-center sm:text-start">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
              מה כלול
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              מה כלול בשיעור הפרטי האישי?
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
              ב-Pro Session (90 דקות) יש זמן אמיתי להעמקה. גם בשיעור מלא (60
              דקות) - אותה מקצועיות, בקצב ממוקד יותר.
            </p>
          </header>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {INCLUDED.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-border bg-background p-6"
              >
                <span className="text-2xl" aria-hidden="true">
                  {item.icon}
                </span>
                <h3 className="mt-3 text-sm font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {item.body}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            כולל: פיתוח קול, DJ, הפקה, פסנתר, גיטרה או תיאוריה - ובקשה מיוחדת
            הקלטת השיעור (שמע / וידאו) בתוספת תשלום.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-14 text-center sm:px-6 sm:py-16 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
          ההבטחה והמחויבות שלנו
        </p>
        <h2 className="mt-3 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          כל תלמיד הוא עולם ומלואו
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
          אנחנו כאן ללוות אתכם צעד אחר צעד. מלוא תשומת הלב, מקצועיות בלתי
          מתפשרת, ועשייה כדי שתגיעו למטרות - בקצב הנכון לכם ובאווירה תומכת.
          כל שאלה תקבל מענה, כל אתגר ייפתר יחד.
        </p>
        <Link
          href="/academy"
          className="mt-6 inline-block text-sm font-medium text-brand-red hover:underline"
        >
          כל מסלולי האקדמיה </Link>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-center text-lg font-semibold text-foreground sm:text-xl">
          איך מתחילים?
        </h2>
        <ol className="mx-auto mt-5 max-w-md list-decimal space-y-3 ps-5 text-sm leading-relaxed text-muted-foreground">
          <li>
            הזמינו את השיעור דרך{" "}
            <Link href="/book" className="font-medium text-brand-red hover:underline">
              עמוד ההזמנה
            </Link>{" "}
            או בחרו חבילה למעלה.
          </li>
          <li>
            לאחר ההזמנה - שלחו הודעת וואטסאפ עם התחום המבוקש והעדפת מועד.
          </li>
          <li>נתאם איתכם בהקדם ונבנה את המפגש הראשון.</li>
        </ol>
      </section>

      <section className="border-t border-border bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-[72rem] px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            רוצים לעשות את קפיצת המדרגה הזו?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
            הזמינו עכשיו שיעור פרטי ממוקד והתחילו להתקדם במהירות וביעילות
            בתחום שבחרתם.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/book"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-red px-7 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(212,43,43,0.35)] transition-[background-color,box-shadow] hover:bg-brand-red-light hover:shadow-[0_0_32px_rgba(212,43,43,0.45)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
            >
              הזמנה באתר </Link>
            <a
              href={ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-7 py-3 text-sm font-semibold text-foreground transition-colors hover:border-brand-red/40 hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
              aria-label="תיאום שיעור פרטי בוואטסאפ"
            >
              תיאום בוואטסאפ
            </a>
          </div>
          <div className="mt-5 flex justify-center">
            <ShareButton title="שיעור פרטי במוזיקה | יקיר כהן הפקות" />
          </div>
        </div>
      </section>
    </div>
  );
}
