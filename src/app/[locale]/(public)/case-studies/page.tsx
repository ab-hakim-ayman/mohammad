import { CaseStudySection } from "@/features/case-study";
import { FeatureBanner } from "@/shared/components";
import { A2I_BANNER_MANIFEST } from "@/shared/utils/banner-manifest";

export default async function PublicCaseStudiesPage() {
  return (
    <>
      <FeatureBanner {...A2I_BANNER_MANIFEST["case-study"]} />
      <CaseStudySection />
    </>
  );
}
