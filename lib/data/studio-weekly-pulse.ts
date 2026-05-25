/**
 * Curated, human-written studio updates - rotated by calendar week.
 * Edit the pool when production focus shifts; no live tickers or fake counters.
 */

export type StudioWeeklyPulse = {
  /** Short kicker, e.g. "השבוע באולפן" */
  kicker: string;
  /** Main narrative - authentic production snapshot */
  body: string;
  /** Optional closing line (availability, tone) */
  footnote?: string;
};

/** Editorial pool - add or replace entries as the studio schedule evolves */
export const STUDIO_WEEKLY_PULSE_POOL: StudioWeeklyPulse[] = [
  {
    kicker: "השבוע באולפן",
    body: "שני פודקאסטים בעריכה, ושלוש ברכות לחתונה.",
    footnote: "נשארו כמה שעות פנויות השבוע - כתבו לנו.",
  },
  {
    kicker: "השבוע באולפן",
    body: "מקליטים שיר מתנה לבר מצווה, וסוגרים עריכת פרק פודקאסט לפני העלאה.",
    footnote: "נשמח לתאם שעה שקטה באולפן - כתבו לנו בוואטסאפ.",
  },
  {
    kicker: "השבוע באולפן",
    body: "מעבדים קריינות לקמפיין, ומכינים ברכת חתן/כלה עם ליווי צמוד באולפן.",
    footnote: "מקומות אחרונים לפני סוף השבוע.",
  },
  {
    kicker: "השבוע באולפן",
    body: "שולחים ללקוחות טיוטות ערוכות מפודקאסטים, ומלטשים סאונד לקליפ ברכה קצר.",
    footnote: "האולפן פתוח גם בערב - לפי תיאום מראש.",
  },
];

function getISOWeekNumber(date: Date): number {
  const utc = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
  const day = utc.getUTCDay() || 7;
  utc.setUTCDate(utc.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(utc.getUTCFullYear(), 0, 1));
  return Math.ceil(
    ((utc.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7,
  );
}

/** Returns this week's curated pulse from the editorial pool (deterministic, not live). */
export function getStudioWeeklyPulse(
  date: Date = new Date(),
): StudioWeeklyPulse {
  const week = getISOWeekNumber(date);
  const index = week % STUDIO_WEEKLY_PULSE_POOL.length;
  return STUDIO_WEEKLY_PULSE_POOL[index]!;
}
