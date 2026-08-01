import React from "react";

export type DetailFieldType =
    | "text"
    | "badge"
    | "status"
    | "date"
    | "datetime"
    | "link"
    | "media"
    | "media-gallery"
    | "editor"
    | "tags"
    | "boolean"
    | "user"
    | "custom";

export interface DetailFieldConfig<T = any> {
    label: string;
    key: keyof T | string;
    type: DetailFieldType;
    placeholder?: string;
    editorVariant?: string;
    gridSpan?: 1 | 2 | 3 | 4 | 6 | 12;
    render?: (data: T) => React.ReactNode;
}

export interface DetailSectionConfig<T = any> {
    title?: string;
    description?: string;
    fields: DetailFieldConfig<T>[];
}

export interface RelatedItem {
    id: string;
    title: string;
    subtitle?: string;
    imageUrl?: string;
    status?: string;
}

export interface RelatedSectionConfig<T = any> {
    title: string;
    hrefPrefix: string;
    variant?: "list" | "badges" | "grid";
    getRecords: (data: T) => RelatedItem[];
}

export interface DetailEngineConfig<T = any> {
    titleKey: keyof T | string;
    subtitleKey?: keyof T | string;
    statusKey?: keyof T | string;
    isFeaturedKey?: keyof T | string;
    eyebrow?: string;
    headerIcon?: React.ComponentType<{ className?: string }>;
    actions?: {
        editHref?: string;
        backHref?: string;
        onDelete?: () => void;
        isDeleting?: boolean;
    };
    mainSections: DetailSectionConfig<T>[];
    sidebarSections: DetailSectionConfig<T>[];
    relatedSections?: RelatedSectionConfig<T>[];
}

export interface DetailEngineProps<T = any> {
    data: T;
    config: DetailEngineConfig<T>;
}