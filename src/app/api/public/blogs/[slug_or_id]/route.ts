import I18n from "@/shared/components/I18n";

import { NextRequest } from "next/server";
import { ApiServer } from "@/core/server/http/handler";
import { blogService } from "@/features/blog/server";
import { ApiResponse } from "@/core/server/http/response";
import { enrichEntitiesWithAltText  } from "@/features/media/utils/enrich-entities";
import { AppError } from "@/core/server/http/errors";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug_or_id: string }> }
) {
  const { slug_or_id } = await params;

  return ApiServer.cachedPublic(request, `blogs:${slug_or_id}`, async () => {
    let blog;
    try {
      if (slug_or_id.startsWith("c") && slug_or_id.length >= 25) {
        try {
          blog = await blogService.getById(slug_or_id);
        } catch {
          blog = await blogService.getPublicBySlug(slug_or_id);
        }
      } else {
        blog = await blogService.getPublicBySlug(slug_or_id);
      }

      if (blog.status !== "PUBLISHED") {
        return ApiResponse.success(null, "Blog not found or not published");
      }
    } catch (error) {
      if (error instanceof AppError && error.statusCode === 404) {
        return ApiResponse.success(null, "Blog not found");
      }
      throw error;
    }
    const [enriched] = await enrichEntitiesWithAltText("blog", [blog] as any[], {
      cardImage: "cardImage",
      heroImage: "heroImage",
      ogImage: "ogImage",
    });
    return ApiResponse.success(enriched, "Blog retrieved");
  });
}
