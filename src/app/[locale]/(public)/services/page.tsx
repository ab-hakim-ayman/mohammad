import { ServiceSection } from "@/features/service";
import { FeatureBanner } from "@/shared/components";
import { A2I_BANNER_MANIFEST } from "@/shared/utils/banner-menifest";

export default async function PublicServicesPage() {
  return (
    <>
      <FeatureBanner {...A2I_BANNER_MANIFEST.service} />
      <ServiceSection  />
    </>
  );
}
