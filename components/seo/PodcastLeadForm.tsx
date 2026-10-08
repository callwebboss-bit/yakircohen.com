"use client";

import CallbackLeadForm from "@/components/forms/CallbackLeadForm";
import {
  CALLBACK_PODCAST_CONTEXT,
  CALLBACK_PODCAST_SERVICE_OPTIONS,
} from "@/lib/leads/callback-lead";

export default function PodcastLeadForm() {
  return (
    <CallbackLeadForm
      utmCampaign="podcast_lead_form"
      serviceOptions={CALLBACK_PODCAST_SERVICE_OPTIONS}
      serviceContext={CALLBACK_PODCAST_CONTEXT}
      formLabel="טופס יצירת קשר לפודקאסט"
    />
  );
}
