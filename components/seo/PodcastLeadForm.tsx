"use client";

import CallbackLeadForm from "@/components/forms/CallbackLeadForm";

const PODCAST_SERVICE_OPTIONS = [
  "הקלטה בלבד באולפן",
  "הפקת פודקאסט אודיו מלאה",
  "פודקאסט וידאו / פרמיום",
  "פודקאסט משפחתי (סבא/סבתא, אירוע)",
  "ניקוי הקלטת זום / ביתית",
  "אולפן פודקאסט נייד (עד הבית)",
  "עדיין לא בטוח/ה",
] as const;

export default function PodcastLeadForm() {
  return (
    <CallbackLeadForm
      utmCampaign="podcast_lead_form"
      serviceOptions={PODCAST_SERVICE_OPTIONS}
      formLabel="טופס יצירת קשר לפודקאסט"
    />
  );
}
