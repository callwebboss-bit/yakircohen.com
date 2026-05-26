import type { Metadata } from "next";
import Link from "next/link";
import YouTube from "@/components/YouTube";
import { constructMetadata } from "@/lib/metadata";
import { ACADEMY_VOICEOVER_DEMO } from "@/lib/data/youtube-showcases";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { SITE_NAME } from "@/lib/constants";
import ShareButton from "@/components/ui/ShareButton";

export const metadata: Metadata = constructMetadata({
  title: "קורס קריינות ודיבור נכון | יקיר כהן הפקות",
  description:
    "קורס קריינות מקצועי: נשימה, דיקציה, אינטונציה, עבודה מול מיקרופון וקריינות סיפורית. זמין גם אונליין. הפכו את הקול שלכם לכלי עבודה שמכניס כסף.",
  slug: "academy/voiceover",
  keywords: [
    "קורס קריינות",
    "לימוד קריינות",
    "פיתוח קול",
    "קריינות רדיו",
    "קריינות פרסומות",
    "קורס קריינות אונליין",
  ],
});

const MODULES = [
  {
    stage: "מודול 1",
    title: "היסודות",
    body: "נשימה מהסרעפת לייצור קול יציב. דיקציה ברורה וחדה. מציאת הנקודה המתוקה מול המיקרופון ומניעת פופים. קריאה ראשונה של טקסט עם הבנת המסר המרכזי.",
  },
  {
    stage: "מודול 2",
    title: "אינטונציה וטונאליות",
    body: "שחקנות של קול. שחק עם גובה הקול, הקצב והעוצמה כדי להפוך טקסט משעמם למרתק. מה הרגש שצריך להעביר ואיך.",
  },
  {
    stage: "מודול 3",
    title: "קריינות סיפורית",
    body: "פרומואים, דוקו, פרסומות וספרי שמע. הסודות שגורמים לאנשים להקשיב ולהאמין. איך לצבוע טקסט יבש בצבעים של רגש ומשמעות.",
  },
] as const;

const FORMATS = [
  {
    icon: "🎤",
    label: "פרסומות ורדיו",
    body: "הדגשת המילה הנכונה ליצירת אמינות או התלהבות. שליטה בזמן ובאנרגיה.",
  },
  {
    icon: "🎬",
    label: "סרטים ודוקו",
    body: "העברת רגש בלי להיות דרמטי מדי. נרטיב שגורם לצפיות.",
  },
  {
    icon: "📚",
    label: "ספרי שמע ופודקאסט",
    body: "הפחת חיים לדמויות שונות. קריאה שמחזיקה מאזין מהדקה הראשונה.",
  },
  {
    icon: "☎️",
    label: "מענה קולי ועסקי",
    body: "שידור מקצועיות וסבלנות. קול שמייצג את המותג.",
  },
] as const;

