"use client";

import { useCurrentUser, useLogout } from "@/features/auth";
import type { SiteInfoRecord } from "@/features/site-info";
import { Link } from "@/shared/i18n";
import LanguageSwitcher from "@/shared/i18n/components/LanguageSwitcher";
import { ThemeToggle } from "@/shared/theme";
import { ArrowRight, LayoutGrid, LogOut, Menu, UserCog } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState, Suspense } from "react";
import { usePublicSiteInfo } from "@/features/site-info";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import I18n from "@/shared/components/I18n";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";

const navigation = [
  { key: "home", label: "Home", href: "/" },
  { key: "about", label: "About Us", href: "/about" },
  { key: "services", label: "Services", href: "/services" },
  { key: "caseStudies", label: "Case Studies", href: "/case-studies" },
  { key: "experiences", label: "Experiences", href: "/experiences" },
  { key: "educations", label: "Education", href: "/educations" },
  { key: "technologies", label: "Technologies", href: "/technologies" },
  { key: "blogs", label: "Blogs", href: "/blogs" },
  { key: "contact", label: "Contact Us", href: "/contact" },
] as const;

function getInitials(name?: string | null, email?: string | null) {
  const source = (name || email || "A2I").trim();
  return source
    .split(/\s+/)
    .slice(0, 2)
    .map((item) => item[0]?.toUpperCase() ?? "")
    .join("");
}

function ProfileAvatar({
  src,
  name,
  email,
}: {
  src?: string | null;
  name?: string | null;
  email?: string | null;
}) {
  const initials = getInitials(name, email);
  return (
    <div className="border-border/80 bg-muted/50 text-foreground relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border shadow-2xs select-none transition-transform hover:scale-105">
      {src ? (
        <Image
          src={src}
          alt={name || email || "Profile avatar"}
          fill
          sizes="36px"
          unoptimized
          className="object-cover"
        />
      ) : (
        <span className="text-muted-foreground text-[11px] font-bold tracking-tight">{initials}</span>
      )}
    </div>
  );
}

export type HeaderVariant = "classic" | "glassmorphic" | "brutalist" | "gradient-glow" | "minimal";

interface HeaderProps {
  siteInfo?: SiteInfoRecord | null;
  variant?: HeaderVariant;
}

