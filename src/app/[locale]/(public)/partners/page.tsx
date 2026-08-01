import { PartnerSection } from "@/features/partner";
import { FeatureBanner } from "@/shared/components";
import { A2I_BANNER_MANIFEST } from "@/shared/utils/banner-menifest";

export default async function PublicPartnersPage() {
  return (
    <>
      <FeatureBanner {...A2I_BANNER_MANIFEST.partner} />
      <PartnerSection  />
    </>
  );
}
