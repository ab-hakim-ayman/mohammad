import React from "react";
import { Path, FieldValues, UseFormReturn, Control, UseFormSetValue, ControllerRenderProps } from "react-hook-form";
import { z } from "zod";
import { SelectOption } from "@/shared/components/Select";

export type FormFieldType =
    | "text"
    | "password"
    | "number"
    | "textarea"
    | "select"
    | "multiselect"
    | "switch"
    | "slug"
    | "media"
    | "media-gallery"
    | "editor"
    | "date"
    | "datetime-local"
    | "tags"
    | "custom";

export interface FieldSchemaConfig<T extends FieldValues> {
    name: Path<T>;
    label: string;
    type: FormFieldType;
    required?: boolean;
    placeholder?: string;
    description?: string;
    options?: SelectOption[];
    sourceField?: Path<T>;
    mediaFolder?: string;
    acceptMedia?: string;
    showAltText?: boolean;
    altTextField?: Path<T>; // For single media altText sync
    altTextsField?: Path<T>; // For media gallery altTexts sync
    gridSpan?: 1 | 2 | 3 | 4 | 6 | 12;
    editorProps?: Record<string, any>;
    onEditorChangeExtra?: (val: any, methods: UseFormReturn<T>) => void; // For Blog readTime estimation
    condition?: (values: any) => boolean;
    renderCustom?: (methods: UseFormReturn<T>) => React.ReactNode;
}

export interface FormSectionConfig<T extends FieldValues> {
    title?: string;
    description?: string;
    fields: FieldSchemaConfig<T>[];
}

export interface FormEngineConfig<T extends FieldValues> {
    sections: FormSectionConfig<T>[];
}

export interface FormActionButton {
    label: string;
    type?: "submit" | "button";
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost";
    isLoading?: boolean;
    disabled?: boolean;
    onClick?: () => void;
    icon?: React.ReactNode;
}

export interface FormEngineProps<TFieldValues extends FieldValues> {
    schema: z.ZodType<any, any, any>;
    config: FormEngineConfig<TFieldValues>;
    defaultValues?: Partial<TFieldValues>;
    onSubmit: (data: TFieldValues) => Promise<void> | void;
    isSubmitting?: boolean;
    submitText?: string;
    cancelText?: string | null;
    onCancel?: () => void;
    extraActions?: FormActionButton[];
    folderPrefix?: string;
}

export interface SlugAutoInputProps<TFieldValues extends FieldValues> {
    field: {
        name: Path<TFieldValues>;
        sourceField?: string;
    };
    controllerField: ControllerRenderProps<TFieldValues, any>;
    control: Control<TFieldValues>;
    setValue: UseFormSetValue<TFieldValues>;
}