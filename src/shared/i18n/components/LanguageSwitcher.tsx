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
          "group inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full border border-gray-800 bg-[#161616] px-3 text-xs font-medium text-gray-300 transition-all duration-200 outline-none select-none",
          "hover:border-gray-700 hover:text-white",
          isOpen && "border-gray-700 text-white bg-[#1e1e1e]"
        )}
      >
        <span className="text-sm leading-none">{currentLanguage.flag}</span>
        <span className="text-xs font-semibold tracking-tight">{currentLanguage.label}</span>
        <ChevronDown
          className={cn(
            "text-gray-400 group-hover:text-white ml-0.5 h-3 w-3 transition-transform duration-200 ease-out",
            isOpen && "rotate-180"
          )}
        />
      </Menu.Trigger>

      <Menu.Portal>
        {/* z-[9999] দিয়ে ড্রপডাউনকে হেডারের উপরে ফিক্সড করা হয়েছে */}
        <Menu.Positioner side={side} align="end" sideOffset={10} className="z-[9999]">
          <Menu.Popup
            className={cn(
              "w-48 overflow-hidden rounded-xl border border-gray-800 bg-[#161616] p-1.5 text-gray-200 shadow-2xl backdrop-blur-xl",
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
                        ? "bg-gray-800 text-white font-semibold"
                        : "text-gray-400 hover:bg-gray-800/60 hover:text-white focus:bg-gray-800/60 focus:text-white"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm leading-none">{option.flag}</span>
                      <span className="text-xs font-medium">{option.label}</span>
                    </div>

                    {isActive && (
                      <div className="flex h-4 w-4 items-center justify-center text-green-400">
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