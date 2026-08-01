"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { ArrowLeft, Briefcase, PencilLine } from "lucide-react";

import { useExperience, useUpdateExperience, ExperienceForm } from "@/features/experience";
import { Button } from "@/components/ui/button";
import { StateScreen } from "@/shared/components/StateScreen";
import { AdminPageBanner } from "@/shared/components/admin/AdminPageBanner";
import I18n from "@/shared/components/I18n";

export default function EditExperiencePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const locale = useLocale();

  const { data, isLoading, error } = useExperience(id);
  const updateExperience = useUpdateExperience();

  const handleSubmit = async (formData: any) => {
    await updateExperience.mutateAsync({ id, data: formData });
    router.push(`/${locale}/admin/experiences`);
  };

  if (isLoading) {
    return <StateScreen state="loading" title="Loading experience editor..." compact />;
  }

  if (error || !data?.data) {
    return <StateScreen state="notFound" title="Experience record not found" compact />;
  }

  return (
    <div className="ui-reveal-up w-full space-y-6 select-none">
      <AdminPageBanner
        icon={PencilLine}
        eyebrow={<I18n>Edit Record</I18n>}
        title={<I18n>Edit Experience</I18n>}
        description={
          <I18n>
            Update professional experience details, connections to projects, location properties, and display properties.
          </I18n>
        }
        actions={
          <Link href={`/${locale}/admin/experiences`}>
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

      <ExperienceForm
        initialData={data.data as any}
        onSubmit={handleSubmit}
        isSubmitting={updateExperience.isPending}
      />
    </div>
  );
}
