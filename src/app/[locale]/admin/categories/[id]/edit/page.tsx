"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { ArrowLeft, PencilLine } from "lucide-react";

import { useCategory, useUpdateCategory, CategoryForm } from "@/features/category";
import { Button } from "@/components/ui/button";
import { StateScreen } from "@/shared/components/StateScreen";
import { AdminPageBanner } from "@/shared/components/admin/AdminPageBanner";
import I18n from "@/shared/components/I18n";

export default function EditCategoryPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const locale = useLocale();

  const { data, isLoading, error } = useCategory(id);
  const updateCategory = useUpdateCategory();

  const handleSubmit = async (formData: any) => {
    await updateCategory.mutateAsync({ id, data: formData });
    router.push(`/${locale}/admin/categories`);
  };

  if (isLoading) {
    return <StateScreen state="loading" title="Loading category editor..." compact />;
  }

  if (error || !data?.data) {
    return <StateScreen state="notFound" title="Category record not found" compact />;
  }

  return (
    <div className="ui-reveal-up w-full space-y-6 select-none">
      <AdminPageBanner
        icon={PencilLine}
        eyebrow={<I18n>Edit Record</I18n>}
        title={<I18n>Edit Category</I18n>}
        description={
          <I18n>Adjust taxonomy details while staying inside the aligned admin editor shell.</I18n>
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

      <CategoryForm
        initialData={data.data}
        onSubmit={handleSubmit}
        isSubmitting={updateCategory.isPending}
      />
    </div>
  );
}
