import {
  BOOK_AUDIENCE_ROUTES,
  BOOK_ESCAPE_HATCH,
} from "@/lib/data/book-audience-routes";

export type BookRouterLeadSource = {
  formId: string;
  closerServiceId: string;
  parserId: "audience_fast";
  label: string;
  defaultSource: string;
  utmCampaigns: readonly string[];
};

/** מקורות ליד מכרטיסי /book — מיוצאים ל-yakir-closer */
export const BOOK_ROUTER_LEAD_SOURCES: readonly BookRouterLeadSource[] = [
  ...BOOK_AUDIENCE_ROUTES.map((route) => ({
    formId: route.utm_campaign,
    closerServiceId: route.closerServiceId,
    parserId: "audience_fast" as const,
    label: `נתיב /book: ${route.tag}`,
    defaultSource: `/book#${route.categoryId}`,
    utmCampaigns: [route.utm_campaign] as const,
  })),
  {
    formId: BOOK_ESCAPE_HATCH.utm_campaign,
    closerServiceId: "recording",
    parserId: "audience_fast",
    label: "בריחה מנתיב /book",
    defaultSource: "/book",
    utmCampaigns: [BOOK_ESCAPE_HATCH.utm_campaign],
  },
];
