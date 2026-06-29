import type { FaqCtaItem } from "@/components/ui/FAQWithCtaLinks";

export const HEB_LESSONS_EN_PAGE_PATH = "/academy/hebrew-lessons";

export const HEB_LESSONS_EN_META = {
  title: "Hebrew Teacher in Modiin | Private Hebrew Lessons | Yakir Cohen",
  description:
    "Private Hebrew lessons in Modiin & central Israel — in-person or Zoom. Spoken Hebrew from lesson one, one-on-one with a professional native speaker. Trial lesson ₪500.",
  keywords: [
    "Hebrew teacher Modiin",
    "Hebrew tutor Israel",
    "private Hebrew lessons",
    "learn Hebrew Modiin",
    "Hebrew lessons Zoom Israel",
    "ulpan alternative Israel",
    "Hebrew for expats Israel",
    "Hebrew tutor online Israel",
    "spoken Hebrew lessons",
    "learn Hebrew Modi'in Maccabim",
  ] as const,
};

export const HEB_LESSONS_EN_HERO = {
  eyebrow: "Private Hebrew Lessons | Modi'in & Central Israel | In-Person / Zoom",
  h1: "Private Hebrew Lessons in Modiin — Speak Hebrew with Confidence",
  subtitle:
    "With Yakir Cohen — professional voice artist, Hebrew master, and personal coach. Hebrew in Hebrew, real-life conversations, no outdated textbooks.",
  painIntro: [
    "You understand some Hebrew — but when it's time to speak, the words just won't come out?",
    "You're not alone. Many new immigrants, expats, and tech workers in Modiin and central Israel feel exactly this way: they can read and understand, but in conversation — silence.",
  ] as const,
};

export const HEB_LESSONS_EN_VALUE_PROPS = [
  {
    id: "one-on-one",
    title: "100% One-on-One",
    description:
      "No group, no embarrassment. Every minute is dedicated to you — your level, your pace, your goals.",
  },
  {
    id: "speaking",
    title: "Spoken Hebrew from Day One",
    description:
      "Real daily conversations: shopping, work, kids, neighbors. Not just grammar — actual Hebrew you'll use.",
  },
  {
    id: "flex",
    title: "In-Person in Modiin, at Home, or Zoom",
    description:
      "We adapt the format to your schedule. In central Israel? Let's meet. Far away? Same quality on Zoom.",
  },
  {
    id: "personal",
    title: "A Plan Built Around Your Goal",
    description:
      "New immigrant, Hi-Tech worker, family, work — every student gets a different track. No one-size-fits-all curriculum.",
  },
] as const;

export const HEB_LESSONS_EN_METHOD = {
  heading: "Hebrew in Hebrew — No Translating in Your Head",
  subheading: "How we learn together",
  points: [
    "We speak from the very first lesson — no months of grammar before you open your mouth.",
    "No dusty textbooks or 30-year-old methods. Living Hebrew, from real life.",
    "When needed, explanations in English, Russian, Arabic, Amharic, or Spanish.",
    "The goal: you walk out of the lesson and speak — not fill in worksheets.",
  ] as const,
  supportLanguages: "Support languages: English, Russian, Arabic, Amharic, Spanish",
};

export const HEB_LESSONS_EN_AUDIENCE = {
  heading: "Who Is This For?",
  items: [
    "New immigrants (Olim) in Modiin, Maccabim-Re'ut and the area who want to speak fast",
    "Expats who don't connect with the government Ulpan format",
    "Hi-Tech workers and students with packed schedules — one lesson a week, at your pace",
    "Families who want a spouse or child to speak Hebrew at home",
    "Anyone who understands Hebrew but can't speak yet — and wants to change that",
  ] as const,
};

export const HEB_LESSONS_EN_COMPARISON = {
  heading: "Private Lesson vs. Government Ulpan — What's the Difference?",
  rows: [
    { label: "Pace", gov: "Group class, fixed pace", private: "One-on-one, at your own pace" },
    { label: "Speaking time", gov: "Limited microphone time", private: "100% speaking time — the whole lesson is yours" },
    { label: "Flexibility", gov: "Fixed location and hours", private: "Home / Zoom / Modi'in — your choice" },
    { label: "Customization", gov: "Same curriculum for everyone", private: "Personal goals: work, family, daily life" },
  ] as const,
  closing:
    "Not a replacement for Ulpan — a complement. What it often can't give you: real speaking practice, at your pace, with a teacher who listens.",
};

