"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import I18n from "@/shared/components/I18n";
import type { SortOrder } from "./section-engine.types";

const sortContainerVariants = cva(
    "inline-flex shrink-0 items-center transition-all duration-200 select-none",
    {
        variants: {
            variant: {
                default: "rounded-xl border border-border/80 bg-background/80 p-1 shadow-2xs",
                capsule: "rounded-full border border-border/80 bg-muted/60 p-1 shadow-3xs backdrop-blur-md",
                glass: "rounded-2xl border border-border/50 bg-card/40 p-1 shadow-sm backdrop-blur-xl",
                solid: "rounded-none border-2 border-border-strong bg-card p-1 shadow-[2px_2px_0px_0px_currentColor] font-mono",
                underline: "rounded-none border-b border-border/80 bg-transparent p-0 gap-3",
            },
            size: {
                sm: "h-8 text-xs",
                default: "h-10 text-xs",
                lg: "h-11 text-sm",
            },
        },
        defaultVariants: {
            variant: "capsule",
            size: "default",
        },
    }
);

const sortItemVariants = cva(
    "cursor-pointer font-bold transition-all duration-200 flex items-center justify-center",
    {
        variants: {
            variant: {
                default: "rounded-lg",
                capsule: "rounded-full",
                glass: "rounded-xl",
                solid: "rounded-none",
                underline: "rounded-none border-b-2 py-1",
            },
            size: {
                sm: "px-3 py-1 text-[11px]",
                default: "px-4 py-1.5 text-xs",
                lg: "px-5 py-2 text-sm",
            },
        },
        defaultVariants: {
            variant: "capsule",
            size: "default",
        },
    }
);

export interface SectionSortToggleProps extends VariantProps<typeof sortContainerVariants> {
    value: SortOrder;
    onChange: (val: SortOrder) => void;
    className?: string;
}

export function SectionSortToggle({
    value,
    onChange,
    variant = "capsule",
    size = "default",
    className,
}: SectionSortToggleProps) {
    const isUnderline = variant === "underline";
    const isSolid = variant === "solid";

    const getItemClass = (isActive: boolean) => {
        if (isUnderline) {
            return isActive
                ? "border-primary text-primary font-bold"
                : "border-transparent text-muted-foreground hover:text-foreground";
        }

        if (isSolid) {
            return isActive
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground";
        }

        return isActive
            ? "bg-primary text-primary-foreground shadow-xs"
            : "text-muted-foreground hover:text-foreground";
    };

    return (
        <div className={cn(sortContainerVariants({ variant, size }), className)}>
            <button
                type="button"
                onClick={() => onChange("latest")}
                className={cn(sortItemVariants({ variant, size }), getItemClass(value === "latest"))}
            >
                <I18n>Latest</I18n>
            </button>

            <button
                type="button"
                onClick={() => onChange("oldest")}
                className={cn(sortItemVariants({ variant, size }), getItemClass(value === "oldest"))}
            >
                <I18n>Oldest</I18n>
            </button>
        </div>
    );
}