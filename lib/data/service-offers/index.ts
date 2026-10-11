import { AI_SONG_PAGE } from "@/lib/data/service-offers/ai-song";
import { CLASS_SONG_PAGE } from "@/lib/data/service-offers/class-song";
import { ENLISTMENT_PAGE } from "@/lib/data/service-offers/enlistment";
import { GROUP_SESSION_PAGE } from "@/lib/data/service-offers/group-session";
import { HOST_COACHING_PAGE } from "@/lib/data/service-offers/host-coaching";
import { LIVE_PODCAST_PAGE } from "@/lib/data/service-offers/live-podcast";
import { ORIGINAL_SONG_PAGE } from "@/lib/data/service-offers/original-song";
import { PARODY_PAGE } from "@/lib/data/service-offers/parody";
import { PODCAST_LAUNCH_PAGE } from "@/lib/data/service-offers/podcast-launch";
import { PROFESSIONAL_SINGER_PAGE } from "@/lib/data/service-offers/professional-singer";
import { RENEW_OLD_SONG_PAGE } from "@/lib/data/service-offers/renew-old-song";
import type { ServiceOfferPage } from "@/lib/data/service-offers/types";

/** כל עמודי השירותים החדשים (11.10.2026). הבדיקות עוברות על הרשימה הזו. */
export const SERVICE_OFFER_PAGES: readonly ServiceOfferPage[] = [
  PARODY_PAGE,
  ORIGINAL_SONG_PAGE,
  GROUP_SESSION_PAGE,
  AI_SONG_PAGE,
  PROFESSIONAL_SINGER_PAGE,
  CLASS_SONG_PAGE,
  ENLISTMENT_PAGE,
  LIVE_PODCAST_PAGE,
  PODCAST_LAUNCH_PAGE,
  HOST_COACHING_PAGE,
  RENEW_OLD_SONG_PAGE,
];
