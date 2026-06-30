/** נתוני ROI לחיסכון זמן — מבוסס על עותק ותמחור קיימים באתר */

export const PODCAST_ROI = {
  diyHoursPerEpisode: 4,
  marketEditRatePerHour: 120,
  deliveryNote: "מסירה מקצועית: רוב הפרקים תוך 1–3 ימי עבודה",
} as const;

export const ACADEMY_ROI = {
  mistakeCostPerMonth: 450,
  lessonPriceExVat: 990,
  note: "טעויות ציוד וזמן עריכה — הערכה לפי שיעור פרטי אחד בחודש",
} as const;

export function calcPodcastMonthlySavings(episodesPerMonth: number): {
  hoursSaved: number;
  workDaysSaved: number;
  diyCostEstimate: number;
} {
  const hoursSaved = episodesPerMonth * PODCAST_ROI.diyHoursPerEpisode;
  return {
    hoursSaved,
    workDaysSaved: Math.round((hoursSaved / 8) * 10) / 10,
    diyCostEstimate: hoursSaved * PODCAST_ROI.marketEditRatePerHour,
  };
}

export function calcAcademyMistakeSavings(months: number): {
  mistakesAvoided: number;
  lessonsEquivalent: number;
} {
  return {
    mistakesAvoided: months * ACADEMY_ROI.mistakeCostPerMonth,
    lessonsEquivalent: Math.round(
      (months * ACADEMY_ROI.mistakeCostPerMonth) / ACADEMY_ROI.lessonPriceExVat,
    ),
  };
}
