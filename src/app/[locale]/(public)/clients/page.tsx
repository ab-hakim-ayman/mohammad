import { ClientSection } from "@/features/client";
import { FeatureBanner } from "@/shared/components";
import { A2I_BANNER_MANIFEST } from "@/shared/utils/banner-menifest";

export default async function PublicClientsPage() {
  return (
    <>
      <FeatureBanner {...A2I_BANNER_MANIFEST.client} />
      <ClientSection  />
    </>
  );
}
