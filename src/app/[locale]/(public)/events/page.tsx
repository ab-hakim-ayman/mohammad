import { EventSection } from "@/features/event";
import { FeatureBanner } from "@/shared/components";
import { A2I_BANNER_MANIFEST } from "@/shared/utils/banner-menifest";

export default async function PublicEventsPage() {
  return (
    <>
      <FeatureBanner {...A2I_BANNER_MANIFEST.event} />
      <EventSection  />
    </>
  );
}
