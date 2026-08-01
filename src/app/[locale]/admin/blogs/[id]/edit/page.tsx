"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { ArrowLeft, Newspaper, PencilLine } from "lucide-react";

import { useBlog, useUpdateBlog, BlogForm } from "@/features/blog";
import { Button } from "@/components/ui/button";
import { StateScreen } from "@/shared/components/StateScreen";
import { AdminPageBanner } from "@/shared/components/admin/AdminPageBanner";
import I18n from "@/shared/components/I18n";

export default function EditBlogPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const locale = useLocale();

  const { data, isLoading, error } = useBlog(id);
  const updateBlog = useUpdateBlog();

  const handleSubmit = async (formData: any) => {
    await updateBlog.mutateAsync({ id, data: formData });
    router.push(`/${locale}/admin/blogs`);
  };

  if (isLoading) {
    return <StateScreen state="loading" title="Loading blog editor..." compact />;
  }

  if (error || !data?.data) {
    return <StateScreen state="notFound" title="Blog record not found" compact />;
  }

  return (
    <div className="ui-reveal-up w-full space-y-6 select-none">
      {/* Admin Page Header */}
      <AdminPageBanner
        icon={PencilLine}
        eyebrow={<I18n>Edit Record</I18n>}
        title={<I18n>Edit Blog Post</I18n>}
        description={
          <I18n>
            Refine the article body, metadata, and publishing state in one cohesive editor.
          </I18n>
        }
        actions={
          <Link href={`/${locale}/admin/blogs`}>
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

      {/* Form Engine Render */}
      <BlogForm
        initialData={data.data}
        onSubmit={handleSubmit}
        isSubmitting={updateBlog.isPending}
      />
    </div>
  );
}