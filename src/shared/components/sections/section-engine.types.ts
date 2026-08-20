import type { ReactNode } from "react";

export type SectionLayout = "grid" | "accordion" | "list" | "table" | "chart" | "flex";
export type SearchVariant = "default" | "capsule" | "glass" | "solid" | "underline";
export type SortToggleVariant = "default" | "capsule" | "glass" | "solid" | "underline";
export type FilterDisplayType = "select" | "single-pill" | "multi-pill";
export type SortOrder = "latest" | "oldest";
export type GridColumns = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type GridGap = "none" | "xs" | "sm" | "default" | "lg" | "xl";

export interface SectionFilterOption {
    label: string;
    value: string;
}

export interface SectionFilterConfig {
    key: string;
    placeholder?: string;
    options?: SectionFilterOption[];
    type?: FilterDisplayType;
}

export interface SectionTableColumn<T = any> {
    header: ReactNode;
    accessorKey?: keyof T | string;
    cell?: (item: T, index: number) => ReactNode;
    className?: string;
    headerClassName?: string;
}

export interface SectionEngineProps<T = any> {
    data: any;
    isLoading?: boolean;
    error?: any;
    pageSize?: number;
    layout?: SectionLayout;
    accordionType?: "single" | "multiple";
    columns?: GridColumns;
    gap?: GridGap;
    tableColumns?: SectionTableColumn<T>[];
    searchKey?: string;
    searchPlaceholder?: string;
    searchVariant?: SearchVariant;
    sortVariant?: SortToggleVariant;
    sortSize?: "sm" | "default" | "lg";
    searchFields?: (item: T) => (string | number | undefined | null)[];
    filters?: SectionFilterConfig[];
    dateKey?: string;
    showSortToggle?: boolean;
    itemCountLabel?: string;

    // 🟢 লেআউট-ভিত্তিক রেন্ডারার ফাংশন
    renderCard?: (item: T, index: number) => ReactNode;
    renderAccordionItem?: (item: T, index: number) => ReactNode;
    renderListItem?: (item: T, index: number) => ReactNode;
    renderChart?: (items: T[]) => ReactNode;
    renderChip?: (item: T, index: number) => ReactNode;
    renderItem?: (item: T, index: number) => ReactNode;

    skeletonHeightClassName?: string;
    className?: string;
    header?: ReactNode;
    showToolbar?: boolean;
    showPagination?: boolean;
    hideEmptyState?: boolean;
}