export const HEB_LESSONS_EN_PRICING = {
  heading: "Flexible Learning Plans",
  subheading:
    "All plans include one weekly private lesson — in-person or Zoom — with personal coaching.",
  monthly: {
    name: "Monthly Plan",
    price: "₪3,200",
    period: "per month",
    features: [
      "One private lesson per week — in-person or Zoom",
      "Full flexibility — stop anytime",
      "No annual commitment",
      "Personal guidance & support",
    ] as const,
  },
  annual: {
    name: "Annual Plan",
    price: "₪11,520",
    period: "per year",
    badge: "Recommended",
    trialNote: "Trial lesson for just ₪500 (instead of first month at ₪3,200)",
    features: [
      "One private lesson per week — in-person or Zoom",
      "Trial lesson for ₪500 (instead of ₪3,200)",
      "Significant yearly savings",
      "Personal guidance & support",
    ] as const,
  },
  trial: {
    price: 500,
    heading: "Book a Trial Lesson for ₪500",
    intro:
      "Fill in your details and we'll schedule your first lesson. Once complete, we'll contact you to confirm the time and payment details.",
    scarcity:
      "Limited spots — a small number of new students accepted each month. One trial lesson per student.",
  },
};

export const HEB_LESSONS_EN_HOW_IT_WORKS = [
  {
    step: "01",
    title: "Quick Fit Call",
    description:
      "Via WhatsApp or phone — we'll understand your goal, your level, and the format that works for you (in-person / Zoom).",
  },
  {
    step: "02",
    title: "Trial Lesson",
    description:
      "First session: level assessment, speaking from minute one, and a personal plan. ₪500 — no commitment.",
  },
  {
    step: "03",
    title: "Weekly Lessons at Your Pace",
    description:
      "One-on-one lesson each week. Progress, speak, improve — and stop whenever you want.",
  },
] as const;

export const HEB_LESSONS_EN_TESTIMONIAL = {
  quote:
    "I came to Yakir to improve my Hebrew. I've been studying with him for 6 years in a row (with a break during COVID and the war) and my Hebrew has improved tremendously. Highly recommended.",
  author: "Shwaqat Awist",
  languages: "Arabic, English",
  goal: "Speak Hebrew professionally at work, understand words deeply and the thinking behind them",
};

