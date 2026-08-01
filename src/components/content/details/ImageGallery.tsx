import Image from "next/image";
import { ScrollReveal } from "@/shared/components/ScrollReveal";

interface GalleryCaption {
  title?: string;
  description?: string;
}

interface ImageGalleryProps {
  images: string[];
  captions?: GalleryCaption[];
  altTexts?: string[];
}

export function ImageGallery({ images, captions, altTexts }: ImageGalleryProps) {
  if (!images || images.length === 0) return null;

  return (
    <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-5 5xl:grid-cols-8">
      {images.map((img: string, idx: number) => {
        const caption = captions?.[idx];
        return (
          <ScrollReveal
            key={idx}
            delay={idx * 50}
            className="group border-border bg-muted shadow-soft hover:border-primary/20 hover:shadow-soft-hover relative aspect-4/3 w-full overflow-hidden rounded-xl border transition-all"
          >
            <Image
              src={img}
              alt={altTexts?.[idx] || `Gallery image ${idx + 1}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105 hover:scale-105"
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            />
            {caption && (
              <div className="from-background/90 via-background/60 absolute inset-x-0 bottom-0 bg-linear-to-t to-transparent p-6 pt-12">
                {caption.title && (
                  <h4 className="text-foreground font-semibold">{caption.title}</h4>
                )}
                {caption.description && (
                  <p className="text-foreground/80 mt-1 text-xs">{caption.description}</p>
                )}
              </div>
            )}
          </ScrollReveal>
        );
      })}
    </div>
  );
}
