"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { ArrowLeft, GraduationCap, PencilLine } from "lucide-react";

import { useEducation, useUpdateEducation, EducationForm } from "@/features/education";
import { Button } from "@/components/ui/button";
import { StateScreen } from "@/shared/components/StateScreen";
import { AdminPageBanner } from "@/shared/components/admin/AdminPageBanner";
import I18n from "@/shared/components/I18n";

export default function EditEducationPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const locale = useLocale();

  const { data, isLoading, error } = useEducation(id);
  const updateEducation = useUpdateEducation();

  const handleSubmit = async (formData: any) => {
    await updateEducation.mutateAsync({ id, data: formData });
    router.push(`/${locale}/admin/educations`);
  };

  if (isLoading) {
    return <StateScreen state="loading" title="Loading education editor..." compact />;
  }

  if (error || !data?.data) {
    return <StateScreen state="notFound" title="Education record not found" compact />;
  }

  return (
    <div className="ui-reveal-up w-full space-y-6 select-none">
      <AdminPageBanner
        icon={PencilLine}
        eyebrow={<I18n>Edit Record</I18n>}
        title={<I18n>Edit Education</I18n>}
        description={
          <I18n>
            Update academic timeline details, degree, field of study, grades, and certificates.
          </I18n>
        }
        actions={
          <Link href={`/${locale}/admin/educations`}>
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

      <EducationForm
        initialData={data.data as any}
        onSubmit={handleSubmit}
        isSubmitting={updateEducation.isPending}
      />
    </div>
  );
}
