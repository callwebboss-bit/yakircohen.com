import type { BlogNurtureConfig, BlogNurtureServiceLink } from "@/lib/data/blog-nurture";
import { getRelatedServiceCallout } from "@/lib/data/blog";

type ClusterId =
  | "studio"
  | "podcast"
  | "events"
  | "online"
  | "business"
  | "voiceover"
  | "academy"
  | "photography"
  | "video"
  | "clinic"
  | "default";

function clusterFromSlug(relatedServiceSlug: string): ClusterId {
  const s = relatedServiceSlug.replace(/^\/+/, "");
  if (s.startsWith("studio") || s === "studio") return "studio";
  if (s.startsWith("podcast")) return "podcast";
  if (s.startsWith("events") || s === "events") return "events";
  if (s.startsWith("online")) return "online";
  if (s.startsWith("business")) return "business";
  if (s.startsWith("voiceover")) return "voiceover";
  if (s.startsWith("academy")) return "academy";
  if (s.startsWith("photography")) return "photography";
  if (s.startsWith("video")) return "video";
  if (s === "clinic" || s.includes("stuttering")) return "clinic";
  return "default";
}

const CLUSTER_DEFAULTS: Record<
  ClusterId,
  { audience: readonly string[]; extraLinks: readonly BlogNurtureServiceLink[] }
