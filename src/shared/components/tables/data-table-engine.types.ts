import React, { ReactNode } from "react";

export type ColumnType =
    | "text"
    | "badge"
    | "status"
    | "date"
    | "datetime"
    | "image"
    | "link"
    | "relation"
    | "boolean"
    | "custom";

export interface ColumnConfig<T = any> {
    key: string;
    header: string;
    type?: ColumnType;
    sortable?: boolean;
    hrefPrefix?: string; // For Relation badges linking
    render?: (row: T) => ReactNode;
}

export interface DataTableFilterOption {
    label: string;
    value: string;
}

export interface DataTableFilterConfig {
    key: string;
    placeholder: string;
    options: DataTableFilterOption[];
}

export interface BulkActionConfig<T = any> {
    label: string;
    variant?: "default" | "destructive" | "outline" | "secondary";
    icon?: ReactNode;
    onClick: (selectedRows: T[]) => void | Promise<void>;
}

export interface DataTableEngineProps<TData> {
    data: TData[];
    columns: ColumnConfig<TData>[];

    // Search & Filters
    searchKey?: string;
    searchPlaceholder?: string;
    filters?: DataTableFilterConfig[];

    // Single Row Actions
    onView?: (data: TData) => void;
    onEdit?: (data: TData) => void;
    onDelete?: (data: TData) => void;

    // Bulk Selection Actions
    bulkActions?: BulkActionConfig<TData>[];

    // Server/Client Pagination Controls
    pageCount?: number;
    currentPage?: number;
    onPageChange?: (page: number) => void;
    isLoading?: boolean;

    // Top Header Extra Slot
    headerActions?: ReactNode;
    enableExport?: boolean;
}