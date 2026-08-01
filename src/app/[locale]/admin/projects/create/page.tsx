"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { ArrowLeft, FolderKanban } from "lucide-react";

import { useCreateProject, ProjectForm } from "@/features/project";
import { Button } from "@/components/ui/button";
import { AdminPageBanner } from "@/shared/components/admin/AdminPageBanner";
import I18n from "@/shared/components/I18n";

export default function CreateProjectPage() {
  const router = useRouter();
  const locale = useLocale();
  const createProject = useCreateProject();

  const handleSubmit = async (data: any) => {
    await createProject.mutateAsync(data);
    router.push(`/${locale}/admin/projects`);
  };

  return (
    <div className="ui-reveal-up w-full space-y-6 select-none">
      <AdminPageBanner
        icon={FolderKanban}
        eyebrow={<I18n>Create Record</I18n>}
        title={<I18n>Create Project</I18n>}
        description={
          <I18n>Create a new project with details, media, and publishing settings.</I18n>
        }
        actions={
          <Link href={`/${locale}/admin/projects`}>
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
      <ProjectForm onSubmit={handleSubmit} isSubmitting={createProject.isPending} />
    </div>
  );
}
