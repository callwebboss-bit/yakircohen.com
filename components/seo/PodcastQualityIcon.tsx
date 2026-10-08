import type { PodcastQualityIconId } from "@/lib/data/podcast-recording-page";

/*
 * אייקונים בסגנון ממשק של פלאגינים (פאנל, קו תדר, פיידרים, צורת גל), כדי שמי
 * שלא מכיר עריכת סאונד יבין במבט שיש כאן עבודה מתקדמת. SVG פנימי, צבע לפי
 * currentColor, ותמיד אחרי כותרת טקסט ולכן aria-hidden.
 * רק קווים עגולים וקו חלש לרקע, בלי טקסט בתוך ה-SVG.
 */

const faint = { opacity: 0.35 } as const;

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className="size-16 text-brand-red"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
    >
      <rect x="4" y="8" width="56" height="48" rx="8" style={faint} />
      {children}
    </svg>
  );
}

export default function PodcastQualityIcon({ id }: { id: PodcastQualityIconId }) {
  switch (id) {
    case "deesser":
      /* צורת גל שקצות הפסגות שלה חתוכות בקו סף מקווקו */
      return (
        <Panel>
          <path d="M10 22H54" strokeDasharray="3 4" style={faint} />
          <path d="M14 40V30M20 40V22M26 40V32M32 40V22M38 40V34M44 40V22M50 40V30" />
          <path d="M14 40V50M20 40V50M26 40V47M32 40V50M38 40V46M44 40V50M50 40V48" style={faint} />
        </Panel>
      );
    case "eq":
      /* עקומת תדרים עם שלוש נקודות אחיזה */
      return (
        <Panel>
          <path d="M12 20H52M12 32H52M12 44H52" style={faint} />
          <path d="M10 36C18 36 20 22 28 22S38 42 46 42 52 34 54 32" />
          <circle cx="20" cy="29" r="3" fill="currentColor" />
          <circle cx="32" cy="32" r="3" fill="currentColor" />
          <circle cx="46" cy="42" r="3" fill="currentColor" />
        </Panel>
      );
    case "diction":
      /* גל דיבור חד וברור בתוך סוגריים מיקוד */
      return (
        <Panel>
          <path d="M14 22V18H18M50 22V18H46M14 42V46H18M50 42V46H46" />
          <path d="M22 32H24M28 26V38M34 22V42M40 27V37M45 32H46" />
        </Panel>
      );
    case "balance":
      /* שני פיידרים באותו גובה ושני מדי רמה שווים */
      return (
        <Panel>
          <path d="M20 16V48M44 16V48" style={faint} />
          <rect x="14" y="28" width="12" height="7" rx="2" fill="currentColor" />
          <rect x="38" y="28" width="12" height="7" rx="2" fill="currentColor" />
          <path d="M10 22V42M54 22V42" />
        </Panel>
      );
    case "soften":
      /* קו משונן חלש שהופך לקו חלק */
      return (
        <Panel>
          <path d="M10 34L16 18L22 46L28 14L34 48L40 20L46 42L54 34" style={faint} strokeDasharray="2 3" />
          <path d="M10 34C18 24 22 24 28 34S38 44 44 34 50 30 54 34" />
        </Panel>
      );
  }
}
