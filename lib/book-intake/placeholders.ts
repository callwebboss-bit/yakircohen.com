import type { ServiceTypeTag } from "@/lib/book-intake/presets";

const PLACEHOLDERS: Record<ServiceTypeTag, string> = {
  MIX_AND_MASTER:
    "למשל: ערוץ שירה בודד + פלייבק, צריך פלאגין תיקון וניקוי נשימות...",
  PODCAST_VOICE_CLEANUP:
    "למשל: הקלטה של שני משתתפים, אורך צפוי 45 דקות, נדרש פתיח וסגיר...",
  VIDEO_AI_EDIT:
    "למשל: עריכת וידאו קצר לרשתות יחד עם מאסטרינג לאודיו...",
  NEED_RECOMMENDATION:
    "למשל: שילוב עריכת וידאו קצרה לרשתות יחד עם מאסטרינג לאודיו...",
};

const ROUTE_PLACEHOLDERS: Record<string, string> = {
  "online-restore":
    "למשל: הקלטת זום עם רעשי רקע — צריך ניקוי ואיזון לפני פרסום...",
  "podcast-content":
    "למשל: פודקאסט שני מנחים, 40 דקות, צריך עריכה ופתיח...",
  "family-gifts":
    "למשל: שיר ברכה לאירוע משפחתי, הקלטה באולפן + עריכה בסיסית...",
};

export function resolveIntakePlaceholder(
  serviceTypeTag: ServiceTypeTag | null,
  routeId?: string | null,
): string {
  if (routeId && ROUTE_PLACEHOLDERS[routeId]) {
    return ROUTE_PLACEHOLDERS[routeId];
  }
  if (serviceTypeTag) {
    return PLACEHOLDERS[serviceTypeTag];
  }
  return "למשל: תארו בקצרה מה הבעיה, איזה קבצים יש, ומה התוצאה שאתם צריכים...";
}

export const INTAKE_ROUTE_HINT_KEY = "yakir_intake_route_hint";

export function saveIntakeRouteHint(routeId: string): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(INTAKE_ROUTE_HINT_KEY, routeId);
  } catch {
    /* private mode */
  }
}

export function readIntakeRouteHint(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return sessionStorage.getItem(INTAKE_ROUTE_HINT_KEY);
  } catch {
    return null;
  }
}
