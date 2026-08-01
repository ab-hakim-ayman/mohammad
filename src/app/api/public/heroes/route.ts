import { NextRequest } from "next/server";
import { ApiServer } from "@/core/server/http/handler";
import { heroService } from "@/features/hero/server";
import { ApiResponse } from "@/core/server/http/response";
import { enrichEntitiesWithAltText  } from "@/features/media/utils/enrich-entities";

export async function GET(request: NextRequest) {
  return ApiServer.cachedPublic(request, "heroes", async () => {
    const hero = await heroService.getActive();
    if (!hero) {
      return ApiResponse.success(null, "Active hero retrieved");
    }
    const [enriched] = await enrichEntitiesWithAltText("hero", [hero], { heroImage: "heroImage" });
    return ApiResponse.success(enriched, "Active hero retrieved");
  });
}
