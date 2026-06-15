import Link from "next/link";
import { buildWhatsAppHref } from "@/lib/whatsapp";

const HUB_POINTS = [
  {
    title: "אירועים בשטח",
    text: "לוח שנה צפוף — אין זמן לשבת על כל מעבר לפני חתונה.",
  },
  {
    title: "אולפן ועריכה",
    text: "רמיקסים, תגים קוליים וסטים — מי שמכיר את הלוח שנה גם מייצר.",
  },
  {
    title: "צוות ולקוחות",
    text: "כשיש עובדים, הקלטות ולקוחות — שכבת ייצור חיצונית מורידה עומס.",
  },
] as const;

export default function DjProducerHubIntro() {
  const waHref = buildWhatsAppHref({
    text: "שלום, אני דיג'יי עמוס — מחפש עזרה בייצור מאשאפים / סטים. אשמח לשמוע מה אפשר.",
    utm_source: "website",
    utm_campaign: "dj_hub_intro",
  });

  return (
    <section
      aria-labelledby="dj-hub-intro-heading"
      className="rounded-2xl border border-brand-red/15 bg-gradient-to-br from-brand-red/5 to-transparent p-6 sm:p-8"
    >
      <h2
        id="dj-hub-intro-heading"
        className="text-xl font-semibold text-foreground sm:text-2xl"
      >
        אתם מנגנים — אנחנו מייצרים
      </h2>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
        דיג&apos;יי עם לוח שנה צפוף לא חייב לשבת על כל רמיקס לבד.
        כאן יש שילובים עם BPM וסולם, דוגמאות ביוטיוב, וחבילות — וכשצריך, אנחנו בונים באולפן.
      </p>
      <ul className="mt-6 grid gap-4 sm:grid-cols-3">
        {HUB_POINTS.map((point) => (
          <li
            key={point.title}
            className="rounded-xl border border-border bg-surface/80 p-4"
          >
            <h3 className="text-sm font-semibold text-foreground">{point.title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{point.text}</p>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center rounded-xl bg-brand-red px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-red-light"
        >
          בואו נוריד לחץ — וואטסאפ
        </a>
        <Link
          href="#mashup-ideas"
          className="inline-flex min-h-11 items-center rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:border-brand-red/40"
        >
          לקטלוג השילובים
        </Link>
        <Link
          href="#mashup-bundles"
          className="inline-flex min-h-11 items-center rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:border-brand-red/40"
        >
          חבילות והנחות
        </Link>
      </div>
    </section>
  );
}
