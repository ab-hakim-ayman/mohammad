"use client";

import React, { useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { FaTwitter, FaLinkedin, FaFacebook, FaRedditAlien, FaWhatsapp } from "react-icons/fa";
import { Check, Copy, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import I18n from "@/shared/components/I18n";

const shareWidgetVariants = cva("relative transition-all duration-300", {
    variants: {
        variant: {
            classic: "border-border border-l-2 pl-4",
            glassmorphic:
                "rounded-2xl border border-white/10 bg-card/40 p-4 shadow-sm backdrop-blur-xl dark:border-white/5",
            brutalist:
                "border-2 border-border-strong bg-card p-4 shadow-[4px_4px_0px_0px_currentColor]",
            gradientGlow:
                "relative rounded-2xl border border-border/60 bg-gradient-to-b from-card/80 via-card/50 to-card/20 p-4 shadow-lg backdrop-blur-md",
            minimal: "p-0",
        },
    },
    defaultVariants: {
        variant: "classic",
    },
});

const itemVariants = cva(
    "group inline-flex items-center gap-2.5 text-xs font-semibold transition-all duration-200 cursor-pointer select-none",
    {
        variants: {
            variant: {
                classic: "text-muted-foreground hover:text-primary",
                glassmorphic:
                    "rounded-xl border border-border/50 bg-background/50 px-3 py-2 text-muted-foreground hover:border-primary/40 hover:bg-background/80 hover:text-foreground shadow-2xs backdrop-blur-md",
                brutalist:
                    "rounded-none border-2 border-border-strong bg-background px-3 py-1.5 text-foreground hover:bg-foreground hover:text-background font-mono shadow-[2px_2px_0px_0px_currentColor] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none",
                gradientGlow:
                    "rounded-xl border border-border/40 bg-card/60 px-3 py-2 text-muted-foreground hover:border-primary/50 hover:bg-primary/10 hover:text-primary hover:shadow-xs",
                minimal: "rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground",
            },
            iconOnly: {
                true: "justify-center p-2",
                false: "w-full justify-start",
            },
        },
        defaultVariants: {
            variant: "classic",
            iconOnly: false,
        },
    }
);

export interface ShareWidgetProps extends VariantProps<typeof shareWidgetVariants> {
    url: string;
    title: string;
    label?: string;
    layout?: "horizontal" | "vertical";
    showCopy?: boolean;
    showLabels?: boolean;
    networks?: ("twitter" | "linkedin" | "facebook" | "reddit" | "whatsapp")[];
    className?: string;
}

export function ShareWidget({
    url,
    title,
    label = "Share",
    layout = "vertical",
    variant = "classic",
    showCopy = true,
    showLabels = true,
    networks = ["twitter", "linkedin", "facebook", "reddit", "whatsapp"],
    className,
}: ShareWidgetProps) {
    const [copied, setCopied] = useState(false);

    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback
        }
    };

    const shareLinks = {
        twitter: {
            name: "X (Twitter)",
            href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
            icon: <FaTwitter className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />,
        },
        linkedin: {
            name: "LinkedIn",
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
            icon: <FaLinkedin className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />,
        },
        facebook: {
            name: "Facebook",
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            icon: <FaFacebook className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />,
        },
        reddit: {
            name: "Reddit",
            href: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
            icon: <FaRedditAlien className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />,
        },
        whatsapp: {
            name: "WhatsApp",
            href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
            icon: <FaWhatsapp className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />,
        },
    };

    const isHorizontal = layout === "horizontal";
    const shouldRenderLabel = showLabels && !isHorizontal;

    return (
        <div className={cn(shareWidgetVariants({ variant }), className)}>
            {label && (
                <p
                    className={cn(
                        "text-muted-foreground mb-3 text-[11px] font-black tracking-widest uppercase select-none flex items-center gap-1.5",
                        variant === "brutalist" && "font-mono text-foreground font-extrabold"
                    )}
                >
                    <Share2 className="h-3 w-3 text-primary" />
                    <I18n>{label}</I18n>
                </p>
            )}

            <div
                className={cn(
                    "flex gap-2",
                    isHorizontal
                        ? "flex-row flex-wrap items-center"
                        : "flex-col items-stretch"
                )}
            >
                {networks.map((net) => {
                    const item = shareLinks[net];
                    if (!item) return null;

                    return (
                        <a
                            key={net}
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={`Share on ${item.name}`}
                            className={cn(
                                itemVariants({ variant, iconOnly: isHorizontal || !showLabels })
                            )}
                        >
                            <div
                                className={cn(
                                    "flex items-center justify-center shrink-0 transition-transform duration-300",
                                    variant === "classic" &&
                                    "h-7 w-7 rounded-full border border-border bg-surface-elevated text-foreground group-hover:border-primary group-hover:text-primary"
                                )}
                            >
                                {item.icon}
                            </div>
                            {shouldRenderLabel && <span>{item.name}</span>}
                        </a>
                    );
                })}

                {showCopy && (
                    <button
                        type="button"
                        onClick={handleCopy}
                        title={copied ? "Link Copied" : "Copy Link"}
                        className={cn(
                            itemVariants({ variant, iconOnly: isHorizontal || !showLabels }),
                            copied && "text-emerald-500 hover:text-emerald-500 border-emerald-500/40"
                        )}
                    >
                        <div
                            className={cn(
                                "flex items-center justify-center shrink-0 transition-transform duration-300",
                                variant === "classic" &&
                                "h-7 w-7 rounded-full border border-border bg-surface-elevated text-foreground group-hover:border-primary group-hover:text-primary",
                                copied && "border-emerald-500 text-emerald-500"
                            )}
                        >
                            {copied ? (
                                <Check className="h-3.5 w-3.5 text-emerald-500" />
                            ) : (
                                <Copy className="h-3.5 w-3.5" />
                            )}
                        </div>
                        {shouldRenderLabel && (
                            <span>
                                <I18n>{copied ? "Copied!" : "Copy Link"}</I18n>
                            </span>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}