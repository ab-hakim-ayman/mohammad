"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import I18n from "@/shared/components/I18n";
import { Badge } from "@/components/ui/badge";
import { CardEngineProps } from "./card-engine.types";

export function CardEngine<T extends Record<string, any>>({
  data,
  config,
  size = "md",
  layout = "vertical",
  mediaType = "image",
  shadow = "md",
  mediaPosition = "top",
  imageBleed = "edge-to-edge",
  alignment = "start",
  className,
}: CardEngineProps<T>) {
  if (!data) return null;

  const getNestedValue = (obj: any, path: string) => {
    if (!path) return undefined;
    return path.split(".").reduce((acc, part) => acc && acc[part], obj);
  };

  const title = config.getTitle ? config.getTitle(data) : config.titleKey ? getNestedValue(data, config.titleKey as string) : undefined;
  const description = config.getDescription ? config.getDescription(data) : config.descriptionKey ? getNestedValue(data, config.descriptionKey as string) : undefined;

  // Media Resolvers
  const resolvedImage = config.getImage ? config.getImage(data) : config.imageKey ? getNestedValue(data, config.imageKey as string) : undefined;
  const resolvedVideo = config.getVideo ? config.getVideo(data) : config.videoKey ? getNestedValue(data, config.videoKey as string) : undefined;
  const resolvedLogo = config.getLogo ? config.getLogo(data) : config.logoKey ? getNestedValue(data, config.logoKey as string) : undefined;
  const resolvedIcon = config.getIcon ? config.getIcon(data) : config.iconKey ? getNestedValue(data, config.iconKey as string) : undefined;
  const resolvedAvatar = config.getAvatar ? config.getAvatar(data) : config.avatarKey ? getNestedValue(data, config.avatarKey as string) : undefined;

  const activeMedia = resolvedVideo || resolvedImage || resolvedLogo || resolvedIcon || resolvedAvatar;
  const activeMediaType = resolvedVideo ? "video" : mediaType;

  const imageVariant = config.imageVariant || (resolvedLogo || resolvedIcon ? "logo" : resolvedAvatar ? "avatar" : "cover");
  const isSmallMedia = imageVariant === "logo" || imageVariant === "icon" || imageVariant === "avatar";

  const resolvedHref = typeof config.href === "function" ? config.href(data) : config.href;
  const metaItems = config.getMetaItems ? config.getMetaItems(data) : [];
  const badges = config.getBadges ? config.getBadges(data) : [];

  const alignmentClasses = {
    start: "items-start text-left",
    center: "items-center text-center",
    right: "items-end text-right",
  }[alignment];

  const flexAlignment = {
    start: "justify-start",
    center: "justify-center",
    right: "justify-end",
  }[alignment];

  const sizeClasses = {
    sm: "p-2.5 text-xs",
    md: "p-4 sm:p-5 text-sm",
    lg: "p-5 sm:p-6 text-base",
  }[size];

  const shadowClasses = {
    none: "shadow-none",
    sm: "shadow-xs",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
  }[shadow];

  // Layout & Positioning Logic
  const isRowLayout = isSmallMedia
    ? layout === "horizontal"
    : mediaPosition === "left" || mediaPosition === "right";

  const isReverse = !isSmallMedia && (mediaPosition === "bottom" || mediaPosition === "right");
  const hasEdgeBleedCover = activeMedia && imageVariant === "cover" && imageBleed === "edge-to-edge";

  // --- Render Media Container ---
  const renderMediaContainer = () => {
    // 1. Placeholder (No Media)
    if (!activeMedia) {
      if (imageVariant === "logo" || imageVariant === "icon") {
        return <div aria-hidden="true" className="h-7 w-7 sm:h-8 sm:w-8 shrink-0 opacity-0 pointer-events-none" />;
      }
      if (imageVariant === "avatar") {
        return <div aria-hidden="true" className="h-10 w-10 sm:h-12 sm:w-12 shrink-0 opacity-0 pointer-events-none" />;
      }
      return (
        <div
          aria-hidden="true"
          className={cn(
            "relative shrink-0 bg-transparent opacity-0 pointer-events-none",
            isRowLayout ? "w-2/5 min-h-full" : "aspect-[16/9] w-full",
            hasEdgeBleedCover && !isRowLayout && "mb-4"
          )}
        />
      );
    }

    // 2. Logo / Icon Variant (Vertically Centered Frame)
    if (imageVariant === "logo" || imageVariant === "icon") {
      return (
        <div
          className={cn(
            "flex shrink-0 items-center justify-center",
            layout === "horizontal"
              ? "self-center"
              : cn("w-full mb-2.5", flexAlignment)
          )}
        >
          <div className="relative flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center">
            <Image
              src={activeMedia}
              alt={title || "Icon"}
              fill
              unoptimized
              className="object-contain transition-transform duration-300 group-hover:scale-110"
            />
          </div>
        </div>
      );
    }

    // 3. Avatar Variant
    if (imageVariant === "avatar") {
      return (
        <div
          className={cn(
            "flex shrink-0 items-center justify-center",
            layout === "horizontal"
              ? "self-center"
              : cn("w-full mb-2.5", flexAlignment)
          )}
        >
          <div className="relative h-10 w-10 sm:h-12 sm:w-12 overflow-hidden rounded-full border-2 border-primary/20 bg-muted">
            <Image
              src={activeMedia}
              alt={title || "Avatar"}
              fill
              unoptimized
              className="object-cover"
            />
          </div>
        </div>
      );
    }

    // 4. Cover Image / Video Variant
    return (
      <div
        className={cn(
          "relative shrink-0 overflow-hidden bg-muted",
          isRowLayout ? "w-2/5 self-stretch min-h-[140px]" : "aspect-[16/9] w-full",
          imageBleed === "padded" && "rounded-xl border border-border/40 m-3"
        )}
      >
        {activeMediaType === "video" ? (
          <video
            src={activeMedia}
            controls
            muted
            loop
            playsInline
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <Image
            src={activeMedia}
            alt={title || "Cover media"}
            fill
            unoptimized
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </div>
    );
  };

  return (
    <article
      className={cn(
        "group relative flex h-full w-full overflow-hidden bg-card transition-all duration-300 rounded-lg",
        hasEdgeBleedCover ? "p-0" : sizeClasses,
        shadowClasses,
        // 🟢 items-center এবং justify-center সুনিশ্চিত করা হলো
        isRowLayout ? "flex-row items-center justify-center gap-2.5" : "flex-col",
        isReverse && (isRowLayout ? "flex-row-reverse" : "flex-col-reverse"),
        className
      )}
    >
      {/* Media Rendering */}
      {(!isReverse || isSmallMedia) && renderMediaContainer()}

      {/* Content Section */}
      <div
        className={cn(
          "flex min-w-0",
          layout === "horizontal"
            ? "w-auto flex-initial flex-col justify-center items-start self-center"
            : "w-full flex-1 flex-col h-full justify-between space-y-2.5",
          layout === "horizontal" ? "text-left" : alignmentClasses,
          hasEdgeBleedCover ? sizeClasses : "p-0"
        )}
      >
        <div
          className={cn(
            "flex flex-col w-full",
            layout === "horizontal" ? "space-y-0.5 items-start text-left justify-center" : cn("space-y-1", alignmentClasses)
          )}
        >
          {metaItems.length > 0 && (
            <div className={cn("text-muted-foreground mb-1 flex flex-wrap items-center gap-2 text-xs select-none", flexAlignment)}>
              {metaItems.map((meta, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 rounded-md bg-muted/80 px-2 py-0.5 font-medium">
                  {meta.icon}
                  {meta.text}
                </span>
              ))}
            </div>
          )}

          {title && (
            <h3
              className={cn(
                "font-bold tracking-tight text-foreground flex items-center",
                layout === "horizontal"
                  ? "w-auto text-left leading-none m-0 p-0"
                  : alignment === "center" ? "w-full text-center leading-snug" : alignment === "right" ? "w-full text-right leading-snug" : "w-full text-left leading-snug",
                size === "sm" ? "text-sm" : size === "lg" ? "text-xl" : "text-base"
              )}
            >
              {resolvedHref ? (
                <Link href={resolvedHref} className="hover:text-primary transition-colors inline-block truncate leading-none">
                  {title}
                </Link>
              ) : (
                <span className="truncate leading-none">{title}</span>
              )}
            </h3>
          )}

          {description && (
            <p
              className={cn(
                "line-clamp-2 text-xs leading-relaxed text-muted-foreground sm:text-sm",
                layout === "horizontal"
                  ? "w-auto text-left mt-1"
                  : alignment === "center" ? "w-full text-center" : alignment === "right" ? "w-full text-right" : "w-full text-left"
              )}
            >
              {description}
            </p>
          )}
        </div>

        {(badges.length > 0 || config.actionLabel) && (
          <div className={cn("relative z-10 mt-3 flex w-full items-center justify-between gap-3 border-t border-border/60 pt-3", flexAlignment)}>
            <div className={cn("flex max-w-[70%] flex-wrap gap-1.5", flexAlignment)}>
              {badges.map((b, i) =>
                b.href ? (
                  <Link
                    key={i}
                    href={b.href}
                    className="border-border bg-muted/60 text-muted-foreground hover:text-primary rounded-full border px-2.5 py-0.5 text-[11px] font-semibold transition-all"
                  >
                    #{b.label}
                  </Link>
                ) : (
                  <Badge key={i} variant="outline" className="text-[11px]">
                    {b.label}
                  </Badge>
                )
              )}
            </div>

            {config.actionLabel && resolvedHref && (
              <Link href={resolvedHref} className="text-primary hover:text-foreground flex shrink-0 items-center gap-1 text-xs font-bold transition-colors">
                <span><I18n>{config.actionLabel}</I18n></span>
                <ChevronRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Media Rendering: Bottom / Right */}
      {!isSmallMedia && isReverse && renderMediaContainer()}
    </article>
  );
}