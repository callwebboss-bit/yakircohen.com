import type { TestimonialItem } from "@/components/marketing/Testimonials";

export const TESTIMONIAL_CATEGORY_LABELS = {
  studio: "אולפן",
  events: "אירועים",
  podcast: "פודקאסט",
  voiceover: "קריינות",
  online: "אונליין",
  academy: "אקדמיה",
} as const;

export type TestimonialCategoryId = keyof typeof TESTIMONIAL_CATEGORY_LABELS;

export function getTestimonialYear(datePublished?: string): string | undefined {
  if (!datePublished) return undefined;
  const year = datePublished.slice(0, 4);
  return /^\d{4}$/.test(year) ? year : undefined;
}

export function countByCategory(
  items: readonly TestimonialItem[],
): Partial<Record<TestimonialCategoryId, number>> {
  const counts: Partial<Record<TestimonialCategoryId, number>> = {};
  for (const item of items) {
    if (!item.serviceCategory) continue;
    counts[item.serviceCategory] = (counts[item.serviceCategory] ?? 0) + 1;
  }
  return counts;
}

export function formatCategoryBreakdown(
  items: readonly TestimonialItem[],
): string {
  const counts = countByCategory(items);
  return (Object.keys(TESTIMONIAL_CATEGORY_LABELS) as TestimonialCategoryId[])
    .filter((id) => (counts[id] ?? 0) > 0)
    .map((id) => `${TESTIMONIAL_CATEGORY_LABELS[id]} ${counts[id]}`)
    .join(" · ");
}
