import { NextRequest } from "next/server";
import { ApiServer } from "@/core/server/http/handler";
import { aboutService } from "@/features/about/server";
import { ApiResponse } from "@/core/server/http/response";
import { enrichEntitiesWithAltText  } from "@/features/media/utils/enrich-entities";
import { AppError } from "@/core/server/http/errors";

export async function GET(request: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  return ApiServer.cachedPublic(request, `abouts:${key}`, async () => {
    try {
      const about = await aboutService.getPublished(key);
      if (!about) return ApiResponse.success(null, "About section retrieved");
      const [enriched] = await enrichEntitiesWithAltText("about", [about] as any[], {
        heroImage: "heroImage",
        ogImage: "ogImage",
      });
      return ApiResponse.success(enriched, "About section retrieved");
    } catch (error) {
      if (error instanceof AppError && error.statusCode === 404) {
        return ApiResponse.success(null, "About section not found");
      }
      throw error;
    }
  });
}
