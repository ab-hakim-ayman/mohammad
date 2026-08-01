import { NextRequest } from "next/server";
import { ApiServer } from "@/core/server/http/handler";
import { ApiResponse } from "@/core/server/http/response";
import { galleryService } from "@/features/gallery/server";
import { enrichEntitiesWithAltText  } from "@/features/media/utils/enrich-entities";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  return ApiServer.cachedPublic(_request, "galleries", async () => {
    const { slug } = await params;
    const gallery = await galleryService.getBySlug(slug);
    if (!gallery) {
      return ApiResponse.success(null, "Gallery retrieved");
    }
    const [enriched] = await enrichEntitiesWithAltText("gallery", [gallery], {
      coverImage: "coverImage",
      ogImage: "ogImage",
    });

    if (enriched.items && enriched.items.length > 0) {
      const enrichedItems = await enrichEntitiesWithAltText(
        "gallery-item",
        enriched.items as any[],
        { image: "image" }
      );
      (enriched as any).items = enrichedItems;
    }

    return ApiResponse.success(enriched, "Gallery retrieved");
  });
}
