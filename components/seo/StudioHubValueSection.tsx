import ShowcaseVideoSection from "@/components/seo/ShowcaseVideoSection";

/** תיק עבודות לעמוד /studio - מהמאגר המרכזי */
export default function StudioHubValueSection() {
  return (
    <ShowcaseVideoSection
      playlistId="studio-hub"
      heading="תיק עבודות ודוגמאות מהאולפן"
      sectionId="service-showcase-video"
      schemaVideoLimit={8}
    />
  );
}
