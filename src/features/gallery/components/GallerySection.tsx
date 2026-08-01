"use client";

import { useMemo } from "react";
import { usePublishedGalleries } from "../hooks/useGallery";
import { GalleryCard } from "./GalleryCard";
import { SectionEngine } from "@/shared/components/sections/SectionEngine";
import { Gallery } from "../types/gallery.types";

export function GallerySection() {
  const { data, isLoading, error } = usePublishedGalleries();

  const processedGalleries = useMemo(() => {
    if (!data) return [];
    const raw = Array.isArray(data) ? data : (data as any).data?.data || (data as any).data || [];
    return raw.map((gallery: any) => {
      const hasImage = gallery.items?.some((i: any) => i.type === "IMAGE");
      const hasVideo = gallery.items?.some((i: any) => i.type === "VIDEO");
      const types = [];
      if (hasImage) types.push("IMAGE");
      if (hasVideo) types.push("VIDEO");
      return {
        ...gallery,
        mediaTypes: types,
      };
    });
  }, [data]);

  const filters = useMemo(() => {
    return [
      {
        key: "mediaTypes",
        placeholder: "Media Type",
        options: [
          { label: "Images", value: "IMAGE" },
          { label: "Videos", value: "VIDEO" },
        ],
      },
    ];
  }, []);

  return (
    <SectionEngine<any>
      data={processedGalleries}
      isLoading={isLoading}
      error={error}
      searchKey="title"
      searchPlaceholder="Filter galleries by keyword..."
      filters={filters}
      renderCard={(item) => (
        <GalleryCard gallery={item} variant="classic" size="md" className="h-full w-full" />
      )}
    />
  );
}
