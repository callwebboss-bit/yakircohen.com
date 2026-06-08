import type { Metadata } from "next";
import Link from "next/link";
import { buildBookHref } from "@/lib/book-url";
import { THANK_YOU_TO_BOOK_CATEGORY } from "@/lib/data/book-closer-map";
import { constructMetadata } from "@/lib/metadata";
import { buildServiceWhatsAppText, buildWhatsAppHref } from "@/lib/whatsapp";

export const metadata: Metadata = constructMetadata({
  title: "ההזמנה בדרך | יקיר כהן הפקות",
  description: "תודה על פנייתכם - נחזור אליכם תוך 15 דקות.",
  slug: "thank-you",
});

type ServiceId =
  | "studio"
  | "events"
  | "podcast"
  | "photography"
  | "dj"
  | "singer"
  | "academy"
  | "online"
  | "clips";

const SERVICE_CONTENT: Record<
  ServiceId,
  { title: string; responseTime: string; bullets: [string, string, string] }
> = {
  studio: {
    title: "הקלטה באולפן",
    responseTime: "נחזור אליכם תוך 15 דקות בשעות הפעילות",
    bullets: [
      "הכינו את השיר - ניגון יחד עם הלחן, פזמון ובית",
      "הביאו שתייה חמה לחימום הגרון לפני ההקלטה",
      "הגיעו 10 דקות מוקדם - יש חניה פנויה ליד האולפן",
    ],
  },
  events: {
    title: "אטרקציות לאירוע",
    responseTime: "נחזור אליכם תוך שעה לאישור הפרטים",
    bullets: [
      "וודאו שיש מקום פנוי לציוד לפי האטרקציה שבחרתם",
      "שלחו את שם האולם ואיש הקשר שלו לתיאום",
      "אישור סופי נדרש 48 שעות לפני האירוע",
    ],
  },
  podcast: {
    title: "הקלטת פודקאסט",
    responseTime: "נחזור אליכם תוך 15 דקות",
    bullets: [
      "הכינו רשימת נושאים / שאלות לפרק - אפילו ראשי פרקים",
      "בדקו חיבור אינטרנט יציב אם ההקלטה מרחוק",
      "אין ניסיון? לא צריך - מנחים אתכם בכל שלב",
    ],
  },
  photography: {
    title: "צילום אירוע",
    responseTime: "נחזור אליכם תוך שעה",
    bullets: [
      "שלחו לנו לוח זמנים של האירוע ורגעים חשובים לצילום",
      "ציינו אם יש רצון לצילומים סטודיו בנוסף",
      "וודאו גישה לכל אזורי הצילום עם מנהל האולם",
    ],
  },
  dj: {
    title: "DJ לאירוע",
    responseTime: "נחזור אליכם תוך שעה לאישור זמינות",
    bullets: [
      "שלחו תאריך מדויק ושם האולם לבדיקת זמינות",
      "הכינו רשימת שירים חובה / אסור להשמיע",
      "נסיים תיאום מול מנהל האולם לפני האירוע",
    ],
  },
  singer: {
    title: "הגברה לזמרים",
    responseTime: "נחזור אליכם תוך 15 דקות בשעות הפעילות",
    bullets: [
      "שלחו פרטי האירוע: תאריך, אולם וגודל קהל משוער",
      "ציינו אם יש הרכב מלווה או פלייבק בלבד",
      "הכינו רשימת שירים לבדיקת סאונד לפני העלייה לבמה",
    ],
  },
  academy: {
    title: "שיעור פרטי באקדמיה",
    responseTime: "נחזור אליכם תוך 15 דקות",
    bullets: [
      "חשבו על מטרה אחת לשיעור - קול, DJ או הפקה",
      "אם יש חומר קיים (שיר, פרויקט) - הביאו אותו לשיעור",
      "הגיעו 5 דקות מוקדם - יש חניה ליד האולפן",
    ],
  },
  online: {
    title: "שחזור סאונד / AI",
    responseTime: "נחזור אליכם תוך שעה עם הערכה ראשונית",
    bullets: [
      "שמרו את קובץ המקור המקורי - אל תשלחו רק MP3 דחוס",
      "תארו בקצרה את הבעיה: רעש, עיוות, הקלטה ישנה",
      "אם יש דדליין - ציינו אותו כבר בהודעה הראשונה",
    ],
  },
  clips: {
    title: "קליפים ודיגיטל",
    responseTime: "נחזור אליכם תוך 15 דקות",
    bullets: [
      "הכינו חומר גלם: וידאו, תמונות או הקלטה קיימת",
      "ציינו לאיזו פלטפורמה מיועד הקליפ (יוטיוב, רילס, אירוע)",
      "אם יש דוגמה לסגנון שאהבתם - שלחו קישור",
    ],
  },
};

function isServiceId(v: string | undefined): v is ServiceId {
  return !!v && v in SERVICE_CONTENT;
}

const DEFAULT_WA_HREF = buildWhatsAppHref({
  text: buildServiceWhatsAppText("יצירת קשר"),
  utm_source: "website",
  utm_campaign: "thank_you_cta",
});

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const params = await searchParams;
  const serviceId = isServiceId(params.service) ? params.service : "studio";
  const content = SERVICE_CONTENT[serviceId];

  const retryWaHref = buildWhatsAppHref({
    text: buildServiceWhatsAppText(content.title),
    utm_source: "website",
    utm_campaign: `thank_you_retry_${serviceId}`,
  });

  const bookCategory = THANK_YOU_TO_BOOK_CATEGORY[serviceId];
  const bookUpsellHref = bookCategory ? buildBookHref(bookCategory) : "/book";

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-lg px-4 py-16 sm:px-6 sm:py-20">
        <div className="text-center">
          <span className="text-5xl" aria-hidden="true">
            ✓
          </span>
          <h1 className="mt-5 font-serif text-2xl font-semibold text-foreground sm:text-3xl">
            ההזמנה בדרך אלינו
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">{content.responseTime}</p>
        </div>

        <div className="mt-10 rounded-2xl border border-border bg-surface p-6">
          <p className="mb-4 text-xs font-bold tracking-widest text-brand-red uppercase">
            מה כדאי להכין ל{content.title}
          </p>
          <ol className="space-y-4">
            {content.bullets.map((bullet, i) => (
              <li key={i} className="flex gap-4 text-sm">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-red/10 text-xs font-bold text-brand-red">
                  {i + 1}
                </span>
                <span className="text-foreground">{bullet}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-6 space-y-3">
          <a
            href={retryWaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-red px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-red-light"
          >
            שלחו את הוואטסאפ שוב
          </a>

          <Link
            href={bookUpsellHref}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:border-brand-red/40"
          >
            רוצים לבחור תוספות? הזמנה מפורטת
          </Link>
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          שאלות? אפשר גם{" "}
          <a
            href={DEFAULT_WA_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-red hover:underline"
          >
            לכתוב ישירות בוואטסאפ
          </a>
        </p>
      </div>
    </div>
  );
}
