"use client";

import React, { useEffect, useState } from "react";
import {
  useForm,
  FormProvider,
  Controller,
  useWatch,
  FieldValues,
  DefaultValues,
  UseFormSetValue,
  Path,
} from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2, X } from "lucide-react";

import I18n from "@/shared/components/I18n";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { Select, MultiSelect } from "@/shared/components";
import { MediaUploader } from "@/components/media/MediaUploader";
import { ContentEditorDynamic as ContentEditor } from "@/components/content/ContentEditorDynamic";
import { FieldSchemaConfig, FormEngineProps, SlugAutoInputProps } from "./form-engine.types";
import { cn } from "@/lib/utils";

export function FormEngine<TFieldValues extends FieldValues>({
  schema,
  config,
  defaultValues,
  onSubmit,
  isSubmitting = false,
  submitText = "Save Changes",
  cancelText = "Cancel",
  onCancel,
  extraActions = [],
  folderPrefix = "a2icoders",
}: FormEngineProps<TFieldValues>) {
  const [showErrorModal, setShowErrorModal] = useState(false);

  const methods = useForm<TFieldValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<TFieldValues>,
  });

  const {
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = methods;

  const formValues = useWatch({ control });

  useEffect(() => {
    if (defaultValues && Object.keys(defaultValues).length > 0) {
      reset(defaultValues as DefaultValues<TFieldValues>);
    }
  }, [defaultValues, reset]);

  const onError = () => {
    if (Object.keys(errors).length > 0) {
      setShowErrorModal(true);
    }
  };

  const renderField = (field: FieldSchemaConfig<TFieldValues>, sectionTitle?: string) => {
    const errorMsg = errors[field.name]?.message as string | undefined;

    const fieldLabelClean = (field.label || "").trim().toLowerCase();
    const sectionTitleClean = (sectionTitle || "").trim().toLowerCase();
    const isDuplicateLabel = fieldLabelClean === sectionTitleClean || fieldLabelClean === "p*";

    // 👉 Tailwind CSS সেফ গ্রিড স্প্যান ম্যাপ (যাতে gridSpan 6 বা 12 পারফেক্টলি কাজ করে)
    const gridSpanClasses: Record<number, string> = {
      4: "md:col-span-4",
      6: "md:col-span-6",
      8: "md:col-span-8",
      12: "md:col-span-12",
    };

    const spanClass = field.gridSpan ? gridSpanClasses[field.gridSpan] || "md:col-span-12" : "md:col-span-12";

    return (
      <div
        key={field.name as string}
        className={cn("col-span-12 space-y-1.5", spanClass)}
      >
        {field.type !== "switch" && field.label && !isDuplicateLabel && (
          <label className="text-foreground/80 block text-[11px] font-bold tracking-widest uppercase">
            <I18n>{field.label}</I18n>{" "}
            {field.required && <span className="text-destructive ml-0.5">*</span>}
          </label>
        )}

        <Controller
          name={field.name}
          control={control}
          render={({ field: controllerField }) => {
            switch (field.type) {
              case "text":
              case "password":
              case "date":
              case "datetime-local":
                return (
                  <Input
                    {...controllerField}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={controllerField.value ?? ""}
                    className="bg-background/60 border-border/80 focus-visible:ring-primary/20 h-9 rounded-xl text-xs backdrop-blur-md transition-all focus-visible:ring-2"
                  />
                );

              case "number":
                return (
                  <Input
                    type="number"
                    {...controllerField}
                    value={controllerField.value ?? ""}
                    onChange={(e) =>
                      controllerField.onChange(
                        e.target.value === "" ? null : Number(e.target.value)
                      )
                    }
                    className="bg-background/60 border-border/80 focus-visible:ring-primary/20 h-9 rounded-xl text-xs backdrop-blur-md transition-all focus-visible:ring-2"
                  />
                );

              case "textarea":
                return (
                  <Textarea
                    {...controllerField}
                    rows={3}
                    placeholder={field.placeholder}
                    value={controllerField.value ?? ""}
                    className="bg-background/60 border-border/80 focus-visible:ring-primary/20 resize-none rounded-xl text-xs backdrop-blur-md transition-all focus-visible:ring-2"
                  />
                );

              case "tags":
                return (
                  <Input
                    {...controllerField}
                    placeholder={field.placeholder}
                    value={
                      Array.isArray(controllerField.value) ? controllerField.value.join(", ") : ""
                    }
                    onChange={(e) =>
                      controllerField.onChange(
                        e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean)
                      )
                    }
                    className="bg-background/60 border-border/80 focus-visible:ring-primary/20 h-9 rounded-xl text-xs backdrop-blur-md transition-all focus-visible:ring-2"
                  />
                );

              case "custom":
                return <>{field.renderCustom ? field.renderCustom(methods) : null}</>;

              case "select":
                return (
                  <Select
                    name={field.name as string}
                    value={controllerField.value ?? ""}
                    onValueChange={controllerField.onChange}
                    options={field.options || []}
                    placeholder={field.placeholder || "Select option..."}
                  />
                );

              case "multiselect":
                return (
                  <MultiSelect
                    options={field.options || []}
                    value={Array.isArray(controllerField.value) ? controllerField.value : []}
                    onChange={controllerField.onChange}
                    placeholder={field.placeholder || "Select options..."}
                  />
                );

              case "switch":
                return (
                  <div className="border-border/60 bg-muted/20 flex items-center gap-3 rounded-xl border p-2.5">
                    <Switch
                      id={field.name as string}
                      checked={!!controllerField.value}
                      onCheckedChange={controllerField.onChange}
                    />
                    <label
                      htmlFor={field.name as string}
                      className="text-foreground cursor-pointer text-xs font-semibold select-none"
                    >
                      <I18n>{field.label}</I18n>
                    </label>
                  </div>
                );

              case "media": {
                const altTextVal = field.altTextField ? methods.watch(field.altTextField) : "";
                return (
                  <div className="flex w-full justify-center">
                    <MediaUploader
                      label=""
                      value={typeof controllerField.value === "string" ? controllerField.value : null}
                      onChange={(val) =>
                        controllerField.onChange(typeof val === "string" ? val : null)
                      }
                      folder={`${folderPrefix}/${field.mediaFolder || "general"}`}
                      accept={field.acceptMedia}
                      multiple={false}
                      showAltText={field.showAltText}
                      altText={typeof altTextVal === "string" ? altTextVal : ""}
                      onAltTextChange={(val) => {
                        if (field.altTextField) {
                          setValue(field.altTextField, (val || null) as any);
                        }
                      }}
                    />
                  </div>
                );
              }

              case "media-gallery": {
                const altTextsVal = field.altTextsField
                  ? methods.watch(field.altTextsField)
                  : undefined;
                return (
                  <div className="flex w-full justify-center">
                    <MediaUploader
                      label=""
                      value={Array.isArray(controllerField.value) ? controllerField.value : []}
                      onChange={(val) => controllerField.onChange(Array.isArray(val) ? val : [])}
                      folder={`${folderPrefix}/${field.mediaFolder || "gallery"}`}
                      multiple={true}
                      showAltText={field.showAltText}
                      altTexts={Array.isArray(altTextsVal) ? altTextsVal : undefined}
                      onAltTextsChange={(newAltTexts) => {
                        if (field.altTextsField) {
                          setValue(field.altTextsField, newAltTexts as any);
                        }
                      }}
                    />
                  </div>
                );
              }

              case "editor":
                return (
                  <ContentEditor
                    {...field.editorProps}
                    variant={field.editorProps?.variant || "blog"}
                    value={controllerField.value as any}
                    onChange={(doc: any) => {
                      controllerField.onChange(doc);
                      if (field.onEditorChangeExtra) {
                        field.onEditorChangeExtra(doc, methods);
                      }
                    }}
                  />
                );

              case "slug":
                return (
                  <SlugAutoInput
                    field={field}
                    controllerField={controllerField}
                    control={control}
                    setValue={setValue}
                  />
                );

              default:
                return <React.Fragment />;
            }
          }}
        />

        {field.description && (
          <p className="text-muted-foreground text-[11px] leading-tight">{field.description}</p>
        )}
        {errorMsg && (
          <p className="text-destructive animate-in fade-in-50 text-xs font-semibold">{errorMsg}</p>
        )}
      </div>
    );
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit, onError)} className="w-full space-y-6 select-none">
        {config.sections.map((section, idx) => (
          <div
            key={idx}
            className="border-border/70 bg-card/40 space-y-4 rounded-2xl border p-4 shadow-2xs backdrop-blur-md md:p-5"
          >
            {section.title && (
              <div className="border-border/50 border-b pb-2.5">
                <h3 className="text-foreground text-xs font-bold tracking-widest uppercase">
                  <I18n>{section.title}</I18n>
                </h3>
                {section.description && (
                  <p className="text-muted-foreground mt-0.5 text-xs">{section.description}</p>
                )}
              </div>
            )}
            <div className="grid grid-cols-12 gap-4">
              {section.fields
                .filter((field) => !field.condition || field.condition(formValues))
                .map((field) => renderField(field, section.title))}
            </div>
          </div>
        ))}

        {/* 🚨 Error Modal Dialog */}
        <Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
          <DialogContent className="border-border/80 bg-card/95 rounded-2xl shadow-xl backdrop-blur-md sm:max-w-md">
            <DialogHeader className="space-y-2">
              <div className="bg-destructive/10 text-destructive flex h-9 w-9 items-center justify-center rounded-xl">
                <AlertCircle className="h-5 w-5" />
              </div>
              <DialogTitle className="text-sm font-bold tracking-wide">
                <I18n>Validation Error</I18n>
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-xs leading-relaxed">
                <I18n>Please correct the highlighted fields and resolve all form errors before saving your changes.</I18n>
              </DialogDescription>
            </DialogHeader>

            <div className="bg-muted/30 border-border/60 max-h-32 overflow-y-auto rounded-xl border p-3 text-xs">
              <span className="font-semibold text-foreground">
                <I18n>Failed Fields:</I18n>
              </span>{" "}
              <span className="text-destructive font-mono">
                {Object.keys(errors).join(", ")}
              </span>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="default"
                onClick={() => setShowErrorModal(false)}
                className="bg-primary text-primary-foreground hover:bg-primary/90 h-8 rounded-xl px-4 text-xs font-bold shadow-2xs"
              >
                <I18n>Got it</I18n>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 🟢 Floating Bottom Bar */}
        <div className="border-border/80 bg-card/80 sticky bottom-4 z-20 mx-auto flex w-full max-w-2xl flex-col items-center justify-between gap-3 rounded-2xl border p-3 shadow-xl backdrop-blur-md sm:flex-row">
          <div className="flex w-full items-center justify-start gap-2 px-1 sm:w-auto">
            <span
              className={`h-2 w-2 rounded-full ${isDirty ? "bg-warning animate-pulse" : "bg-success"
                }`}
            />
            <span className="text-muted-foreground text-xs font-semibold">
              {isDirty ? <I18n>Unsaved Changes</I18n> : <I18n>All Changes Saved</I18n>}
            </span>
          </div>

          <div className="flex w-full flex-wrap items-center justify-end gap-2 sm:w-auto">
            {extraActions.map((action, i) => (
              <Button
                key={i}
                type={action.type || "button"}
                variant={action.variant || "outline"}
                onClick={action.onClick}
                disabled={action.disabled || action.isLoading || isSubmitting}
                className="h-8 rounded-xl px-3 text-xs font-bold shadow-2xs"
              >
                {action.isLoading ? (
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                ) : action.icon ? (
                  <span className="mr-1.5">{action.icon}</span>
                ) : null}
                <I18n>{action.label}</I18n>
              </Button>
            ))}

            {cancelText !== null && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel || (() => window.history.back())}
                className="border-border/80 h-8 rounded-xl px-3.5 text-xs font-bold shadow-2xs"
              >
                <I18n>{cancelText}</I18n>
              </Button>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary text-primary-foreground hover:bg-primary/90 h-8 rounded-xl px-4 text-xs font-bold shadow-2xs transition-all"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <I18n>Saving...</I18n>
                </span>
              ) : (
                <I18n>{submitText}</I18n>
              )}
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}

function SlugAutoInput<TFieldValues extends FieldValues>({
  field,
  controllerField,
  control,
  setValue,
}: SlugAutoInputProps<TFieldValues>) {
  const [isManuallyEdited, setIsManuallyEdited] = useState(false);
  const sourceFieldName = "title" as Path<TFieldValues>;

  const sourceValue = useWatch({
    control,
    name: sourceFieldName,
  });

  useEffect(() => {
    if (typeof sourceValue === "string" && !isManuallyEdited) {
      const generatedSlug = sourceValue
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .replace(/--+/g, "-")
        .replace(/^-+|-+$/g, "");

      if (controllerField.value !== generatedSlug) {
        setValue(field.name, generatedSlug as Parameters<UseFormSetValue<TFieldValues>>[1], {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    }
  }, [sourceValue, isManuallyEdited, field.name, setValue, controllerField.value]);

  return (
    <Input
      {...controllerField}
      value={controllerField.value ?? ""}
      onChange={(e) => {
        setIsManuallyEdited(true);
        controllerField.onChange(e);
      }}
      className="bg-background/60 border-border/80 focus-visible:ring-primary/20 h-9 rounded-xl font-mono text-xs transition-all focus-visible:ring-2"
    />
  );
}