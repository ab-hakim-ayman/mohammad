import { AchievementSection } from "@/features/achievement";
import { FeatureBanner } from "@/shared/components";
import { A2I_BANNER_MANIFEST } from "@/shared/utils/banner-menifest";

export default async function PublicAchievementsPage() {
  return (
    <>
      <FeatureBanner {...A2I_BANNER_MANIFEST.achievement} />
      <AchievementSection  />
    </>
  );
}
