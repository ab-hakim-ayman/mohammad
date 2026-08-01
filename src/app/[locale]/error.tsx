"use client";

import { useLocale } from "next-intl";
import Link from "next/link";
import { ArrowRight, RotateCcw } from "lucide-react";
import { useEffect } from "react";
import { StateScreen } from "@/shared/components/StateScreen";
import I18n from "@/shared/components/I18n";

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const locale = useLocale();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] w-full items-center justify-center p-6">
      <StateScreen
        state="error"
        title="Something interrupted the experience"
        description="The application hit an unexpected issue while trying to render this view. You can retry the request or return to the main experience."
        detail={error.message || "An unexpected error occurred."}
        actions={
          <>
            <button
              onClick={reset}
              className="bg-primary text-on-primary hover:bg-primary/90 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium shadow-xs transition-all"
            >
              <I18n>Try again</I18n>
              <RotateCcw className="ml-2 h-4 w-4" />
            </button>
            <Link
              href={`/${locale}`}
              className="border-border bg-background text-foreground hover:bg-muted inline-flex items-center justify-center rounded-xl border px-6 py-3 text-sm font-semibold shadow-xs transition-colors"
            >
              <I18n>Back home</I18n>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </>
        }
      />
    </div>
  );
}
