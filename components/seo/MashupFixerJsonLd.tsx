import { DJ_MASHUP_IDEAS } from "@/lib/data/dj-mashup-ideas";
import { getProService } from "@/lib/data/pro-services";
import { humanizeMashupCopy } from "@/lib/mashup-copy-humanize";
import { safeJsonLdStringify } from "@/lib/safe-json-ld";
import { absoluteUrl } from "@/lib/site-url";

/** ItemList בלבד - Service+FAQ כבר ב-ServicePageLayout */
export default function MashupFixerJsonLd() {
  const service = getProService("mashup-fixer");
  const pageUrl = absoluteUrl("online/mashup-fixer");

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${pageUrl}#mashup-ideas-list`,
    name: "רעיונות מאשאפ לדיג'יי",
    description: humanizeMashupCopy(service.metaDescription),
    numberOfItems: DJ_MASHUP_IDEAS.length,
    itemListElement: DJ_MASHUP_IDEAS.map((idea, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: humanizeMashupCopy(`${idea.songA} ו-${idea.songB}`),
      description: humanizeMashupCopy(idea.hook ?? idea.whyItWorks.slice(0, 160)),
      url: `${pageUrl}#mashup-idea-${idea.id}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(itemList) }}
    />
  );
}
