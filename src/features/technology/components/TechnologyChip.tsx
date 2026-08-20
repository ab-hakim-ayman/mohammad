"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Technology } from "../types/technology.types";

export type TechnologyChipVariant =
    | "default"
    | "lime"
    | "outline"
    | "minimal"
    | "glow";

export type TechnologyChipSize = "xs" | "sm" | "default" | "lg";

export interface TechnologyChipProps {
    technology: Technology;
    variant?: TechnologyChipVariant;
    size?: TechnologyChipSize;
    showLogo?: boolean;
    logo?: ReactNode;
    clickable?: boolean;
    href?: string;
    isActive?: boolean;
    className?: string;
    onClick?: (technology: Technology) => void;
}

const sizeStyles: Record<TechnologyChipSize, string> = {
    xs: "px-2.5 py-0.5 text-[10px] gap-1 rounded-lg",
    sm: "px-3 py-1 text-[11px] gap-1.5 rounded-lg",
    default: "px-3.5 py-1.5 text-xs gap-2 rounded-xl",
    lg: "px-4 py-2 text-sm gap-2.5 rounded-xl",
};

const logoSizes: Record<TechnologyChipSize, string> = {
    xs: "h-3 w-3",
    sm: "h-3.5 w-3.5",
    default: "h-4 w-4",
    lg: "h-5 w-5",
};

const variantStyles: Record<TechnologyChipVariant, string> = {
    default:
        "border-border/70 bg-card/60 text-foreground/85 backdrop-blur-xs hover:border-lime-500/50 hover:bg-lime-500/10 hover:text-lime-600 dark:hover:text-lime-400 hover:shadow-xs",
    lime:
        "border-lime-500/30 bg-lime-500/10 text-lime-700 dark:text-lime-400 hover:border-lime-500/60 hover:bg-lime-500/20",
    outline:
        "border-border bg-background text-foreground/80 hover:border-foreground/40 hover:bg-muted/30",
    minimal:
        "border-transparent bg-muted/50 text-foreground/80 hover:bg-muted hover:text-foreground",
    glow:
        "border-lime-500/40 bg-card/80 text-foreground/90 hover:border-lime-500 hover:shadow-[0_0_15px_rgba(132,204,22,0.25)] hover:text-lime-600 dark:hover:text-lime-400",
};

export function TechnologyChip({
    technology,
    variant = "default",
    size = "default",
    showLogo = false,
    logo,
    clickable = false,
    href,
    isActive = false,
    className,
    onClick,
}: TechnologyChipProps) {
    const [imgError, setImgError] = useState(false);

    const content = (
        <>
            {showLogo && (
                <span className={cn("relative shrink-0 overflow-hidden", logoSizes[size])}>
                    {logo ? (
                        logo
                    ) : technology.logo && !imgError ? (
                        <Image
                            src={technology.logo}
                            alt={technology.title}
                            width={20}
                            height={20}
                            className="h-full w-full object-contain"
                            onError={() => setImgError(true)}
                        />
                    ) : null}
                </span>
            )}

            <span className="font-medium tracking-tight whitespace-nowrap">
                {technology.title}
            </span>
        </>
    );

    const baseClasses = cn(
        "inline-flex items-center border transition-all duration-200 select-none",
        sizeStyles[size],
        variantStyles[variant],
        isActive && "border-lime-500 bg-lime-500/15 text-lime-600 ring-1 ring-lime-500/30 dark:text-lime-400",
        (clickable || href || onClick) && "cursor-pointer active:scale-95",
        className
    );

    if (href) {
        return (
            <Link href={href} className={baseClasses}>
                {content}
            </Link>
        );
    }

    if (onClick || clickable) {
        return (
            <button
                type="button"
                onClick={() => onClick?.(technology)}
                className={baseClasses}
            >
                {content}
            </button>
        );
    }

    return <span className={baseClasses}>{content}</span>;
}