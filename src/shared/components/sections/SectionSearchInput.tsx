"use client";

import { Search, X } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const searchWrapperVariants = cva("relative w-full transition-all duration-200", {
    variants: {
        variant: {
            default: "sm:max-w-[260px]",
            capsule: "sm:max-w-[280px]",
            glass: "sm:max-w-[280px]",
            solid: "sm:max-w-[270px]",
            underline: "sm:max-w-[240px]",
        },
    },
    defaultVariants: {
        variant: "capsule",
    },
});

const searchInputVariants = cva(
    "w-full h-10 pl-10 pr-9 text-xs font-medium transition-all outline-hidden placeholder:text-muted-foreground/60 disabled:cursor-not-allowed disabled:opacity-50",
    {
        variants: {
            variant: {
                default:
                    "rounded-xl border border-border/80 bg-background/80 hover:border-primary/40 focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/10 shadow-2xs",
                capsule:
                    "rounded-full border border-border/80 bg-surface-elevated/40 hover:border-border-strong focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/10 shadow-3xs",
                glass:
                    "rounded-2xl border border-border/50 bg-card/40 backdrop-blur-xl hover:border-primary/40 focus:border-primary focus:bg-card/70 focus:ring-2 focus:ring-primary/15 shadow-sm",
                solid:
                    "rounded-none border-2 border-border-strong bg-card text-foreground font-mono placeholder:text-muted-foreground focus:bg-muted focus:ring-0 shadow-[2px_2px_0px_0px_currentColor]",
                underline:
                    "rounded-none border-b border-border/80 bg-transparent pl-8 pr-7 hover:border-foreground focus:border-primary focus:ring-0",
            },
        },
        defaultVariants: {
            variant: "capsule",
        },
    }
);

export interface SectionSearchInputProps extends VariantProps<typeof searchInputVariants> {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export function SectionSearchInput({
    value,
    onChange,
    placeholder = "Search keywords...",
    variant = "capsule",
    className,
}: SectionSearchInputProps) {
    const isUnderline = variant === "underline";
    const isSolid = variant === "solid";

    return (
        <div className={cn(searchWrapperVariants({ variant }), className)}>
            <Search
                className={cn(
                    "pointer-events-none absolute top-1/2 -translate-y-1/2 text-muted-foreground/70",
                    isUnderline ? "left-1.5 h-3.5 w-3.5" : "left-3.5 h-3.5 w-3.5",
                    isSolid && "text-foreground"
                )}
            />
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={cn(searchInputVariants({ variant }))}
            />
            {value && (
                <button
                    type="button"
                    onClick={() => onChange("")}
                    className="hover:text-foreground text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer p-0.5"
                >
                    <X className="h-3.5 w-3.5" />
                </button>
            )}
        </div>
    );
}