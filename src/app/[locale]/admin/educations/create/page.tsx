"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { ArrowLeft, GraduationCap } from "lucide-react";

import { useCreateEducation, EducationForm } from "@/features/education";
import { Button } from "@/components/ui/button";
import { AdminPageBanner } from "@/shared/components/admin/AdminPageBanner";
import I18n from "@/shared/components/I18n";

export default function CreateEducationPage() {
  const router = useRouter();
  const locale = useLocale();
  const createEducation = useCreateEducation();

  const handleSubmit = async (data: any) => {
    await createEducation.mutateAsync(data);
    router.push(`/${locale}/admin/educations`);
  };

  return (
    <div className="ui-reveal-up w-full space-y-6 select-none">
      <AdminPageBanner
        icon={GraduationCap}
        eyebrow={<I18n>Create Record</I18n>}
        title={<I18n>Create Education</I18n>}
        description={
          <I18n>
            Add a new academic timeline record with degree, field of study, grades, and certificates.
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
        onSubmit={handleSubmit}
        isSubmitting={createEducation.isPending}
      />
    </div>
  );
}
