"use client";

import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
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

                // 🟢 3. Dropdown Select
                const selectedOpt = options.find((opt) => opt.value === currentVal);
                return (
                    <div key={filter.key} className="w-full sm:max-w-[200px]">
                        <Select
                            value={typeof currentVal === "string" ? currentVal : "All"}
                            onValueChange={(val: string | null) =>
                                onFilterChange(filter.key, val === "All" ? null : val)
                            }
                        >
                            <SelectTrigger className="bg-background/60 border-border/80 h-10 rounded-full text-xs px-4 backdrop-blur-md">
                                <SelectValue>
                                    {selectedOpt ? selectedOpt.label : `All ${filter.placeholder || "Items"}`}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent className="border-border/80 bg-popover/95 rounded-2xl p-1 shadow-xl backdrop-blur-xl">
                                <SelectItem value="All" className="text-xs font-semibold">
                                    All {filter.placeholder ? `${filter.placeholder}s` : "Items"}
                                </SelectItem>
                                {options.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value} className="text-xs font-semibold">
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                );
            })}
        </div>
    );
}