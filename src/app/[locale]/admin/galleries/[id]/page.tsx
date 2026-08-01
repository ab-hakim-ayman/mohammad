"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useGallery, useDeleteGalleryItem, useDeleteGallery, CreateGalleryItemSchema, CreateGalleryItemSchemaType } from "@/features/gallery";
import { galleryApi } from "@/features/gallery/api/gallery.api";
import { useQueryClient } from "@tanstack/react-query";
import { DetailEngine } from "@/shared/components/details/DetailEngine";
import { DetailEngineConfig } from "@/shared/components/details/detail-engine.types";
import { FormEngine } from "@/shared/components/forms/FormEngine";
import { FormEngineConfig } from "@/shared/components/forms/form-engine.types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Trash2,
  Play,
  FileImage,
  Loader2,
  BookOpen,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import I18n from "@/shared/components/I18n";
import { StateScreen } from "@/shared/components";

export default function GalleryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useGallery(id);
  const deleteGalleryMutation = useDeleteGallery();
  const deleteItemMutation = useDeleteGalleryItem();

  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) {
    return <StateScreen state="loading" title="Loading gallery details" compact />;
  }

  if (error || !data?.data) {
    return <StateScreen state="error" title="Failed to load gallery details" compact />;
  }

  const gallery = data.data;
  const items = gallery.items || [];

  const handleDeleteItem = async (itemId: string, itemTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${itemTitle || "this item"}"?`)) return;
    try {
      await deleteItemMutation.mutateAsync(itemId);
      queryClient.invalidateQueries({ queryKey: ["galleries", gallery.id] });
    } catch (err: any) {
      alert(err?.message || "Failed to delete item.");
    }
  };

  const handleDeleteGallery = async () => {
    if (!confirm("Delete this gallery permanently?")) return;
    await deleteGalleryMutation.mutateAsync(gallery.id);
    router.push("/admin/galleries");
  };

  // FormEngine Configuration for adding a gallery item
  const formConfig: FormEngineConfig<CreateGalleryItemSchemaType> = {
    sections: [
      {
        fields: [
          { name: "title", label: "Title", type: "text", required: true, gridSpan: 12 },
          { name: "shortDesc", label: "Description", type: "textarea", gridSpan: 12 },
          {
            name: "type",
            label: "Type",
            type: "select",
            required: true,
            options: [
              { label: "Image", value: "IMAGE" },
              { label: "Video", value: "VIDEO" },
            ],
            gridSpan: 6,
          },
          {
            name: "status",
            label: "Status",
            type: "select",
            required: true,
            options: [
              { label: "Draft", value: "DRAFT" },
              { label: "Published", value: "PUBLISHED" },
              { label: "Archived", value: "ARCHIVED" },
            ],
            gridSpan: 6,
          },
          { name: "order", label: "Display Order", type: "number", gridSpan: 12 },
          {
            name: "image",
            label: "Upload Asset",
            type: "media",
            required: true,
            mediaFolder: "galleries",
            showAltText: true,
            altTextField: "imageAlt",
            gridSpan: 12,
          },
          {
            name: "videoUrl",
            label: "Video URL",
            type: "text",
            gridSpan: 12,
            condition: (values) => values?.type === "VIDEO",
          },
          {
            name: "thumbnail",
            label: "Video Thumbnail",
            type: "media",
            mediaFolder: "galleries",
            showAltText: true,
            altTextField: "thumbnailAlt",
            gridSpan: 12,
            condition: (values) => values?.type === "VIDEO",
          },
          // Hidden fields mapping to alt text inputs managed by altTextField
          { name: "imageAlt", label: "Image Alt", type: "text", gridSpan: 12, condition: () => false },
          { name: "thumbnailAlt", label: "Thumbnail Alt", type: "text", gridSpan: 12, condition: () => false },
        ],
      },
    ],
  };

  const config: DetailEngineConfig<typeof gallery> = {
    titleKey: "title",
    subtitleKey: "shortDesc",
    statusKey: "status",
    headerIcon: BookOpen,
    eyebrow: "Gallery Details",
    actions: {
      editHref: `/admin/galleries/${gallery.id}/edit`,
      backHref: "/admin/galleries",
      onDelete: handleDeleteGallery,
      isDeleting: deleteGalleryMutation.isPending,
    },
    mainSections: [
      {
        title: "Overview",
        fields: [
          { label: "Slug", key: "slug", type: "text", gridSpan: 6 },
          { label: "Display Order", key: "order", type: "text", gridSpan: 6 },
        ],
      },
      {
        title: "Gallery Items",
        description: `Total items: ${items.length}`,
        fields: [
          {
            label: "Items Grid",
            key: "items" as any,
            type: "custom",
            gridSpan: 12,
            render: () => {
              return (
                <div className="space-y-4">
                  {/* Action Bar */}
                  <div className="flex items-center justify-between border-b border-border/40 pb-3">
                    <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
                      <I18n>Manage Gallery Content</I18n>
                    </span>
                    <Button
                      onClick={() => setIsModalOpen(true)}
                      size="sm"
                      className="bg-primary text-primary-foreground hover:bg-primary/90 h-8 rounded-xl px-3 text-xs font-bold gap-1.5 shadow-2xs transition-all hover:scale-[1.02]"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <I18n>Add Item</I18n>
                    </Button>
                  </div>

                  {items.length === 0 ? (
                    <div className="border-border/40 flex min-h-[200px] flex-col items-center justify-center rounded-2xl border border-dashed text-center p-6 bg-background/20">
                      <FileImage className="text-muted-foreground/30 mb-2 h-10 w-10" />
                      <p className="text-foreground text-xs font-bold">
                        <I18n>No items uploaded yet</I18n>
                      </p>
                      <p className="text-muted-foreground mt-0.5 text-[10px]">
                        <I18n>Click "Add Item" to upload images or videos to this gallery.</I18n>
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                      {items.map((item: any) => (
                        <div
                          key={item.id}
                          className="bg-background/40 border-border/40 group relative overflow-hidden rounded-2xl border shadow-xs transition-all hover:scale-[1.02] hover:border-primary/30"
                        >
                          <div className="relative aspect-video w-full overflow-hidden bg-zinc-950">
                            {item.type === "VIDEO" ? (
                              <>
                                {item.thumbnail ? (
                                  <Image
                                    src={item.thumbnail}
                                    alt={item.title || ""}
                                    fill
                                    unoptimized
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center">
                                    <Play className="h-10 w-10 text-white/70" />
                                  </div>
                                )}
                                <div className="absolute right-2 top-2 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white uppercase">
                                  Video
                                </div>
                              </>
                            ) : (
                              item.image && (
                                <Image
                                  src={item.image}
                                  alt={item.title || ""}
                                  fill
                                  unoptimized
                                  className="object-contain transition-transform duration-300 group-hover:scale-105"
                                />
                              )
                            )}

                            <div
                              className={cn(
                                "absolute left-2 top-2 rounded-md px-2 py-0.5 text-[10px] font-extrabold uppercase",
                                item.status === "PUBLISHED"
                                  ? "bg-emerald-500/80 text-white"
                                  : item.status === "ARCHIVED"
                                    ? "bg-amber-500/80 text-white"
                                    : "bg-zinc-500/80 text-white"
                              )}
                            >
                              <I18n>{item.status}</I18n>
                            </div>

                            <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100 flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleDeleteItem(item.id, item.title || "")}
                                disabled={deleteItemMutation.isPending}
                                className="bg-destructive hover:bg-destructive/95 text-white flex h-10 w-10 items-center justify-center rounded-xl transition-all hover:scale-105 shadow-sm"
                                title="Delete Item"
                              >
                                {deleteItemMutation.isPending && deleteItemMutation.variables === item.id ? (
                                  <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                  <Trash2 className="h-5 w-5" />
                                )}
                              </button>
                            </div>
                          </div>

                          <div className="p-4 space-y-1">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="text-foreground truncate text-sm font-bold">{item.title || "Untitled"}</h3>
                              <span className="bg-zinc-200 dark:bg-zinc-800 text-muted-foreground rounded-md px-1.5 py-0.5 text-[9px] font-bold">
                                Order: {item.order}
                              </span>
                            </div>
                            {item.shortDesc && (
                              <p className="text-muted-foreground truncate text-xs">{item.shortDesc}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            },
          },
        ],
      },
    ],
    sidebarSections: [
      {
        title: "Visual Assets",
        fields: [
          { label: "Cover Image", key: "coverImage", type: "media", gridSpan: 12 },
          { label: "OG Image", key: "ogImage", type: "media", gridSpan: 12 },
        ],
      },
      {
        title: "Activity & History",
        fields: [
          { label: "Published At", key: "publishedAt", type: "datetime", gridSpan: 12 },
          { label: "Archived At", key: "archivedAt", type: "datetime", gridSpan: 12 },
          { label: "Created At", key: "createdAt", type: "datetime", gridSpan: 12 },
          { label: "Updated At", key: "updatedAt", type: "datetime", gridSpan: 12 },
          {
            label: "Created By",
            key: "createdBy",
            type: "custom",
            gridSpan: 12,
            render: (rec) =>
              rec.createdBy?.profile?.fullName ||
              rec.createdBy?.name ||
              rec.createdBy?.email ||
              "—",
          },
          {
            label: "Updated By",
            key: "updatedBy",
            type: "custom",
            gridSpan: 12,
            render: (rec) =>
              rec.updatedBy?.profile?.fullName ||
              rec.updatedBy?.name ||
              rec.updatedBy?.email ||
              "—",
          },
        ],
      },
    ],
  };

  return (
    <>
      <DetailEngine data={gallery} config={config as any} />

      {/* Upload Item Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="border-border/80 bg-card/95 rounded-2xl shadow-xl backdrop-blur-md sm:max-w-xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold tracking-wide">
              <I18n>Add New Gallery Item</I18n>
            </DialogTitle>
          </DialogHeader>

          <div className="pt-2">
            <FormEngine
              schema={CreateGalleryItemSchema}
              config={formConfig}
              defaultValues={{
                galleryId: gallery.id,
                type: "IMAGE",
                status: "DRAFT",
                order: 0,
              }}
              onSubmit={async (values) => {
                try {
                  await galleryApi.addItem(gallery.id, values);
                  setIsModalOpen(false);
                  queryClient.invalidateQueries({ queryKey: ["galleries", gallery.id] });
                } catch (err: any) {
                  alert(err?.message || "Failed to add item");
                }
              }}
              cancelText="Cancel"
              onCancel={() => setIsModalOpen(false)}
              submitText="Save Item"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
