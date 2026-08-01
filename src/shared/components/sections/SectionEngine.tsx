"use client";

import { useState, useMemo } from "react";
import { Search, Inbox, RotateCcw } from "lucide-react";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { Pagination } from "@/shared/components";
import { ScrollReveal } from "@/shared/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem
} from "@/components/ui/select";
import I18n from "@/shared/components/I18n";
import { SectionEngineProps } from "./section-engine.types";

export function SectionEngine<T extends Record<string, any>>({
    data,
    isLoading,
    error,
    pageSize = 20,
    searchKey,
    searchPlaceholder = "Filter by keyword...",
    categoryKey = "categories",
    searchFields,
    filters,
    renderCard,
    skeletonHeightClassName = "h-[380px]",
    className,
}: SectionEngineProps<T>) {
    const [searchInput, setSearchInput] = useState("");
    const debouncedSearch = useDebounce(searchInput, 300);
    const [filterValues, setFilterValues] = useState<Record<string, string>>({});
    const [page, setPage] = useState(1);

    // Helper to get nested properties
    const getNestedValue = (obj: any, path: string) => {
        if (!path) return undefined;
        return path.split(".").reduce((acc, part) => acc && acc[part], obj);
    };

    // Unwrap response payload safely
    const items = useMemo<T[]>(() => {
        if (!data) return [];
        if (Array.isArray(data)) return data;
        const unwrapped = (data as any).data;
        return Array.isArray(unwrapped) ? unwrapped : unwrapped?.data || [];
    }, [data]);

    // Resolve filter configuration (support dynamic props and legacy categoryKey fallback)
    const resolvedFilters = useMemo(() => {
        if (filters) return filters;

        // Legacy category fallback
        if (categoryKey && items.length > 0) {
            const list = new Set<string>();
            items.forEach((item) => {
                const categories = item[categoryKey];
                if (Array.isArray(categories)) {
                    categories.forEach((cat) => {
                        if (cat.title || cat.name) list.add(cat.title || cat.name);
                    });
                }
            });
            if (list.size > 0) {
                return [
                    {
                        key: categoryKey,
                        placeholder: "Category",
                        options: Array.from(list).map((cat) => ({ label: cat, value: cat })),
                    },
                ];
            }
        }
        return [];
    }, [filters, categoryKey, items]);

    // Check if search or any filters are active
    const hasActiveFilters =
        searchInput.trim() !== "" ||
        Object.values(filterValues).some((val) => val && val !== "All");

    const handleResetFilters = () => {
        setSearchInput("");
        setFilterValues({});
        setPage(1);
    };

    // Client-side filtering & query matching
    const filteredItems = useMemo(() => {
        const query = debouncedSearch.trim().toLowerCase();

        return items.filter((item) => {
            // 1. Search Query Match
            let matchesSearch = true;
            if (query) {
                if (searchKey) {
                    const itemVal = String(getNestedValue(item, searchKey) || "").toLowerCase();
                    matchesSearch = itemVal.includes(query);
                } else if (searchFields) {
                    const searchStr = searchFields(item).join(" ").toLowerCase();
                    matchesSearch = searchStr.includes(query);
                } else {
                    // Default fallback search
                    const searchStr = `${item.title || ""} ${item.slug || ""} ${item.excerpt || item.description || item.shortDesc || ""}`.toLowerCase();
                    matchesSearch = searchStr.includes(query);
                }
            }

            // 2. Custom/Dynamic Filters Match
            const matchesFilters = Object.entries(filterValues).every(([key, filterVal]) => {
                if (!filterVal || filterVal === "All") return true;

                const val = getNestedValue(item, key);
                if (val === undefined || val === null) return false;

                // Handle Array values (e.g. categories, tags)
                if (Array.isArray(val)) {
                    return val.some((subVal) => {
                        if (typeof subVal === "object" && subVal !== null) {
                            const matchStr = String(subVal.title || subVal.name || subVal.value || "");
                            return matchStr.toLowerCase() === filterVal.toLowerCase();
                        }
                        return String(subVal).toLowerCase() === filterVal.toLowerCase();
                    });
                }

                // Handle nested object
                if (typeof val === "object" && val !== null) {
                    const matchStr = String(val.title || val.name || val.value || "");
                    return matchStr.toLowerCase() === filterVal.toLowerCase();
                }

                // Handle plain values
                return String(val).toLowerCase() === filterVal.toLowerCase();
            });

            return matchesSearch && matchesFilters;
        });
    }, [items, debouncedSearch, filterValues, searchKey, searchFields]);

    // Client-side Pagination logic
    const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
    const currentPage = page > totalPages ? 1 : page;

    const visibleItems = useMemo(() => {
        return filteredItems.slice(
            (currentPage - 1) * pageSize,
            currentPage * pageSize
        );
    }, [filteredItems, currentPage, pageSize]);

    // Skeleton Loading State
    if (isLoading) {
        return (
            <section className="bg-surface-elevated/50 w-full py-16">
                <div className="container-custom px-4 sm:px-6">
                    <div className="flex w-full flex-wrap items-stretch justify-center gap-6">
                        {Array.from({ length: 8 }).map((_, idx) => (
                            <div
                                key={idx}
                                className={`border-border bg-card w-full shrink-0 animate-pulse rounded-xl border p-6 shadow-xs sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)] ${skeletonHeightClassName}`}
                            />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    // Error State
    if (error) {
        return (
            <section className="bg-surface-elevated/50 w-full py-16">
                <div className="container-custom px-4 sm:px-6">
                    <div className="border-destructive/40 bg-destructive/5 text-destructive rounded-xl border p-6 text-center text-sm font-medium">
                        <I18n>Error loading items</I18n>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className={`bg-surface-elevated/50 w-full py-16 ${className || ""}`}>
            <div className="container-custom px-4 sm:px-6">
                {/* Top Control Toolbar */}
                {(resolvedFilters.length > 0 || searchKey || searchFields || searchPlaceholder) && (
                    <ScrollReveal className="mb-6 flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        {/* Left Column: Filters & Reset Button */}
                        <div className="flex flex-1 flex-wrap items-center gap-2">
                            {resolvedFilters.map((filter) => {
                                const selectedOpt = filter.options.find((opt) => opt.value === filterValues[filter.key]);

                                return (
                                    <div key={filter.key} className="w-full sm:max-w-[200px]">
                                        <Select
                                            value={filterValues[filter.key] || "All"}
                                            onValueChange={(val) => {
                                                setFilterValues((prev) => {
                                                    const next = { ...prev };
                                                    if (val === "All" || !val) {
                                                        delete next[filter.key];
                                                    } else {
                                                        next[filter.key] = val;
                                                    }
                                                    return next;
                                                });
                                                setPage(1);
                                            }}
                                        >
                                            <SelectTrigger className="bg-background/60 border-border/80 h-10 rounded-full text-xs backdrop-blur-md px-4">
                                                <SelectValue>
                                                    {selectedOpt ? selectedOpt.label : filter.placeholder}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent className="border-border/80 bg-popover/95 rounded-2xl p-1 shadow-xl backdrop-blur-xl">
                                                <SelectItem value="All" className="rounded-xl text-xs font-semibold">
                                                    All {filter.placeholder}s
                                                </SelectItem>
                                                {filter.options.map((opt) => (
                                                    <SelectItem
                                                        key={opt.value}
                                                        value={opt.value}
                                                        className="rounded-xl text-xs font-semibold"
                                                    >
                                                        {opt.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                );
                            })}

                            {/* Reset Filters Button */}
                            {hasActiveFilters && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleResetFilters}
                                    className="text-muted-foreground hover:text-foreground h-10 gap-1.5 rounded-full px-4 text-xs font-bold transition-all hover:bg-surface-elevated/40"
                                >
                                    <RotateCcw className="h-3.5 w-3.5" />
                                    <I18n>Reset Filters</I18n>
                                </Button>
                            )}
                        </div>

                        {/* Right Column: Search Input */}
                        {(searchKey || searchFields || searchPlaceholder) && (
                            <div className="relative w-full shrink-0 sm:max-w-[260px]">
                                <Search className="text-muted-foreground/70 pointer-events-none absolute top-1/2 left-3.5 h-3.5 w-3.5 -translate-y-1/2" />
                                <input
                                    value={searchInput}
                                    onChange={(e) => {
                                        setSearchInput(e.target.value);
                                        setPage(1);
                                    }}
                                    placeholder={searchPlaceholder}
                                    className="border-border bg-surface-elevated/40 text-foreground shadow-3xs placeholder:text-muted-foreground/60 hover:border-border-strong focus:border-primary focus:bg-background focus:ring-primary/10 w-full rounded-full border h-10 pr-4 pl-10 text-xs font-medium transition-all focus:ring-4 focus:outline-hidden flex items-center"
                                />
                            </div>
                        )}
                    </ScrollReveal>
                )}

                {/* Content Item Grid */}
                {filteredItems.length > 0 ? (
                    <>
                        <div className="flex w-full flex-wrap items-stretch justify-center gap-6">
                            {visibleItems.map((item: T, index: number) => (
                                <ScrollReveal
                                    key={item.id || index}
                                    delay={(index % 4) * 60}
                                    className="flex w-full shrink-0 flex-col sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)]"
                                >
                                    {renderCard(item)}
                                </ScrollReveal>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="mt-12 flex justify-center">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setPage}
                                    variant="classic"
                                />
                            </div>
                        )}
                    </>
                ) : (
                    /* Empty State */
                    <ScrollReveal className="border-border bg-card mx-auto flex max-w-sm flex-col items-center justify-center rounded-xl border border-dashed px-6 py-16 text-center shadow-sm">
                        <span className="text-muted-foreground mb-4 flex h-10 w-10 items-center justify-center">
                            <Inbox className="h-6 w-6" />
                        </span>
                        <h3 className="text-foreground text-sm font-bold">
                            <I18n>No items found</I18n>
                        </h3>
                        <p className="text-muted-foreground mt-1 max-w-xs text-xs leading-relaxed">
                            <I18n>Try adjusting your search or filter options.</I18n>
                        </p>
                        <Button
                            onClick={handleResetFilters}
                            variant="outline"
                            className="mt-5 h-8 cursor-pointer rounded-lg px-4 text-xs font-bold"
                        >
                            <I18n>Clear filters</I18n>
                        </Button>
                    </ScrollReveal>
                )}
            </div>
        </section>
    );
}