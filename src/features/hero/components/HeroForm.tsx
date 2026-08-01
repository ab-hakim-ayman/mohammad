"use client";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { MediaUploader } from "@/components/media/MediaUploader";
import { CreateHeroSchema } from "../schemas/hero.schema";

import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select } from "@/shared/components/Select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import I18n from "@/shared/components/I18n";
import { Hero, CreateHeroPayload } from "../types/hero.types";

interface HeroFormProps {
  initialData?: Hero;
  onSubmit: (data: any) => Promise<void> | void;
  [key: string]: any;
}

export function HeroForm({ initialData, onSubmit, isSubmitting = false }: HeroFormProps) {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<z.input<typeof CreateHeroSchema>, unknown, CreateHeroPayload>({
    resolver: zodResolver(CreateHeroSchema),
    defaultValues: {
      title: initialData?.title || "",
      shortDesc: initialData?.shortDesc || "",
      heroImage: initialData?.heroImage || null,
      heroVideoUrl: initialData?.heroVideoUrl || null,
      ctaText: initialData?.ctaText || null,
      ctaLink: initialData?.ctaLink || null,
      secondaryCtaText: initialData?.secondaryCtaText || null,
      secondaryCtaLink: initialData?.secondaryCtaLink || null,
      status: initialData?.status || "DRAFT",
      isActive: initialData?.isActive || false,
      order: initialData?.order ?? 0,
    },
  });

  const heroImageAlt = useWatch({ control, name: "heroImageAlt" });
  const statusVal = useWatch({ control, name: "status" });

  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    await handleSubmit(onSubmit)(e);
  };

  return (
    <form onSubmit={onFormSubmit} className="container-custom space-y-6">
      <Card className="border-border bg-card rounded-xl shadow-xs">
        <CardContent className="space-y-6 p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-foreground text-sm font-semibold tracking-wide">
                <I18n>Title</I18n> *
              </label>
              <Input {...register("title")} className="h-11 rounded-xl focus-visible:ring-1" />
              {errors.title && (
                <p className="text-destructive text-xs font-medium">{errors.title.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-foreground text-sm font-semibold tracking-wide">
                <I18n>Short Desc</I18n> *
              </label>
              <Input {...register("shortDesc")} className="h-11 rounded-xl focus-visible:ring-1" />
              {errors.shortDesc && (
                <p className="text-destructive text-xs font-medium">{errors.shortDesc.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-foreground text-sm font-semibold tracking-wide">
                <I18n>Status</I18n> *
              </label>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange} options={[
                    { label: "Draft", value: "DRAFT" },
                    { label: "Published", value: "PUBLISHED" },
                    { label: "Archived", value: "ARCHIVED" },
                  ]} />
                )}
              />
            </div>
            <div className="space-y-2">
              <label className="text-foreground text-sm font-semibold tracking-wide">
                <I18n>Order</I18n>
              </label>
              <Input
                type="number"
                {...register("order", { valueAsNumber: true })}
                className="h-11 rounded-xl focus-visible:ring-1"
              />
            </div>
          </div>

          <div className="border-border flex items-center gap-3 border-y py-2">
            <Controller
              control={control}
              name="isActive"
              render={({ field }) => (
                <Switch
                  id="isActive"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={statusVal !== "PUBLISHED"}
                />
              )}
            />
            <label
              htmlFor="isActive"
              className={`cursor-pointer text-sm font-medium select-none ${statusVal !== "PUBLISHED" ? "text-muted-foreground" : "text-foreground"}`}
            >
              <I18n>Active</I18n>
            </label>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-foreground text-sm font-semibold tracking-wide">
                <I18n>Cta Text</I18n>
              </label>
              <Input {...register("ctaText")} className="h-11 rounded-xl focus-visible:ring-1" />
            </div>
            <div className="space-y-2">
              <label className="text-foreground text-sm font-semibold tracking-wide">
                <I18n>Cta Link</I18n>
              </label>
              <Input {...register("ctaLink")} className="h-11 rounded-xl focus-visible:ring-1" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-foreground text-sm font-semibold tracking-wide">
                <I18n>Secondary Cta Text</I18n>
              </label>
              <Input
                {...register("secondaryCtaText")}
                className="h-11 rounded-xl focus-visible:ring-1"
              />
            </div>
            <div className="space-y-2">
              <label className="text-foreground text-sm font-semibold tracking-wide">
                <I18n>Secondary Cta Link</I18n>
              </label>
              <Input
                {...register("secondaryCtaLink")}
                className="h-11 rounded-xl focus-visible:ring-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card rounded-xl shadow-xs">
        <CardContent className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2">
          <Controller
            control={control}
            name="heroImage"
            render={({ field }) => (
              <MediaUploader
                label={"Hero Image"}
                value={typeof field.value === "string" ? field.value : null}
                onChange={(value) => field.onChange(typeof value === "string" ? value : null)}
                folder="a2icoders/heroes"
                altText={heroImageAlt ?? ""}
                onAltTextChange={(val) => setValue("heroImageAlt", val || null)}
              />
            )}
          />

          <Controller
            control={control}
            name="heroVideoUrl"
            render={({ field }) => (
              <MediaUploader
                label={"Hero Video Url"}
                value={typeof field.value === "string" ? field.value : null}
                onChange={(value) => field.onChange(typeof value === "string" ? value : null)}
                folder="a2icoders/heroes"
                accept="video/*"
                showAltText={false}
              />
            )}
          />
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4 pt-4">
        {Object.keys(errors).length > 0 && (
          <Alert
            variant="destructive"
            className="border-destructive/20 bg-destructive/10 rounded-xl"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs font-semibold">
              <I18n>Please resolve errors before saving:</I18n> {Object.keys(errors).join(", ")}
            </AlertDescription>
          </Alert>
        )}

        <div className="border-border flex justify-end gap-3 border-t pt-5">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
            className="h-10 cursor-pointer rounded-xl px-5 transition-colors"
          >
            <I18n>Cancel</I18n>
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 cursor-pointer rounded-xl px-6 font-semibold shadow-sm transition-all"
          >
            {isSubmitting ? "Saving" : "Save"}
          </Button>
        </div>
      </div>
    </form>
  );
}
