"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { ArrowLeft, Sparkles } from "lucide-react";

import { useCreateHero, HeroForm } from "@/features/hero";
import { Button } from "@/components/ui/button";
import { AdminPageBanner } from "@/shared/components/admin/AdminPageBanner";
import I18n from "@/shared/components/I18n";

export default function CreateHeroPage() {
  const router = useRouter();
  const locale = useLocale();
  const createHero = useCreateHero();

  const handleSubmit = async (data: any) => {
    await createHero.mutateAsync(data);
    router.push(`/${locale}/admin/heroes`);
  };

  return (
    <div className="ui-reveal-up w-full space-y-6 select-none">
      <AdminPageBanner
        icon={Sparkles}
        eyebrow={<I18n>Create Record</I18n>}
        title={<I18n>Create Hero Section</I18n>}
        description={<I18n>Create a new hero banner with headline, subtitle, and media.</I18n>}
        actions={
          <Link href={`/${locale}/admin/heroes`}>
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
      <HeroForm onSubmit={handleSubmit} isSubmitting={createHero.isPending} />
    </div>
  );
}
