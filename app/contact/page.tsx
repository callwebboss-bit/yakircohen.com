import type { Metadata } from "next";
import ContactPageContent from "@/components/contact/ContactPageContent";
import SmartMap from "@/components/ui/SmartMap";
import { STUDIO_ADDRESS } from "@/lib/constants";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "יצירת קשר",
  description:
    "צרו קשר - אולפן הקלטות, DJ, קריינות ופודקאסטים במודיעין. זמינים בוואטסאפ בשעות הפעילות.",
  slug: "contact",
  keywords: ["צור קשר", "אולפן מודיעין", "DJ מודיעין", "וואטסאפ"],
});

export default function ContactPage() {
  return (
    <>
      <ContactPageContent />

      <section className="mx-auto max-w-3xl px-4 pb-14 sm:px-6 lg:px-8">
        <SmartMap
          address={STUDIO_ADDRESS}
          googleMapsUrl="https://maps.google.com/maps?q=עמק+איילון+34+מודיעין&output=embed"
        />
      </section>
    </>
  );
}