export default function VoiceoverCoursePage() {
  const ctaHref = buildWhatsAppHref({
    text: "היי יקיר! אני מתעניין/ת בקורס הקריינות. אשמח לשיחת ייעוץ ראשונית לגלות יחד את הפוטנציאל בקול שלי.",
    utm_source: "academy",
    utm_campaign: "voiceover_course_cta",
  });

  return (
    <div className="bg-background">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-border bg-background">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_-10%,rgba(212,43,43,0.12),transparent_55%)]"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
          <nav aria-label="ניווט ארגוני" className="mb-6">
            <ol className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <li>
                <Link href="/" className="transition-colors duration-fast ease-luxury hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red">
                  ראשי
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/academy" className="transition-colors duration-fast ease-luxury hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red">
                  האקדמיה
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="font-medium text-foreground" aria-current="page">
                קורס קריינות
              </li>
            </ol>
          </nav>

          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
            {SITE_NAME}
          </p>

          <h1 className="mt-3 font-serif text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            קורס קריינות ודיבור נכון
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            יש לך קול שאנשים מחמיאים לך עליו? &quot;יש לך קול רדיופוני&quot;,
            &quot;אתה חייב לקריין פרסומות&quot;. הגיע הזמן להפוך את המחמאה
            למקצוע שמכניס כסף.
          </p>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            קריינות היא אומנות. יש לה חוקים, טכניקות וסודות שאפשר ללמוד רק
            ממי שכבר עשה את הדרך.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href={ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-red px-7 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(212,43,43,0.3)] transition-[background-color,box-shadow] duration-normal ease-luxury hover:bg-brand-red-light hover:shadow-[0_0_32px_rgba(212,43,43,0.45)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
            >
              גלו את הפוטנציאל בקול שלכם ←
            </a>
            <p className="text-xs text-muted-foreground">
              שיחת ייעוץ ראשונית, ללא עלות וללא התחייבות
            </p>
          </div>
        </div>
      </section>

      {/* ── What a voiceover artist does ── */}
      <section className="border-b border-border bg-surface py-12 sm:py-14">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
            מה זה קריין מקצועי?
          </p>
          <h2 className="mt-3 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            הרבה יותר מ&quot;אדם שמקריא טקסט&quot;
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
            קריין הוא שחקן של קול. אמן של אינטונציה. מספר סיפורים, איש מכירות,
            מורה ומגיש חדשות, והכול רק באמצעות מנעד הקול שלו. קריין טוב לא רק
            קורא את המילים, הוא מבין את מה שבין המילים.
          </p>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            היכולת לצבוע טקסט יבש בצבעים של רגש ומשמעות, זו מה שמבדיל בין
            חובבן למקצוען. וזו בדיוק היכולת שלומדים כאן.
          </p>
        </div>
      </section>

      {/* ── Studio demo ── */}
      <section
        className="border-b border-border bg-surface py-12 sm:py-14"
        aria-labelledby="academy-voiceover-demo-heading"
      >
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2
            id="academy-voiceover-demo-heading"
            className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
          >
            דוגמת קריינות מהאולפן
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            שמעו איך נשמעת קריינות מקצועית לפני שמתחילים את המסלול.
          </p>
          <div className="mx-auto mt-8 aspect-video max-w-2xl overflow-hidden rounded-2xl bg-neutral-900">
            <YouTube
              videoId={ACADEMY_VOICEOVER_DEMO.videoId}
              title={ACADEMY_VOICEOVER_DEMO.title}
              fillParent
            />
          </div>
        </div>
      </section>

      {/* ── Formats ── */}
      <section className="mx-auto max-w-[72rem] px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <h2 className="mb-8 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          לאן הקול שלך יכול לקחת אותך?
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FORMATS.map((f) => (
            <div
              key={f.label}
              className="rounded-2xl border border-border bg-background p-5"
            >
              <span className="text-2xl" aria-hidden="true">
                {f.icon}
              </span>
              <h3 className="mt-2 text-sm font-semibold text-foreground">
                {f.label}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Curriculum ── */}
      <section className="border-t border-border bg-surface py-14 sm:py-16">
        <div className="mx-auto max-w-[72rem] px-4 sm:px-6 lg:px-8">
          <header className="mb-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
              הסילבוס
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              מה לומדים בקורס?
            </h2>
          </header>

          <div className="space-y-5">
            {MODULES.map((m, i) => (
              <div
                key={m.stage}
                className="flex gap-5 rounded-2xl border border-border bg-background p-6"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-red/10 text-sm font-bold text-brand-red">
                  {i + 1}
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-brand-red">
                    {m.stage}
                  </p>
                  <h3 className="mt-1 text-base font-semibold text-foreground">
                    {m.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {m.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Online note ── */}
      <section className="border-t border-border bg-background py-10 sm:py-12">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
          <h3 className="text-base font-semibold text-foreground">
            קורס קריינות אונליין
          </h3>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            לומדים מהבית, בזמן שלך, עם גישה לחומרי לימוד מוקלטים, משימות
            אישיות ומשוב מקצועי. מתאים לאנשים עובדים ולסטודנטים, בלי לוותר על
            האיכות.
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-border bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-[72rem] px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            בואו נדבר על הקול שלכם
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
            שיחת ייעוץ ראשונית ללא עלות. נגלה ביחד את הפוטנציאל ונבנה מסלול
            שמתאים לכם.
          </p>
          <a
            href={ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-brand-red px-7 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(212,43,43,0.3)] transition-[background-color,box-shadow] duration-normal ease-luxury hover:bg-brand-red-light hover:shadow-[0_0_32px_rgba(212,43,43,0.45)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
            aria-label="שיחת ייעוץ לקורס קריינות בוואטסאפ"
          >
            לשיחת ייעוץ ראשונית בוואטסאפ ←
          </a>
          <div className="mt-5 flex justify-center">
            <ShareButton title="קורס קריינות ודיבור נכון | יקיר כהן הפקות" />
          </div>
        </div>
      </section>
    </div>
  );
}
