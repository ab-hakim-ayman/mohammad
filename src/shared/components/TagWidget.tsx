// src/components/content/details/TagWidget.tsx
"use client";

import React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { Hash } from "lucide-react";
import { cn } from "@/lib/utils";
import I18n from "@/shared/components/I18n";

const tagContainerVariants = cva("w-full transition-all duration-300", {
    variants: {
        containerStyle: {
            none: "p-0",
            card: "rounded-2xl border border-border/60 bg-card/40 p-5 shadow-xs backdrop-blur-md",
            bordered: "border-border-strong border-2 bg-card p-5 font-mono",
        },
    },
    defaultVariants: {
        containerStyle: "none",
    },
});

const tagItemPatternVariants = cva(
    "inline-flex items-center text-xs font-medium transition-all duration-200 select-none",
    {
        variants: {
            itemPattern: {
                capsulePill:
                    "border-border/80 bg-muted/40 text-muted-foreground hover:border-primary/50 hover:bg-muted hover:text-foreground rounded-full border px-3.5 py-1.5",
                outlined:
                    "border-border/80 hover:border-foreground hover:text-foreground text-muted-foreground rounded-lg border px-3 py-1 bg-transparent",
                softBadge:
                    "bg-primary/10 text-primary hover:bg-primary/20 rounded-md px-2.5 py-1 font-semibold",
                hashTag:
                    "text-muted-foreground hover:text-primary font-mono py-1 pr-2 hover:underline before:content-['#'] before:text-primary/70",
                subtleTile:
                    "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground rounded-md px-3 py-1.5",
            },
        },
        defaultVariants: {
            itemPattern: "capsulePill",
        },
    }
);

export interface TagItem {
    id?: string | number;
    title: string;
    slug?: string;
    [key: string]: any;
}

export interface TagWidgetProps
    extends VariantProps<typeof tagContainerVariants>,
    VariantProps<typeof tagItemPatternVariants> {
    items: TagItem[];
    label?: string;
    hrefPrefix?: string;
    className?: string;
}

export function TagWidget({
    items = [],
    label = "Tags",
    hrefPrefix = "/blogs?tag=",
    containerStyle = "none",
    itemPattern = "capsulePill",
    className,
}: TagWidgetProps) {
    if (!items || items.length === 0) return null;

    return (
        <div className={cn(tagContainerVariants({ containerStyle }), className)}>
            {label && (
                <div className="mb-3 flex items-center gap-1.5 select-none">
                    <Hash className="h-4 w-4 text-emerald-500" />
                    <p className="text-muted-foreground text-xs font-bold tracking-[0.18em] uppercase">
                        <I18n>{label}</I18n>
                    </p>
                </div>
            )}

            <div className="flex flex-wrap items-center gap-2">
                {items.map((tag, idx) => {
                    const slug = tag.slug || tag.title.toLowerCase().replace(/\s+/g, "-");
                    const href = `${hrefPrefix}${slug}`;

                    return (
                        <Link
                            key={tag.id || idx}
                            href={href}
                            className={cn(tagItemPatternVariants({ itemPattern }))}
                        >
                            {tag.title}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}