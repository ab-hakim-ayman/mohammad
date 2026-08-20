"use client";

import { Badge } from "@/components/ui/badge";
import { Select } from "@/shared/components/Select";
import { cn } from "@/lib/utils";
import type { SectionFilterConfig } from "./section-engine.types";

export interface SectionFilterGroupProps {
    filters: SectionFilterConfig[];
    filterValues: Record<string, string | string[] | null | undefined>;
    onFilterChange: (key: string, value: string | string[] | null | undefined) => void;
    onReset?: () => void;
    hasActiveFilters?: boolean;
    className?: string;
}

export function SectionFilterGroup({
    filters = [],
    filterValues,
    onFilterChange,
    className,
}: SectionFilterGroupProps) {
    if (!filters.length) return null;

    return (
        <div className={cn("flex w-full flex-wrap items-center gap-2", className)}>
            {filters.map((filter) => {
                const currentVal = filterValues[filter.key];
                const displayType = filter.type || "single-pill";
                const options = filter.options || [];

                if (options.length === 0) return null;

                // 🟢 1. Single-Pill Selection (Video Toggle Style)
                if (displayType === "single-pill") {
                    const selected = typeof currentVal === "string" ? currentVal : "";
                    return (
                        <div key={filter.key} className="flex flex-wrap items-center gap-2">
                            {options.map((opt) => {
                                const isActive = selected === opt.value;
                                return (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => {
                                            onFilterChange(filter.key, isActive ? null : opt.value);
                                        }}
                                        className={cn(
                                            "cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-semibold select-none transition-all",
                                            isActive
                                                ? "bg-primary text-primary-foreground border-primary shadow-xs"
                                                : "bg-background/80 border-border/70 text-muted-foreground hover:bg-muted hover:text-foreground"
                                        )}
                                    >
                                        {opt.label}
                                    </button>
                                );
                            })}
                        </div>
                    );
                }

                // 🟢 2. Multi-Pill Badges
                if (displayType === "multi-pill") {
                    const activeArray = Array.isArray(currentVal) ? currentVal : [];
                    return (
                        <div key={filter.key} className="flex flex-wrap items-center gap-2">
                            {options.map((opt) => {
                                const isSelected = activeArray.includes(opt.value);
                                return (
                                    <Badge
                                        key={opt.value}
                                        variant={isSelected ? "default" : "outline"}
                                        onClick={() => {
                                            const next = isSelected
                                                ? activeArray.filter((v) => v !== opt.value)
                                                : [...activeArray, opt.value];
                                            onFilterChange(filter.key, next.length > 0 ? next : null);
                                        }}
                                        className={cn(
                                            "cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-semibold select-none transition-all",
                                            !isSelected && "bg-background/70 border-border/70 text-muted-foreground hover:bg-muted"
                                        )}
                                    >
                                        {opt.label}
                                    </Badge>
                                );
                            })}
                        </div>
                    );
                }

                // 🟢 3. Custom Dropdown Select Integration
                const allOption = {
                    label: `All ${filter.placeholder || "Items"}`,
                    value: "All",
                };
                const mergedOptions = [allOption, ...options];
                const selectedValue = typeof currentVal === "string" && currentVal ? currentVal : "All";

                return (
                    <div key={filter.key} className="w-full sm:w-44">
                        <Select
                            options={mergedOptions}
                            value={selectedValue}
                            onValueChange={(val) => {
                                onFilterChange(filter.key, val === "All" || !val ? null : val);
                            }}
                            placeholder={`All ${filter.placeholder || "Items"}`}
                            className="bg-background/60 border-border/80 h-10 rounded-full text-xs backdrop-blur-md"
                        />
                    </div>
                );
            })}
        </div>
    );
}