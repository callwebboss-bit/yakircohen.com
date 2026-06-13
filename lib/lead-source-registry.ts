/**
 * רישום מרכזי של מקורות ליד — מיפוי formId / utm_campaign → yakir-closer.
 * מיוצא ל-closer-config דרך npm run export:closer.
 */

import { BOOK_ROUTER_LEAD_SOURCES } from "@/lib/data/book-router-lead-sources";

export type LeadParserId =
  | "standard_closing"
  | "consult_partial"
  | "dj_detailed_form"
  | "academy_hebrew"
  | "attractions_order"
  | "podcast_calculator"
  | "dj_calculator"
  | "photography_calculator"
  | "clips_cart"
  | "contact_quiz"
  | "generic_inquiry"
  | "audience_fast";

export type LeadSourceEntry = {
  formId: string;
  closerServiceId: string;
  parserId: LeadParserId;
  label: string;
  defaultSource: string;
  utmCampaigns?: readonly string[];
};

/** מיפוי שירות ב-quiz יצירת קשר → closer */
export const CONTACT_SERVICE_TO_CLOSER: Record<string, string> = {
  studio: "recording",
  dj: "dj",
  voice: "podcast",
  podcast: "podcast",
  clip: "bat_mitzvah",
  online: "online_ai",
  other: "recording",
};

