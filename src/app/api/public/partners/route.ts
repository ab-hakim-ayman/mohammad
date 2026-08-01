import I18n from "@/shared/components/I18n";
import { NextRequest } from "next/server";
import { ApiServer } from "@/core/server/http/handler";
import { ApiResponse } from "@/core/server/http/response";
import { partnerService } from "@/features/partner/server";
import { enrichEntitiesWithAltText  } from "@/features/media/utils/enrich-entities";

export async function GET(request: NextRequest) {
  return ApiServer.cachedPublic(request, "partners", async () => {
    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "0");
    const result = await partnerService.getPublished(limit || undefined);
    const enriched = await enrichEntitiesWithAltText("partner", result, { logo: "logo" });
    return ApiResponse.success(enriched, "Partners retrieved");
  });
}
