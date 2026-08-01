"use client";

import * as React from "react";
import { useSidebar } from "@/components/ui/sidebar";
import {
    Globe,
    UserCheck,
    LogOut,
    ExternalLink,
    PanelLeftClose,
    PanelLeftOpen,
    ChevronDown,
} from "lucide-react";
import I18n from "@/shared/components/I18n";
import { ThemeToggle } from "@/shared/theme";
import LanguageSwitcher from "@/shared/i18n/components/LanguageSwitcher";
import { useCurrentUser, useLogout } from "@/features/auth";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { Link } from "@/shared/i18n";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

function getInitials(name?: string | null, email?: string | null) {
    const source = (name || email || "A2I").trim();
    return source
        .split(/\s+/)
        .slice(0, 2)
        .map((item) => item[0]?.toUpperCase() ?? "")
        .join("");
}

export function AdminHeader() {
    const { open, toggleSidebar } = useSidebar();
    const router = useRouter();
    const pathname = usePathname();
    const locale = useLocale();
    const logout = useLogout();
    const { data: userData } = useCurrentUser();

    const [isProfileOpen, setIsProfileOpen] = React.useState(false);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    const currentUser = userData?.data?.user;
    const profileName = currentUser?.profile?.fullName || currentUser?.name || currentUser?.email;
    const profileAvatar = currentUser?.profile?.avatar || currentUser?.avatar;
    const profileLabel = currentUser?.profile?.designation || currentUser?.role || "Admin";
    const initials = getInitials(profileName, currentUser?.email);

    // Outside click to close profile menu
    React.useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await logout.mutateAsync();
        router.push(`/${locale}/login`);
    };

    const isMyProfileActive = pathname?.includes("/admin/profiles/me");

    return (
        <header className="border-border/60 bg-background/80 z-20 flex h-13 sm:h-14 shrink-0 items-center justify-between border-b px-3.5 sm:px-5 backdrop-blur-xl select-none">
            {/* Left: Sidebar Trigger & Workspace Quick Actions */}
            <div className="flex items-center gap-2.5">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleSidebar}
                    className="border-border/80 bg-muted/30 hover:bg-muted/80 text-muted-foreground hover:text-foreground h-8 w-8 cursor-pointer rounded-xl border shadow-2xs transition-all"
                >
                    {open ? (
                        <PanelLeftClose className="h-4 w-4" />
                    ) : (
                        <PanelLeftOpen className="h-4 w-4" />
                    )}
                    <span className="sr-only">Toggle Sidebar</span>
                </Button>
            </div>

            {/* Right Actions: Go to Site, Language, Theme & Profile Dropdown */}
            <div className="flex items-center gap-2.5 sm:gap-3">
                {/* Go to Site Button - Vercel Pill Style */}
                <Link
                    href="/"
                    target="_blank"
                    className="border-border/80 bg-muted/20 text-muted-foreground hover:border-primary/40 hover:bg-muted/60 hover:text-foreground inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-semibold transition-all shadow-2xs"
                >
                    <Globe className="h-3.5 w-3.5 text-primary" />
                    <span className="hidden sm:inline">
                        <I18n>Go to site</I18n>
                    </span>
                    <ExternalLink className="h-3 w-3 opacity-60" />
                </Link>

                <div className="bg-border/60 h-4 w-[1px]" />

                {/* Language Switcher & Theme Toggle */}
                <div className="flex items-center gap-1">
                    <React.Suspense
                        fallback={<div className="w-10 h-8 bg-card rounded-full border border-border/60 animate-pulse" />}
                    >
                        <LanguageSwitcher side="bottom" />
                    </React.Suspense>
                    <ThemeToggle />
                </div>

                <div className="bg-border/60 h-4 w-[1px]" />

                {/* Profile Avatar Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        type="button"
                        onClick={() => setIsProfileOpen((prev) => !prev)}
                        className="focus:outline-none flex items-center gap-1.5 cursor-pointer group"
                    >
                        <div className="border-border/80 bg-muted/50 relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border text-xs font-bold transition-transform group-hover:scale-105 shadow-2xs">
                            {profileAvatar ? (
                                <Image
                                    src={profileAvatar}
                                    alt={profileName || "Avatar"}
                                    fill
                                    sizes="32px"
                                    unoptimized
                                    className="object-cover"
                                />
                            ) : (
                                <span className="text-muted-foreground text-[11px]">{initials}</span>
                            )}
                        </div>
                    </button>

                    {/* Floating Profile Menu Box */}
                    {isProfileOpen && (
                        <div className="border-border/80 bg-popover/90 shadow-xl animate-in fade-in-80 zoom-in-95 absolute right-0 mt-2 w-56 rounded-xl border p-1.5 backdrop-blur-xl z-50">
                            <div className="px-3 py-2 border-b border-border/60 mb-1">
                                <p className="text-foreground truncate text-xs font-bold leading-tight">{profileName}</p>
                                <p className="text-primary mt-0.5 text-[10px] font-bold tracking-wider uppercase truncate">
                                    {profileLabel}
                                </p>
                            </div>

                            <Link
                                href="/admin/profiles/me"
                                onClick={() => setIsProfileOpen(false)}
                                className={cn(
                                    "group flex h-8.5 w-full items-center gap-2.5 rounded-lg px-2.5 text-xs font-semibold transition-all cursor-pointer",
                                    isMyProfileActive
                                        ? "bg-primary/10 text-primary font-bold"
                                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                                )}
                            >
                                <UserCheck className={cn("h-3.5 w-3.5 shrink-0", isMyProfileActive ? "text-primary" : "text-muted-foreground")} />
                                <span><I18n>My Profile</I18n></span>
                            </Link>

                            <button
                                type="button"
                                onClick={handleLogout}
                                className="group flex h-8.5 w-full items-center gap-2.5 rounded-lg px-2.5 text-xs font-bold text-destructive hover:bg-destructive/10 transition-all cursor-pointer mt-1"
                            >
                                <LogOut className="h-3.5 w-3.5 shrink-0 text-destructive/80 group-hover:text-destructive" />
                                <span><I18n>Logout</I18n></span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}