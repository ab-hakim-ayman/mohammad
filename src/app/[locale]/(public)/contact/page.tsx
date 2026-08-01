export const dynamic = 'force-dynamic';

import { ContactSection } from "@/features/contact/server";
import { FeatureBanner } from "@/shared/components";
import { A2I_BANNER_MANIFEST } from "@/shared/utils/banner-menifest";

export async function generateMetadata() {
  return {
    title: `${"Contact Operations"} | Architecture Sync`,
    description:
      "Initialize a secure project brief parameter with our core systems infrastructure layer.",
  };
}

export default async function PublicContactPage() {
  return (
    <>
      <FeatureBanner {...A2I_BANNER_MANIFEST.contact} />
      <ContactSection />
    </>
  );
}
