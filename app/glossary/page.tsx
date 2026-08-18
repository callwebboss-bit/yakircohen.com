import type { Metadata } from "next";
import GlossaryHubContent from "@/components/glossary/GlossaryHubContent";
import { GLOSSARY_DESCRIPTION, GLOSSARY_TERMS, GLOSSARY_TITLE } from "@/lib/data/glossary";
import { constructMetadata } from "@/lib/metadata";
import {
  buildDefinedTermSetSchema,
  buildGlossaryHubWebPageSchema,
} from "@/lib/seo/glossary-schema";
import { safeJsonLdStringify } from "@/lib/safe-json-ld";

export const metadata: Metadata = constructMetadata({
  title: GLOSSARY_TITLE,
  description: GLOSSARY_DESCRIPTION,
  slug: "glossary",
  keywords: [
    "מונחון אודיו",
    "מילון מונחי אולפן",
    "מה זה EQ",
    "מה זה LUFS",
    "מה זה צ'ק סאונד",
  ],
});

export default function GlossaryHubPage() {
  const termSetSchema = buildDefinedTermSetSchema(GLOSSARY_TERMS);
  const pageSchema = buildGlossaryHubWebPageSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLdStringify([termSetSchema, pageSchema]),
        }}
      />
      <GlossaryHubContent terms={GLOSSARY_TERMS} />
    </>
  );
}
