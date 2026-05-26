export const FILTER_QUESTIONS = [
  {
    id: "timeline" as const,
    text: "מתי תרצו לצאת לדרך?",
    options: [
      { id: "this_week" as const, label: "השבוע", icon: "⚡" },
      { id: "this_month" as const, label: "במהלך החודש", icon: "📆" },
      { id: "just_browsing" as const, label: "רק בודקים אפשרויות", icon: "🔭" },
    ],
  },
  {
    id: "purpose" as const,
    text: "מה מטרת הפרויקט?",
    options: [
      { id: "professional" as const, label: "תוכן מקצועי", icon: "🎤" },
      { id: "personal" as const, label: "פרויקט אישי", icon: "🎵" },
      { id: "gift" as const, label: "מתנה לאירוע", icon: "🎁" },
    ],
  },
] as const;

export type TimelineId = (typeof FILTER_QUESTIONS)[0]["options"][number]["id"];
export type PurposeId = (typeof FILTER_QUESTIONS)[1]["options"][number]["id"];

export type FilterAnswers = {
  timeline: TimelineId;
  purpose: PurposeId;
};

export const FILTER_STORAGE_KEY = "yc_filter_answers";
