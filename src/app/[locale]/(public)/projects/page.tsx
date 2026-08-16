import { ProjectSection } from "@/features/project";
import { FeatureBanner } from "@/shared/components";
import { A2I_BANNER_MANIFEST } from "@/shared/utils/banner-manifest";

export default async function PublicProjectsPage() {
  return (
    <>
      <FeatureBanner {...A2I_BANNER_MANIFEST.project} />
      <ProjectSection />
    </>
  );
}
