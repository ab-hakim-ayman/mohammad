import { FaqSection } from "@/features/faq";
import { FeatureBanner } from "@/shared/components";
import { A2I_BANNER_MANIFEST } from "@/shared/utils/banner-manifest";

export default async function PublicFaqsPage() {
  return (
    <>
      <FeatureBanner {...A2I_BANNER_MANIFEST.faq} />
      <FaqSection />
    </>
  );
}