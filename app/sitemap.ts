import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";
import { getAllBlogSlugs } from "@/lib/data/blog-slugs";

const url = (path: string) => `${SITE_URL}/${path}`;

const STATIC_ROUTES: MetadataRoute.Sitemap = [
  { url: SITE_URL, priority: 1.0, changeFrequency: "weekly" },

  // ── Podcast ────────────────────────────────────────────────────────────────
  { url: url("podcast"), priority: 0.9, changeFrequency: "monthly" },
  {
    url: url("podcast/podcast-studio-modiin"),
    priority: 0.9,
    changeFrequency: "monthly",
  },
  { url: url("podcast/podcast-editing"), priority: 0.8, changeFrequency: "monthly" },
  { url: url("podcast/podcast-production"), priority: 0.8, changeFrequency: "monthly" },
  {
    url: url("podcast/podcast-recording"),
    priority: 0.9,
    changeFrequency: "monthly",
  },
  {
    url: url("podcast/podcast-with-grandpa"),
    priority: 0.85,
    changeFrequency: "monthly",
  },
  { url: url("podcast/mobile-podcast-at-home"), priority: 0.8, changeFrequency: "monthly" },
  { url: url("podcast/faq"), priority: 0.6, changeFrequency: "monthly" },

  // ── Studio & Blessings ─────────────────────────────────────────────────────
  { url: url("studio"), priority: 0.9, changeFrequency: "monthly" },
  { url: url("portfolio"), priority: 0.85, changeFrequency: "monthly" },
  { url: url("studio/recording-studio"), priority: 0.9, changeFrequency: "monthly" },
  { url: url("studio/blessings"), priority: 0.8, changeFrequency: "monthly" },
  { url: url("studio/blessings/bar-mitzvah"), priority: 0.7, changeFrequency: "monthly" },
  {
    url: url("studio/blessings/bat-mitzvah-clip"),
    priority: 0.85,
    changeFrequency: "monthly",
  },
  { url: url("studio/blessings/bride-groom-blessing"), priority: 0.7, changeFrequency: "monthly" },
  { url: url("studio/blessings/video-clip"), priority: 0.7, changeFrequency: "monthly" },
  { url: url("studio/pricing"), priority: 0.7, changeFrequency: "monthly" },
  { url: url("studio/recording-song-modiin"), priority: 0.7, changeFrequency: "monthly" },
  {
    url: url("studio/recording-song-modiin/gifts"),
    priority: 0.8,
    changeFrequency: "monthly",
  },
  {
    url: url("studio/recording-song-modiin/gifts/funny-ringtone"),
    priority: 0.7,
    changeFrequency: "monthly",
  },
  { url: url("studio/studio-jerusalem"), priority: 0.7, changeFrequency: "monthly" },
  { url: url("studio/mobile-studio"), priority: 0.8, changeFrequency: "monthly" },

  // ── Voiceover ──────────────────────────────────────────────────────────────
  { url: url("voiceover"), priority: 0.9, changeFrequency: "monthly" },
  { url: url("voiceover/services"), priority: 0.8, changeFrequency: "monthly" },
  { url: url("voiceover/course"), priority: 0.7, changeFrequency: "monthly" },

  // ── Events & Attractions ───────────────────────────────────────────────────
  { url: url("events"), priority: 0.9, changeFrequency: "monthly" },
  { url: url("events/dj-events"), priority: 0.8, changeFrequency: "monthly" },
  {
    url: url("events/wedding-attractions-packages"),
    priority: 0.85,
    changeFrequency: "monthly",
  },
  { url: url("events/attractions"), priority: 0.8, changeFrequency: "monthly" },
  { url: url("events/attractions/bubble-machine"), priority: 0.7, changeFrequency: "monthly" },
  {
    url: url("events/attractions/bubble-machine/smoke-bubble-machine-events"),
    priority: 0.8,
    changeFrequency: "monthly",
  },
  { url: url("events/attractions/cold-fireworks"), priority: 0.7, changeFrequency: "monthly" },
  { url: url("events/attractions/confetti-cannon"), priority: 0.7, changeFrequency: "monthly" },
  { url: url("events/attractions/giant-balloons"), priority: 0.7, changeFrequency: "monthly" },
  { url: url("events/stage-led-dj"), priority: 0.8, changeFrequency: "monthly" },
  { url: url("events/attractions/smoke-cannons-for-events"), priority: 0.7, changeFrequency: "monthly" },
  { url: url("events/attractions/wedding-smoking-machine"), priority: 0.7, changeFrequency: "monthly" },
  {
    url: url(
      "events/attractions/wedding-smoking-machine/heavy-smoke-large-events",
    ),
    priority: 0.75,
    changeFrequency: "monthly",
  },
  { url: url("events/equipment"), priority: 0.7, changeFrequency: "monthly" },
  {
    url: url("events/equipment/singer-amplification"),
    priority: 0.75,
    changeFrequency: "monthly",
  },
  { url: url("events/host"), priority: 0.7, changeFrequency: "monthly" },
  { url: url("events/host/faq"), priority: 0.6, changeFrequency: "monthly" },
  { url: url("events/equipment/faq"), priority: 0.6, changeFrequency: "monthly" },

  // ── Video ──────────────────────────────────────────────────────────────────
  { url: url("video"), priority: 0.9, changeFrequency: "monthly" },
  { url: url("video/event-filming"), priority: 0.7, changeFrequency: "monthly" },
  { url: url("video/corporate-video"), priority: 0.7, changeFrequency: "monthly" },
  { url: url("video/presentation"), priority: 0.7, changeFrequency: "monthly" },
  { url: url("photo-slideshow"), priority: 0.85, changeFrequency: "monthly" },

  // ── Photography ────────────────────────────────────────────────────────────
  { url: url("photography"), priority: 0.9, changeFrequency: "monthly" },
  { url: url("photography/wedding"), priority: 0.7, changeFrequency: "monthly" },
  { url: url("photography/events"), priority: 0.7, changeFrequency: "monthly" },

  // ── Booking & vouchers ─────────────────────────────────────────────────────
  { url: url("book"), priority: 0.9, changeFrequency: "monthly" },
  { url: url("pricing"), priority: 0.85, changeFrequency: "monthly" },
  { url: url("voucher"), priority: 0.7, changeFrequency: "monthly" },

  // ── Online & courses ─────────────────────────────────────────────────────────
  { url: url("online"), priority: 0.8, changeFrequency: "monthly" },
  { url: url("online/audio-music"), priority: 0.72, changeFrequency: "monthly" },
  { url: url("online/podcast-voice"), priority: 0.72, changeFrequency: "monthly" },
  { url: url("online/video-content"), priority: 0.72, changeFrequency: "monthly" },
  { url: url("online/image-design"), priority: 0.72, changeFrequency: "monthly" },
  { url: url("online/vocal-fix"), priority: 0.75, changeFrequency: "monthly" },
  {
    url: url("online/vocal-fix/pitch-correction"),
    priority: 0.75,
    changeFrequency: "monthly",
  },
  {
    url: url("online/vocal-fix/photo-enhance"),
    priority: 0.75,
    changeFrequency: "monthly",
  },
  {
    url: url("online/vocal-fix/mixing"),
    priority: 0.75,
    changeFrequency: "monthly",
  },
  {
    url: url("online/vocal-fix/send-file"),
    priority: 0.5,
    changeFrequency: "yearly",
  },
  { url: url("online/online-ai-pricing"), priority: 0.7, changeFrequency: "monthly" },

  // ── Stuttering / clinic ──────────────────────────────────────────────────────
  { url: url("stuttering"), priority: 0.7, changeFrequency: "monthly" },
  { url: url("clinic"), priority: 0.7, changeFrequency: "monthly" },

  // ── Geo landing ────────────────────────────────────────────────────────────
  { url: url("dj-events/cities/jerusalem"), priority: 0.8, changeFrequency: "monthly" },

  // ── About / Contact ────────────────────────────────────────────────────────
  { url: url("about"), priority: 0.6, changeFrequency: "monthly" },
  { url: url("about/faq"), priority: 0.6, changeFrequency: "monthly" },
  { url: url("start"), priority: 0.7, changeFrequency: "monthly" },
  { url: url("contact"), priority: 0.6, changeFrequency: "monthly" },

  // ── Business / social media ──────────────────────────────────────────────────
  { url: url("business/social-media"), priority: 0.8, changeFrequency: "monthly" },
  {
    url: url("business/professional-voiceover"),
    priority: 0.75,
    changeFrequency: "monthly",
  },

  // ── Legal ──────────────────────────────────────────────────────────────────
  { url: url("privacy"), priority: 0.3, changeFrequency: "yearly" },
  { url: url("accessibility"), priority: 0.3, changeFrequency: "yearly" },
  { url: url("terms"), priority: 0.3, changeFrequency: "yearly" },

  // ── Academy ────────────────────────────────────────────────────────────────
  { url: url("academy"), priority: 0.9, changeFrequency: "monthly" },
  { url: url("academy/dj-course"), priority: 0.8, changeFrequency: "monthly" },
  { url: url("academy/music-production"), priority: 0.8, changeFrequency: "monthly" },
  { url: url("academy/ulpan"), priority: 0.75, changeFrequency: "monthly" },
  { url: url("academy/private-lessons"), priority: 0.8, changeFrequency: "monthly" },
  { url: url("academy/voiceover"), priority: 0.8, changeFrequency: "monthly" },
  { url: url("academy/stuttering-course"), priority: 0.8, changeFrequency: "monthly" },
  { url: url("academy/home-studio"), priority: 0.7, changeFrequency: "monthly" },
  { url: url("academy/ai-music"), priority: 0.75, changeFrequency: "monthly" },

  // ── Commerce ───────────────────────────────────────────────────────────────
  { url: url("shop"), priority: 0.7, changeFrequency: "monthly" },

  // ── Blog hub ───────────────────────────────────────────────────────────────
  { url: url("blog"), priority: 0.8, changeFrequency: "weekly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const blogRoutes: MetadataRoute.Sitemap = getAllBlogSlugs().map((slug) => ({
    url: url(`blog/${slug}`),
    priority: 0.7,
    changeFrequency: "monthly" as const,
  }));

  const deployDate = new Date();
  return [...STATIC_ROUTES, ...blogRoutes].map((entry) => ({
    ...entry,
    lastModified: entry.lastModified ?? deployDate,
  }));
}
