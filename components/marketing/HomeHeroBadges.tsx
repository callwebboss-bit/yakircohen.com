import {
  GOOGLE_RATING_LABEL,
  SITE_TRUST_STATS,
  STUDIO_ADDRESS_LINE,
} from "@/lib/constants";

export default function HomeHeroBadges() {
  const yearsStat = SITE_TRUST_STATS.find((s) => s.label === "שנות ניסיון");
  const clientsStat = SITE_TRUST_STATS.find((s) => s.label === "לקוחות מרוצים");
  const googleStat = SITE_TRUST_STATS.find((s) => s.label === GOOGLE_RATING_LABEL);

  const items = [
    yearsStat ? `${yearsStat.value} ${yearsStat.label}` : null,
    clientsStat ? `${clientsStat.value} ${clientsStat.label}` : null,
    googleStat ? `${googleStat.value} ${googleStat.label}` : null,
    `📍 ${STUDIO_ADDRESS_LINE.split(",")[0]}`,
  ].filter(Boolean) as string[];

  return (
    <ul
      className="mt-4 flex flex-wrap gap-2"
      aria-label="נתוני אמון"
    >
      {items.map((label) => (
        <li
          key={label}
          className="inline-flex min-h-8 items-center rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted-foreground"
        >
          {label}
        </li>
      ))}
    </ul>
  );
}
