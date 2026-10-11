import type { Metadata } from "next";
import KidsBirthdayPageContent from "@/components/seo/KidsBirthdayPageContent";
import {
  KIDS_BIRTHDAY_HERO,
  KIDS_BIRTHDAY_PATH,
} from "@/lib/data/kids-birthday";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: KIDS_BIRTHDAY_HERO.metaTitle,
  description: KIDS_BIRTHDAY_HERO.metaDescription,
  slug: KIDS_BIRTHDAY_PATH,
  keywords: [...KIDS_BIRTHDAY_HERO.keywords],
});

export default function KidsBirthdayPage() {
  return <KidsBirthdayPageContent />;
}
