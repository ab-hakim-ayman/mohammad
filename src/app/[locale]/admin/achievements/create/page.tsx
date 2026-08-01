"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { ArrowLeft, Trophy } from "lucide-react";

import { useCreateAchievement, AchievementForm } from "@/features/achievement";
import { Button } from "@/components/ui/button";
import { AdminPageBanner } from "@/shared/components/admin/AdminPageBanner";
import I18n from "@/shared/components/I18n";

export default function CreateAchievementPage() {
  const router = useRouter();
  const locale = useLocale();
  const createAchievement = useCreateAchievement();

  const handleSubmit = async (data: any) => {
    await createAchievement.mutateAsync(data);
    router.push(`/${locale}/admin/achievements`);
  };

  return (
    <div className="ui-reveal-up w-full space-y-6 select-none">
      <AdminPageBanner
        icon={Trophy}
        eyebrow={<I18n>Create Record</I18n>}
        title={<I18n>Create Achievement</I18n>}
        description={
          <I18n>Add a milestone, award, or certification to the credibility section.</I18n>
        }
        actions={
          <Link href={`/${locale}/admin/achievements`}>
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
      <AchievementForm onSubmit={handleSubmit} isSubmitting={createAchievement.isPending} />
    </div>
  );
}
