"use client";

import { use } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import {
  useToolBySlug,
  ToolSchemaRunner,
  CUSTOM_TOOL_COMPONENTS,
} from "@/features/tool";
import { StateScreen } from "@/shared/components/StateScreen";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface PublicSingleToolPageProps {
  params: Promise<{ slug: string }>;
}

export default function PublicSingleToolPage({ params }: PublicSingleToolPageProps) {
  const { slug } = use(params);
  const locale = useLocale();

  const { data, isLoading, error } = useToolBySlug(slug);

  if (isLoading) {
    return (
      <div className="container-custom py-16">
        <StateScreen state="loading" title="Loading Tool Workspace..." compact />
      </div>
    );
  }

  const tool = (data as any)?.data || data;

  if (error || !tool) {
    return (
      <div className="container-custom py-16">
        <StateScreen
          state="error"
          title="Tool Not Found"
          description="The requested developer tool does not exist or has been archived."
          actions={
            <Button onClick={() => (window.location.href = `/${locale}/tools`)}>
              Back to Tools Directory
            </Button>
          }
        />
      </div>
    );
  }

  const CustomComponent =
    tool.engineType === "CUSTOM" && tool.componentKey
      ? CUSTOM_TOOL_COMPONENTS[tool.componentKey]
      : null;

  return (
    <div className="container-custom py-6 space-y-6">
      {/* Navigation Link */}
      <div>
        <Link
          href={`/${locale}/tools`}
          className="inline-flex items-center text-xs font-semibold text-muted-foreground transition hover:text-primary"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Tools Directory
        </Link>
      </div>

      {/* Main Tool Shell / Workspace */}
      <div className="rounded-3xl border border-border/80 bg-card/40 p-6 shadow-xl backdrop-blur-md lg:p-8">
        {CustomComponent ? (
          <CustomComponent tool={tool} />
        ) : (
          <ToolSchemaRunner tool={tool} />
        )}
      </div>
    </div>
  );
}
