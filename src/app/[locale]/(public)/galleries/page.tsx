import { GallerySection } from "@/features/gallery";
import { FeatureBanner } from "@/shared/components";
import { A2I_BANNER_MANIFEST } from "@/shared/utils/banner-menifest";

export default async function PublicGalleriesPage() {
  return (
    <>
      <FeatureBanner {...A2I_BANNER_MANIFEST.gallery} />
      <GallerySection  />
    </>
  );
}
