"use client";

import { Info } from "lucide-react";
import { useAdminAbout, useSaveAbout, AboutForm } from "@/features/about";
import { StateScreen } from "@/shared/components/StateScreen";
import { AdminPageBanner } from "@/shared/components/admin/AdminPageBanner";
import I18n from "@/shared/components/I18n";

export default function AdminAboutsPage() {
  const { data, isLoading, error } = useAdminAbout();
  const saveAbout = useSaveAbout();

  const handleSubmit = async (formData: any) => {
    await saveAbout.mutateAsync(formData);
  };

  if (isLoading) {
    return <StateScreen state="loading" title="Loading about section..." compact />;
  }

  if (error) {
    return <StateScreen state="error" title="Unable to load about section" compact />;
  }

  return (
    <div className="ui-reveal-up w-full space-y-6 select-none">
      <AdminPageBanner
        icon={Info}
        title={<I18n>About Us</I18n>}
        description={<I18n>Manage your company's core about information directly.</I18n>}
      />
      <AboutForm
        initialData={data?.data ?? undefined}
        onSubmit={handleSubmit}
        isSubmitting={saveAbout.isPending}
      />
    </div>
  );
}
