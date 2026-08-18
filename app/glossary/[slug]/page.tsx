import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GlossaryTermPageContent from "@/components/glossary/GlossaryTermPageContent";
import {
  getAllGlossarySlugs,
  getGlossaryTermBySlug,
} from "@/lib/data/glossary";
import { constructMetadata } from "@/lib/metadata";

type GlossaryTermPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllGlossarySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: GlossaryTermPageProps): Promise<Metadata> {
  const { slug } = await params;
  const term = getGlossaryTermBySlug(slug);

  if (!term) {
    return { title: "מונח לא נמצא" };
  }

  const description = term.also ? `${term.definition} ${term.also}` : term.definition;

  return constructMetadata({
    title: `${term.termHe} - הגדרה קצרה`,
    description,
    slug: `glossary/${term.slug}`,
    keywords: [
      term.termHe,
      ...(term.termEn ? [term.termEn] : []),
      ...(term.aliases ?? []),
      ...(term.longTail ?? []),
    ],
  });
}

export default async function GlossaryTermPage({
  params,
}: GlossaryTermPageProps) {
  const { slug } = await params;
  const term = getGlossaryTermBySlug(slug);

  if (!term) {
    notFound();
  }

  return <GlossaryTermPageContent term={term} />;
}
