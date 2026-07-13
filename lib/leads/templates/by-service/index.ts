import type { LeadRecord, ServiceType } from "@/lib/leads/types";
import { studioAdminExtras } from "@/lib/leads/templates/by-service/studio";
import { eventsAdminExtras } from "@/lib/leads/templates/by-service/events";
import { businessAdminExtras } from "@/lib/leads/templates/by-service/business";
import { podcastAdminExtras } from "@/lib/leads/templates/by-service/podcast";
import { photographyAdminExtras } from "@/lib/leads/templates/by-service/photography";

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function serviceExtras(lead: LeadRecord): string[] {
  switch (lead.serviceType) {
    case "studio":
      return studioAdminExtras(lead);
    case "events":
    case "dj":
      return eventsAdminExtras(lead);
    case "business":
      return businessAdminExtras(lead);
    case "podcast":
      return podcastAdminExtras(lead);
    case "photography":
      return photographyAdminExtras(lead);
    default:
      return [];
  }
}

export function buildServiceAdminBodyHtml(lead: LeadRecord): string {
  const headline = serviceHeadline(lead.serviceType);
  const extras = serviceExtras(lead);
  const extrasHtml = extras.length
    ? `<ul style="margin:8px 0;padding-inline-start:18px;">${extras
        .map((e) => `<li>${esc(e)}</li>`)
        .join("")}</ul>`
    : "";

  return `
<div style="font-family:Arial,Helvetica,sans-serif;direction:rtl;text-align:right;color:#111;font-size:14px;line-height:1.5;">
  <h2 style="margin:0 0 8px;font-size:18px;">${esc(headline)}</h2>
  ${extrasHtml}
  <p style="white-space:pre-wrap;margin:0;">${esc(lead.body)}</p>
</div>`.trim();
}

function serviceHeadline(service: ServiceType): string {
  switch (service) {
    case "events":
    case "dj":
      return "ליד אירועים / חתונה";
    case "business":
      return "ליד עסקי / קורפורייט";
    case "studio":
      return "ליד אולפן";
    case "podcast":
      return "ליד פודקאסט";
    case "photography":
      return "ליד צילום";
    case "online":
      return "ליד אונליין / שחזור";
    default:
      return "ליד מהאתר";
  }
}
