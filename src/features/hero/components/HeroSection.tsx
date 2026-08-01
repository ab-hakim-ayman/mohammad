"use client";
import Image from "next/image";
import { ArrowRight, Globe } from "lucide-react";
import { Link } from "@/shared/i18n";
import { ScrollReveal } from "@/shared/components/ScrollReveal";
import { Skeleton } from "@/components/ui/skeleton";
import I18n from "@/shared/components/I18n";
import { useActiveHero } from "../hooks/useHero";

function isExternalLink(value: string) {
  return /^https?:\/\//i.test(value);
}

export function HeroSection() {
  const { data, isLoading, error } = useActiveHero();
  const hero = data?.data;

  if (isLoading) {
    return (
      <section className="bg-background w-full py-10 sm:py-12 lg:py-24 3xl:py-32 5xl:py-36">
        <div className="container-custom space-y-6">
          <Skeleton className="h-8 w-64 rounded-lg" />
          <Skeleton className="h-16 w-full max-w-3xl rounded-xl" />
          <Skeleton className="h-6 w-full max-w-2xl rounded-xl" />
          <div className="flex gap-3 pt-4">
            <Skeleton className="h-11 w-40 rounded-full" />
            <Skeleton className="h-11 w-40 rounded-full" />
          </div>
        </div>
      </section>
    );
  }
  if (error || !hero) return null;

  const trustPoints = [
    "Dedicated product and engineering teams",
    "Enterprise-grade delivery and QA workflows",
    "Fast kickoff with transparent communication",
  ];
  const heroStats = [
    { value: "2 weeks", label: "Typical kickoff" },
    { value: "Full-cycle", label: "Delivery support" },
    { value: "AI-ready", label: "Modern stacks" },
  ];

  const heroImageAlt = hero.heroImageAlt || hero.title;

  return (
    <section className="bg-background text-foreground relative w-full overflow-hidden">
      <div className="relative">
        <div className="bg-background absolute inset-0" />
        <div
          className={[
            "container-custom relative z-10 gap-10 py-10 sm:py-12 lg:py-24 3xl:py-32 5xl:py-36",
            hero.heroImage
              ? "grid lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:items-center"
              : "block",
          ].join(" ")}
        >
          <ScrollReveal className="flex max-w-5xl flex-col justify-center">
            <div className="border-border bg-surface-elevated text-primary-foreground inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold tracking-[0.18em] uppercase">
              <span>
                <I18n>UK-style delivery approach</I18n>
              </span>
            </div>

            <h1 className="text-foreground text-4xl font-semibold tracking-tighter sm:text-5xl lg:text-6xl xl:text-7xl">
              <span className="mt-6 block">{hero.title}</span>
            </h1>

            <p className="text-muted-foreground mt-6 max-w-3xl text-lg leading-8 sm:text-[1.35rem] sm:leading-9">
              {hero.shortDesc}
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              {hero.ctaText && hero.ctaLink ? (
                isExternalLink(hero.ctaLink) ? (
                  <a
                    href={hero.ctaLink}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-background text-foreground border-border shadow-soft hover:bg-surface-elevated inline-flex items-center justify-center gap-2 rounded-full border px-6 py-3.5 text-sm font-semibold transition-all duration-300 hover:-translate-y-1"
                  >
                    {hero.ctaText}
                    <ArrowRight className="h-4 w-4" />
                  </a>
                ) : (
                  <Link
                    href={hero.ctaLink}
                    className="bg-background text-foreground border-border shadow-soft hover:bg-surface-elevated inline-flex items-center justify-center gap-2 rounded-full border px-6 py-3.5 text-sm font-semibold transition-all duration-300 hover:-translate-y-1"
                  >
                    {hero.ctaText}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                )
              ) : null}
              {hero.secondaryCtaText && hero.secondaryCtaLink ? (
                isExternalLink(hero.secondaryCtaLink) ? (
                  <a
                    href={hero.secondaryCtaLink}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-surface-elevated text-foreground border-border hover:bg-surface-elevated/80 inline-flex items-center justify-center gap-2 rounded-full border px-6 py-3.5 text-sm font-semibold transition-all duration-300 hover:-translate-y-1"
                  >
                    {hero.secondaryCtaText}
                    <Globe className="h-4 w-4" />
                  </a>
                ) : (
                  <Link
                    href={hero.secondaryCtaLink}
                    className="bg-surface-elevated text-foreground border-border hover:bg-surface-elevated/80 inline-flex items-center justify-center gap-2 rounded-full border px-6 py-3.5 text-sm font-semibold transition-all duration-300 hover:-translate-y-1"
                  >
                    {hero.secondaryCtaText}
                  </Link>
                )
              ) : null}
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {heroStats.map((item) => (
                <div key={item.label} className="border-border bg-card rounded-none sm:rounded-lg border p-4">
                  <p className="text-foreground text-2xl font-semibold tracking-tighter">
                    {item.value}
                  </p>
                  <p className="text-muted-foreground mt-2 text-xs font-semibold tracking-[0.18em] uppercase">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {trustPoints.map((point) => (
                <div
                  key={point}
                  className="border-border bg-card text-muted-foreground flex items-start gap-3 rounded-none sm:rounded-lg border px-4 py-4 text-sm leading-6"
                >
                  <span className="bg-primary/20 mt-1 inline-flex h-2.5 w-2.5 shrink-0 rounded-full" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>

          {hero.heroImage ? (
            <ScrollReveal className="flex items-center justify-center lg:justify-end" delay={120}>
              <div className="border-border bg-card shadow-brand relative w-full max-w-160 overflow-hidden rounded-none sm:rounded-lg border">
                <div className="relative aspect-[4/4.2] w-full overflow-hidden">
                  <Image
                    src={hero.heroImage}
                    alt={heroImageAlt}
                    fill
                    sizes="(min-width: 1024px) 38vw, 100vw"
                    unoptimized
                    className="object-cover transition-transform duration-700 hover:scale-[1.03]"
                  />
                </div>
              </div>
            </ScrollReveal>
          ) : null}
        </div>
      </div>
    </section>
  );
}
