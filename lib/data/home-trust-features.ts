import type { ComponentType } from "react";
import {
  ClockIcon,
  ShieldCheckIcon,
  UsersIcon,
  ZapIcon,
} from "@/components/ui/Icons";

export type HomeTrustFeatureIcon = "equipment" | "response" | "support" | "editing";

export type HomeTrustFeature = {
  id: HomeTrustFeatureIcon;
  title: string;
  description: string;
  href: string;
};

const ICON_MAP: Record<
  HomeTrustFeatureIcon,
  ComponentType<{ size?: number; className?: string }>
> = {
  equipment: ShieldCheckIcon,
  response: ClockIcon,
  support: UsersIcon,
  editing: ZapIcon,
};

export const HOME_TRUST_FEATURES: readonly HomeTrustFeature[] = [
  {
    id: "equipment",
    title: "ציוד קצה",
    description: "מיקרופונים וממירים ברמת אולפן מקצועי",
    href: "/studio",
  },
  {
    id: "response",
    title: "מענה מהיר",
    description: "הצעת מחיר ראשונית בתוך שעות, לא ימים",
    href: "/book",
  },
  {
    id: "support",
    title: "ליווי אישי",
    description: "מהרעיון ועד קובץ מוכן לפרסום",
    href: "/studio/recording-song-modiin",
  },
  {
    id: "editing",
    title: "עריכה מקצועית",
    description: "ניקוי רעשים, מיקס ומסירה בפורמט מוכן",
    href: "/podcast/podcast-editing",
  },
] as const;

export function getHomeTrustFeatureIcon(id: HomeTrustFeatureIcon) {
  return ICON_MAP[id];
}
