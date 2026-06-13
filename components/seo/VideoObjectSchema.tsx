"use client";

import {
  buildFaqPageSchema,
  buildVideoObjectGraph,
  type VideoSchemaInput,
} from "@/lib/video-schema";
import { safeJsonLdStringify } from "@/lib/safe-json-ld";

type VideoObjectSchemaProps = {
  videos?: readonly VideoSchemaInput[];
  faqItems?: readonly { question: string; answer: string }[];
};

export default function VideoObjectSchema({
  videos = [],
  faqItems,
}: VideoObjectSchemaProps) {
  const videoGraph = buildVideoObjectGraph(videos);
  const faqGraph = faqItems?.length ? buildFaqPageSchema(faqItems) : null;

  return (
    <>
      {videoGraph ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(videoGraph) }}
        />
      ) : null}
      {faqGraph ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(faqGraph) }}
        />
      ) : null}
    </>
  );
}
