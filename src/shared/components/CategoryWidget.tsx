// src/components/content/details/CategoryWidget.tsx
"use client";

import React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import I18n from "@/shared/components/I18n";

const categoryContainerVariants = cva("w-full transition-all duration-300", {
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

const categoryItemPatternVariants = cva(
    "group flex items-center justify-between text-sm transition-all duration-200 select-none",
    {
        variants: {
            itemPattern: {
                listRow:
                    "text-muted-foreground hover:text-foreground py-2 font-medium",
                pillCounter:
                    "hover:bg-accent hover:text-accent-foreground text-muted-foreground rounded-lg px-3 py-2 font-medium",
                ghostTile:
                    "hover:border-primary/40 hover:bg-primary/5 hover:text-primary text-muted-foreground rounded-xl border border-transparent px-3 py-2",
                borderedBox:
                    "border-border/70 hover:border-primary/50 hover:bg-card text-foreground rounded-lg border px-3 py-2 shadow-2xs",
                dotLead:
                    "text-muted-foreground hover:text-foreground relative py-1.5 pl-4 font-medium before:absolute before:left-0 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full before:bg-border hover:before:bg-primary",
            },
        },
        defaultVariants: {
            itemPattern: "listRow",
        },
    }
);

export interface CategoryItem {
    id?: string | number;
    title: string;
    slug?: string;
    count?: number;
    [key: string]: any;
}

export interface CategoryWidgetProps
    extends VariantProps<typeof categoryContainerVariants>,
    VariantProps<typeof categoryItemPatternVariants> {
    items: CategoryItem[];
    label?: string;
    hrefPrefix?: string;
    showCount?: boolean;
    className?: string;
}

export function CategoryWidget({
    items = [],
    label = "Categories",
    hrefPrefix = "/blogs?category=",
    containerStyle = "none",
    itemPattern = "listRow",
    showCount = true,
    className,
}: CategoryWidgetProps) {
    if (!items || items.length === 0) return null;

    return (
        <div className={cn(categoryContainerVariants({ containerStyle }), className)}>
            {label && (
                <div className="mb-4 flex items-center gap-2 select-none">
                    <Layers className="h-4 w-4 text-emerald-500" />
                    <p className="text-muted-foreground text-xs font-bold tracking-[0.18em] uppercase">
                        <I18n>{label}</I18n>
                    </p>
                </div>
            )}

            <div className="flex flex-col space-y-1">
                {items.map((cat, idx) => {
                    const slug = cat.slug || cat.title.toLowerCase().replace(/\s+/g, "-");
                    const href = `${hrefPrefix}${slug}`;

                    return (
                        <Link
                            key={cat.id || idx}
                            href={href}
                            className={cn(categoryItemPatternVariants({ itemPattern }))}
                        >
                            <span className="truncate transition-transform duration-200 group-hover:translate-x-0.5">
                                {cat.title}
                            </span>

                            {showCount && typeof cat.count !== "undefined" && (
                                <span className="border-border/80 bg-muted/40 text-muted-foreground/80 group-hover:border-primary/40 group-hover:text-foreground flex h-5 min-w-[28px] items-center justify-center rounded-full border px-2 text-[11px] font-semibold">
                                    {cat.count}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}