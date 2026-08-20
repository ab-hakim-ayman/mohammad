import { ToolSection } from "@/features/tool";
import { FeatureBanner } from "@/shared/components";
import { A2I_BANNER_MANIFEST } from "@/shared/utils/banner-manifest";

export default async function PublicToolsPage() {
  const toolBanner = (A2I_BANNER_MANIFEST as any).tool || {
    variant: "splitInline",
    eyebrow: "Developer Toolkit",
    title: "Interactive Web & Engineering Utilities",
    description: "Client-side developer tools for instant formatting, encoding, JWT parsing, UUID generation, and system transformations with zero server latency.",
    chips: ["Zero Server Load", "Privacy First", "Client-Side Executed"],
    stats: [{ value: "100%", label: "Client-Side" }, { value: "Sub-1ms", label: "Transformation Speed" }],
  };

  return (
    <div className="container-custom py-8 space-y-12">
      <FeatureBanner {...toolBanner} />
      <ToolSection />
    </div>
  );
}
