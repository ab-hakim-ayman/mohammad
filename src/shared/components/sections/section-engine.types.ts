import type { ReactNode } from "react";

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

export interface SectionEngineProps<T = any> {
    data: any;
    isLoading?: boolean;
    error?: any;
    pageSize?: number;
    columns?: GridColumns;
    gap?: GridGap;
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
    renderCard: (item: T) => ReactNode;
    skeletonHeightClassName?: string;
    className?: string;
    header?: ReactNode;
    showToolbar?: boolean;
    showPagination?: boolean;
    hideEmptyState?: boolean;
}