"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { ArrowLeft, Cpu } from "lucide-react";

import { useCreateTechnology } from "@/features/technology";
import { TechnologyForm } from "@/features/technology/components/TechnologyForm";
import { Button } from "@/components/ui/button";
import { AdminPageBanner } from "@/shared/components/admin/AdminPageBanner";
import I18n from "@/shared/components/I18n";

export default function CreateTechnologyPage() {
  const router = useRouter();
  const locale = useLocale();
  const createTechnology = useCreateTechnology();

  const handleSubmit = async (data: any) => {
    await createTechnology.mutateAsync(data);
    router.push(`/${locale}/admin/technologies`);
  };

  return (
    <div className="ui-reveal-up w-full space-y-6 select-none">
      <AdminPageBanner
        icon={Cpu}
        eyebrow={<I18n>Create Record</I18n>}
        title={<I18n>Create Technology</I18n>}
        description={<I18n>Add a new technology or tool to the stack catalog.</I18n>}
        actions={
          <Link href={`/${locale}/admin/technologies`}>
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
      <TechnologyForm onSubmit={handleSubmit} isSubmitting={createTechnology.isPending} />
    </div>
  );
}
