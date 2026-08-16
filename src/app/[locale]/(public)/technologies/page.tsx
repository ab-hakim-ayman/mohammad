import { TechnologySection } from "@/features/technology";
import { Metadata } from "next";
import { FeatureBanner } from "@/shared/components";
import { A2I_BANNER_MANIFEST } from "@/shared/utils/banner-manifest";

export const metadata: Metadata = {
  title: "Technologies",
  description: "Explore the technologies, tools, and engineering stack used across delivery work.",
};

export default async function PublicTechnologiesPage() {
  return (
    <>
      <FeatureBanner {...A2I_BANNER_MANIFEST.technology} />
      <TechnologySection />
    </>
  );
}
