import { IndustrySection } from "@/features/industry";
import { FeatureBanner } from "@/shared/components";
import { A2I_BANNER_MANIFEST } from "@/shared/utils/banner-menifest";

export default async function PublicIndustriesPage() {
  return (
    <>
      <FeatureBanner {...A2I_BANNER_MANIFEST.industry} />
      <IndustrySection  />
    </>
  );
}
