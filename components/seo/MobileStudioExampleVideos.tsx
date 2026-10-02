"use client";

import YouTube from "@/components/YouTube";
import type { MobileStudioExampleVideo } from "@/lib/data/mobile-studio-page";
import { YOUTUBE_CHANNEL_URL } from "@/lib/data/youtube-embeds";

export type MobileStudioExampleVideosProps = {
  videos: readonly MobileStudioExampleVideo[];
};

export default function MobileStudioExampleVideos({
  videos,
}: MobileStudioExampleVideosProps) {
  // סרטון בלי מזהה לא מוצג. קודם רונדר במקומו בלוק "סרטון בקרוב",
  // והוא הוסר ב-2.10.2026: לא מבטיחים מדיה שאין.
  const withIds = videos.filter((v) => v.videoId?.trim());

  if (withIds.length === 0) return null;

  return (
    <div className="mt-8 space-y-8">
      {withIds.length > 0 ? (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {withIds.map((video) => (
            <li key={video.videoId} className="flex flex-col">
              <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-neutral-200">
                <YouTube
                  videoId={video.videoId!}
                  title={video.title}
                  fillParent
                />
              </div>
              <p className="mt-3 text-sm font-medium text-foreground">
                {video.title}
              </p>
            </li>
          ))}
        </ul>
      ) : null}

    </div>
  );
}
