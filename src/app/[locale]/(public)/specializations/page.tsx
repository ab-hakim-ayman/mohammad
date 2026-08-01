import { SpecializationSection } from "@/features/specialization";
import { Metadata } from "next";
import { FeatureBanner } from "@/shared/components";
import { A2I_BANNER_MANIFEST } from "@/shared/utils/banner-menifest";

export const metadata: Metadata = {
  title: "Specializations",
  description: "Our areas of expertise and specialization",
};

export default async function PublicSpecializationsPage() {
  return (
    <>
      <FeatureBanner {...A2I_BANNER_MANIFEST.specialization} />
      <SpecializationSection   />
    </>
  );
}
