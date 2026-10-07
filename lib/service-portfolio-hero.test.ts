import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import {
  EVENTS_SERVICES,
  PHOTOGRAPHY_SERVICES,
  STUDIO_SERVICES,
  VIDEO_SERVICES,
  VOICEOVER_SERVICES,
  type ServiceEntity,
} from "./data/services";
import { resolveOgForCategory } from "./seo/og-images";
import {
  isRawCameraFilename,
  OG_IMAGE_BRAND_EXCLUSIONS,
  resolveServiceOgImage,
} from "./service-portfolio-hero";

/* בדיקת הלוגו 7.10.2026: עמודי שירות שיתפו צילום עם מותג של גוף אחר
   (JAMES RICHARDSON, JR/DUTY FREE, 102FM, ALMOG COHEN) או alt משם קובץ של מצלמה. */

const ALL_SERVICES: ServiceEntity[] = [
  STUDIO_SERVICES,
  VOICEOVER_SERVICES,
  EVENTS_SERVICES,
  VIDEO_SERVICES,
  PHOTOGRAPHY_SERVICES,
].flatMap((registry) => Object.values(registry as Record<string, ServiceEntity>));

const EXCLUDED_SRC = new Set(
  OG_IMAGE_BRAND_EXCLUSIONS.map((relative) => `/images/services/${relative}`.normalize("NFC")),
);

function serviceBySlug(slug: string): ServiceEntity {
  const service = ALL_SERVICES.find((entry) => entry.slug === slug);
  assert.ok(service, `missing service ${slug}`);
  return service;
}

describe("service share image (og:image)", () => {
  it("every path in the brand exclusion list still exists on disk", () => {
    const missing = OG_IMAGE_BRAND_EXCLUSIONS.filter(
      (relative) => !existsSync(path.join(process.cwd(), "public", "images", "services", relative)),
    );
    assert.deepEqual(missing, [], "a file was renamed or moved, update OG_IMAGE_BRAND_EXCLUSIONS");
  });

  it("no service page shares a photo from the exclusion list", () => {
    const offenders = ALL_SERVICES.filter((service) =>
      EXCLUDED_SRC.has(resolveServiceOgImage(service).path.normalize("NFC")),
    ).map((service) => service.slug);
    assert.deepEqual(offenders, []);
  });

  it("the events hub falls back to the category card when its folder has no good file", () => {
    const og = resolveServiceOgImage(serviceBySlug("events"));
    assert.equal(og.path, resolveOgForCategory("events").path);
  });

  it("the pages that shared the terminal and ALMOG COHEN photos now share something else", () => {
    for (const slug of [
      "events/stage-led-dj",
      "events/host",
      "events/equipment",
      "events/wedding-attractions-packages",
      "events/attractions/confetti-cannon",
    ]) {
      const og = resolveServiceOgImage(serviceBySlug(slug));
      assert.doesNotMatch(og.path, /102\s?FM|חבילת סלואו/i, slug);
    }
  });

  it("no share alt is a raw camera file name", () => {
    const rawLooking = /\d{4,}|burst|scaled|(?:^|\s)img|leom/i;
    const bad = ALL_SERVICES.map((service) => ({
      slug: service.slug,
      alt: resolveServiceOgImage(service).alt,
    })).filter(({ alt }) => rawLooking.test(alt) || !/[א-ת]/.test(alt));
    assert.deepEqual(bad, []);
  });

  it("a raw camera file keeps its photo but takes the page title as alt", () => {
    const service = serviceBySlug("studio/recording-song-modiin");
    const og = resolveServiceOgImage(service);
    assert.match(og.path, /COVER-scaled\.webp$/);
    assert.equal(og.alt, service.title);
  });
});

describe("isRawCameraFilename", () => {
  it("flags camera and phone names", () => {
    for (const name of [
      "00000IMG_00000_BURST20200701191123548_COVER-scaled.webp",
      "LEOM9008.webp",
      "IMG-20200706-WA0025.webp",
      "400120200453_289382.webp",
      "dj-400120200453_289382.webp",
    ]) {
      assert.equal(isRawCameraFilename(name), true, name);
    }
  });

  it("keeps names that someone wrote", () => {
    for (const name of [
      "אירוע חברה עם מיתוג.webp",
      "חנן-בן-ארי-קונפטי-scaled.webp",
      "עמדת-לד-השכרות-1024x576.webp",
      "Colorful Confetti Shower (1).webp",
      "Video Shoot.webp",
    ]) {
      assert.equal(isRawCameraFilename(name), false, name);
    }
  });
});

describe("share image format", () => {
  it("category hubs, portrait and narrow photos share the category card", () => {
    for (const service of ALL_SERVICES) {
      const og = resolveServiceOgImage(service);
      const categoryOg = resolveOgForCategory(service.category);
      if (service.slug === service.category) {
        assert.equal(og.path, categoryOg.path, `${service.slug} is a hub`);
        continue;
      }
      assert.ok(og.width >= 1200 && og.width >= og.height, `${service.slug} shares ${og.path} at ${og.width}x${og.height}`);
    }
  });
});
