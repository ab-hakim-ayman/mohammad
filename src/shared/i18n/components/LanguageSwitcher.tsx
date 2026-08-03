"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { usePathname, useRouter } from "@/shared/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { routing } from "@/shared/i18n/routing";
import type { Locale } from "@/shared/i18n/config";
import { cn } from "@/lib/utils";

import { Menu } from "@base-ui/react";
import { useLocale } from "next-intl";

const languageMeta: Record<Locale, { label: string; flag: string }> = {
  en: { label: "English", flag: "🇺🇸" },
  bn: { label: "বাংলা", flag: "🇧🇩" },
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
      {/* Minimal Header Trigger Button */}
      <Menu.Trigger
        type="button"
        aria-label="Select language"
        className={cn(
          "group inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full border border-border/80 bg-card/60 px-3 text-xs font-medium text-muted-foreground backdrop-blur-md transition-all duration-200 outline-none select-none shadow-2xs",
          "hover:border-border-strong hover:text-foreground hover:bg-card hover:shadow-xs",
          "focus-visible:ring-2 focus-visible:ring-primary/20",
          isOpen && "border-border-strong text-foreground bg-accent shadow-xs"
        )}
      >
        <span className="text-sm leading-none">{currentLanguage.flag}</span>
        <span className="text-xs font-semibold tracking-tight">{currentLanguage.label}</span>
        <ChevronDown
          className={cn(
            "text-muted-foreground group-hover:text-foreground ml-0.5 h-3 w-3 transition-transform duration-200 ease-out",
            isOpen && "rotate-180 text-foreground"
          )}
        />
      </Menu.Trigger>

      <Menu.Portal>
        {/* z-[9999] দিয়ে ড্রপডাউনকে হেডারের উপরে ফিক্সড করা হয়েছে */}
        <Menu.Positioner side={side} align="end" sideOffset={10} className="z-[9999]">
          <Menu.Popup
            className={cn(
              "w-48 overflow-hidden rounded-xl border border-border/80 bg-popover/90 p-1.5 text-popover-foreground shadow-xl backdrop-blur-xl",
              "animate-in fade-in-0 zoom-in-95 duration-150 ease-out focus-visible:outline-none"
            )}
          >
            <div className="flex flex-col gap-0.5">
              {routing.locales.map((locale) => {
                const option = languageMeta[locale as Locale];
                const isActive = locale === currentLocale;

                return (
                  <Menu.Item
                    key={locale}
                    onClick={() => switchLanguage(locale as Locale)}
                    className={cn(
                      "group relative flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-xs transition-all duration-150 outline-none select-none",
                      isActive
                        ? "bg-accent text-accent-foreground font-semibold"
                        : "text-muted-foreground hover:bg-accent/60 hover:text-accent-foreground focus:bg-accent/60 focus:text-accent-foreground"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm leading-none">{option.flag}</span>
                      <span className="text-xs font-medium">{option.label}</span>
                    </div>

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