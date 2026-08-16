import { EducationSection } from "@/features/education";
import { FeatureBanner } from "@/shared/components";
import { A2I_BANNER_MANIFEST } from "@/shared/utils/banner-manifest";

export default async function PublicEducationsPage() {
  return (
    <>
      <FeatureBanner {...(A2I_BANNER_MANIFEST as any).education} />
      <div className="container-custom py-12 px-4 sm:px-6">
        <EducationSection />
      </div>
    </>
  );
}
