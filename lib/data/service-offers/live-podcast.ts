import { isServiceOfferPublished } from "@/lib/data/service-offers/status";
import type { ServiceOfferPage } from "@/lib/data/service-offers/types";

/**
 * פודקאסט חי מהבמה. הבעלים, 11.10.2026: כולל צילום וידאו, עד ארבעה אנשים על
 * הבמה, והתמחור הועבר אליי. המחירים: live_podcast_with_sound ו-
 * live_podcast_venue_sound, סכום רכיבים קיימים (ראו ההערה בקטלוג). מה כלול
 * בהגעה ובהגברה: mobile_podcast_at_home ו-event_sound_rental.
 */
export const LIVE_PODCAST_PAGE: ServiceOfferPage = {
  path: "/podcast/live-podcast",
  metaTitle: "פודקאסט חי מהבמה, לכנסים ולאירועי חברה",
  metaDescription:
    "פודקאסט שמוקלט מול קהל: מגיעים עם אולפן נייד, עד 4 משתתפים על הבמה, צילום וידאו, והגברה לקהל או חיבור להגברה של המקום.",
  keywords: ["פודקאסט חי", "פודקאסט מול קהל", "פודקאסט בכנס", "הקלטת פודקאסט באירוע", "פודקאסט לייב"],
  eyebrow: "פודקאסט חי",
  h1: "פודקאסט חי מהבמה",
  intro:
    "שיחה על הבמה, מול קהל, שמוקלטת ומצולמת כפרק פודקאסט. מגיעים עם כל הציוד, התאורה והצוות, לכנס, לאירוע חברה או לערב קהילה.",
  highlight: "עד 4 משתתפים על הבמה, וצילום וידאו כלול.",
  audience: {
    title: "למי זה מתאים",
    items: [
      "כנס מקצועי",
      "אירוע חברה",
      "ערב קהילה"
    ],
  },
  steps: [
    {
      title: "מתאמים",
      description: "מה האירוע, כמה על הבמה, והאם יש במקום הגברה.",
    },
    {
      title: "מגיעים ומקימים",
      description: "מגיעים עם האולפן הנייד, התאורה והמצלמות, ומקימים במקום.",
    },
    {
      title: "מקליטים מול קהל",
      description: "עד 4 מיקרופונים על הבמה. הקהל שומע דרך ההגברה שלנו או של המקום.",
    },
    {
      title: "הפרק אצלכם",
      description: "השיחה מוקלטת ומצולמת, ומוסרים לכם אותה כפרק.",
    },
  ],
  includesTitle: "מה כלול",
  includes: [
    "הגעה עם כל הציוד, התאורה והצוות",
    "עד 4 מיקרופונים על הבמה",
    "צילום וידאו",
    "הגברה לקהל עד 250 איש, או חיבור להגברה של המקום",
  ],
  priceTitle: "כמה עולה פודקאסט חי",
  prices: [
    { id: "live_podcast_with_sound", label: "עם ההגברה שלנו", note: "כולל הגברה לקהל עד 250 איש", from: true },
    { id: "live_podcast_venue_sound", label: "עם ההגברה של המקום", note: "כשיש במקום הגברה, מתחברים אליה", from: true },
  ],
  priceNote: "מחוץ למרכז יש תוספת נסיעה, כמו באולפן הנייד.",
  alternatives: {
    title: "פודקאסט חי, או משהו אחר?",
    items: [
      {
        "href": "/podcast/mobile-podcast-at-home",
        "label": "אולפן פודקאסט נייד",
        "body": "מקליטים בלי קהל, בבית או במשרד."
      },
      {
        "href": "/podcast/corporate-podcast",
        "label": "פודקאסט ארגוני",
        "body": "רוצים סדרת פרקים לחברה, ולא אירוע אחד."
      },
      {
        "href": "/business/on-site-studio",
        "label": "אולפן זמני בחברה",
        "body": "רוצים אולפן שנשאר אצלכם לתקופה."
      },
      {
        "href": "/events/equipment",
        "label": "הגברה לאירועים",
        "body": "צריכים רק הגברה, בלי הקלטה."
      }
    ],
  },
  faqs: [
    {
      id: "live-how-many",
      question: "כמה אנשים יכולים להיות על הבמה?",
      answer: "עד 4.",
    },
    {
      id: "live-video",
      question: "הצילום כלול?",
      answer: "כן. צילום וידאו כלול בשני המסלולים.",
    },
    {
      id: "live-venue-sound",
      question: "מה ההבדל בין שני המחירים?",
      answer:
        "ההגברה לקהל. אם במקום כבר יש הגברה, מתחברים אליה והמחיר נמוך יותר. אם אין, מביאים את ההגברה שלנו, לקהל של עד 250 איש.",
    },
  ],
  whatsapp: {
    packageLabel: "פודקאסט חי מהבמה",
    priceId: "live_podcast_with_sound",
    utmCampaign: "live_podcast",
  },
  related: [
    { href: "/podcast/mobile-podcast-at-home", label: "אולפן פודקאסט נייד" },
    { href: "/podcast/corporate-podcast", label: "פודקאסט ארגוני" },
    { href: "/events/equipment", label: "הגברה לאירועים" },
  ],
  draft: !isServiceOfferPublished("/podcast/live-podcast"),
};
