import { NextRequest } from "next/server";
import { ApiServer } from "@/core/server/http/handler";
import { experienceService } from "@/features/experience/server";
import { ApiResponse } from "@/core/server/http/response";
import { enrichEntitiesWithAltText } from "@/features/media/utils/enrich-entities";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return ApiServer.cachedPublic(request, "experiences", async () => {
    const { id } = await params;
    const experience = await experienceService.getPublicById(id);

    const [enriched] = await enrichEntitiesWithAltText("experience", [experience as any], {
      logo: "logo",
      cardImage: "cardImage",
      ogImage: "ogImage",
    });

    return ApiResponse.success(enriched, "Experience retrieved");
  });
}
