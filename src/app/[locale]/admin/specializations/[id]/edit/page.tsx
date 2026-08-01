"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { ArrowLeft, PencilLine } from "lucide-react";

import {
  useSpecialization,
  useUpdateSpecialization,
  SpecializationForm,
} from "@/features/specialization";
import { Button } from "@/components/ui/button";
import { StateScreen } from "@/shared/components/StateScreen";
import { AdminPageBanner } from "@/shared/components/admin/AdminPageBanner";
import I18n from "@/shared/components/I18n";

export default function EditSpecializationPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const locale = useLocale();

  const { data, isLoading, error } = useSpecialization(id);
  const updateSpecialization = useUpdateSpecialization();

  const handleSubmit = async (formData: any) => {
    await updateSpecialization.mutateAsync({ id, data: formData });
    router.push(`/${locale}/admin/specializations`);
  };

  if (isLoading) {
    return <StateScreen state="loading" title="Loading specialization editor..." compact />;
  }

  if (error || !data?.data) {
    return <StateScreen state="notFound" title="Specialization record not found" compact />;
  }

  return (
    <div className="ui-reveal-up w-full space-y-6 select-none">
      <AdminPageBanner
        icon={PencilLine}
        eyebrow={<I18n>Edit Record</I18n>}
        title={<I18n>Edit Specialization</I18n>}
        description={<I18n>Update specialization details and publishing settings.</I18n>}
        actions={
          <Link href={`/${locale}/admin/specializations`}>
            <Button
              variant="outline"
              className="border-border bg-surface-elevated text-foreground ui-card-hover h-10 cursor-pointer rounded-xl px-4 shadow-sm"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              <I18n>Back</I18n>
            </Button>
          </Link>
        }
      />
      <SpecializationForm
        initialData={data.data}
        onSubmit={handleSubmit}
        isSubmitting={updateSpecialization.isPending}
      />
    </div>
  );
}
