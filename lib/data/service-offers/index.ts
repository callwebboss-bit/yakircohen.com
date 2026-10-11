import { CLASS_SONG_PAGE } from "@/lib/data/service-offers/class-song";
import { ENLISTMENT_PAGE } from "@/lib/data/service-offers/enlistment";
import { GROUP_SESSION_PAGE } from "@/lib/data/service-offers/group-session";
import { ORIGINAL_SONG_PAGE } from "@/lib/data/service-offers/original-song";
import { PODCAST_LAUNCH_PAGE } from "@/lib/data/service-offers/podcast-launch";
import type { ServiceOfferPage } from "@/lib/data/service-offers/types";

/** כל עמודי השירותים החדשים (11.10.2026). הבדיקות עוברות על הרשימה הזו. */
export const SERVICE_OFFER_PAGES: readonly ServiceOfferPage[] = [
  ORIGINAL_SONG_PAGE,
  GROUP_SESSION_PAGE,
  CLASS_SONG_PAGE,
  ENLISTMENT_PAGE,
  PODCAST_LAUNCH_PAGE,
];
