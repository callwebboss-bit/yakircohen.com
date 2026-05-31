"use client";

import AudioShowcase from "@/components/seo/AudioShowcase";

const BEFORE_SRC = "/audio/bride-blessing-raw.mp3";
const AFTER_SRC = "/audio/bride-blessing-tuned.mp3";

export default function BlessingsBrideGroomBeforeAfter() {
  return (
    <AudioShowcase
      variant="vocal"
      context="page"
      beforeSrc={BEFORE_SRC}
      afterSrc={AFTER_SRC}
    />
  );
}
