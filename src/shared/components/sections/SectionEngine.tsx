"use client";

import { useState, useMemo } from "react";
import { Inbox } from "lucide-react";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { Pagination } from "@/shared/components";
import { ScrollReveal } from "@/shared/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import I18n from "@/shared/components/I18n";
import type {
    SectionEngineProps,
    SectionFilterOption,
    SortOrder,
    GridColumns,
    GridGap,
} from "./section-engine.types";
import { SectionSearchInput } from "./SectionSearchInput";
import { SectionFilterGroup } from "./SectionFilterGroup";
import { SectionSortToggle } from "./SectionSortToggle";

const columnGridVariants: Record<GridColumns, string> = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
    5: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
    6: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6",
    7: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7",
    8: "grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8",
};

const gapVariants: Record<GridGap, string> = {
    none: "gap-0",
    xs: "gap-2",
    sm: "gap-3",
    default: "gap-6",
    lg: "gap-8",
    xl: "gap-10",
};

export function SectionEngine<T extends Record<string, any>>({
    data,
    isLoading,
    error,
    pageSize = 20,
    columns = 3,
    gap = "default",
    searchKey,
    searchPlaceholder = "Search...",
    searchVariant = "capsule",
    sortVariant = "capsule",
    sortSize = "default",
    searchFields,
    filters,
    dateKey = "publishedAt",
    showSortToggle = true,
    showToolbar = true,           // 👈 প্রিভিউ সেকশনের জন্য false করা যাবে
    showPagination = true,        // 👈 প্রিভিউ সেকশনের জন্য false করা যাবে
    hideEmptyState = false,       // 👈 ডেটা না থাকলে নাল রিটার্ন করতে
    header,                       // 👈 কাস্টম সেকশন হেডার
    itemCountLabel = "items",
    renderCard,
    skeletonHeightClassName = "h-[104px]",
    className,
}: SectionEngineProps<T>) {
    const [searchInput, setSearchInput] = useState("");
    const debouncedSearch = useDebounce(searchInput, 300);
    const [filterValues, setFilterValues] = useState<Record<string, string | string[] | null | undefined>>({});
    const [sortOrder, setSortOrder] = useState<SortOrder>("latest");
    const [page, setPage] = useState(1);

    const getNestedValue = (obj: any, path: string) => {
        if (!path) return undefined;
        return path.split(".").reduce((acc, part) => acc && acc[part], obj);
    };

    const items = useMemo<T[]>(() => {
        if (!data) return [];
        if (Array.isArray(data)) return data;
        const unwrapped = (data as any).data;
        return Array.isArray(unwrapped) ? unwrapped : unwrapped?.data || [];
    }, [data]);

    const resolvedFilters = useMemo(() => {
        if (filters && filters.length > 0) {
            return filters.map((f) => {
                if (f.options && f.options.length > 0) return f;

                const list = new Set<string>();
                items.forEach((item) => {
                    const val = getNestedValue(item, f.key);
                    if (Array.isArray(val)) {
                        val.forEach((sub) => {
                            const str = sub?.title || sub?.name || sub?.value || sub;
                            if (str && typeof str === "string") list.add(str);
                        });
                    } else if (val) {
                        const str = val?.title || val?.name || val?.value || val;
                        if (str && typeof str === "string") list.add(str);
                    }
                });

                const generatedOptions: SectionFilterOption[] = Array.from(list).map((v) => ({
                    label: v,
                    value: v,
                }));

                return { ...f, options: generatedOptions };
            });
        }
        return [];
    }, [filters, items]);

    const handleFilterChange = (key: string, val: string | string[] | null | undefined) => {
        setFilterValues((prev) => {
            const next = { ...prev };
            if (!val || val === "All" || (Array.isArray(val) && val.length === 0)) {
                delete next[key];
            } else {
                next[key] = val;
            }
            return next;
        });
        setPage(1);
    };

    const handleResetFilters = () => {
        setSearchInput("");
        setFilterValues({});
        setPage(1);
    };

    const hasActiveFilters =
        searchInput.trim() !== "" ||
        Object.values(filterValues).some((val) => {
            if (!val) return false;
            if (Array.isArray(val)) return val.length > 0;
            return val !== "All";
        });

    const processedItems = useMemo(() => {
        const query = debouncedSearch.trim().toLowerCase();

        const filtered = items.filter((item) => {
            let matchesSearch = true;
            if (query) {
                if (searchKey) {
                    const itemVal = String(getNestedValue(item, searchKey) || "").toLowerCase();
                    matchesSearch = itemVal.includes(query);
                } else if (searchFields) {
                    const searchStr = searchFields(item).join(" ").toLowerCase();
                    matchesSearch = searchStr.includes(query);
                } else {
                    const searchStr = `${item.title || ""} ${item.slug || ""} ${item.excerpt || item.description || item.shortDesc || ""
                        }`.toLowerCase();
                    matchesSearch = searchStr.includes(query);
                }
            }

            const matchesFilters = Object.entries(filterValues).every(([key, filterVal]) => {
                if (!filterVal || filterVal === "All") return true;
                const val = getNestedValue(item, key);
                if (val === undefined || val === null) return false;

                if (Array.isArray(filterVal)) {
                    if (filterVal.length === 0) return true;
                    if (Array.isArray(val)) {
                        return filterVal.some((target) =>
                            val.some((sub) =>
                                String(sub.title || sub.name || sub.value || sub).toLowerCase() === target.toLowerCase()
                            )
                        );
                    }
                    return filterVal.some(
                        (target) => String(val.title || val.name || val).toLowerCase() === target.toLowerCase()
                    );
                }

                if (Array.isArray(val)) {
                    return val.some((subVal) => {
                        const matchStr = String(subVal.title || subVal.name || subVal.value || subVal);
                        return matchStr.toLowerCase() === (filterVal as string).toLowerCase();
                    });
                }

                const matchStr = String(val.title || val.name || val.value || val);
                return matchStr.toLowerCase() === (filterVal as string).toLowerCase();
            });

            return matchesSearch && matchesFilters;
        });

        return filtered.sort((a, b) => {
            const dateA = new Date(a[dateKey] || a.createdAt || 0).getTime();
            const dateB = new Date(b[dateKey] || b.createdAt || 0).getTime();
            return sortOrder === "latest" ? dateB - dateA : dateA - dateB;
        });
    }, [items, debouncedSearch, filterValues, searchKey, searchFields, dateKey, sortOrder]);

    const totalPages = Math.max(1, Math.ceil(processedItems.length / pageSize));
    const currentPage = page > totalPages ? 1 : page;

    const visibleItems = useMemo(() => {
        if (!showPagination) return processedItems.slice(0, pageSize);
        return processedItems.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    }, [processedItems, currentPage, pageSize, showPagination]);

    if (isLoading) {
        return (
            <section className={cn("w-full py-10", className)}>
                <div className="container-custom px-4 sm:px-6">
                    {header && <div className="mb-8 w-full">{header}</div>}
                    <div className={cn("grid w-full", columnGridVariants[columns], gapVariants[gap])}>
                        {Array.from({ length: Math.min(pageSize, columns * 2) }).map((_, idx) => (
                            <div
                                key={idx}
                                className={cn(
                                    "border-border bg-card w-full animate-pulse rounded-xl border p-4 shadow-xs",
                                    skeletonHeightClassName
                                )}
                            />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (error || (hideEmptyState && items.length === 0)) {
        return null;
    }

    return (
        <section className={cn("w-full py-10", className)}>
            <div className="container-custom px-4 sm:px-6">
                {/* কাস্টম হেডার (যদি প্রিভিউ সেকশন হয়) */}
                {header && <div className="mb-8 w-full">{header}</div>}

                {/* টুলবার (সার্চ + ফিল্টার + সর্ট) */}
                {showToolbar && (resolvedFilters.length > 0 || searchKey || searchFields) && (
                    <ScrollReveal className="mb-8 flex flex-col space-y-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="w-full flex-1 sm:max-w-md">
                                <SectionSearchInput
                                    value={searchInput}
                                    onChange={(val) => {
                                        setSearchInput(val);
                                        setPage(1);
                                    }}
                                    placeholder={searchPlaceholder}
                                    variant={searchVariant}
                                />
                            </div>

                            {showSortToggle && (
                                <SectionSortToggle
                                    value={sortOrder}
                                    onChange={(val) => {
                                        setSortOrder(val);
                                        setPage(1);
                                    }}
                                    variant={sortVariant}
                                    size={sortSize}
                                />
                            )}
                        </div>

                        {resolvedFilters.length > 0 && (
                            <SectionFilterGroup
                                filters={resolvedFilters}
                                filterValues={filterValues}
                                onFilterChange={handleFilterChange}
                            />
                        )}

                        <div className="text-muted-foreground/80 flex items-center justify-between text-xs font-semibold tracking-wide">
                            <span>
                                {hasActiveFilters ? (
                                    <>
                                        {processedItems.length} of {items.length} {itemCountLabel}
                                    </>
                                ) : (
                                    <>
                                        {items.length} {itemCountLabel}
                                    </>
                                )}
                            </span>

                            {hasActiveFilters && (
                                <button
                                    type="button"
                                    onClick={handleResetFilters}
                                    className="text-primary hover:underline cursor-pointer font-bold"
                                >
                                    <I18n>Clear all</I18n>
                                </button>
                            )}
                        </div>
                    </ScrollReveal>
                )}

                {/* গ্রিড ম্যাট্রিক্স */}
                {processedItems.length > 0 ? (
                    <>
                        <div className={cn("grid w-full items-stretch", columnGridVariants[columns], gapVariants[gap])}>
                            {visibleItems.map((item: T, index: number) => (
                                <ScrollReveal
                                    key={item.id || index}
                                    delay={(index % columns) * 40}
                                    className="flex h-full w-full flex-col"
                                >
                                    {renderCard(item)}
                                </ScrollReveal>
                            ))}
                        </div>

                        {showPagination && totalPages > 1 && (
                            <div className="mt-14 flex justify-center">
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
                    !hideEmptyState && (
                        <ScrollReveal className="border-border bg-card mx-auto flex max-w-sm flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-16 text-center shadow-xs">
                            <span className="text-muted-foreground mb-4 flex h-10 w-10 items-center justify-center">
                                <Inbox className="h-6 w-6" />
                            </span>
                            <h3 className="text-foreground text-sm font-bold">
                                No {itemCountLabel} found
                            </h3>
                            <p className="text-muted-foreground mt-1 max-w-xs text-xs leading-relaxed">
                                <I18n>Try adjusting your search or category filters.</I18n>
                            </p>
                            <Button
                                onClick={handleResetFilters}
                                variant="outline"
                                className="mt-5 h-8 rounded-full px-4 text-xs font-bold"
                            >
                                <I18n>Reset filters</I18n>
                            </Button>
                        </ScrollReveal>
                    )
                )}
            </div>
        </section>
    );
}