"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { ImageIcon, PlayCircle } from "lucide-react";
import I18n from "@/shared/components/I18n";
import { ScrollReveal } from "@/shared/components/ScrollReveal";

interface GalleryItem {
  id: string;
  title: string | null;
  shortDesc: string | null;
  image: string | null;
  type: string;
  videoUrl: string | null;
  thumbnail: string | null;
}

interface Props {
  items: GalleryItem[];
  coverImage?: string | null;
  hasContent: boolean;
}

export function GalleryCinemaViewer({ items, coverImage, hasContent }: Props) {
  const searchParams = useSearchParams();
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const activeItem = items.find((item) => item.id === activeItemId) || items[0] || null;
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    const hashId = hash.startsWith("#item-") ? hash.replace("#item-", "") : null;
    const queryId = searchParams.get("item");
    const nextId = hashId || queryId || items[0]?.id || null;
    setActiveItemId(nextId);
  }, [items, searchParams]);

  const handleThumbnailClick = (item: GalleryItem) => {
    setActiveItemId(item.id);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `#item-${item.id}`);
    }
    stageRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <section
      className={`bg-muted/30 border-border border-y py-20 sm:py-28 ${!hasContent && !coverImage ? "mt-0 border-t-0" : ""}`}
    >
      <div className="container-custom">
        <ScrollReveal className="mb-16 text-center">
          <span className="text-primary mb-4 inline-block text-xs font-bold tracking-[0.2em] uppercase">
            <I18n>The Gallery</I18n>
          </span>
          <h2 className="text-foreground text-3xl font-black tracking-tight sm:text-5xl">
            <I18n>Visual Exploration</I18n>
          </h2>
        </ScrollReveal>

        {activeItem && (
          <div ref={stageRef} className="mb-16 scroll-mt-32">
            <div className="bg-surface-elevated border-border shadow-brand overflow-hidden rounded-[2rem] border p-4 sm:p-8">
              <div className="group relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl bg-black/90">
                {activeItem.type === "VIDEO" && activeItem.videoUrl ? (
                  <iframe
                    src={activeItem.videoUrl.replace("watch?v=", "embed/")}
                    className="absolute inset-0 z-10 h-full w-full"
                    allowFullScreen
                    title={activeItem.title || "Video"}
                  />
                ) : activeItem.image ? (
                  <Image
                    src={activeItem.image}
                    alt={activeItem.title || "Gallery Item"}
                    fill
                    className="object-contain"
                    sizes="(max-width: 1280px) 100vw, 1280px"
                    priority
                  />
                ) : (
                  <ImageIcon className="h-20 w-20 text-white/20" />
                )}
              </div>

              <div className="mt-8 flex flex-col justify-between gap-6 px-4 sm:px-6 md:flex-row md:items-start">
                <div>
                  <div className="mb-4 flex items-center gap-3">
                    <span className="bg-primary/10 text-primary border-primary/20 rounded-full border px-3 py-1 text-xs font-black tracking-widest uppercase">
                      {activeItem.type}
                    </span>
                  </div>
                  <h3 className="mb-4 text-2xl font-bold tracking-tight sm:text-3xl">
                    {activeItem.title || "Untitled Media"}
                  </h3>
                  {activeItem.shortDesc && (
                    <p className="text-muted-foreground max-w-3xl text-lg leading-relaxed">
                      {activeItem.shortDesc}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {items.length > 0 ? (
          <div className="3xl:grid-cols-5 4xl:grid-cols-6 5xl:grid-cols-8 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {items.map((item, index) => (
              <button
                key={item.id}
                onClick={() => handleThumbnailClick(item)}
                className={`group relative aspect-square overflow-hidden rounded-2xl border transition-all duration-300 outline-none sm:aspect-[4/3] ${
                  activeItemId === item.id
                    ? "border-primary ring-primary ring-offset-background shadow-brand scale-[0.98] ring-2 ring-offset-2"
                    : "border-border shadow-soft hover:shadow-soft-hover"
                } `}
              >
                <Image
                  src={item.thumbnail || item.image || ""}
                  alt={item.title || "Thumbnail"}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className={`object-cover transition-transform duration-700 ${activeItemId === item.id ? "scale-100" : "group-hover:scale-110"} `}
                />
                <div
                  className={`absolute inset-0 transition-opacity duration-300 ${activeItemId === item.id ? "bg-black/10" : "bg-black/40 group-hover:bg-black/20"} `}
                ></div>

                {item.type === "VIDEO" && (
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <PlayCircle className="h-10 w-10 text-white opacity-80 drop-shadow-md transition-all group-hover:scale-110 group-hover:opacity-100" />
                  </div>
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="border-border bg-card text-muted-foreground shadow-soft rounded-none border p-16 text-center sm:rounded-lg">
            <ImageIcon className="text-muted-foreground/30 mx-auto mb-6 h-16 w-16" />
            <p className="text-lg font-medium">
              <I18n>No items in this collection yet.</I18n>
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
