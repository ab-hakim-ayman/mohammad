"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { Link } from "@/shared/i18n";

import {
  LayoutDashboard,
  Users,
  Briefcase,
  Layers,
  FileText,
  Settings,
  Image as ImageIcon,
  MessageSquare,
  Tag,
  Star,
  Globe,
  Contact,
  Activity,
  Info,
  Calendar,
  HelpCircle,
  FolderOpen,
  Mail,
  Cpu,
  Award,
  Trophy,
  ShieldAlert,
  GraduationCap,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";

import I18n from "@/shared/components/I18n";

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface SidebarGroupType {
  label: string;
  items: SidebarItem[];
}

const sidebarGroups: SidebarGroupType[] = [
  {
    label: "Main",
    items: [
      { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { name: "Users", href: "/admin/users", icon: Users },
      { name: "Profile Directory", href: "/admin/profiles", icon: Contact },
      { name: "Audit Logs", href: "/admin/audit-logs", icon: Activity },
    ],
  },
  {
    label: "Company",
    items: [
      { name: "About Us", href: "/admin/about", icon: Info },
      { name: "Contact Us", href: "/admin/contacts", icon: Mail },
    ],
  },
  {
    label: "Portfolio",
    items: [
      { name: "Projects", href: "/admin/projects", icon: Briefcase },
      { name: "Experiences", href: "/admin/experiences", icon: Briefcase },
      { name: "Educations", href: "/admin/educations", icon: GraduationCap },
      { name: "Services", href: "/admin/services", icon: Layers },
      { name: "Case Studies", href: "/admin/case-studies", icon: FileText },
      { name: "Achievements", href: "/admin/achievements", icon: Trophy },
    ],
  },
  {
    label: "Content",
    items: [
      { name: "Blogs", href: "/admin/blogs", icon: FileText },
      { name: "Categories", href: "/admin/categories", icon: FolderOpen },
      { name: "Media", href: "/admin/media", icon: ImageIcon },
      { name: "Galleries", href: "/admin/galleries", icon: ImageIcon },
    ],
  },
  {
    label: "Engagement",
    items: [
      { name: "Testimonials", href: "/admin/testimonials", icon: Star },
      { name: "FAQs", href: "/admin/faqs", icon: HelpCircle },
      { name: "Tags", href: "/admin/tags", icon: Tag },
    ],
  },
  {
    label: "Expertise",
    items: [
      { name: "Skills", href: "/admin/skills", icon: Award },
      { name: "Specializations", href: "/admin/specializations", icon: Award },
      { name: "Technologies", href: "/admin/technologies", icon: Cpu },
    ],
  },
  {
    label: "System",
    items: [
      { name: "Site Info", href: "/admin/site-info", icon: Settings },
      { name: "Heroes", href: "/admin/heroes", icon: Globe },
    ],
  },
];

export function AdminSidebar({ userRole }: { userRole?: string }) {
  const pathname = usePathname();
  const locale = useLocale();

  const normalizedPath = React.useMemo(() => {
    if (!pathname) return "/admin";

    let clean = pathname.replace(new RegExp(`^/${locale}`), "");
    if (!clean) clean = "/";
    if (clean.length > 1 && clean.endsWith("/")) {
      clean = clean.slice(0, -1);
    }

    return clean;
  }, [pathname, locale]);

  const checkIsActive = React.useCallback(
    (href: string) => {
      const cleanHref = href.length > 1 && href.endsWith("/") ? href.slice(0, -1) : href;

      if (cleanHref === "/admin") {
        return normalizedPath === "/admin";
      }

      return (
        normalizedPath === cleanHref || normalizedPath.startsWith(`${cleanHref}/`)
      );
    },
    [normalizedPath]
  );

  return (
    <Sidebar collapsible="icon" className="border-border/60 bg-sidebar/95 border-r backdrop-blur-xl">
      {/* Workspace Brand Header */}
      <SidebarHeader className="p-3.5">
        <div className="border border-border/80 bg-card/60 animate-in fade-in flex flex-col gap-1 rounded-xl px-3.5 py-3 shadow-2xs backdrop-blur-md duration-300 group-data-[collapsible=icon]:hidden">
          <div className="flex items-center gap-2">
            <span className="bg-primary/10 border border-primary/20 text-primary flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[10px] font-black">
              A2I
            </span>
            <p className="text-primary text-[10px] font-bold tracking-widest uppercase">
              <I18n>Admin Workspace</I18n>
            </p>
          </div>
          <p className="text-muted-foreground truncate text-xs font-medium leading-tight">
            <I18n>Platform Control Panel</I18n>
          </p>
        </div>
      </SidebarHeader>

      {/* Main Sidebar Scroll Area */}
      <SidebarContent className="gap-1 px-2 pb-4">
        {userRole === "EMPLOYEE" ? (
          <SidebarGroup>
            <SidebarGroupLabel className="text-muted-foreground/60 px-3 text-[10px] font-bold tracking-widest uppercase group-data-[collapsible=icon]:hidden">
              <I18n>Personal</I18n>
            </SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                {(() => {
                  const active = checkIsActive("/admin/profiles/me");
                  return (
                    <SidebarMenuButton
                      isActive={active}
                      tooltip="My Profile"
                      className={cn(
                        "p-0 overflow-hidden transition-all rounded-xl",
                        active
                          ? "bg-primary/10 text-primary font-bold shadow-2xs"
                          : "hover:bg-muted/60 text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <Link
                        href="/admin/profiles/me"
                        className="flex h-9 w-full items-center justify-start gap-2.5 px-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
                      >
                        <Contact className={cn("h-4 w-4 shrink-0 transition-colors", active ? "text-primary" : "text-muted-foreground")} />
                        <span className="truncate text-xs font-medium tracking-wide group-data-[collapsible=icon]:hidden">
                          <I18n>My Profile</I18n>
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  );
                })()}
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        ) : (
          sidebarGroups.map((group, groupIdx) => (
            <SidebarGroup key={groupIdx} className="space-y-0.5 py-1">
              <SidebarGroupLabel className="text-muted-foreground/60 h-6 px-3 text-[10px] font-bold tracking-widest uppercase group-data-[collapsible=icon]:hidden">
                <I18n>{group.label}</I18n>
              </SidebarGroupLabel>
              <SidebarMenu>
                {group.items.map((item) => {
                  const active = checkIsActive(item.href);
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        isActive={active}
                        tooltip={item.name}
                        className={cn(
                          "p-0 overflow-hidden transition-all rounded-xl",
                          active
                            ? "bg-primary/10 text-primary font-semibold shadow-2xs"
                            : "hover:bg-muted/60 text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <Link
                          href={item.href}
                          className="flex h-9 w-full items-center justify-start gap-2.5 px-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
                        >
                          <item.icon
                            className={cn(
                              "h-4 w-4 shrink-0 transition-colors",
                              active ? "text-primary" : "text-muted-foreground/80"
                            )}
                          />
                          <span className="truncate text-xs font-medium tracking-wide group-data-[collapsible=icon]:hidden">
                            <I18n>{item.name}</I18n>
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroup>
          ))
        )}
      </SidebarContent>
    </Sidebar>
  );
}