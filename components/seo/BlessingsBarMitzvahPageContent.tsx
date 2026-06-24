import TrustStatsBar from "@/components/marketing/TrustStatsBar";
import BlessingsProcessGrid from "@/components/blessings/BlessingsProcessGrid";
import BlessingsRelatedNav from "@/components/blessings/BlessingsRelatedNav";
import BlessingsSectionHeader from "@/components/blessings/BlessingsSectionHeader";
import BlessingsWhyGrid from "@/components/blessings/BlessingsWhyGrid";
import ShowcaseVideoSection from "@/components/seo/ShowcaseVideoSection";
import ServicePageFromRegistry from "@/components/services/ServicePageFromRegistry";
import {
  BAR_MITZVAH_PROCESS,
  BAR_MITZVAH_WHY,
} from "@/lib/data/blessings-subpages";
import { getStudioService } from "@/lib/data/services";
import { BAR_MITZVAH_BLESSING_VIDEOS } from "@/lib/data/youtube-showcases";
import { buildWhatsAppHref } from "@/lib/whatsapp";

const service = getStudioService("blessings-bar-mitzvah");

const whatsappHref = buildWhatsAppHref({
  text: "שלום, אני מעוניין להקליט ברכה / דרשה לבר מצווה",
  utm_source: "website",
  utm_campaign: "bar_mitzvah_blessing_cta",
});

const RELATED_LINKS = [
  { href: "/studio/blessings", label: "כל סוגי הברכות" },
  { href: "/studio/blessings/bat-mitzvah-clip", label: "קליפ בת מצווה" },
  { href: "/studio/blessings/video-clip", label: "שיר + קליפ" },
  { href: "/studio/recording-song-modiin/gifts", label: "מתנות מהאולפן" },
  { href: "/studio/pricing", label: "מחירון" },
] as const;

export default function BlessingsBarMitzvahPageContent() {
  return (
    <ServicePageFromRegistry service={service} portfolioLabel="ברכות בר/בת מצווה">
      <TrustStatsBar variant="compact" className="rounded-2xl border" />

      {/* What can be recorded */}
      <section aria-labelledby="bar-mitzvah-types-heading">
        <BlessingsSectionHeader
          id="bar-mitzvah-types-heading"
          eyebrow="מה מקליטים?"
          title="כל הרגעים שרוצים לשמוע שוב"
          description="דרשה, ברכת הכהנים, ברכה מהמשפחה או שיר מקורי - כולם יוצאים ברמה אחרת כשמקליטים נכון."
        />
        <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[
            {
              emoji: "📖",
              title: "דרשה לבר מצווה",
              description:
                "הנאום שהאב, הרב או הבר מצווה עצמו נותן. מוקלט בשקט, בקצב נכון, עם ליווי אישי עד שזה מרגיש נכון.",
            },
            {
              emoji: "✡️",
              title: "ברכת הכהנים",
              description:
                "ברכה עתיקה ומרגשת שנשמעת הכי טוב כשמוקלטת מראש ברמה מקצועית - בלי תלות בלחץ הרגע.",
            },
            {
              emoji: "💬",
              title: "ברכה מהמשפחה",
              description:
                "סבא, סבתא, דוד, חברים שלא יכולים להגיע לאירוע - שולחים ברכה מוקלטת שמוקרנת באולם. נשמרת לתמיד.",
            },
            {
              emoji: "🎵",
              title: "שיר ברכה לאירוע",
              description:
                "שיר כניסה מקורי עם שם הבר-מצווה ומילים שכתבתם. הכי יחודי שיש - ואפשר לנגן אותו שוב בחתונה.",
            },
          ].map((item) => (
            <li
              key={item.title}
              className="rounded-xl border border-border bg-surface p-5"
            >
              <span className="text-2xl" aria-hidden>
                {item.emoji}
              </span>
              <h3 className="mt-3 font-semibold text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="bar-mitzvah-why-heading">
        <BlessingsSectionHeader
          id="bar-mitzvah-why-heading"
          eyebrow="למה מוקלט?"
          title="ברכה שמכבדת את הרגע, בלי לחץ על הבמה"
          description="דרשה, ברכת הכהנים או ברכה אישית. מקליטים בשקט, עורכים בקצב נכון ומוסרים קובץ מוכן לאירוע."
        />
        <BlessingsWhyGrid items={BAR_MITZVAH_WHY} />
      </section>

      <section aria-labelledby="bar-mitzvah-process-heading">
        <BlessingsSectionHeader
          id="bar-mitzvah-process-heading"
          eyebrow="התהליך"
          title="איך זה עובד?"
        />
        <BlessingsProcessGrid steps={BAR_MITZVAH_PROCESS} />
      </section>

      <ShowcaseVideoSection
        videos={BAR_MITZVAH_BLESSING_VIDEOS}
        heading="ברכות ודרשות - דוגמאות מהאולפן"
        subheading="ככה זה נשמע כשמקליטים נכון."
        kicker="דוגמאות"
      />

      <section
        className="rounded-2xl border border-brand-red/25 bg-brand-red/5 p-6 text-center sm:p-10"
        aria-labelledby="bar-mitzvah-cta-heading"
      >
        <h2
          id="bar-mitzvah-cta-heading"
          className="text-xl font-semibold text-foreground sm:text-2xl"
        >
          רוצים להקליט ברכה לבר/בת מצווה?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
          שלחו הודעה ונגיד לכם בדיוק כמה זמן, כמה עולה ואיך מגיעים מוכנים.
          בלי התחייבות.
        </p>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-red px-7 py-3.5 text-sm font-semibold text-white hover:bg-brand-red-light"
        >
          דברו איתי בוואטסאפ
        </a>
      </section>

      <BlessingsRelatedNav links={RELATED_LINKS} />
    </ServicePageFromRegistry>
  );
}
