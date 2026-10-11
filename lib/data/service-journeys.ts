import { DATE_HOLD_TERMS_BODY, TIME_CLAIMS } from "@/lib/data/conversion-copy";
import { getScopeById } from "@/lib/data/pricing-catalog";
import { REVISION_POLICIES } from "@/lib/data/revision-policy";

/**
 * ציר "מה קורה מרגע שפונים" לכל שירות (תוכנית הבהירות, שלב 3, 11.10.2026).
 *
 * כל שלב אומר מי עושה מה, ומתי. הטקסט נשען רק על עובדות מאושרות, וכל עובדה
 * מגיעה מהמקור שלה ולא נכתבת שוב:
 * - הצעה "בדרך כלל תוך שעה": TIME_CLAIMS.quoteHour (D62).
 * - שריון מועד במקדמה: DATE_HOLD_TERMS_BODY.
 * - שולחים מראש את השיר ואנחנו מכינים פלייבק: בחירת הבעלים, 11.10.2026 (D93).
 * - שעה באולפן, הקלטה, מיקס ומאסטר: scope של song_recording בקטלוג.
 * - הטכנאי מקליט ונותן טיפים מעשיים: D82.
 * - "התוצאה ביד באותו רגע": S1002-01.
 * - סבבי התיקונים: REVISION_POLICIES (D65), המקור האחד לסבבים.
 */

export type JourneyActor = "you" | "us" | "together";

export type JourneyStep = {
  id: string;
  title: string;
  body: string;
  /** מי עושה את השלב. מוצג כתווית, כדי שיהיה ברור מתי התור של הלקוח */
  actor: JourneyActor;
  /** מתי או כמה זמן, כשיש עובדה מאושרת */
  when?: string;
};

export type ServiceJourney = {
  id: string;
  heading: string;
  subheading: string;
  steps: readonly JourneyStep[];
};

export const JOURNEY_ACTOR_LABEL: Record<JourneyActor, string> = {
  you: "אתם",
  us: "אנחנו",
  together: "יחד",
};

function songRevisionsLine(): string {
  const song = REVISION_POLICIES.find((p) => p.id === "song");
  if (!song) throw new Error("revision policy for song is missing (lib/data/revision-policy.ts)");
  return song.summary;
}

function songScope() {
  const scope = getScopeById("song_recording");
  if (!scope?.duration || !scope.includes) {
    throw new Error("song_recording scope needs duration and includes (lib/data/pricing-catalog.ts)");
  }
  return scope;
}

export function getSongJourney(): ServiceJourney {
  const scope = songScope();
  return {
    id: "song",
    heading: "מה קורה מרגע שפונים",
    subheading: "הקלטת שיר, מההודעה הראשונה ועד הקובץ ביד",
    steps: [
      {
        id: "contact",
        title: "פונים",
        body: "שולחים הודעה בוואטסאפ או מזמינים באתר.",
        actor: "you",
        when: `הצעה ${TIME_CLAIMS.quoteHour}`,
      },
      {
        id: "date",
        title: "קובעים תאריך",
        body: `סוגרים מועד ${DATE_HOLD_TERMS_BODY}.`,
        actor: "together",
      },
      {
        id: "song",
        title: "שולחים את השיר",
        body: "שולחים מראש את השיר שרוצים להקליט, ואנחנו מכינים את הפלייבק.",
        actor: "you",
        when: "לפני היום באולפן",
      },
      {
        id: "studio",
        title: "באולפן",
        body: "הטכנאי מקליט ונותן טיפים מעשיים: איך עובדים מול המיקרופון ומה חשוב לדעת. לא צריך ניסיון.",
        actor: "together",
        when: scope.duration,
      },
      {
        id: "result",
        title: "התוצאה ביד",
        body: `התוצאה ביד באותו רגע: ${scope.includes}.`,
        actor: "us",
        when: "בסוף הסשן",
      },
      {
        id: "revisions",
        title: "תיקונים, אם צריך",
        body: `${songRevisionsLine()}.`,
        actor: "us",
      },
    ],
  };
}