export function Header({ siteInfo, variant = "classic" }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { data: siteInfoResponse } = usePublicSiteInfo();
  const activeSiteInfo = siteInfo || siteInfoResponse?.data;

  const { data: userData, isLoading: authLoading } = useCurrentUser();
  const logout = useLogout();
  const currentUser = userData?.data?.user;
  const profileName = currentUser?.profile?.fullName || currentUser?.name || currentUser?.email;
  const profileAvatar = currentUser?.profile?.avatar || currentUser?.avatar;
  const profileLabel = currentUser?.profile?.designation || currentUser?.role || "Dashboard";
  const isAuthenticated = !!currentUser && !authLoading;
  const brandTitle = activeSiteInfo?.siteTitle || activeSiteInfo?.companyTitle || "A2ICoders";
  const brandKicker = activeSiteInfo?.businessType || "Software";
  const brandLogoAlt =
    activeSiteInfo?.companyTitle || activeSiteInfo?.siteTitle || brandTitle || "Logo";

  const isActiveLink = useCallback(
    (href: string) => {
      if (href === "/") return pathname === href;
      return pathname.startsWith(href);
    },
    [pathname]
  );

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    setIsMenuOpen(false);
    await logout.mutateAsync();
    router.push("/" + locale + "/login");
  };

  const profileActions = [
    { href: "/admin/profiles/me", icon: UserCog, label: "My Profile" },
    { href: "/admin", icon: LayoutGrid, label: "Dashboard" },
  ];

  const variantStyles = {
    classic: isScrolled
      ? "bg-background/80 border-b border-border/60 shadow-2xs backdrop-blur-md"
      : "bg-transparent border-b border-transparent",
    glassmorphic: "bg-background/60 backdrop-blur-xl border-b border-border/50 shadow-2xs",
    brutalist: "bg-card border-b-4 border-border-strong shadow-md",
    "gradient-glow":
      "bg-background/80 backdrop-blur-md border-b border-border/60 after:absolute after:bottom-0 after:left-1/4 after:w-1/2 after:h-[1px] after:bg-gradient-to-r after:from-transparent after:via-primary/50 after:to-transparent",
    minimal: "bg-background border-b border-border/50",
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 w-full transition-all duration-300 select-none",
        variantStyles[variant]
      )}
    >
      <nav className="container-custom mx-auto flex h-14 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Name */}
        <Link href="/" className="group inline-flex min-w-0 shrink-0 items-center gap-2.5">
          <span
            className={cn(
              "relative inline-flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden transition-all duration-300",
              variant === "brutalist"
                ? "text-foreground border-border-strong bg-warning rounded-none border-2 shadow-md"
                : "border-border/80 bg-muted/30 group-hover:border-primary/50 text-primary rounded-xl border text-xs font-bold shadow-2xs"
            )}
          >
            {activeSiteInfo?.logo || activeSiteInfo?.darkLogo ? (
              <>
                {activeSiteInfo?.logo && (
                  <Image
                    src={activeSiteInfo.logo}
                    alt={brandLogoAlt}
                    fill
                    sizes="36px"
                    unoptimized
                    className="object-contain p-1 dark:hidden"
                  />
                )}
                {activeSiteInfo?.darkLogo && (
                  <Image
                    src={activeSiteInfo.darkLogo}
                    alt={brandLogoAlt}
                    fill
                    sizes="36px"
                    unoptimized
                    className="hidden object-contain p-1 dark:block"
                  />
                )}
              </>
            ) : (
              <I18n>Mohammad</I18n>
            )}
          </span>

          {/* <span className="flex min-w-0 flex-col">
            <span
              className={cn(
                "text-[10px] leading-none font-bold tracking-widest uppercase",
                variant === "brutalist" ? "text-foreground" : "text-primary"
              )}
            >
              {brandKicker}
            </span>
            <span
              className={cn(
                "mt-0.5 truncate text-xs sm:text-sm leading-none font-bold tracking-tight transition-colors",
                variant === "brutalist"
                  ? "text-foreground font-mono"
                  : "text-foreground group-hover:text-primary"
              )}
            >
              {brandTitle}
            </span>
          </span> */}
        </Link>

        {/* 🚀 Navigation Links - High Contrast Vercel Hover Style */}
        <div
          className={cn(
            "hidden items-center gap-1 p-1 lg:flex",
            variant === "brutalist"
              ? "bg-card shadow-brand border-border-strong rounded-none border-2"
              : "bg-muted/30 border-border/80 rounded-full border shadow-2xs backdrop-blur-md"
          )}
        >
          {navigation.map((item) => {
            const active = isActiveLink(item.href);
            return (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  "px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all duration-200 rounded-full",
                  active
                    ? variant === "brutalist"
                      ? "text-background rounded-none bg-foreground font-mono"
                      : "bg-background text-primary border-border border shadow-xs font-bold"
                    : variant === "brutalist"
                      ? "text-foreground hover:bg-muted font-mono"
                      : "text-muted-foreground/90 hover:text-foreground hover:bg-muted/80 hover:shadow-2xs"
                )}
              >
                <I18n>{item.label}</I18n>
              </Link>
            );
          })}
        </div>

        {/* Right Actions Toolbar */}
        <div className="relative z-50 flex shrink-0 items-center gap-2">
          <div className="hidden md:block">
            <Suspense
              fallback={<div className="w-10 h-8 bg-card rounded-full border border-border/60 animate-pulse" />}
            >
              <LanguageSwitcher />
            </Suspense>
          </div>

          <ThemeToggle />

          {/* Profile Dropdown */}
          {isAuthenticated ? (
            <div className="hidden lg:block">
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <button className="flex items-center gap-1.5 rounded-full border-0 bg-transparent p-0 transition-opacity hover:opacity-80 focus:outline-none cursor-pointer" />
                  }
                >
                  <ProfileAvatar
                    src={profileAvatar}
                    name={profileName}
                    email={currentUser?.email}
                  />
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="border-border/80 bg-popover/95 z-50 w-60 rounded-2xl border p-1.5 shadow-xl backdrop-blur-xl animate-in fade-in-80 zoom-in-95"
                >
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="p-1.5 font-normal">
                      <div className="bg-muted/50 border-border/60 flex items-center gap-2.5 rounded-xl border p-2">
                        <ProfileAvatar
                          src={profileAvatar}
                          name={profileName}
                          email={currentUser?.email}
                        />
                        <div className="flex min-w-0 flex-col">
                          <span className="text-foreground truncate text-xs font-bold leading-tight">
                            {profileName}
                          </span>
                          <span className="text-primary mt-0.5 text-[10px] leading-none font-bold tracking-wider uppercase">
                            {profileLabel}
                          </span>
                        </div>
                      </div>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator className="my-1 bg-border/60" />

                    {profileActions.map((item) => {
                      const Icon = item.icon;
                      return (
                        <DropdownMenuItem
                          key={item.href}
                          render={
                            <Link
                              href={item.href}
                              className="text-foreground/90 flex w-full cursor-pointer items-center justify-between rounded-xl px-2.5 py-2 text-xs font-semibold hover:bg-muted/80 hover:text-foreground transition-all focus:outline-none"
                            />
                          }
                        >
                          <span className="inline-flex items-center gap-2">
                            <Icon className="text-muted-foreground h-3.5 w-3.5" />
                            <I18n>{item.label}</I18n>
                          </span>
                          <ArrowRight className="text-muted-foreground/50 h-3 w-3" />
                        </DropdownMenuItem>
                      );
                    })}

                    <DropdownMenuSeparator className="my-1 bg-border/60" />

                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-destructive hover:bg-destructive/10 focus:bg-destructive/10 flex cursor-pointer items-center justify-between rounded-xl px-2.5 py-2 text-xs font-bold transition-colors focus:outline-none"
                    >
                      <span className="inline-flex items-center gap-2">
                        <LogOut className="h-3.5 w-3.5" />
                        <I18n>Logout</I18n>
                      </span>
                      <ArrowRight className="h-3 w-3 opacity-70" />
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Link
              href="/login"
              className={buttonVariants({
                variant: "outline",
                className: cn(
                  "hidden h-8 cursor-pointer px-3.5 text-xs font-bold shadow-2xs lg:inline-flex rounded-full border-border/80 hover:bg-muted/80 hover:border-border transition-all",
                  variant === "brutalist" &&
                  "bg-card text-foreground hover:bg-muted border-border-strong rounded-none border-2 font-mono shadow-md"
                ),
              })}
            >
              <I18n>Login</I18n>
            </Link>
          )}

          {/* Mobile Sheet Drawer Trigger */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger
              render={
                <button
                  className={cn(
                    "border-border/80 hover:bg-muted/80 inline-flex h-9 w-9 cursor-pointer items-center justify-center border bg-transparent p-0 shadow-2xs outline-none lg:hidden rounded-full transition-colors",
                    variant === "brutalist" &&
                    "bg-card text-foreground border-border-strong rounded-none border-2 shadow-md"
                  )}
                />
              }
            >
              <Menu className="h-4 w-4" />
            </SheetTrigger>

            <SheetContent
              side="right"
              className="border-border/80 bg-background/95 z-max flex w-[min(22rem,calc(100vw-1rem))] flex-col gap-4 rounded-l-2xl border-l p-4 shadow-2xl backdrop-blur-xl"
            >
              <SheetTitle className="sr-only">
                <I18n>Mobile Navigation Drawer</I18n>
              </SheetTitle>

              <div className="border-border/60 flex items-center justify-between border-b pb-3">
                <span className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
                  <I18n>Main Navigation</I18n>
                </span>
                <div className="md:hidden">
                  <Suspense
                    fallback={<div className="w-10 h-8 bg-card rounded-full border border-border/60 animate-pulse" />}
                  >
                    <LanguageSwitcher />
                  </Suspense>
                </div>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto pr-0.5">
                {isAuthenticated ? (
                  <Card className="border-border/60 bg-muted/30 overflow-hidden rounded-xl shadow-2xs">
                    <CardContent className="flex items-center gap-3 p-3">
                      <ProfileAvatar
                        src={profileAvatar}
                        name={profileName}
                        email={currentUser?.email}
                      />
                      <div className="flex min-w-0 flex-col">
                        <span className="text-foreground truncate text-xs font-bold">
                          {profileName}
                        </span>
                        <span className="text-primary mt-0.5 text-[10px] font-bold tracking-wider uppercase">
                          {profileLabel}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="border-border/60 bg-card/60 rounded-xl shadow-2xs">
                    <CardContent className="space-y-1 p-3">
                      <h3 className="text-foreground text-xs font-bold">
                        <I18n>Engineering Peace of Mind</I18n>
                      </h3>
                    </CardContent>
                  </Card>
                )}

                <div className="border-border/60 bg-card/40 grid gap-1 rounded-xl border p-1.5 shadow-2xs">
                  {navigation.map((item) => {
                    const active = isActiveLink(item.href);
                    return (
                      <Link
                        key={item.key}
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={cn(
                          "flex items-center justify-between rounded-lg px-3.5 py-2.5 text-xs font-semibold transition-all",
                          active
                            ? "bg-primary text-primary-foreground font-bold shadow-2xs"
                            : "text-foreground/80 hover:bg-muted/80 hover:text-foreground"
                        )}
                      >
                        <I18n>{item.label}</I18n>
                        <ArrowRight className="h-3.5 w-3.5 opacity-60" />
                      </Link>
                    );
                  })}
                </div>

                {isAuthenticated ? (
                  <div className="border-border/60 bg-card/40 grid gap-1 rounded-xl border p-1.5 shadow-2xs">
                    {profileActions.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsMenuOpen(false)}
                          className="text-foreground/80 hover:bg-muted/80 hover:text-foreground flex items-center justify-between rounded-lg px-3 py-2.5 text-xs font-semibold"
                        >
                          <span className="inline-flex items-center gap-2">
                            <Icon className="text-muted-foreground h-3.5 w-3.5" />
                            <I18n>{item.label}</I18n>
                          </span>
                          <ArrowRight className="h-3.5 w-3.5 opacity-60" />
                        </Link>
                      );
                    })}
                    <button
                      onClick={handleLogout}
                      className="text-destructive hover:bg-destructive/10 flex w-full cursor-pointer items-center justify-between rounded-lg border-0 bg-transparent px-3 py-2.5 text-left text-xs font-bold transition-colors"
                    >
                      <span className="inline-flex items-center gap-2">
                        <LogOut className="h-3.5 w-3.5" />
                        <I18n>Logout</I18n>
                      </span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-2 pt-2">
                    <Link
                      href="/contact"
                      onClick={() => setIsMenuOpen(false)}
                      className={buttonVariants({
                        className:
                          "inline-flex h-9 w-full cursor-pointer items-center justify-center rounded-xl text-xs font-bold tracking-wider uppercase shadow-xs",
                      })}
                    >
                      <I18n>Contact Us</I18n>
                      <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}