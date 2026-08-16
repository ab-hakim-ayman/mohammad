"use client";

import React, { useState } from "react";
import { Sparkles, CheckCircle2, Lightbulb, ChevronDown } from "lucide-react";
import { getValidTakeaways } from "@/lib/content/content-utils";
import I18n from "@/shared/components/I18n";

export function TakeawaysRenderer({ block }: { block: any }) {
  const [isOpen, setIsOpen] = useState(true);
  const items = getValidTakeaways(block.props?.itemsJson);
  if (!items || items.length === 0) return null;

  const title = block.props?.title || "Key Takeaways";

  return (
    <section className="not-prose relative my-8 overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-background p-6 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-primary/35 hover:shadow-md md:p-8">
      {/* Subtle Background Glow */}
      <div className="pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />

      {/* Header Section (Clickable Header to Toggle) */}
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative flex cursor-pointer items-center justify-between gap-3 border-b border-border/50 pb-4 select-none"
      >
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary shadow-xs">
            <Lightbulb className="size-5" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest text-primary uppercase">
              <Sparkles className="size-3" />
              <span><I18n>Executive Summary</I18n></span>
            </div>
            <h3 className="text-foreground text-xl font-bold tracking-tight md:text-2xl">
              {title}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-mono text-xs font-semibold text-primary sm:inline-flex">
            {items.length} {items.length === 1 ? "Insight" : "Insights"}
          </span>
          <button
            type="button"
            className="flex size-8 items-center justify-center rounded-xl border border-border/60 bg-background/80 text-muted-foreground hover:text-foreground transition-all"
            aria-label="Toggle Takeaways"
          >
            <ChevronDown className={`size-4 transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`} />
          </button>
        </div>
      </div>

      {/* Collapsible Content */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0 mt-0"
        }`}
      >
        <div className="overflow-hidden space-y-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="group/item flex items-start gap-3.5 rounded-xl border border-border/60 bg-background/60 p-3.5 transition-all duration-200 hover:border-primary/30 hover:bg-background/90 hover:shadow-xs"
            >
              <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary transition-colors duration-200 group-hover/item:border-primary group-hover/item:bg-primary group-hover/item:text-primary-foreground">
                <CheckCircle2 className="size-3.5 stroke-[2.5]" />
              </div>
              <p className="text-foreground/90 text-sm font-medium leading-relaxed">
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