export const LEAD_SOURCE_REGISTRY: readonly LeadSourceEntry[] = [
  {
    formId: "studio_recording_booking",
    closerServiceId: "recording",
    parserId: "standard_closing",
    label: "אשף הקלטה באולפן",
    defaultSource: "/book#studio",
    utmCampaigns: ["studio_recording_booking"],
  },
  {
    formId: "podcast_booking_wizard",
    closerServiceId: "podcast",
    parserId: "standard_closing",
    label: "אשף פודקאסט",
    defaultSource: "/book#podcast",
    utmCampaigns: ["podcast_booking_wizard", "podcast_save_for_later"],
  },
  {
    formId: "events_booking_wizard",
    closerServiceId: "effects_only",
    parserId: "standard_closing",
    label: "אשף אטרקציות",
    defaultSource: "/book#events",
    utmCampaigns: ["events_booking_wizard"],
  },
  {
    formId: "singer_amplification_booking",
    closerServiceId: "live_sound",
    parserId: "standard_closing",
    label: "אשף הגברה לזמרים",
    defaultSource: "/book#singer",
    utmCampaigns: ["singer_amplification_booking"],
  },
  {
    formId: "academy_booking",
    closerServiceId: "academy",
    parserId: "standard_closing",
    label: "שיעור פרטי באקדמיה",
    defaultSource: "/book#academy",
  },
  {
    formId: "dj_events_calculator",
    closerServiceId: "dj",
    parserId: "dj_calculator",
    label: "מחשבון DJ ואירועים",
    defaultSource: "dj-events",
    utmCampaigns: ["dj_calculator"],
  },
  {
    formId: "photography_calculator",
    closerServiceId: "recording",
    parserId: "photography_calculator",
    label: "מחשבון צילום לאירוע",
    defaultSource: "/book#photography",
    utmCampaigns: ["photography_calculator"],
  },
  {
    formId: "attractions_calculator",
    closerServiceId: "effects_only",
    parserId: "attractions_order",
    label: "מחשבון אטרקציות",
    defaultSource: "/events/attractions",
    utmCampaigns: ["attractions_calculator"],
  },
  {
    formId: "podcast_calculator",
    closerServiceId: "podcast",
    parserId: "podcast_calculator",
    label: "מחשבון פודקאסט",
    defaultSource: "/podcast",
    utmCampaigns: ["podcast_calculator"],
  },
  {
    formId: "clips_booking",
    closerServiceId: "bat_mitzvah",
    parserId: "clips_cart",
    label: "טופס קליפים דיגיטליים",
    defaultSource: "/book#clips",
    utmCampaigns: ["clips_booking"],
  },
  {
    formId: "online_restore_booking",
    closerServiceId: "online_ai",
    parserId: "standard_closing",
    label: "שחזור סאונד אונליין",
    defaultSource: "/book#online",
  },
  {
    formId: "dj_booking_form",
    closerServiceId: "dj",
    parserId: "dj_detailed_form",
    label: "טופס שריון DJ מפורט",
    defaultSource: "/events/dj-events",
    utmCampaigns: ["dj_booking_form"],
  },
  {
    formId: "academy_trial_lesson",
    closerServiceId: "academy",
    parserId: "academy_hebrew",
    label: "שיעור ניסיון עברית (אולפן)",
    defaultSource: "/academy/ulpan",
    utmCampaigns: ["academy_trial_lesson"],
  },
  {
    formId: "singer_amplification_callback",
    closerServiceId: "live_sound",
    parserId: "generic_inquiry",
    label: "פנייה מעמוד הגברה לזמרים",
    defaultSource: "/events/equipment/singer-amplification",
    utmCampaigns: ["singer_amplification_closing_form"],
  },
  {
    formId: "callback_lead_form",
    closerServiceId: "recording",
    parserId: "generic_inquiry",
    label: "טופס callback כללי",
    defaultSource: "/contact",
  },
  {
    formId: "recording_song_inquiry_form",
    closerServiceId: "recording",
    parserId: "standard_closing",
    label: "טופס הקלטת שיר מודיעין",
    defaultSource: "/studio/recording-song-modiin",
    utmCampaigns: ["recording_song_inquiry_form"],
  },
  {
    formId: "contact_quiz",
    closerServiceId: "recording",
    parserId: "contact_quiz",
    label: "קוויז יצירת קשר",
    defaultSource: "/contact",
    utmCampaigns: ["contact_page", "contact_emergency_dj"],
  },
  {
    formId: "market_alert_internal",
    closerServiceId: "recording",
    parserId: "generic_inquiry",
    label: "התרעות מלאי פנימיות מהקלוזר",
    defaultSource: "local-tools/closer",
  },
  {
    formId: "event_index_subscription",
    closerServiceId: "recording",
    parserId: "generic_inquiry",
    label: "מנוי דופק השוק",
    defaultSource: "/pro/event-index",
    utmCampaigns: ["event_index_subscription"],
  },
  {
    formId: "consult_15min",
    closerServiceId: "recording",
    parserId: "consult_partial",
    label: "ייעוץ 15 דקות",
    defaultSource: "/book",
    utmCampaigns: ["booking_consult_15"],
  },
  ...BOOK_ROUTER_LEAD_SOURCES,
] as const;

const BY_FORM_ID = new Map(
  LEAD_SOURCE_REGISTRY.map((e) => [e.formId, e] as const),
);

const BY_UTM = new Map<string, LeadSourceEntry>();
for (const entry of LEAD_SOURCE_REGISTRY) {
  for (const campaign of entry.utmCampaigns ?? []) {
    BY_UTM.set(campaign, entry);
  }
}

export function resolveLeadSource(opts: {
  formId?: string | null;
  utmCampaign?: string | null;
  sourcePath?: string | null;
}): LeadSourceEntry | null {
  if (opts.formId) {
    const hit = BY_FORM_ID.get(opts.formId);
    if (hit) return hit;
  }
  if (opts.utmCampaign) {
    const hit = BY_UTM.get(opts.utmCampaign);
    if (hit) return hit;
  }
  if (opts.sourcePath) {
    const norm = opts.sourcePath.trim();
    const byPath = LEAD_SOURCE_REGISTRY.find(
      (e) => norm.includes(e.defaultSource) || norm === e.defaultSource,
    );
    if (byPath) return byPath;
  }
  return null;
}

export function closerServiceForContactQuiz(serviceKey: string): string {
  return CONTACT_SERVICE_TO_CLOSER[serviceKey] ?? "recording";
}
