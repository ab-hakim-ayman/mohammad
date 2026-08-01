"use client";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import type { ContentEditorProps } from "./types";
import I18n from "@/shared/components/I18n";

const ContentEditor = dynamic(() => import("./ContentEditor"), {
  ssr: false,
  loading: () => (
    <div className="border-border bg-muted/30 flex min-h-[400px] items-center justify-center rounded-none sm:rounded-xl border">
      <div className="text-muted-foreground flex flex-col items-center gap-2">
        <Loader2 className="text-primary h-6 w-6 animate-spin" />
        <p className="text-sm">
          <I18n>Loading rich text editor...</I18n>
        </p>
      </div>
    </div>
  ),
});

export function ContentEditorDynamic(props: ContentEditorProps) {
  return <ContentEditor {...props} />;
}
