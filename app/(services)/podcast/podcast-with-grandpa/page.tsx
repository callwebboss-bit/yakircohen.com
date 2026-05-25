import PodcastWithGrandpaPageContent from "@/components/seo/PodcastWithGrandpaPageContent";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "פודקאסט עם סבא וסבתא | הקלטת שיר באולפן  -  מתנה משפחתית",
  description:
    "חוויה משפחתית באולפן במודיעין: פודקאסט עם סבא וסבתא, הקלטת שיר, קליפ וידאו ומזכרת לכל החיים. מתנה מרגשת ליום הולדת ויובל.",
  slug: "podcast/podcast-with-grandpa",
  keywords: [
    "פודקאסט עם סבא",
    "הקלטת שיר באולפן",
    "מתנה לסבא",
    "חוויה משפחתית",
    "תיעוד סיפורי חיים",
    "אולפן מודיעין",
  ],
});

export default function PodcastWithGrandpaPage() {
  return <PodcastWithGrandpaPageContent />;
}
