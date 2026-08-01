import { NextRequest } from "next/server";
import { ApiServer } from "@/core/server/http/handler";
import { ApiResponse } from "@/core/server/http/response";
import { serviceService } from "@/features/service/server";
import { enrichEntitiesWithAltText  } from "@/features/media/utils/enrich-entities";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  return ApiServer.cachedPublic(_request, "services", async () => {
    const { slug } = await params;
    const service = await serviceService.getPublicBySlug(slug);
    if (!service) return ApiResponse.success(null, "Service not found");
    const [enriched] = await enrichEntitiesWithAltText("service", [service] as any[], {
      cardImage: "cardImage",
      heroImage: "heroImage",
      ogImage: "ogImage",
    });
    return ApiResponse.success(enriched, "Service retrieved");
  });
}
