"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { ArrowLeft, Wrench } from "lucide-react";

import { useTool, useUpdateTool, ToolForm } from "@/features/tool";
import { StateScreen } from "@/shared/components/StateScreen";
import { Button } from "@/components/ui/button";
import { AdminPageBanner } from "@/shared/components/admin/AdminPageBanner";
import I18n from "@/shared/components/I18n";

interface EditToolPageProps {
  params: Promise<{ id: string }>;
}

export default function EditToolPage({ params }: EditToolPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const locale = useLocale();

  const { data, isLoading, error } = useTool(id);
  const updateTool = useUpdateTool();

  if (isLoading) {
    return <StateScreen state="loading" title="Loading Tool Details..." compact />;
  }

  const tool = (data as any)?.data || data;

  if (error || !tool) {
    return <StateScreen state="error" title="Tool not found" compact />;
  }

  const handleSubmit = async (formData: any) => {
    await updateTool.mutateAsync({ id, data: formData });
    router.push(`/${locale}/admin/tools`);
  };

  return (
    <div className="ui-reveal-up w-full space-y-6 select-none">
      <AdminPageBanner
        icon={Wrench}
        eyebrow={<I18n>Edit Record</I18n>}
        title={<><I18n>Edit Tool</I18n>: {tool.title}</>}
        description={
          <I18n>Update execution mode, category, action key, or visibility settings.</I18n>
        }
        actions={
          <Link href={`/${locale}/admin/tools`}>
            <Button
              variant="outline"
              className="border-border bg-card text-foreground ui-card-hover h-10 cursor-pointer rounded-xl px-4 shadow-sm"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              <I18n>Back</I18n>
            </Button>
          </Link>
        }
      />
      <ToolForm
        initialData={tool}
        onSubmit={handleSubmit}
        isSubmitting={updateTool.isPending}
      />
    </div>
  );
}