> = {
  studio: {
    audience: [
      "מי שרוצה הקלטה באולפן במודיעין - שיר, ברכה או קריינות",
      "מי שמשווה בין אולפן לאולפן נייד או עריכה מרחוק",
      "משפחות ויוצרים שמגיעים בפעם הראשונה",
    ],
    extraLinks: [
      { href: "/studio", label: "אולפן הקלטות במודיעין" },
      { href: "/studio/recording-song-modiin", label: "הקלטת שיר באולפן" },
      { href: "/studio/blessings", label: "הקלטת ברכות" },
    ],
  },
  podcast: {
    audience: [
      "מי שמתחיל או מפיק פודקאסט ורוצה תהליך מסודר",
      "עסקים שרוצים פודקאסט מותג בלי לנהל הכל לבד",
      "מי שמשווה בין הקלטה בבית להפקה באולפן",
    ],
    extraLinks: [
      { href: "/podcast", label: "מרכז פודקאסט" },
      { href: "/podcast/podcast-recording", label: "הקלטת פודקאסט" },
      { href: "/podcast/podcast-editing", label: "עריכת פודקאסט" },
    ],
  },
  events: {
    audience: [
      "זוגות ומפיקים שבוחרים DJ או אטרקציות לאירוע",
      "מי שרוצה מחיר ומפרט ברורים לפני הזמנה",
      "מי שמשלב שיר לחופה או ברכה עם ההפקה",
    ],
    extraLinks: [
      { href: "/events/dj-events", label: "DJ לאירועים" },
      { href: "/events/attractions", label: "אטרקציות" },
      { href: "/events/wedding-attractions-packages", label: "חבילות לחתונה" },
    ],
  },
  online: {
    audience: [
      "מי שיש לו קובץ קיים ורוצה שיפור סאונד מרחוק",
      "מי שמקליט בבית וצריך תיקון זיופים או מיקס",
      "מי שרוצה תוצאה בלי להגיע לאולפן",
    ],
    extraLinks: [
      { href: "/online", label: "שחזור סאונד AI" },
      { href: "/online/vocal-fix/pitch-correction", label: "תיקון זיופים" },
      { href: "/online/vocal-fix/mixing", label: "מיקס ומאסטרינג" },
    ],
  },
  business: {
    audience: [
      "עסקים שצריכים תוכן, פודקאסט או הקלטה עם חשבונית",
      "שיווק ו-HR שמפיקים במשרד או באולפן",
      "סוכנויות שמחפשות שותף הפקה",
    ],
    extraLinks: [
      { href: "/business", label: "מרכז לעסקים" },
      { href: "/business/on-site-studio", label: "אולפן זמני בחברה" },
      { href: "/business/content-studio", label: "אולפן תוכן" },
    ],
  },
  voiceover: {
    audience: [
      "עסקים שצריכים קריינות לפרסומת, IVR או סרטון",
      "מי שמחפש קול אנושי ולא רובוטי",
      "מי שרוצה הפקה מלאה עם חשבונית",
    ],
    extraLinks: [
      { href: "/voiceover", label: "קריינות" },
      { href: "/voiceover/services", label: "שירותי קריינות" },
      { href: "/business/professional-voiceover", label: "קריינות לעסקים" },
    ],
  },
  academy: {
    audience: [
      "מי שרוצה ללמוד DJ, הפקה או קול עם ליווי",
      "מי שמעדיף שיעור פרטי באולפן ולא קורס המוני",
      "מי שמתלבט בין שירות ללימוד",
    ],
    extraLinks: [
      { href: "/academy", label: "אקדמיה" },
      { href: "/academy/dj-course", label: "קורס DJ" },
      { href: "/academy/ai-music", label: "AI + מוזיקה" },
    ],
  },
  photography: {
    audience: [
      "זוגות ומפיקים שצריכים צילום לאירוע",
      "מי שרוצה תיעוד שמחזיק שנים",
      "מי שמשלב צילום עם סאונד או DJ",
    ],
    extraLinks: [
      { href: "/photography/wedding", label: "צילום חתונות" },
      { href: "/photography/events", label: "צילום אירועים" },
      { href: "/events/dj-events", label: "DJ לאירועים" },
    ],
  },
  video: {
    audience: [
      "מי שצריך צילום וידאו לאירוע או לעסק",
      "מי שרוצה רילז או סרטון תדמית",
      "מי שמשלב וידאו עם הקלטה באולפן",
    ],
    extraLinks: [
      { href: "/video", label: "הפקת וידאו" },
      { href: "/video/event-filming", label: "צילום אירועים" },
      { href: "/video/corporate-video", label: "סרט תדמית" },
    ],
  },
  clinic: {
    audience: [
      "מי שמחפש ליווי לגמגום בגישה לוגית",
      "מי שרוצה פגישת חקירה לפני התחייבות ארוכה",
      "מי שמעדיף פנים מול פנים או מרחוק",
    ],
    extraLinks: [
      { href: "/clinic", label: "קליניקה" },
      { href: "/academy/stuttering-course", label: "קורס גמגום" },
      { href: "/stuttering", label: "מידע על גמגום" },
    ],
  },
  default: {
    audience: [
      "מי שמחפש שירותי סאונד, אולפן או אירועים במודיעין והמרכז",
      "מי שרוצה תיאום ברור ומחיר שקוף",
      "מי שמעדיף ליווי אנושי ולא תהליך אוטומטי בלבד",
    ],
    extraLinks: [
      { href: "/studio", label: "אולפן" },
      { href: "/events", label: "אירועים" },
      { href: "/podcast", label: "פודקאסט" },
    ],
  },
};

/** Fallback nurture לפי relatedServiceSlug - כשאין override ידני לפוסט */
export function buildClusterNurture(
  relatedServiceSlug: string,
): BlogNurtureConfig {
  const cluster = clusterFromSlug(relatedServiceSlug);
  const defaults = CLUSTER_DEFAULTS[cluster];
  const callout = getRelatedServiceCallout(relatedServiceSlug);
  const primary: BlogNurtureServiceLink | null = callout
    ? { href: callout.href, label: callout.title }
    : null;

  const serviceLinks: BlogNurtureServiceLink[] = [];
  if (primary) serviceLinks.push(primary);
  for (const link of defaults.extraLinks) {
    if (!serviceLinks.some((l) => l.href === link.href)) {
      serviceLinks.push(link);
    }
  }

  return {
    audience: defaults.audience,
    serviceLinks: serviceLinks.slice(0, 3),
    ctaHeading: callout?.title,
    ctaBody: callout?.subtitle,
  };
}
