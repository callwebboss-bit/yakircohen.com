import type { Metadata } from "next";
import OnlineCategoryPageContent from "@/components/seo/OnlineCategoryPageContent";
import { constructMetadata } from "@/lib/metadata";
import { getOnlineCategoryBySlug } from "@/lib/data/online-page";

type CategoryPageProps = {
  params: Promise<{ category: string }>;
};

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const item = getOnlineCategoryBySlug(category);

  if (!item) {
    return constructMetadata({
      title: "שירותי אונליין",
      description: "שירותי AI אונליין מקצה לקצה.",
      slug: "online",
    });
  }

  return constructMetadata({
    title: `${item.title} | שירותי AI אונליין`,
    description: `${item.description} שירות Done-for-You מלא כולל ליווי אישי, ביצוע מקצה לקצה ותוצר מוכן.`,
    slug: `online/${item.slug}`,
    keywords: ["שירותי AI אונליין", item.title, "Done for you", "הפקה מרחוק", "שירותים דיגיטליים"],
  });
}

export default async function OnlineCategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  return <OnlineCategoryPageContent slug={category} />;
}
