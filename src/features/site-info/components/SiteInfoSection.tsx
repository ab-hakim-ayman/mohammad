"use client";

import { usePublicSiteInfo } from "../hooks/useSiteInfo";
import { SiteInfoCard } from "./SiteInfoCard";
import { StateScreen } from "@/shared/components/StateScreen";

export function SiteInfoSection() {
  const { data, isLoading, error } = usePublicSiteInfo();
  const siteInfo = data?.data;

  if (isLoading) {
    return <StateScreen state="loading" title="Loading site info..." compact />;
  }

  if (error || !siteInfo) {
    return null;
  }

  return (
    <div className="container-custom mx-auto w-full px-4 sm:px-6 relative z-10">
      <SiteInfoCard
        siteInfo={siteInfo}
        variant="classic"
        size="md"
        className="h-full w-full"
      />
    </div>
  );
}