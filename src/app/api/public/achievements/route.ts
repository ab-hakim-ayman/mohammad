import I18n from "@/shared/components/I18n";
import { NextRequest } from "next/server";
import { ApiServer } from "@/core/server/http/handler";
import { ApiResponse } from "@/core/server/http/response";
import { achievementService } from "@/features/achievement/server";
import { enrichEntitiesWithAltText  } from "@/features/media/utils/enrich-entities";

export async function GET(request: NextRequest) {
  return ApiServer.cachedPublic(request, "achievements", async () => {
    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "0");
    const result = await achievementService.getPublished(limit || undefined);
    const enriched = await enrichEntitiesWithAltText("achievement", result as any[], {
      cardImage: "cardImage",
      heroImage: "heroImage",
      ogImage: "ogImage",
      image: "image",
    });
    return ApiResponse.success(enriched, "Achievements retrieved");
  });
}
