import React from "react";
import {
  Activity,
  BookOpen,
  BriefcaseBusiness,
  Clock3,
  FolderKanban,
  Images,
  MessageSquareQuote,
  Users,
  Database,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { getPublicHealth } from "@/shared/server/site-status/public-health.service";
import { getPublicStats } from "@/shared/server/site-status/public-stats.service";
import { AnimatedCount } from "./AnimatedCount";
import { cn } from "@/lib/utils";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import I18n from "@/shared/components/I18n";

function formatDateTime(value: string | null, locale: string) {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

interface AdminStatsOverviewProps {
  locale: string;
  variant?: "default" | "minimal" | "luxury";
}

export async function AdminStatsOverview({ locale, variant = "default" }: AdminStatsOverviewProps) {
  const [stats, health] = await Promise.all([getPublicStats(), getPublicHealth()]);

  const isHealthy = health.status === "ok";
  const isDbUp = health.checks.database === "up";

  const primaryCards = [
    {
      key: "publishedContent",
      label: "Published Content",
      value: stats.overview.publishedContent,
      helper: "Active blogs, articles & guides",
      icon: Activity,
    },
    {
      key: "showcase",
      label: "Showcase Assets",
      value: stats.overview.activeShowcase,
      helper: "Featured projects & case studies",
      icon: FolderKanban,
    },
    {
      key: "business",
      label: "Business Records",
      value: stats.overview.activeBusinessRecords,
      helper: "Active records",
      icon: BriefcaseBusiness,
    },
    {
      key: "brand",
      label: "Brand Assets",
      value: stats.overview.configuredBrandAssets,
      helper: "Galleries, heroes & media",
      icon: Images,
    },
  ];

  const moduleCards = [
    { key: "projects", label: "Projects", value: stats.entities.projects, icon: FolderKanban },
    { key: "blogs", label: "Blogs", value: stats.entities.blogs, icon: BookOpen },
    {
      key: "testimonials",
      label: "Testimonials",
      value: stats.entities.testimonials,
      icon: MessageSquareQuote,
    },
  ];

  return (
    <section className="w-full max-w-full space-y-6 overflow-hidden antialiased sm:space-y-8">
      {/* 🟢 Top Metric Cards Row (Vercel Grid Style) */}
      <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {primaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <Card
              key={card.key}
              className={cn(
                "group border-border/80 bg-card/60 hover:border-border hover:bg-card/90 relative min-h-[130px] min-w-0 overflow-hidden border p-0 shadow-2xs backdrop-blur-md transition-all duration-300",
                variant === "luxury" &&
                  "border-primary/20 from-card via-card/80 to-primary/5 bg-gradient-to-br",
                variant === "minimal" && "border-border/60 bg-transparent shadow-none"
              )}
            >
              {/* Subtle Radial Glow */}
              <div className="bg-primary/10 group-hover:bg-primary/20 pointer-events-none absolute -top-8 -right-8 h-20 w-20 rounded-full blur-xl transition-opacity" />

              <CardContent className="relative z-10 flex h-full w-full items-start justify-between gap-3 p-5">
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="text-muted-foreground truncate text-[10px] font-bold tracking-widest uppercase">
                    {card.label}
                  </p>

                  <div className="block truncate pt-0.5">
                    <AnimatedCount
                      value={card.value}
                      locale={locale}
                      variant="glow"
                      size="2xl"
                      className="text-foreground font-extrabold tracking-tight"
                    />
                  </div>

                  <p className="text-muted-foreground/80 truncate pt-1 text-[11px] leading-relaxed font-medium">
                    {card.helper}
                  </p>
                </div>

                <div className="border-primary/20 bg-primary/10 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border shadow-2xs select-none">
                  <Icon className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 🟢 Middle Detailed Grid: Module Snapshot & System Status */}
      <div className="grid w-full items-start gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        {/* Module Snapshot Card */}
        <Card className="border-border/80 bg-card/60 min-w-0 border shadow-2xs backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between gap-4 p-5 pb-3">
            <div className="min-w-0 flex-1">
              <CardTitle className="text-foreground truncate text-base font-bold tracking-tight">
                <I18n>Platform Snapshot</I18n>
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-0.5 truncate text-xs font-medium">
                <I18n>Live metrics for key content modules</I18n>
              </CardDescription>
            </div>
            <div className="border-border/80 bg-muted/30 text-muted-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border">
              <Clock3 className="h-4 w-4" />
            </div>
          </CardHeader>

          <CardContent className="p-5 pt-2">
            <div className="grid w-full gap-3 sm:grid-cols-2">
              {moduleCards.map((card) => {
                const Icon = card.icon;

                return (
                  <div
                    key={card.key}
                    className="border-border/60 bg-muted/20 hover:bg-muted/50 flex items-center gap-3 rounded-xl border p-3.5 transition-colors"
                  >
                    <div className="border-border/80 bg-card text-muted-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border shadow-2xs">
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-muted-foreground truncate text-[10px] font-bold tracking-widest uppercase">
                        {card.label}
                      </p>
                      <div className="block truncate">
                        <AnimatedCount
                          value={card.value}
                          locale={locale}
                          variant="primary"
                          size="lg"
                          className="text-foreground font-bold"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* System Integrity & Health Status Card */}
        <Card className="border-border/80 bg-card/60 min-w-0 border shadow-2xs backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between gap-4 p-5 pb-3">
            <div className="min-w-0 flex-1 space-y-0.5">
              <p className="text-primary text-[10px] font-bold tracking-widest uppercase">
                <I18n>Infrastructure</I18n>
              </p>
              <CardTitle className="text-foreground truncate text-base font-bold tracking-tight">
                <I18n>System Health</I18n>
              </CardTitle>
            </div>

            <Badge
              variant="outline"
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase select-none",
                isHealthy
                  ? "border-success/20 bg-success/10 text-success"
                  : "border-warning/20 bg-warning/10 text-warning"
              )}
            >
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  isHealthy ? "bg-success animate-pulse" : "bg-warning"
                )}
              />
              {isHealthy ? "Healthy" : "Degraded"}
            </Badge>
          </CardHeader>

          <CardContent className="space-y-4 p-5 pt-1">
            <p className="text-muted-foreground text-xs leading-relaxed font-medium">
              <I18n>Real-time database connectivity and runtime status.</I18n>
            </p>

            <dl className="w-full space-y-2.5 text-xs">
              <div className="border-border/60 flex items-center justify-between border-b pb-2">
                <dt className="text-muted-foreground flex items-center gap-1.5 font-medium">
                  <Database className="text-muted-foreground/70 h-3.5 w-3.5" />
                  <I18n>Database</I18n>
                </dt>
                <dd
                  className={cn(
                    "inline-flex items-center gap-1 text-[11px] font-bold tracking-wider uppercase",
                    isDbUp ? "text-success" : "text-destructive"
                  )}
                >
                  {isDbUp ? (
                    <>
                      <CheckCircle2 className="h-3 w-3" /> <I18n>Operational</I18n>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-3 w-3" /> <I18n>Offline</I18n>
                    </>
                  )}
                </dd>
              </div>

              <div className="border-border/60 flex items-center justify-between border-b pb-2">
                <dt className="text-muted-foreground font-medium">
                  <I18n>Last Updated</I18n>
                </dt>
                <dd className="text-foreground font-semibold">
                  {formatDateTime(stats.overview.lastUpdatedAt, locale)}
                </dd>
              </div>

              <div className="border-border/60 flex items-center justify-between border-b pb-2">
                <dt className="text-muted-foreground font-medium">
                  <I18n>Health Check At</I18n>
                </dt>
                <dd className="text-foreground font-semibold">
                  {formatDateTime(health.checkedAt, locale)}
                </dd>
              </div>

              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground font-medium">
                  <I18n>Taxonomy Coverage</I18n>
                </dt>
                <dd className="text-foreground font-bold">
                  <AnimatedCount
                    value={
                      stats.entities.categories +
                      stats.entities.tags +
                      stats.entities.specializations
                    }
                    locale={locale}
                    size="sm"
                    className="text-foreground"
                  />
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
