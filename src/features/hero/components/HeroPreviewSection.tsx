"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { ArrowRight, Download, FileText, Edit3, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useActiveHero } from "../hooks/useHero";
import { usePublicSiteInfo } from "@/features/site-info/hooks/useSiteInfo";
import { FaBehance, FaGithub, FaLinkedin } from "react-icons/fa";
import { SiHuggingface, SiLeetcode } from "react-icons/si";


type HeroSlide = {
  id?: string | number;
  slug?: string;
  badge?: string | null;
  title?: string | null;
  shortDesc?: string | null;
  heroVideoUrl?: string | null;
  heroImage?: string | null;
  ctaText?: string | null;
  ctaLink?: string | null;
  secondaryCtaText?: string | null;
  secondaryCtaLink?: string | null;
};

type SiteInfoType = {
  logo?: string | null;
  title?: string | null;
  fullName?: string | null;
  tagline?: string | null;
  shortDesc?: string | null;
  github?: string | null;
  linkedin?: string | null;
  behance?: string | null;
  leetcode?: string | null;
  huggingface?: string | null;
  resumeUrl?: string | null;
};

function normalizeHeroes(payload: unknown): HeroSlide[] {
  if (Array.isArray(payload)) return payload as HeroSlide[];
  if (!payload || typeof payload !== "object") return [];
  const record = payload as { data?: unknown; results?: unknown; items?: unknown };
  const nestedList = record.data ?? record.results ?? record.items;
  if (Array.isArray(nestedList)) return nestedList as HeroSlide[];
  return [payload as HeroSlide];
}

