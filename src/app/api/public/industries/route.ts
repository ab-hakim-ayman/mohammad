import I18n from "@/shared/components/I18n";
import { NextRequest } from "next/server";
import { ApiServer } from "@/core/server/http/handler";
import { ApiResponse } from "@/core/server/http/response";
import { industryService } from "@/features/industry/server";
import { enrichEntitiesWithAltText  } from "@/features/media/utils/enrich-entities";

export async function GET(request: NextRequest) {
  return ApiServer.cachedPublic(request, "industries", async () => {
    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "0");
    const result = await industryService.getPublished(limit || undefined);
    const enriched = await enrichEntitiesWithAltText("industry", result as any[], {
      cardImage: "cardImage",
      heroImage: "heroImage",
      ogImage: "ogImage",
    });
    return ApiResponse.success(enriched, "Industries retrieved");
  });
}
