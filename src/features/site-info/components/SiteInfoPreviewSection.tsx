"use client";
import Image from "next/image";
import { Building2, Mail, MapPin, Phone } from "lucide-react";
import { PreviewSectionHeader } from "@/shared/components";
import { Skeleton } from "@/components/ui/skeleton";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import I18n from "@/shared/components/I18n";
import { usePublicSiteInfo } from "../hooks/useSiteInfo";

const sectionVariants = cva("relative w-full transition-all duration-500 overflow-hidden", {
  variants: {
    variant: {
      classic: "bg-transparent",
      glassmorphic: "bg-transparent",
      brutalist: "bg-transparent",
      gradientGlow: "bg-transparent",
      minimal: "bg-transparent",
    },
    size: {
      sm: "py-6",
      default: "py-12",
      lg: "py-16",
    },
  },
  defaultVariants: {
    variant: "classic",
    size: "default",
  },
});

type SiteInfoPreviewSectionProps = VariantProps<typeof sectionVariants>;

export function SiteInfoPreviewSection({ variant, size }: SiteInfoPreviewSectionProps) {
  const { data, isLoading, error } = usePublicSiteInfo();

  if (isLoading) {
    return (
      <section
        className={cn(
          "bg-background text-foreground relative w-full overflow-hidden px-4 transition-all duration-300 sm:px-6",
          sectionVariants({ variant, size })
        )}
      >
        <div className="container-custom mx-auto w-full">
          <Skeleton className="mb-6 h-10 w-64 rounded" />
          <div className="3xl:grid-cols-4 5xl:grid-cols-8 grid gap-6 lg:grid-cols-2">
            <Skeleton className="border-border bg-surface-elevated/50 h-56 rounded-xl border" />
            <Skeleton className="border-border bg-surface-elevated/50 h-56 rounded-xl border" />
          </div>
        </div>
      </section>
    );
  }

  if (error || !data?.data) return null;
  const siteInfo = data.data;

  return (
    <section
      className={cn(
        "bg-background text-foreground relative w-full overflow-hidden px-4 transition-all duration-300 sm:px-6",
        sectionVariants({ variant, size })
      )}
    >
      <div className="container-custom mx-auto w-full">
        <PreviewSectionHeader
          eyebrow="Site profile"
          title={siteInfo.fullName}
          description={
            siteInfo.shortDesc || siteInfo.tagline || "Public company profile and contact signals."
          }
          href="/site-info"
          ctaLabel="Full profile"
        />
        <div className="3xl:grid-cols-5 5xl:grid-cols-8 mt-10 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="border-border bg-card rounded-none border p-8 sm:rounded-lg sm:p-10">
            <div className="flex flex-wrap items-center gap-4">
              {siteInfo.logo ? (
                <div className="relative h-14 w-14">
                  <Image
                    src={siteInfo.logo}
                    alt={siteInfo.title}
                    fill
                    sizes="56px"
                    unoptimized
                    className="object-contain p-2"
                  />
                </div>
              ) : (
                <div className="text-foreground inline-flex h-14 w-14 items-center justify-center">
                  <Building2 className="h-6 w-6" />
                </div>
              )}
              <div>
                <p className="text-primary text-xs font-semibold tracking-[0.18em] uppercase">
                  {siteInfo.title}
                </p>
                {siteInfo.tagline ? (
                  <p className="text-foreground mt-2 text-2xl font-semibold tracking-tighter">
                    {siteInfo.tagline}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
          <div className="border-border bg-background hover:border-primary/30 rounded-none border p-6 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-md sm:rounded-xl sm:p-7">
            <h2 className="text-foreground text-lg font-semibold">
              <I18n>Contact snapshot</I18n>
            </h2>
            <div className="text-muted-foreground mt-4 space-y-3 text-sm">
              {siteInfo.email ? (
                <div className="flex items-start gap-3">
                  <Mail className="text-primary mt-0.5 h-4 w-4" />
                  <span>{siteInfo.email}</span>
                </div>
              ) : null}
              {siteInfo.phone ? (
                <div className="flex items-start gap-3">
                  <Phone className="text-primary mt-0.5 h-4 w-4" />
                  <span>{siteInfo.phone}</span>
                </div>
              ) : null}
              {siteInfo.address ? (
                <div className="flex items-start gap-3">
                  <MapPin className="text-primary mt-0.5 h-4 w-4" />
                  <span>{siteInfo.address}</span>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
