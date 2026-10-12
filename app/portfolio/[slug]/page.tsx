import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PortfolioWorkPageContent from "@/components/seo/PortfolioWorkPageContent";
import { PORTFOLIO_WORKS, getPortfolioWork } from "@/lib/data/portfolio-works";
import { constructMetadata } from "@/lib/metadata";

type PortfolioWorkPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return PORTFOLIO_WORKS.map((work) => ({ slug: work.slug }));
}

export async function generateMetadata({ params }: PortfolioWorkPageProps): Promise<Metadata> {
  const { slug } = await params;
  const work = getPortfolioWork(slug);
  if (!work) return { title: "עבודה לא נמצאה" };

  return constructMetadata({
    title: work.title,
    description: work.summary,
    slug: `portfolio/${work.slug}`,
  });
}

export default async function PortfolioWorkPage({ params }: PortfolioWorkPageProps) {
  const { slug } = await params;
  const work = getPortfolioWork(slug);
  if (!work) notFound();
  return <PortfolioWorkPageContent work={work} />;
}
