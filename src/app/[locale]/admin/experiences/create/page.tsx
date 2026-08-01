"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { ArrowLeft, Briefcase } from "lucide-react";

import { useCreateExperience, ExperienceForm } from "@/features/experience";
import { Button } from "@/components/ui/button";
import { AdminPageBanner } from "@/shared/components/admin/AdminPageBanner";
import I18n from "@/shared/components/I18n";

export default function CreateExperiencePage() {
  const router = useRouter();
  const locale = useLocale();
  const createExperience = useCreateExperience();

  const handleSubmit = async (data: any) => {
    await createExperience.mutateAsync(data);
    router.push(`/${locale}/admin/experiences`);
  };

  return (
    <div className="ui-reveal-up w-full space-y-6 select-none">
      <AdminPageBanner
        icon={Briefcase}
        eyebrow={<I18n>Create Record</I18n>}
        title={<I18n>Create Experience</I18n>}
        description={
          <I18n>
            Add a new professional experience timeline record with details, location type, and project connections.
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
        onSubmit={handleSubmit}
        isSubmitting={createExperience.isPending}
      />
    </div>
  );
}
