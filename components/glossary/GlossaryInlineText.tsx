"use client";

import type { ReactNode } from "react";
import GlossaryTermTooltip from "@/components/glossary/GlossaryTermTooltip";
/* היטלים קלים במקום lib/data/glossary.ts (62KB). זהו רכיב לקוח שמרונדר
   בכל FAQ ובכל אקורדיון, ולכן כל ייבוא כאן נשלח לדפדפן. */
import {
  GLOSSARY_DEFINITIONS,
  GLOSSARY_TOOLTIP_PHRASE_LIST,
} from "@/lib/data/glossary-tooltips.generated";
import { KEYWORD_LINK_MAP } from "@/lib/internal-links/keyword-map";

const ELIGIBLE_GLOSSARY_PHRASES = GLOSSARY_TOOLTIP_PHRASE_LIST.filter(
  ({ phrase }) => {
    const existing = KEYWORD_LINK_MAP[phrase];
    return !existing || existing.href.startsWith("/glossary");
  },
);

const GLOSSARY_MATCH_RE = new RegExp(
  `(^|[^\\p{L}\\p{N}])(${ELIGIBLE_GLOSSARY_PHRASES.map(({ phrase }) =>
    escapeRegex(phrase),
  ).join("|")})(?=$|[^\\p{L}\\p{N}])`,
  "gu",
);

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default function GlossaryInlineText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(GLOSSARY_MATCH_RE)) {
    const prefix = match[1] ?? "";
    const phrase = match[2];
    const fullMatch = match[0];
    const matchIndex = match.index ?? 0;
    const phraseStart = matchIndex + prefix.length;
    const phraseEnd = phraseStart + phrase.length;
    const termSlug = ELIGIBLE_GLOSSARY_PHRASES.find(
      (item) => item.phrase === phrase,
    )?.slug;
    const definition = termSlug ? GLOSSARY_DEFINITIONS[termSlug] : undefined;

    if (!termSlug || !definition) continue;

    if (matchIndex > lastIndex) {
      nodes.push(text.slice(lastIndex, matchIndex));
    }
    if (prefix) {
      nodes.push(prefix);
    }
    nodes.push(
      <GlossaryTermTooltip
        key={`${termSlug}-${phraseStart}`}
        slug={termSlug}
        href={`/glossary/${termSlug}`}
        definition={definition}
        className={className}
      >
        {phrase}
      </GlossaryTermTooltip>,
    );
    lastIndex = phraseEnd;

    if (fullMatch.length === 0) {
      break;
    }
  }

  if (nodes.length === 0) {
    return text;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return <>{nodes}</>;
}

export function GlossaryTerm({
  slug,
  children,
}: {
  slug: string;
  children: string;
}) {
  const definition = GLOSSARY_DEFINITIONS[slug];
  if (!definition) {
    return children;
  }

  return (
    <GlossaryTermTooltip
      slug={slug}
      href={`/glossary/${slug}`}
      definition={definition}
    >
      {children}
    </GlossaryTermTooltip>
  );
}
