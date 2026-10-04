import {
  ULPAN_FAQ,
  ULPAN_META,
  ULPAN_PAGE_PATH,
  ULPAN_PRICING,
  ULPAN_SHOWCASE_VIDEOS,
} from "@/lib/data/academy-ulpan-page";
import { absoluteUrl } from "@/lib/site-url";
import { ENTITY_IDS } from "@/lib/seo/entity-ids";
import { FOUNDER_NAME } from "@/lib/constants";
import {
  youtubeEmbedUrlFromId,
  youtubeThumbnailUrl,
  youtubeWatchUrl,
} from "@/lib/video-schema";

const pageUrl = absoluteUrl(ULPAN_PAGE_PATH.replace(/^\/+/, ""));

const AREA_SERVED = [
  { "@type": "City" as const, name: "מודיעין-מכבים-רעות" },
  { "@type": "City" as const, name: "שוהם" },
  { "@type": "City" as const, name: "ראשון לציון" },
  { "@type": "AdministrativeArea" as const, name: "מרכז, ישראל" },
];

function buildVideoNodes() {
  return ULPAN_SHOWCASE_VIDEOS.map((video) => ({
    "@type": "VideoObject" as const,
    "@id": `${pageUrl}#${video.schemaId}`,
    name: video.title,
    description: video.description,
    thumbnailUrl: youtubeThumbnailUrl(video.videoId),
    contentUrl: youtubeWatchUrl(video.videoId),
    embedUrl: youtubeEmbedUrlFromId(video.videoId),
    uploadDate: "2024-01-01",
    inLanguage: "he-IL",
    educationalUse: "instruction",
    publisher: { "@id": ENTITY_IDS.organization },
  }));
}

export function buildUlpanPageSchema() {
  const videoNodes = buildVideoNodes();
  const faqPlain = ULPAN_FAQ.map(({ question, answer }) => ({ question, answer }));

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: ULPAN_META.title,
        description: ULPAN_META.description,
        inLanguage: "he-IL",
        isPartOf: { "@id": ENTITY_IDS.website },
        about: { "@id": `${pageUrl}#hebrew-tutoring-service` },
      },
      {
        "@type": "Person",
        "@id": `${pageUrl}#hebrew-tutor`,
        name: FOUNDER_NAME,
        jobTitle: "מורה פרטי לעברית",
        knowsAbout: ["עברית מדוברת", "הוראת עברית", "Ulpan", "Ivrit be-Ivrit"],
        worksFor: { "@id": ENTITY_IDS.organization },
      },
      {
        "@type": "Service",
        "@id": `${pageUrl}#hebrew-tutoring-service`,
        name: "שיעורי עברית פרטיים  -  יקיר כהן",
        description: ULPAN_META.description,
        url: pageUrl,
        serviceType: "Private Hebrew Tutoring",
        category: "Language Education",
        inLanguage: "he-IL",
        provider: { "@id": `${pageUrl}#hebrew-tutor` },
        areaServed: AREA_SERVED,
        offers: [
          {
            "@type": "Offer",
            name: "שיעור ניסיון",
            price: String(ULPAN_PRICING.trial.price),
            priceCurrency: "ILS",
            url: pageUrl,
            availability: "https://schema.org/LimitedAvailability",
          },
          {
            "@type": "Offer",
            name: "מסלול חודשי",
            price: "3200",
            priceCurrency: "ILS",
            url: pageUrl,
          },
          {
            "@type": "Offer",
            name: "מסלול שנתי",
            price: "11520",
            priceCurrency: "ILS",
            url: pageUrl,
          },
        ],
      },
      {
        "@type": "Course",
        "@id": `${pageUrl}#hebrew-course`,
        name: "לימוד עברית מדוברת  -  שיעורים פרטיים",
        description:
          "תוכנית שיעורים פרטיים לעברית מדוברת. אחד על אחד, פרונטלי או בזום, במודיעין והמרכז.",
        url: pageUrl,
        inLanguage: "he-IL",
        courseMode: ["blended", "online", "onsite"],
        teaches: "עברית מדוברת, דיבור, הבנה, ביטחון בשפה",
        educationalLevel: "מתחיל עד מתקדם",
        provider: { "@id": `${pageUrl}#hebrew-tutor` },
        availableLanguage: ["he", "en", "ru", "ar", "am", "es"],
        areaServed: AREA_SERVED,
        hasPart: videoNodes.map((v) => ({ "@id": v["@id"] })),
        offers: [
          {
            "@type": "Offer",
            name: "שיעור ניסיון",
            price: String(ULPAN_PRICING.trial.price),
            priceCurrency: "ILS",
            description: "שיעור היכרות  -  אבחון רמה וקביעת מטרות",
          },
        ],
        /* בלי review (החלטת הבעלים 4.10.2026). ההמלצה נשארת גלויה בעמוד.
           בסכמה היא הייתה Review בלי reviewRating, ששדה חובה לביקורת אצל
           גוגל. ובעמוד אין כוכבים גלויים, כך שאי אפשר להוסיף דירוג.
           בעמוד /academy/hebrew-lessons אותה ביקורת ישבה על Service,
           ושם Search Console דיווח "סוג אובייקט לא חוקי לשדה parent_node". */
      },
      ...videoNodes,
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        mainEntity: faqPlain.map(({ question, answer }) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: {
            "@type": "Answer",
            text: answer,
          },
        })),
      },
    ],
  };
}
