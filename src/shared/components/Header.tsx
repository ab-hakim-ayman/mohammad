"use client";

import { Link } from "@/shared/i18n";
import LanguageSwitcher from "@/shared/i18n/components/LanguageSwitcher";
import { ThemeToggle } from "@/shared/theme";
import { Menu, ArrowRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState, Suspense } from "react";
import type { SiteInfoRecord } from "@/features/site-info";

import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import I18n from "@/shared/components/I18n";
import { cn } from "@/lib/utils";

const navigation = [
  { key: "work", label: "Work", href: "/projects" },
  { key: "projects", label: "Projects", href: "/projects" },
  { key: "caseStudies", label: "Case Studies", href: "/case-studies" },
  { key: "blogs", label: "Blogs", href: "/blogs" },
  { key: "contact", label: "Contact", href: "/contact" },
] as const;

export type HeaderVariant = "classic" | "glassmorphic" | "brutalist" | "gradient-glow" | "minimal";

interface HeaderProps {
  siteInfo?: SiteInfoRecord | null;
  variant?: HeaderVariant;
}

export function Header({ variant = "classic" }: HeaderProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActiveLink = useCallback(
    (href: string) => {
      if (href === "/") return pathname === href;
      return pathname.startsWith(href);
    },
    [pathname]
  );

  const variantStyles = {
    classic: mounted && isScrolled
      ? "bg-background/80 border-b border-border/60 shadow-2xs backdrop-blur-md"
      : "bg-transparent border-b border-transparent",
    glassmorphic: "bg-background/60 backdrop-blur-xl border-b border-border/50 shadow-2xs",
    brutalist: "bg-card border-b-4 border-border-strong shadow-md font-mono",
    "gradient-glow":
      "bg-background/80 backdrop-blur-md border-b border-border/60 relative after:absolute after:bottom-0 after:left-1/4 after:w-1/2 after:h-[1px] after:bg-gradient-to-r after:from-transparent after:via-primary/50 after:to-transparent",
    minimal: "bg-background border-b border-border/50",
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 w-full transition-all duration-300 select-none",
        variantStyles[variant]
      )}
    >
      <nav className="container-custom mx-auto flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Brand Name / Mohammad.dev */}
        <Link href="/" className="group inline-flex min-w-0 shrink-0 items-center gap-2">
          <span className="text-foreground text-base sm:text-lg font-bold tracking-tight font-mono hover:text-primary transition-colors">
            Mohammad.dev
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden items-center gap-6 lg:flex">
          {navigation.map((item) => {
            const active = isActiveLink(item.href);
            return (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  "text-xs sm:text-sm font-medium transition-colors tracking-wide",
                  active
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <I18n>{item.label}</I18n>
              </Link>
            );
          })}
        </div>

        {/* Right Actions Toolbar */}
        <div className="relative z-50 flex shrink-0 items-center gap-3">
          <div className="hidden sm:block">
            <Suspense
              fallback={<div className="w-10 h-8 bg-muted border border-border/60 rounded-full animate-pulse" />}
            >
              <LanguageSwitcher />
            </Suspense>
          </div>

          <ThemeToggle />

          {/* Mobile Sheet Drawer Trigger */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger
              render={
                <button
                  className="border-border/80 hover:bg-muted/80 inline-flex h-9 w-9 cursor-pointer items-center justify-center border bg-transparent p-0 text-muted-foreground outline-none lg:hidden rounded-full transition-colors"
                />
              }
            >
              <Menu className="h-4 w-4" />
            </SheetTrigger>

            <SheetContent
              side="right"
              className="border-border/80 bg-background/95 z-max flex w-[min(22rem,calc(100vw-1rem))] flex-col gap-4 rounded-l-2xl border-l p-6 shadow-2xl backdrop-blur-xl text-foreground"
            >
              <SheetTitle className="sr-only">
                <I18n>Mobile Navigation Drawer</I18n>
              </SheetTitle>

              <div className="border-border/60 flex items-center justify-between border-b pb-3">
                <span className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
                  <I18n>Main Navigation</I18n>
                </span>
                <div className="sm:hidden">
                  <Suspense
                    fallback={<div className="w-10 h-8 bg-muted border border-border/60 rounded-full animate-pulse" />}
                  >
                    <LanguageSwitcher />
                  </Suspense>
                </div>
              </div>

              <div className="flex-1 space-y-2 overflow-y-auto pr-0.5 pt-2">
                {navigation.map((item) => {
                  const active = isActiveLink(item.href);
                  return (
                    <Link
                      key={item.key}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={cn(
                        "flex items-center justify-between rounded-lg px-3.5 py-2.5 text-sm font-medium transition-all",
                        active
                          ? "bg-primary text-primary-foreground font-semibold shadow-2xs"
                          : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                      )}
                    >
                      <I18n>{item.label}</I18n>
                      <ArrowRight className="h-3.5 w-3.5 opacity-60" />
                    </Link>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}