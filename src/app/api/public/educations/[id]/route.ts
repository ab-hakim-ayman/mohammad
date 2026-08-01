import { NextRequest } from "next/server";
import { ApiServer } from "@/core/server/http/handler";
import { educationService } from "@/features/education/server";
import { ApiResponse } from "@/core/server/http/response";
import { enrichEntitiesWithAltText } from "@/features/media/utils/enrich-entities";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return ApiServer.cachedPublic(request, "educations", async () => {
    const { id } = await params;
    const education = await educationService.getPublicById(id);

    const [enriched] = await enrichEntitiesWithAltText("education", [education as any], {
      logo: "logo",
    });

    return ApiResponse.success(enriched, "Education retrieved");
  });
}
