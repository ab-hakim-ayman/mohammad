"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { ArrowLeft, Newspaper } from "lucide-react";

import { useCreateBlog, BlogForm } from "@/features/blog";
import { Button } from "@/components/ui/button";
import { AdminPageBanner } from "@/shared/components/admin/AdminPageBanner";
import I18n from "@/shared/components/I18n";

export default function CreateBlogPage() {
  const router = useRouter();
  const locale = useLocale();
  const createBlog = useCreateBlog();

  const handleSubmit = async (data: any) => {
    await createBlog.mutateAsync(data);
    router.push(`/${locale}/admin/blogs`);
  };

  return (
    <div className="ui-reveal-up w-full space-y-6 select-none">
      {/* Admin Page Header */}
      <AdminPageBanner
        icon={Newspaper}
        eyebrow={<I18n>Create Record</I18n>}
        title={<I18n>Create Blog Post</I18n>}
        description={
          <I18n>
            Draft long-form content inside the same editorial shell used across admin pages.
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
        onSubmit={handleSubmit}
        isSubmitting={createBlog.isPending}
      />
    </div>
  );
}