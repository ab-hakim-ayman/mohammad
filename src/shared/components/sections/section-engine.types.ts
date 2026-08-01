import { ReactNode } from "react";

export interface SectionFilterOption {
    label: string;
    value: string;
}

export interface SectionFilterConfig {
    key: string;
    placeholder: string;
    options: SectionFilterOption[];
}

export interface SectionEngineProps<T = any> {
    data: any;
    isLoading?: boolean;
    error?: any;
    pageSize?: number;
    searchKey?: string;
    searchPlaceholder?: string;
    categoryKey?: string; // Kept for legacy/backward compatibility fallback
    searchFields?: (item: T) => string[];
    filters?: SectionFilterConfig[];
    renderCard: (item: T) => ReactNode;
    skeletonHeightClassName?: string;
    className?: string;
}