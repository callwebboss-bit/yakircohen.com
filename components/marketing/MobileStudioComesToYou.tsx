import Link from "next/link";

const MOBILE_COMES_POINTS = [
  "הקמה מקצועית תוך פחות מ-30 דקות",
  "שירה, ברכה, פודקאסט או ראיון - באיכות אולפן",
  "מתאים לקבוצות, משפחות, ילדים וארגונים",
  "אפשר להוסיף תאורה מקצועית וצילום וידאו",
] as const;

const DEFAULT_HEADING = "לא חייבים להגיע - האולפן מגיע אליכם";

type Props = {
  className?: string;
  /** כותרת חלופית לכל עמוד - מונע תוכן זהה בין עמודים אינדקסביליים */
  heading?: string;
};

/**
 * קולאאוט "האולפן הנייד מגיע אליכם" - לדפי אולפן שמזמינים להגיע למודיעין.
 * מדגיש: המרחב שלכם הופך לאולפן, אזור המרכז/מודיעין מועדף לנייד, שירות בכל הארץ.
 * ה-<strong> על התוצרים המוחשיים (ציוד + התוצאה), לא על מילות מיקום.
 */
export default function MobileStudioComesToYou({
  className = "",
  heading = DEFAULT_HEADING,
}: Props) {
  return (
    <section
      className={`rounded-2xl border border-catalog-gold/25 bg-surface p-6 sm:p-8 ${className}`}
      aria-labelledby="mobile-comes-heading"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
        אולפן נייד
      </p>
      <h2
        id="mobile-comes-heading"
        className="mt-3 font-serif text-xl font-semibold text-foreground sm:text-2xl"
      >
        {heading}
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        מגיעים אליכם עם{" "}
        <strong className="font-semibold text-foreground">
          מיקרופונים, ממשק, פנלים אקוסטיים ומלווה מקצועי
        </strong>{" "}
        - והופכים את הבית, המשרד או העסק שלכם ל
        <strong className="font-semibold text-foreground">אולפן הקלטות לכל דבר</strong>.
        אזור המרכז ומודיעין מועדפים לאולפן הנייד, ואנחנו מגיעים לכל הארץ (תוספת
        נסיעה מחוץ למרכז ומודיעין).
      </p>
      <ul className="mt-5 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
        {MOBILE_COMES_POINTS.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-0.5 text-catalog-gold" aria-hidden>
              ✓
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <Link
        href="/studio/mobile-studio"
        className="mt-6 inline-flex min-h-12 items-center justify-center rounded-xl bg-brand-red px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-red-light"
      >
        לפרטים על האולפן הנייד
      </Link>
    </section>
  );
}
