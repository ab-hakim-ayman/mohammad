import I18n from "@/shared/components/I18n";

import { NextRequest } from "next/server";
import { ApiServer } from "@/core/server/http/handler";
import { achievementService } from "@/features/achievement/server";
import { ApiResponse } from "@/core/server/http/response";
import { enrichEntitiesWithAltText  } from "@/features/media/utils/enrich-entities";
import { AppError } from "@/core/server/http/errors";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug_or_id: string }> }
) {
  const { slug_or_id } = await params;
  return ApiServer.cachedPublic(request, `achievements:${slug_or_id}`, async () => {
    try {
      let achievement;

      if (slug_or_id.startsWith("c") && slug_or_id.length >= 25) {
        try {
          achievement = await achievementService.getById(slug_or_id);
        } catch {
          achievement = await achievementService.getBySlug(slug_or_id);
        }
      } else {
        achievement = await achievementService.getBySlug(slug_or_id);
      }

      if (achievement.status !== "PUBLISHED") {
        return ApiResponse.success(null, "Achievement not found or not published");
      }

      const [enriched] = await enrichEntitiesWithAltText("achievement", [achievement] as any[], {
        cardImage: "cardImage",
        heroImage: "heroImage",
        ogImage: "ogImage",
        image: "image",
      });
      return ApiResponse.success(enriched, "Achievement retrieved");
    } catch (error) {
      if (error instanceof AppError && error.statusCode === 404) {
        return ApiResponse.success(null, "Achievement not found");
      }
      throw error;
    }
  });
}
