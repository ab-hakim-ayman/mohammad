import { BlogSection } from "@/features/blog";
import { FeatureBanner } from "@/shared/components";
import { A2I_BANNER_MANIFEST } from "@/shared/utils/banner-manifest";

export default async function PublicBlogsPage() {
  return (
    <>
      <FeatureBanner {...A2I_BANNER_MANIFEST.blog} />
      <BlogSection />
    </>
  );
}