export const HEB_LESSONS_EN_FAQ: FaqCtaItem[] = [
  {
    id: "en-who",
    question: "Is this suitable for complete beginners?",
    answer:
      "Yes. Beginners get a Hebrew lesson from absolute zero — with explanations in the language that suits you (English, Russian, Arabic, Amharic, Spanish) until we gradually move to Hebrew in Hebrew.",
    ctaText: "Start from zero — message me",
    whatsappMessage:
      "Hi Yakir! I'm a complete beginner in Hebrew. I'd love to book a trial lesson and understand where to start.",
    utm_campaign: "heb_lessons_en_faq_beginners",
  },
  {
    id: "en-spoken",
    question: "Do you focus on spoken Hebrew or also grammar?",
    answer:
      "The emphasis is always on spoken Hebrew. We cover grammar when it helps you speak more naturally — not as an end in itself. The goal is that you walk out of every lesson and use Hebrew in real conversations.",
    ctaText: "Want real spoken Hebrew?",
    whatsappMessage:
      "Hi Yakir! I want to learn spoken Hebrew, not just grammar. Can I book a trial lesson?",
    utm_campaign: "heb_lessons_en_faq_spoken",
  },
  {
    id: "en-zoom",
    question: "Can I learn Hebrew online via Zoom?",
    answer:
      "Absolutely. Zoom lessons are available from anywhere in Israel — same method, same personal connection, one-on-one. Ideal for anyone outside Modi'in who wants a private Hebrew tutor.",
    ctaText: "Book a Zoom lesson",
    whatsappMessage:
      "Hi Yakir! I'm interested in Hebrew lessons via Zoom. When can I schedule a trial lesson?",
    utm_campaign: "heb_lessons_en_faq_zoom",
  },
  {
    id: "en-price",
    question: "How much does a private Hebrew lesson cost?",
    answer:
      "A trial lesson is ₪500. The monthly plan is ₪3,200 (one weekly private lesson). The annual plan is ₪11,520 for 36 lessons, including a discounted trial lesson. In-person or Zoom — same price.",
    ctaText: "Ask about the plan that fits you",
    whatsappMessage:
      "Hi Yakir! I'm interested in private Hebrew lessons. Can you tell me about the plans and pricing?",
    utm_campaign: "heb_lessons_en_faq_price",
  },
  {
    id: "en-ulpan",
    question: "What's the difference between private lessons and the government Ulpan?",
    answer:
      "In the government Ulpan you learn in a group at a fixed pace with limited speaking time. With me — one-on-one, 100% speaking, a plan built around your specific goals, and flexible timing and location. Not a replacement — a complement.",
    ctaText: "Tried Ulpan? Let's talk",
    whatsappMessage:
      "Hi Yakir! I've tried the government Ulpan and I'm looking for something more personal. I'd love to hear about a trial lesson.",
    utm_campaign: "heb_lessons_en_faq_ulpan",
  },
  {
    id: "en-progress",
    question: "How long does it take to see real improvement?",
    answer:
      "Most students feel a difference after just a few lessons — more confidence, more vocabulary, fewer blocks. One weekly lesson plus short practice at home equals noticeable progress. After 3 months, most students can hold a 10-minute conversation with an Israeli.",
    ctaText: "Ready to start?",
    whatsappMessage:
      "Hi Yakir! I want to improve my spoken Hebrew. I'd love to book a trial lesson and see what to expect.",
    utm_campaign: "heb_lessons_en_faq_progress",
  },
  {
    id: "en-location",
    question: "Where do the in-person lessons take place?",
    answer:
      "In-person lessons are available in Modi'in-Maccabim-Re'ut and the central area (Shoham, Lod, Rishon LeZion, Petah Tikva, Netanya, Jerusalem). I can also come to your home in the area. Or Zoom from anywhere.",
    ctaText: "Check availability in your area",
    whatsappMessage:
      "Hi Yakir! I live in [your area]. Can I get an in-person or Zoom Hebrew lesson?",
    utm_campaign: "heb_lessons_en_faq_location",
  },
  {
    id: "en-commitment",
    question: "Is there a long-term commitment?",
    answer:
      "No. The monthly plan — stop anytime. The annual plan saves you money but is not a locked contract. The trial lesson — zero commitment.",
    ctaText: "Ask about flexible options",
    whatsappMessage:
      "Hi Yakir! I'm interested in Hebrew lessons without a long commitment. What are my options?",
    utm_campaign: "heb_lessons_en_faq_commitment",
  },
  {
    id: "en-trial",
    question: "What happens during the trial lesson?",
    answer:
      "Short conversation, level assessment, speaking from minute one, and a suggested personal plan. ₪500, no commitment to continue. After the lesson — you decide.",
    ctaText: "Book a trial lesson",
    whatsappMessage:
      "Hi Yakir! I'd like to book a trial Hebrew lesson. When is a good time?",
    utm_campaign: "heb_lessons_en_faq_trial",
  },
  {
    id: "en-languages",
    question: "What languages do you explain in?",
    answer:
      "Hebrew (most of the lesson), and when needed — English, Russian, Arabic, Amharic, and Spanish. The goal: move to spoken Hebrew as fast as possible.",
    ctaText: "Ask about your preferred language",
    whatsappMessage:
      "Hi Yakir! I'm interested in Hebrew lessons. My preferred explanation language is: [your language].",
    utm_campaign: "heb_lessons_en_faq_languages",
  },
];

export const HEB_LESSONS_EN_CTA = {
  heroPrimary: "Book a Trial Lesson (₪500)",
  heroWhatsapp: "Questions? Message me on WhatsApp",
  bottomHeading: "Ready to Speak Hebrew with Confidence?",
  bottomSub: "Send a message — we'll schedule a quick fit call and a trial lesson.",
  bottomButton: "Message on WhatsApp",
  whatsappHero:
    "Hi Yakir! I found your Hebrew lessons page. I'm interested in a private lesson — I'd love to get details.",
  whatsappBottom:
    "Hi Yakir! I want to start private Hebrew lessons. I'd love to schedule a trial lesson.",
};
