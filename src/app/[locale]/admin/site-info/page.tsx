"use client";

import { Globe } from "lucide-react";
import { useAdminSiteInfo, useSaveSiteInfo, SiteInfoForm } from "@/features/site-info";
import { StateScreen } from "@/shared/components/StateScreen";
import { AdminPageBanner } from "@/shared/components/admin/AdminPageBanner";
import I18n from "@/shared/components/I18n";

export default function AdminSiteInfoPage() {
  const { data, isLoading, error } = useAdminSiteInfo();
  const saveSiteInfo = useSaveSiteInfo();

  const handleSubmit = async (formData: any) => {
    await saveSiteInfo.mutateAsync(formData);
  };

  if (isLoading) {
    return <StateScreen state="loading" title="Loading site info..." compact />;
  }

  if (error) {
    return <StateScreen state="error" title="Unable to load site info" compact />;
  }

  return (
    <div className="ui-reveal-up w-full space-y-6 select-none">
      <AdminPageBanner
        icon={Globe}
        title={<I18n>Site Info</I18n>}
        description={<I18n>Manage site branding, contact info, and SEO metadata directly.</I18n>}
      />
      <SiteInfoForm
        initialData={data?.data ?? undefined}
        onSubmit={handleSubmit}
        isSubmitting={saveSiteInfo.isPending}
      />
    </div>
  );
}