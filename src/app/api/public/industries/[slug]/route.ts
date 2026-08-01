import { NextRequest } from "next/server";
import { ApiServer } from "@/core/server/http/handler";
import { ApiResponse } from "@/core/server/http/response";
import { industryService } from "@/features/industry/server";
import { enrichEntitiesWithAltText  } from "@/features/media/utils/enrich-entities";

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  return ApiServer.cachedPublic(request, "industries", async () => {
    const { slug } = await params;
    const result = await industryService.getPublicBySlug(slug);
    const enriched = await enrichEntitiesWithAltText("industry", [result], {
      cardImage: "cardImage",
      heroImage: "heroImage",
      ogImage: "ogImage",
    });
    return ApiResponse.success(enriched[0] ?? result, "Industry retrieved");
  });
}
