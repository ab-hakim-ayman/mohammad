import { NextRequest } from "next/server";
import { ApiServer } from "@/core/server/http/handler";
import { specializationService } from "@/features/specialization/server";
import { ApiResponse } from "@/core/server/http/response";
import { enrichEntitiesWithAltText  } from "@/features/media/utils/enrich-entities";

export async function GET(request: NextRequest) {
  return ApiServer.cachedPublic(request, "specializations", async () => {
    const specializations = await specializationService.getPublished();
    const enriched = await enrichEntitiesWithAltText("specialization", specializations, {
      cardImage: "cardImage",
      heroImage: "heroImage",
      ogImage: "ogImage",
    });
    return ApiResponse.success(enriched, "Specializations retrieved");
  });
}
