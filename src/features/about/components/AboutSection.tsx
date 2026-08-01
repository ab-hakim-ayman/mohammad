"use client";

import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "@/shared/i18n";
import I18n from "@/shared/components/I18n";
import { usePublishedAbout } from "../hooks/useAbout";

export function AboutSection() {
  const { data, isLoading, error } = usePublishedAbout();
  const about = data?.data;

  if (isLoading) {
    return (
      <div className="container-custom mx-auto w-full px-4 sm:px-6">
        <div className="bg-card h-80 animate-pulse rounded-xl" />
      </div>
    );
  }

  if (error || !about) return null;

  const heroImageAlt = (about as any).heroImageAlt || about.title;

  return (
    /* 🎯 প্যারেন্টে অলরেডি প্যাডিং থাকায় সেকশন ট্যাগ তুলে ডাইরেক্ট গ্লোবাল কন্টেইনার র‍্যাপার দেওয়া হলো */
    <div className="container-custom mx-auto w-full px-4 sm:px-6 relative z-10">
      <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">

        {/* Left Column: Content */}
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-muted-foreground inline-flex items-center gap-2 text-xs font-semibold tracking-[0.3em] uppercase">
              <Sparkles className="text-primary h-4 w-4" />
              <I18n>About Us</I18n>
            </span>
            <span className="bg-border h-px w-16" />
          </div>

          <div>
            <h2 className="text-foreground max-w-3xl text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15]">
              {about.title}
            </h2>
          </div>

          <div className="text-muted-foreground max-w-2xl space-y-5 text-sm sm:text-base leading-relaxed">
            <p>{about.shortDesc}</p>
            {about.contentJson ? (
              <div
                className="prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: about.contentJson }}
              />
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-2">
            <Link
              href="/about"
              className="border-border text-foreground hover:bg-card hover:text-foreground inline-flex items-center gap-2 rounded-lg border px-5 py-3 text-xs font-bold uppercase tracking-wider transition-all shadow-xs"
            >
              <I18n>Explore the full company story</I18n>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Right Column: Hero Image Card */}
        <div className="grid gap-8">
          {about.heroImage ? (
            <div className="bg-card border-border relative min-h-[380px] overflow-hidden rounded-xl border shadow-sm">
              <Image
                src={about.heroImage}
                alt={heroImageAlt}
                fill
                sizes="(min-width: 1024px) 44vw, 100vw"
                unoptimized
                className="object-cover"
              />
              <div className="bg-background/80 backdrop-blur-md text-foreground absolute inset-x-0 bottom-0 px-6 py-5 sm:px-8 border-t border-border">
                <p className="text-primary text-xs font-bold tracking-[0.18em] uppercase">
                  <I18n>Company narrative</I18n>
                </p>
                <p className="text-muted-foreground mt-1 max-w-lg text-xs sm:text-sm leading-relaxed">
                  <I18n>
                    Clear positioning, stronger internal standards, and product delivery that stays
                    aligned with business goals.
                  </I18n>
                </p>
              </div>
            </div>
          ) : null}
        </div>

      </div>
    </div>
  );
}