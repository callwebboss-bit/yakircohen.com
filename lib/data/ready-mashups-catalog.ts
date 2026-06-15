/** מאגר מאשאפים מוכנים לרכישה — מקושר לרעיונות בקטלוג */
export type ReadyMashup = {
  id: string;
  title: string;
  ideaId: string;
  description: string;
  priceExVat: number;
  tags: readonly string[];
};

export const READY_MASHUPS_CATALOG: readonly ReadyMashup[] = [
  {
    id: "ready_taapas_levitating",
    title: "טאפס וטריפונס × Levitating",
    ideaId: "omer_taapas_levitating",
    description: "ווקאל עומר על ביט 128 — נבדק ברחבות 2026.",
    priceExVat: 650,
    tags: ["רחבה", "2026"],
  },
  {
    id: "ready_pantera_kavod",
    title: "פנתרה → יעשו לנו כבוד",
    ideaId: "eyal_pantera_omer_kavod",
    description: "מעבר בין שני ענקי המזרחית, בלי לעצור את הרחבה.",
    priceExVat: 650,
    tags: ["רחבה", "מזרחית"],
  },
  {
    id: "ready_doctor_pantera",
    title: "דוקטור → פנתרה",
    ideaId: "eyal_doctor_lior_pantera",
    description: "build לדרופ שכולם מכירים — גרסה מהאולפן.",
    priceExVat: 650,
    tags: ["רחבה", "Hypeddit-style"],
  },
  {
    id: "ready_ahuvati_cant_hold",
    title: "אהובתי → Can't Hold Us",
    ideaId: "omer_ahuvati_cant_hold",
    description: "רגש עומר, דרופ שמאחד גם מי שלא שומע מזרחית.",
    priceExVat: 650,
    tags: ["רחבה", "מעבר"],
  },
  {
    id: "ready_uptown_daft",
    title: "Daft Punk × Uptown Funk",
    ideaId: "daft_uptown_opener",
    description: "פתיחה בינלאומית לפני שהאוכל מגיע.",
    priceExVat: 650,
    tags: ["פתיחה"],
  },
  {
    id: "ready_shked_kikar",
    title: "שקד × כיכר — ריקוד ראשון",
    ideaId: "shked_kikar_first_dance",
    description: "גשר מריקוד ראשון לרחבה.",
    priceExVat: 650,
    tags: ["סלואו", "מעבר"],
  },
] as const;

export function getReadyMashupByIdeaId(ideaId: string): ReadyMashup | undefined {
  return READY_MASHUPS_CATALOG.find((m) => m.ideaId === ideaId);
}
