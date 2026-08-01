"use client";

import { ArrowRight, Compass } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import I18n from "@/shared/components/I18n";
import { useLocale } from "next-intl";

export default function LocaleNotFound() {
  const locale = useLocale();

  return (
    <main className="bg-background text-foreground border-border/20 relative isolate mt-4 flex min-h-[80vh] w-full flex-col items-center justify-center overflow-hidden rounded-none border px-4 text-center sm:rounded-xl">
      <div
        aria-hidden="true"
        className="bg-primary/5 pointer-events-none absolute top-1/4 -left-40 h-96 w-96 rounded-full blur-3xl"
      />
      <div
        aria-hidden="true"
        className="bg-primary/5 pointer-events-none absolute -right-40 bottom-1/4 h-96 w-96 rounded-full blur-3xl"
      />

      <div
        aria-hidden="true"
        className="ui-grid-pattern pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)] opacity-5 dark:opacity-10"
      />

      <div className="relative z-10 flex max-w-xl flex-col items-center gap-6">
        <div className="border-border bg-background shadow-3xs text-primary flex h-12 w-12 items-center justify-center rounded-none border sm:rounded-xl">
          <Compass className="h-5 w-5 stroke-[1.8]" />
        </div>

        <div className="space-y-2">
          <p className="text-primary text-xs font-black tracking-[0.3em] uppercase">
            <I18n>Error Code 404</I18n>
          </p>
          <h1 className="text-foreground font-sans text-3xl font-bold tracking-tight sm:text-4xl">
            <I18n>Page Not Found</I18n>
          </h1>
        </div>

        <p className="text-muted-foreground max-w-md text-xs leading-relaxed font-medium sm:text-sm">
          <I18n>
            This page is no longer on the active system route map. The link may have changed, the
            content may have shifted, or the dispatch gateway address never existed.
          </I18n>
        </p>

        <div className="mt-2 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
          <a
            href={`/${locale}`}
            className={buttonVariants({
              variant: "default",
              className:
                "inline-flex h-10 w-full cursor-pointer items-center justify-center rounded-full px-6 text-xs font-bold shadow-2xs sm:w-auto",
            })}
          >
            <I18n>Back to Safety</I18n>
          </a>

          <a
            href={`/${locale}/contact`}
            className={buttonVariants({
              variant: "outline",
              className:
                "border-border hover:bg-muted/80 inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-full px-6 text-xs font-bold shadow-2xs sm:w-auto",
            })}
          >
            <span>
              <I18n>Contact the team</I18n>
            </span>
            <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
          </a>
        </div>
      </div>
    </main>
  );
}
