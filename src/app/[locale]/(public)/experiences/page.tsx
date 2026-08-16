import { ExperienceSection } from "@/features/experience";
import { FeatureBanner } from "@/shared/components";
import { A2I_BANNER_MANIFEST } from "@/shared/utils/banner-manifest";

export default async function PublicExperiencesPage() {
  return (
    <>
      <FeatureBanner {...(A2I_BANNER_MANIFEST as any).experience} />
      <div className="container-custom py-12 px-4 sm:px-6">
        <ExperienceSection />
      </div>
    </>
  );
}
