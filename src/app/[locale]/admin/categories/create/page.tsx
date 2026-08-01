"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { ArrowLeft, FolderTree } from "lucide-react";

import { useCreateCategory, CategoryForm } from "@/features/category";
import { Button } from "@/components/ui/button";
import { AdminPageBanner } from "@/shared/components/admin/AdminPageBanner";
import I18n from "@/shared/components/I18n";

export default function CreateCategoryPage() {
  const router = useRouter();
  const locale = useLocale();
  const createCategory = useCreateCategory();

  const handleSubmit = async (data: any) => {
    await createCategory.mutateAsync(data);
    router.push(`/${locale}/admin/categories`);
  };

  return (
    <div className="ui-reveal-up w-full space-y-6 select-none">
      <AdminPageBanner
        icon={FolderTree}
        eyebrow={<I18n>Create Record</I18n>}
        title={<I18n>Create Category</I18n>}
        description={
          <I18n>Set up a new taxonomy record with a clean, consistent editing workflow.</I18n>
        }
        actions={
          <Link href={`/${locale}/admin/categories`}>
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

      <CategoryForm onSubmit={handleSubmit} isSubmitting={createCategory.isPending} />
    </div>
  );
}
