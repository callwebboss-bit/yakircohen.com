import {
  ULPAN_FAQ,
  ULPAN_META,
  ULPAN_PAGE_PATH,
  ULPAN_PRICING,
  ULPAN_SHOWCASE_VIDEOS,
  ULPAN_TESTIMONIAL,
} from "@/lib/data/academy-ulpan-page";
import { SITE_NAME } from "@/lib/constants";
import { absoluteUrl } from "@/lib/site-url";
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
    publisher: {
      "@type": "Organization" as const,
      name: SITE_NAME,
      url: absoluteUrl(),
    },
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
        isPartOf: { "@id": `${absoluteUrl()}/#website` },
        about: { "@id": `${pageUrl}#hebrew-tutoring-service` },
      },
      {
        "@type": "Person",
        "@id": `${pageUrl}#hebrew-tutor`,
        name: "יקיר כהן",
        jobTitle: "מורה פרטי לעברית",
        knowsAbout: ["עברית מדוברת", "הוראת עברית", "Ulpan", "Ivrit be-Ivrit"],
        worksFor: {
          "@type": "Organization",
          name: SITE_NAME,
          url: absoluteUrl(),
        },
      },
      {
        "@type": "Service",
        "@id": `${pageUrl}#hebrew-tutoring-service`,
        name: "שיעורי עברית פרטיים — יקיר כהן",
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
        name: "לימוד עברית מדוברת — שיעורים פרטיים",
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
            description: "שיעור היכרות — אבחון רמה וקביעת מטרות",
          },
        ],
        review: {
          "@type": "Review",
          author: { "@type": "Person", name: ULPAN_TESTIMONIAL.author },
          reviewBody: ULPAN_TESTIMONIAL.quote,
          reviewRating: {
            "@type": "Rating",
            ratingValue: "5",
            bestRating: "5",
          },
        },
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
