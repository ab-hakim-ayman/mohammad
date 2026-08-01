"use client";

import * as React from "react";
import { Check, ChevronDown, Globe } from "lucide-react";
import { usePathname, useRouter } from "@/shared/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { routing } from "@/shared/i18n/routing";
import type { Locale } from "@/shared/i18n/config";
import { cn } from "@/lib/utils";

import { Menu } from "@base-ui/react";
import I18n from "@/shared/components/I18n";
import { useLocale } from "next-intl";

const languageMeta: Record<Locale, { short: string; label: string; hint: string }> = {
  en: { short: "EN", label: "English", hint: "US & International" },
  bn: { short: "BN", label: "বাংলা", hint: "Bengali" },
};

export default function LanguageSwitcher({
  side = "bottom",
}: {
  side?: "top" | "bottom" | "left" | "right";
}) {
  const currentLocale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = React.useState(false);

  const currentLanguage = React.useMemo(
    () => languageMeta[currentLocale] ?? languageMeta.en,
    [currentLocale]
  );

  const switchLanguage = (newLocale: Locale) => {
    if (newLocale === currentLocale) return;

    const query = searchParams?.toString();
    const fullPath = pathname + (query ? "?" + query : "");
    router.replace(fullPath, { locale: newLocale });
  };

  return (
    <Menu.Root open={isOpen} onOpenChange={setIsOpen}>
      {/* 🚀 Vercel/Stripe Grade Trigger Button */}
      <Menu.Trigger
        type="button"
        aria-label="Select language"
        className={cn(
          "group inline-flex h-9 cursor-pointer items-center gap-2 rounded-xl border border-border/80 bg-card/60 backdrop-blur-md px-2.5 text-xs font-semibold text-foreground transition-all duration-200 outline-none select-none shadow-2xs",
          "hover:border-border hover:bg-card hover:shadow-xs",
          "focus-visible:ring-2 focus-visible:ring-primary/20",
          isOpen && "border-border bg-card ring-2 ring-primary/10 shadow-xs"
        )}
      >
        <div className="flex items-center gap-1.5 text-muted-foreground group-hover:text-foreground transition-colors">
          <Globe className="h-3.5 w-3.5 stroke-[2]" />
        </div>

        <div className="flex items-center gap-1.5 border-l border-border/60 pl-2">
          <span className="font-mono text-[11px] font-bold tracking-wider uppercase text-foreground">
            {currentLanguage.short}
          </span>
          <span className="hidden sm:inline-block text-[11px] text-muted-foreground font-normal">
            ({currentLanguage.label})
          </span>
        </div>

        <ChevronDown
          className={cn(
            "text-muted-foreground/70 group-hover:text-foreground ml-0.5 h-3 w-3 transition-transform duration-200 ease-out",
            isOpen && "rotate-180"
          )}
        />
      </Menu.Trigger>

      <Menu.Portal>
        <Menu.Positioner side={side} align="end" sideOffset={6} className="z-max">
          <Menu.Popup
            className={cn(
              "w-56 overflow-hidden rounded-2xl border border-border/80 bg-popover/95 p-1.5 text-popover-foreground shadow-xl backdrop-blur-xl",
              "animate-in fade-in-0 zoom-in-95 duration-150 ease-out focus-visible:outline-none"
            )}
          >
            {/* Header section */}
            <div className="flex items-center justify-between px-2.5 py-1.5 pb-2 text-[10px] font-bold tracking-widest text-muted-foreground/80 uppercase select-none border-b border-border/40 mb-1">
              <span>
                <I18n>Language</I18n>
              </span>
              <span className="font-mono text-[9px] text-muted-foreground/60">i18n</span>
            </div>

            <div className="flex flex-col gap-0.5">
              {routing.locales.map((locale) => {
                const option = languageMeta[locale as Locale];
                const isActive = locale === currentLocale;

                return (
                  <Menu.Item
                    key={locale}
                    onClick={() => switchLanguage(locale as Locale)}
                    className={cn(
                      "group relative flex cursor-pointer items-center justify-between rounded-xl px-2.5 py-2 text-xs transition-all duration-150 outline-none select-none",
                      isActive
                        ? "bg-accent text-accent-foreground font-semibold"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground focus:bg-muted/60 focus:text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      {/* Monospace Short Code Badge */}
                      <span
                        className={cn(
                          "flex h-6 w-7 items-center justify-center rounded-lg border font-mono text-[10px] font-bold tracking-wider uppercase transition-colors",
                          isActive
                            ? "border-primary/30 bg-primary/10 text-primary"
                            : "border-border/60 bg-muted/40 text-muted-foreground group-hover:border-border group-hover:text-foreground"
                        )}
                      >
                        {option.short}
                      </span>

                      {/* Language Title & Hint */}
                      <div className="flex flex-col gap-0.5">
                        <span
                          className={cn(
                            "text-xs font-semibold leading-none",
                            isActive ? "text-foreground" : "text-foreground/80 group-hover:text-foreground"
                          )}
                        >
                          {option.label}
                        </span>
                        <span className="text-[10px] leading-none text-muted-foreground">
                          {option.hint}
                        </span>
                      </div>
                    </div>

                    {/* Active Checkmark */}
                    {isActive && (
                      <div className="flex h-4 w-4 items-center justify-center text-primary">
                        <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                      </div>
                    )}
                  </Menu.Item>
                );
              })}
            </div>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}