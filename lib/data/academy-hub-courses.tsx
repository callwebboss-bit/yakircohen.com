import type { ReactNode } from "react";
import type { HubLinkItem } from "@/components/services/ServiceHubLinks";

export type AcademyCourseCategory =
  | "music-production"
  | "voice-speech"
  | "academic"
  | "workshops";

export type AcademyHubCourse = {
  id: string;
  href: string;
  title: string;
  description: string;
  icon: string;
  fromPrice?: string;
  category: AcademyCourseCategory;
};

export const ACADEMY_HUB_COURSES: readonly AcademyHubCourse[] = [
  {
    id: "dj-course",
    href: "/academy/dj-course",
    title: "קורס DJ מקצועי",
    description: "מהנגיעה הראשונה בקונטרולר ועד סט שלם מול קהל",
    icon: "🎛️",
    category: "music-production",
  },
  {
    id: "dj-ai",
    href: "/academy/dj-course",
    title: "קורס DJ + AI",
    description: "רמיקסים, ביטים ושליטה בציוד - מהתחביב לעמדה מקצועית",
    icon: "🤖",
    category: "music-production",
  },
  {
    id: "music-production",
    href: "/academy/music-production",
    title: "יצירה מוזיקלית",
    description: "עריכה ב-DAW, הפקה, מיקס ומאסטרינג מאפס",
    icon: "🎚️",
    category: "music-production",
  },
  {
    id: "ai-music",
    href: "/academy/ai-music",
    title: "AI מוזיקה",
    description: "יצירה, עריכה והפקה עם כלי AI באולפן",
    icon: "🎼",
    category: "music-production",
  },
  {
    id: "voiceover",
    href: "/academy/voiceover",
    title: "קורס קריינות",
    description: "נשימה, דיקציה, אינטונציה ועבודה מול מיקרופון",
    icon: "🎙️",
    category: "voice-speech",
  },
  {
    id: "stuttering",
    href: "/academy/stuttering-course",
    title: "קורס גמגום",
    description: "שיטת NeverMind לדיבור חופשי וביטחון עצמי",
    icon: "🧠",
    category: "voice-speech",
  },
  {
    id: "private-lessons",
    href: "/academy/private-lessons",
    title: "שיעור פרטי",
    description: "שעה ב-990 ₪ או Pro Session 90 דק׳ ב-1,280 ₪ - DJ, קול, הפקה ועוד",
    icon: "🎵",
    fromPrice: "החל מ-990 ₪ + מע״מ",
    category: "academic",
  },
  {
    id: "home-studio",
    href: "/academy/home-studio",
    title: "ייעוץ אקוסטיקה ובניית אולפן",
    description: "אולפן ביתי, פודקאסט, משדר - תכנון אקוסטי וליווי",
    icon: "🏠",
    category: "academic",
  },
  {
    id: "ulpan",
    href: "/academy/ulpan",
    title: "שיעור פרטי עברית",
    description: "שיעור פרטי במודיעין - פרונטלי או בזום",
    icon: "📖",
    category: "academic",
  },
  {
    id: "hebrew-lessons",
    href: "/academy/hebrew-lessons",
    title: "Hebrew Lessons (English)",
    description: "Private Hebrew lessons for Olim, expats & Hi-Tech - in-person or Zoom",
    icon: "🇬🇧",
    category: "academic",
  },
  {
    id: "workshops",
    href: "/academy/workshops",
    title: "סדנאות לצוותים",
    description: "טיקטוק, רילז ודיבור מול מצלמה. באולפן או בחברה",
    icon: "🎤",
    category: "workshops",
  },
] as const;

export const ACADEMY_CATEGORY_META: Record<
  AcademyCourseCategory,
  { heading: string; subheading: string }
> = {
  "music-production": {
    heading: "מוזיקה והפקה",
    subheading: "DJ, הפקה מוזיקלית, יצירה עם AI - מאפס לתוצר גמור.",
  },
  "voice-speech": {
    heading: "קול ודיבור",
    subheading: "קריינות, שבירת חסמי דיבור ופרוטוקול NeverMind.",
  },
  academic: {
    heading: "לימודים אישיים",
    subheading: "שיעורים פרטיים, ייעוץ אקוסטיקה ולימוד עברית.",
  },
  workshops: {
    heading: "סדנאות והעשרה",
    subheading: "סדנאות לצוותים, מעבדת סאונד הורה-ילד וגיבוש.",
  },
};

const CATEGORY_ORDER: AcademyCourseCategory[] = [
  "music-production",
  "voice-speech",
  "academic",
  "workshops",
];

function courseIcon(emoji: string): ReactNode {
  return (
    <span className="text-2xl" aria-hidden>
      {emoji}
    </span>
  );
}

function courseToHubItem(course: AcademyHubCourse): HubLinkItem {
  return {
    href: course.href,
    title: course.title,
    description: course.description,
    icon: courseIcon(course.icon),
    fromPrice: course.fromPrice,
  };
}

export function academyCoursesToHubItems(): HubLinkItem[] {
  return ACADEMY_HUB_COURSES.map(courseToHubItem);
}

export function academyCoursesByCategory(): {
  category: AcademyCourseCategory;
  heading: string;
  subheading: string;
  items: HubLinkItem[];
}[] {
  return CATEGORY_ORDER.map((cat) => ({
    category: cat,
    ...ACADEMY_CATEGORY_META[cat],
    items: ACADEMY_HUB_COURSES.filter((c) => c.category === cat).map(
      courseToHubItem,
    ),
  }));
}
