"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { ArrowLeft, MessageCircle } from "lucide-react";

import { useCreateTestimonial, TestimonialForm } from "@/features/testimonial";
import { Button } from "@/components/ui/button";
import { AdminPageBanner } from "@/shared/components/admin/AdminPageBanner";
import I18n from "@/shared/components/I18n";

export default function CreateTestimonialPage() {
  const router = useRouter();
  const locale = useLocale();
  const createTestimonial = useCreateTestimonial();

  const handleSubmit = async (data: any) => {
    await createTestimonial.mutateAsync(data);
    router.push(`/${locale}/admin/testimonials`);
  };

  return (
    <div className="ui-reveal-up w-full space-y-6 select-none">
      <AdminPageBanner
        icon={MessageCircle}
        eyebrow={<I18n>Create Record</I18n>}
        title={<I18n>Create Testimonial</I18n>}
        description={
          <I18n>Add new client feedback with a layout that stays polished in both themes.</I18n>
        }
        actions={
          <Link href={`/${locale}/admin/testimonials`}>
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
      <TestimonialForm onSubmit={handleSubmit} isSubmitting={createTestimonial.isPending} />
    </div>
  );
}
