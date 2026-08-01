import I18n from "@/shared/components/I18n";
import { NextRequest } from "next/server";
import { ApiServer } from "@/core/server/http/handler";
import { ApiResponse } from "@/core/server/http/response";
import { galleryService } from "@/features/gallery/server";
import { enrichEntitiesWithAltText  } from "@/features/media/utils/enrich-entities";

export async function GET(request: NextRequest) {
  return ApiServer.cachedPublic(request, "galleries", async () => {
    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "0");
    const result = await galleryService.getPublished(limit || undefined);
    const enriched = await enrichEntitiesWithAltText("gallery", result, {
      coverImage: "coverImage",
      ogImage: "ogImage",
    });

    for (const gallery of enriched) {
      if ((gallery as any).items && (gallery as any).items.length > 0) {
        const enrichedItems = await enrichEntitiesWithAltText(
          "gallery-item",
          (gallery as any).items as any[],
          { image: "image" }
        );
        (gallery as any).items = enrichedItems;
      }
    }

    return ApiResponse.success(enriched, "Galleries retrieved");
  });
}
