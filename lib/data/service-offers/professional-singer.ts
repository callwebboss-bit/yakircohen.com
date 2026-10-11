import type { ServiceOfferPage } from "@/lib/data/service-offers/types";

/**
 * זמר או זמרת מהצוות שמבצעים את השיר במקום הלקוח. הבעלים, 11.10.2026: "יש לי גם
 * זמרים לזה". המחיר: song_house_singer, תוספת על הקלטת השיר.
 */
export const PROFESSIONAL_SINGER_PAGE: ServiceOfferPage = {
  path: "/studio/professional-singer",
  metaTitle: "שיר במתנה בביצוע זמר או זמרת מקצועיים",
  metaDescription:
    "רוצים לתת שיר במתנה בלי לשיר בעצמכם? זמר או זמרת מהצוות שלנו מבצעים את השיר, ואתם מביאים את הסיפור. לשיר קיים, לשיר מקורי או לפרודיה.",
  keywords: ["זמר שישיר בשבילי", "שיר במתנה בביצוע זמר", "זמרת להקלטת שיר", "שיר מתנה בלי לשיר", "זמר מקצועי לשיר מתנה"],
  eyebrow: "זמרים מהצוות",
  h1: "שיר במתנה, בביצוע זמר או זמרת מקצועיים",
  intro:
    "לא כל מי שרוצה לתת שיר רוצה גם לשיר אותו. אתם מביאים את הסיפור או את השיר, וזמר או זמרת מהצוות שלנו מבצעים אותו באולפן.",
  steps: [
    {
      title: "בוחרים שיר",
      description: "שיר קיים, שיר מקורי שנכתוב יחד, או פרודיה.",
    },
    {
      title: "בוחרים קול",
      description: "זמר או זמרת מהצוות שלנו, לפי השיר והאירוע.",
    },
    {
      title: "מקליטים באולפן",
      description: "הזמר מקליט באולפן במודיעין, ואנחנו עושים מיקס ומאסטר.",
    },
    {
      title: "השיר אצלכם",
      description: "מקבלים את השיר המוכן, לשיתוף או להשמעה באירוע.",
    },
  ],
  includesTitle: "מה כלול",
  includes: [
    "ביצוע השיר על ידי זמר או זמרת מהצוות",
    "הקלטה, מיקס ומאסטר",
    "מתאים לשיר קיים, לשיר מקורי, לפרודיה ולשיר AI",
  ],
  priceTitle: "כמה זה עולה",
  prices: [
    { id: "song_recording", label: "הקלטת השיר", note: "הקלטה, מיקס ומאסטר" },
    { id: "song_house_singer", addon: true, note: "תוספת לכל שיר" },
  ],
  priceNote: "בשיר מקורי או בפרודיה, הזמר הוא תוספת למחיר של אותו שיר.",
  faqs: [
    {
      id: "singer-who",
      question: "מי שר?",
      answer: "זמר או זמרת מהצוות שלנו. בוחרים יחד את הקול שמתאים לשיר ולאירוע.",
    },
    {
      id: "singer-which-songs",
      question: "לאיזה שירים זה מתאים?",
      answer: "לשיר קיים, לשיר מקורי שנכתוב יחד, לפרודיה ולשיר AI. בכל אחד מהם הזמר הוא תוספת.",
    },
    {
      id: "singer-price",
      question: "כמה זה עולה?",
      answer: "הזמר הוא תוספת על המחיר של השיר עצמו. בשיר קיים: הקלטת השיר, ועוד הזמר.",
    },
  ],
  whatsapp: {
    packageLabel: "שיר בביצוע זמר מהצוות",
    priceId: "song_house_singer",
    utmCampaign: "professional_singer",
  },
  related: [
    { href: "/studio/original-song", label: "שיר מקורי לכל אירוע" },
    { href: "/studio/parody", label: "פרודיה לאירוע" },
    { href: "/studio/recording-song-modiin", label: "הקלטת שיר" },
  ],
  draft: true,
};
