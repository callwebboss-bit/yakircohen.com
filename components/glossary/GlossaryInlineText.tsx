"use client";

import type { ReactNode } from "react";
import GlossaryTermTooltip from "@/components/glossary/GlossaryTermTooltip";
import {
  GLOSSARY_TOOLTIP_PHRASES,
  getGlossaryTermBySlug,
} from "@/lib/data/glossary";
import { KEYWORD_LINK_MAP } from "@/lib/internal-links/keyword-map";

const ELIGIBLE_GLOSSARY_PHRASES = GLOSSARY_TOOLTIP_PHRASES.filter(
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
    const term = termSlug ? getGlossaryTermBySlug(termSlug) : undefined;

    if (!term) continue;

    if (matchIndex > lastIndex) {
      nodes.push(text.slice(lastIndex, matchIndex));
    }
    if (prefix) {
      nodes.push(prefix);
    }
    nodes.push(
      <GlossaryTermTooltip
        key={`${term.slug}-${phraseStart}`}
        slug={term.slug}
        href={`/glossary/${term.slug}`}
        definition={term.definition}
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
  const term = getGlossaryTermBySlug(slug);
  if (!term) {
    return children;
  }

  return (
    <GlossaryTermTooltip
      slug={slug}
      href={`/glossary/${slug}`}
      definition={term.definition}
    >
      {children}
    </GlossaryTermTooltip>
  );
}
