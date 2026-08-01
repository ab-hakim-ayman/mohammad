"use client";

import { useEffect } from "react";
import { defaultLocale } from "@/shared/i18n";
import I18n from "@/shared/components/I18n";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang={defaultLocale}>
      <body className="bg-foreground text-background flex min-h-screen w-screen flex-col items-center justify-center p-6 text-center font-sans antialiased">
        <div className="max-w-md space-y-4">
          <span className="border-destructive/20 bg-destructive/10 text-destructive inline-flex items-center rounded-full border px-3 py-0.5 text-xs font-semibold">
            <I18n>Core Router Error</I18n>
          </span>
          <h2 className="text-foreground text-xl font-black tracking-tight">
            <I18n>Infrastructure Handshake Failure</I18n>
          </h2>
          <p className="text-muted-foreground text-xs leading-relaxed font-medium">
            <I18n>
              A rendering component mismatch or missing default export broke the root pipeline.
            </I18n>
          </p>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => reset()}
              className="bg-muted text-foreground hover:bg-muted inline-flex h-8 items-center justify-center rounded-lg px-4 text-xs font-bold transition-all"
            >
              <I18n>Retry Component</I18n>
            </button>
            <button
              onClick={() => (window.location.href = `/${defaultLocale}`)}
              className="bg-foreground text-muted-foreground hover:bg-foreground border-border inline-flex h-8 items-center justify-center rounded-lg border px-4 text-xs font-bold transition-colors"
            >
              <I18n>Hard Reload</I18n>
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
