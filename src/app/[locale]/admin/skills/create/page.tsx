"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { ArrowLeft, Gauge } from "lucide-react";

import { useCreateSkill } from "@/features/skill";
import { SkillForm } from "@/features/skill/components/SkillForm";
import { Button } from "@/components/ui/button";
import { AdminPageBanner } from "@/shared/components/admin/AdminPageBanner";
import I18n from "@/shared/components/I18n";

export default function CreateSkillPage() {
  const router = useRouter();
  const locale = useLocale();
  const createSkill = useCreateSkill();

  const handleSubmit = async (data: any) => {
    await createSkill.mutateAsync(data);
    router.push(`/${locale}/admin/skills`);
  };

  return (
    <div className="ui-reveal-up w-full space-y-6 select-none">
      <AdminPageBanner
        icon={Gauge}
        eyebrow={<I18n>Create Record</I18n>}
        title={<I18n>Create Skill</I18n>}
        description={<I18n>Add a new skill with proficiency level and metadata.</I18n>}
        actions={
          <Link href={`/${locale}/admin/skills`}>
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
      <SkillForm onSubmit={handleSubmit} isSubmitting={createSkill.isPending} />
    </div>
  );
}
