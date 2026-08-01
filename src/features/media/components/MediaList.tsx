import { MediaCard } from "./MediaCard";
import type { MediaRecord } from "../types/media.types";
export function MediaList({ items }: { items: MediaRecord[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3 xl:gap-8 3xl:grid-cols-4 3xl:gap-10 5xl:grid-cols-6 5xl:gap-12">
      {items.map((media) => (
        <MediaCard key={media.id} media={media} />
      ))}
    </div>
  );
}