export function HeroPreviewSection({
  projectCount = 20,
  sideProjectCount = 3,
  yearsCount = 10,
}: {
  projectCount?: number;
  sideProjectCount?: number;
  yearsCount?: number;
}) {
  const router = useRouter();
  const { data: heroData, isLoading, error } = useActiveHero();
  const { data: siteInfoData } = usePublicSiteInfo();

  const heroes = useMemo(() => normalizeHeroes(heroData?.data ?? heroData), [heroData]);
  const [activeIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const activeHero: HeroSlide = heroes[activeIndex] || heroes[0] || {};
  const siteInfo = (siteInfoData?.data || {}) as SiteInfoType;

  const handleCopyMcp = () => {
    const domain = siteInfo.title || "hafiq.dev";
    const cleanDomain = domain.replace(/^https?:\/\//i, "");
    navigator.clipboard.writeText(`https://${cleanDomain}/api/mcp`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCtaClick = (url?: string | null) => {
    if (!url) return;
    if (/^https?:\/\//i.test(url)) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      router.push(url);
    }
  };

  const fallbackInitials = useMemo(() => {
    if (siteInfo.fullName) {
      return siteInfo.fullName
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
    }
    return "MH";
  }, [siteInfo.fullName]);

  if (isLoading) {
    return (
      <section className="relative bg-background text-foreground min-h-[92vh] w-full flex items-center overflow-hidden">
        {/* Background Grid Texture */}
        <div
          className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 dark:opacity-20 pointer-events-none"
        />

        <div className="max-w-7xl mx-auto w-full px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative z-10 items-center">

          {/* 1. Left Vertical Sidebar Skeleton */}
          <div className="hidden lg:flex lg:col-span-1 flex-col items-center justify-between self-stretch py-2">
            <div className="flex flex-col items-center space-y-4">
              <Skeleton className="w-11 h-11 rounded-full animate-pulse" />
              <Skeleton className="w-3 h-20 rounded animate-pulse" />
            </div>
            <div className="w-px h-56 bg-border my-6" />
            <div className="flex flex-col space-y-5">
              <Skeleton className="w-4 h-4 rounded-full animate-pulse" />
              <Skeleton className="w-4 h-4 rounded-full animate-pulse" />
              <Skeleton className="w-4 h-4 rounded-full animate-pulse" />
              <Skeleton className="w-4 h-4 rounded-full animate-pulse" />
            </div>
          </div>

          {/* 2. Center Content Skeleton */}
          <div className="lg:col-span-7 space-y-6">
            <Skeleton className="h-7 w-56 rounded-full animate-pulse" />
            <div className="space-y-3">
              <Skeleton className="h-6 w-40 rounded animate-pulse" />
              <Skeleton className="h-16 w-full max-w-xl rounded-lg animate-pulse" />
            </div>
            <Skeleton className="h-20 w-full max-w-lg rounded-lg animate-pulse" />

            <div className="flex gap-4 pt-2">
              <Skeleton className="h-12 w-36 rounded-full animate-pulse" />
              <Skeleton className="h-12 w-36 rounded-full animate-pulse" />
            </div>

            <Skeleton className="h-10 w-80 rounded-xl animate-pulse" />

            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-border/85 max-w-md">
              <div className="space-y-2">
                <Skeleton className="h-8 w-16 rounded animate-pulse" />
                <Skeleton className="h-3 w-12 rounded animate-pulse" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-8 w-16 rounded animate-pulse" />
                <Skeleton className="h-3 w-12 rounded animate-pulse" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-8 w-16 rounded animate-pulse" />
                <Skeleton className="h-3 w-12 rounded animate-pulse" />
              </div>
            </div>
          </div>

          {/* 3. Right Bento Card Skeleton */}
          <div className="lg:col-span-4 flex justify-center lg:justify-end w-full">
            <div className="border border-border/80 p-6 sm:p-7 rounded-3xl shadow-xl w-full max-w-sm space-y-6 bg-card/50">
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-24 rounded-full animate-pulse" />
                <Skeleton className="h-4 w-12 rounded animate-pulse" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-28 rounded animate-pulse" />
                <Skeleton className="h-10 w-44 rounded-lg animate-pulse" />
              </div>
              <div className="space-y-3 border-t border-b border-border/80 py-4">
                <Skeleton className="h-4 w-full rounded animate-pulse" />
                <Skeleton className="h-4 w-5/6 rounded animate-pulse" />
                <Skeleton className="h-4 w-4/5 rounded animate-pulse" />
              </div>
              <Skeleton className="h-11 w-full rounded-xl animate-pulse" />
            </div>
          </div>

        </div>
      </section>
    );
  }

  if (error || !heroes.length || !activeHero) return null;

  return (
    <section className="relative bg-background text-foreground min-h-[92vh] w-full flex items-center overflow-hidden transition-colors duration-300">
      {/* Background Grid Texture */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 dark:opacity-20 pointer-events-none" />

      {/* Main Wrapper */}
      <div className="max-w-7xl mx-auto w-full px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative z-10 items-center">
        {/* 1. Left Vertical Sidebar (Right border removed, line extended closer) */}
        <div className="hidden lg:flex lg:col-span-1 flex-col items-center justify-between self-stretch py-2">
          {/* Top Avatar & Rotated Text */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative w-16 h-16 rounded-full overflow-hidden border border-border shadow-sm">
              {siteInfo.logo ? (
                <Image
                  src={siteInfo.logo}
                  alt={siteInfo.title || "Avatar"}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="bg-primary w-full h-full flex items-center justify-center font-bold text-primary-foreground text-xs">
                  {fallbackInitials}
                </div>
              )}
            </div>

            <span className="text-[11px] font-mono tracking-widest text-muted-foreground [writing-mode:vertical-lr] pt-2">
              {siteInfo.title || "hafiq.dev"}
            </span>
          </div>

          {/* Longer vertical line connecting towards bottom icons */}
          <div className="w-px h-36 bg-border my-auto" />

          {/* Bottom Social Icons */}
          <div className="flex flex-col space-y-5 text-muted-foreground">
            {siteInfo.github && (
              <a
                href={siteInfo.github}
                target="_blank"
                rel="noreferrer"
                className="hover:text-primary transition-colors"
              >
                <FaGithub className="w-4 h-4" />
              </a>
            )}
            {siteInfo.linkedin && (
              <a
                href={siteInfo.linkedin}
                target="_blank"
                rel="noreferrer"
                className="hover:text-primary transition-colors"
              >
                <FaLinkedin className="w-4 h-4" />
              </a>
            )}
            {siteInfo.behance && (
              <a
                href={siteInfo.behance}
                target="_blank"
                rel="noreferrer"
                className="hover:text-primary transition-colors"
              >
                <FaBehance className="w-4 h-4" />
              </a>
            )}
            {siteInfo.leetcode && (
              <a
                href={siteInfo.leetcode}
                target="_blank"
                rel="noreferrer"
                className="hover:text-primary transition-colors"
              >
                <SiLeetcode className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* 2. Center / Main Hero Content */}
        <div className="lg:col-span-7 space-y-6">
          {/* Freelance & Collab Badge */}
          <div className="inline-flex items-center gap-2 bg-success/10 border border-success/30 px-3.5 py-1.5 rounded-full text-xs font-medium text-success">
            <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
            {activeHero.badge || "OPEN FOR FREELANCE & COLLAB"}
          </div>

          <div className="space-y-3">
            <p className="text-lg text-muted-foreground font-normal">
              Hi, I'm{" "}
              <span className="text-foreground font-semibold">
                {siteInfo.fullName || "Hafiq Iqbal"}
              </span>{" "}
              —
            </p>
            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-foreground leading-[1.05]">
              {activeHero.title || "Software Engineer."}
            </h1>
          </div>

          <p className="text-muted-foreground text-base sm:text-lg max-w-xl leading-relaxed font-light">
            {activeHero.shortDesc ||
              "Code craftsman with a thing for clean architecture and products that actually ship. Always up for a freelance build, a tricky problem, or a good collaboration."}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Button
              onClick={() => handleCtaClick(activeHero.ctaLink || "/contact")}
              className="bg-primary hover:bg-primary-hover text-primary-foreground font-semibold px-6 py-3 rounded-full text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer h-auto"
            >
              {activeHero.ctaText || "Get in touch"}
              <ArrowRight className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              onClick={() => handleCtaClick(activeHero.secondaryCtaLink || "/projects")}
              className="px-6 py-3 rounded-full text-sm font-semibold transition-all cursor-pointer h-auto"
            >
              {activeHero.secondaryCtaText || "View my work"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="inline-flex items-center gap-3 bg-secondary/50 border border-border px-3.5 py-2 rounded-xl text-xs text-muted-foreground">
            <span className="font-mono font-bold text-success bg-success/15 px-1.5 py-0.5 rounded">
              MCP SERVER
            </span>
            <span className="text-muted-foreground/30">|</span>
            <span className="text-foreground font-mono">
              {siteInfo.title
                ? `https://${siteInfo.title.replace(/^https?:\/\//i, "")}/api/mcp`
                : "https://hafiq.dev/api/mcp"}
            </span>
            <button
              onClick={handleCopyMcp}
              className="text-muted-foreground hover:text-foreground transition ml-2 cursor-pointer"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-success" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-border/80 max-w-md">
            <div>
              <h3 className="text-2xl font-bold text-foreground">{yearsCount}+</h3>
              <p className="text-xs text-muted-foreground uppercase tracking-widest mt-0.5">Years</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground">{projectCount}+</h3>
              <p className="text-xs text-muted-foreground uppercase tracking-widest mt-0.5">Projects</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground">{sideProjectCount}</h3>
              <p className="text-xs text-muted-foreground uppercase tracking-widest mt-0.5">
                Side Projects
              </p>
            </div>
          </div>
        </div>

        {/* 3. Right "Hire Me" Floating Bento Card */}
        <div className="lg:col-span-4 flex justify-center lg:justify-end">
          <div className="bg-card border border-border/80 hover:border-border-strong p-6 sm:p-7 rounded-3xl shadow-xl dark:shadow-2xl w-full max-w-xs space-y-6 relative group transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-success animate-ping absolute" />
                <span className="h-2.5 w-2.5 rounded-full bg-success relative" />
                <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                  Available
                </span>
              </div>
              <span className="text-xs text-muted-foreground/60 font-mono">2026</span>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">
                Open to work
              </p>
              <h2 className="text-3xl font-black text-foreground tracking-tight">HIRE ME.</h2>
            </div>

            <ul className="space-y-3 text-sm text-muted-foreground border-t border-b border-border/80 py-4">
              <li className="flex items-center gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                Freelance projects
              </li>
              <li className="flex items-center gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                Consulting & advisory
              </li>
              <li className="flex items-center gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                Side collab & OSS
              </li>
            </ul>

            {siteInfo.resumeUrl ? (
              <a
                href={siteInfo.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-border/80 py-3 rounded-xl text-xs font-semibold transition shadow-sm h-11"
              >
                <Download className="h-4 w-4 text-success" />
                Download CV
              </a>
            ) : (
              <Button
                variant="secondary"
                className="w-full h-11 py-3 rounded-xl text-xs font-semibold"
              >
                <Download className="h-4 w-4 text-success mr-2" />
                Download CV
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
