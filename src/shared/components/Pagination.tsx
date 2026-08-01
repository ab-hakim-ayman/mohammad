"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

import {
  Pagination as ShadcnPagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import I18n from "@/shared/components/I18n";

export type PaginationVariant =
  | "classic"
  | "glassmorphic"
  | "brutalist"
  | "gradient-glow"
  | "minimal";
export type PaginationSize = "sm" | "md" | "lg";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  showNumbers?: boolean;
  className?: string;
  variant?: PaginationVariant;
  size?: PaginationSize;
  disabled?: boolean;
}

const sizeClasses: Record<PaginationSize, string> = {
  sm: "h-8 w-8 text-xs rounded-lg",
  md: "h-9 w-9 text-xs sm:text-sm rounded-xl",
  lg: "h-10 w-10 text-sm sm:text-base rounded-xl",
};

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  showFirstLast = true,
  showPrevNext = true,
  showNumbers = true,
  className = "",
  variant = "classic",
  size = "md",
  disabled = false,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const handlePageChange = (page: number) => {
    if (disabled || page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
  };

  const getPageNumbers = (): (number | "dots")[] => {
    const totalNumbers = siblingCount * 2 + 3;
    const totalBlocks = totalNumbers + 2;
    if (totalPages <= totalBlocks) return Array.from({ length: totalPages }, (_, i) => i + 1);

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);
    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPages - 1;

    if (!showLeftDots && showRightDots) {
      const leftItemsCount = 3 + 2 * siblingCount;
      const leftRange = Array.from({ length: leftItemsCount }, (_, i) => i + 1);
      return [...leftRange, "dots", totalPages];
    }
    if (showLeftDots && !showRightDots) {
      const rightItemsCount = 3 + 2 * siblingCount;
      const rightRange = Array.from(
        { length: rightItemsCount },
        (_, i) => totalPages - rightItemsCount + i + 1
      );
      return [1, "dots", ...rightRange];
    }
    if (showLeftDots && showRightDots) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      );
      return [1, "dots", ...middleRange, "dots", totalPages];
    }
    return [];
  };

  const pageNumbers = getPageNumbers();

  const isMinimal = variant === "minimal";
  const isBrutalist = variant === "brutalist";
  const isGlass = variant === "glassmorphic";
  const isGlow = variant === "gradient-glow";

  const getDynamicStyles = (isActive: boolean) => {
    if (isActive) {
      if (isBrutalist)
        return "bg-foreground text-background font-black border-2 border-border-strong rounded-none shadow-md pointer-events-none";
      if (isGlow)
        return "bg-primary text-primary-foreground font-bold shadow-md shadow-primary/20 border-transparent pointer-events-none";
      if (isGlass)
        return "bg-card/80 text-foreground border border-border/80 backdrop-blur-md font-bold shadow-2xs pointer-events-none";
      return "bg-primary text-primary-foreground font-bold border-transparent shadow-2xs pointer-events-none";
    }

    if (isBrutalist)
      return "bg-card border-2 border-border-strong rounded-none shadow-xs font-mono text-foreground hover:bg-muted cursor-pointer";
    if (isGlass)
      return "bg-card/40 border border-border/60 text-muted-foreground hover:text-foreground hover:bg-card/80 backdrop-blur-md cursor-pointer transition-colors";
    if (isGlow)
      return "bg-card/60 border border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/40 cursor-pointer transition-colors";
    if (isMinimal)
      return "bg-transparent border-transparent shadow-none text-muted-foreground hover:text-foreground hover:bg-muted/60 cursor-pointer transition-colors";

    // Classic Vercel Style
    return "bg-card/60 border border-border/80 text-muted-foreground hover:text-foreground hover:bg-muted/80 hover:border-border transition-colors duration-200 cursor-pointer shadow-2xs";
  };

  return (
    <ShadcnPagination
      className={cn("justify-center select-none py-2", className)}
      aria-label="Dynamic Unified Pagination"
    >
      <PaginationContent className={cn("flex items-center gap-1 sm:gap-1.5", isMinimal && "gap-2.5")}>
        {/* 1. First Page Button */}
        {showFirstLast && !isMinimal && (
          <PaginationItem>
            <PaginationLink
              isActive={false}
              onClick={() => handlePageChange(1)}
              className={cn(
                sizeClasses[size],
                "flex items-center justify-center p-0",
                getDynamicStyles(false),
                (disabled || currentPage === 1) && "pointer-events-none opacity-40 cursor-not-allowed"
              )}
              aria-label="First Page"
            >
              <ChevronsLeft className="h-3.5 w-3.5 shrink-0" />
            </PaginationLink>
          </PaginationItem>
        )}

        {/* 2. Previous Page Button */}
        {showPrevNext && (
          <PaginationItem>
            <PaginationLink
              isActive={false}
              onClick={() => handlePageChange(currentPage - 1)}
              className={cn(
                sizeClasses[size],
                "flex items-center justify-center p-0",
                getDynamicStyles(false),
                isMinimal
                  ? "border-border/80 bg-card/60 text-foreground flex h-8 w-auto items-center gap-1 rounded-lg border px-2.5 shadow-2xs"
                  : (disabled || currentPage === 1) && "pointer-events-none opacity-40 cursor-not-allowed"
              )}
              aria-label="Previous Page"
            >
              <ChevronLeft className="h-3.5 w-3.5 shrink-0" />
              {isMinimal && (
                <span className="pr-0.5 text-xs font-semibold">
                  <I18n>Prev</I18n>
                </span>
              )}
            </PaginationLink>
          </PaginationItem>
        )}

        {/* 3. Page Numbers Grid */}
        {showNumbers && (
          <>
            {isMinimal ? (
              <PaginationItem>
                <div className="border-border/80 bg-card/40 text-foreground/90 flex items-center rounded-lg border px-3 py-1 text-xs font-medium backdrop-blur-md shadow-2xs">
                  <span className="bg-primary/80 mr-2 inline-flex h-1.5 w-1.5 rounded-full" />
                  <I18n>Page</I18n>
                  <span className="text-primary font-bold mx-1">{currentPage}</span>
                  <I18n>of</I18n>
                  <span className="ml-1 font-semibold">{totalPages}</span>
                </div>
              </PaginationItem>
            ) : (
              pageNumbers.map((page, index) => {
                if (page === "dots") {
                  return (
                    <PaginationItem key={"dots-" + index}>
                      <PaginationEllipsis
                        className={cn(sizeClasses[size], "text-muted-foreground/50 flex items-center justify-center")}
                      />
                    </PaginationItem>
                  );
                }

                const isActive = page === currentPage;
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={isActive}
                      onClick={() => handlePageChange(page)}
                      className={cn(
                        sizeClasses[size],
                        "flex items-center justify-center p-0 font-medium",
                        getDynamicStyles(isActive),
                        disabled && "pointer-events-none opacity-40 cursor-not-allowed"
                      )}
                      aria-label={`Page ${page}`}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              })
            )}
          </>
        )}

        {/* 4. Next Page Button */}
        {showPrevNext && (
          <PaginationItem>
            <PaginationLink
              isActive={false}
              onClick={() => handlePageChange(currentPage + 1)}
              className={cn(
                sizeClasses[size],
                "flex items-center justify-center p-0",
                getDynamicStyles(false),
                isMinimal
                  ? "border-border/80 bg-card/60 text-foreground flex h-8 w-auto items-center gap-1 rounded-lg border px-2.5 shadow-2xs"
                  : (disabled || currentPage === totalPages) && "pointer-events-none opacity-40 cursor-not-allowed"
              )}
              aria-label="Next Page"
            >
              {isMinimal && (
                <span className="pl-0.5 text-xs font-semibold">
                  <I18n>Next</I18n>
                </span>
              )}
              <ChevronRight className="h-3.5 w-3.5 shrink-0" />
            </PaginationLink>
          </PaginationItem>
        )}

        {/* 5. Last Page Button */}
        {showFirstLast && !isMinimal && (
          <PaginationItem>
            <PaginationLink
              isActive={false}
              onClick={() => handlePageChange(totalPages)}
              className={cn(
                sizeClasses[size],
                "flex items-center justify-center p-0",
                getDynamicStyles(false),
                (disabled || currentPage === totalPages) && "pointer-events-none opacity-40 cursor-not-allowed"
              )}
              aria-label="Last Page"
            >
              <ChevronsRight className="h-3.5 w-3.5 shrink-0" />
            </PaginationLink>
          </PaginationItem>
        )}
      </PaginationContent>
    </ShadcnPagination>
  );
}