import { SkillSection } from "@/features/skill";
import { FeatureBanner } from "@/shared/components";
import { A2I_BANNER_MANIFEST } from "@/shared/utils/banner-menifest";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  return {
    title: "Title",
    description: "Description",
  };
}

export default async function PublicSkillsPage() {
  return (
    <>
      <FeatureBanner {...A2I_BANNER_MANIFEST.skill} />
      <SkillSection  />
    </>
  );
}
