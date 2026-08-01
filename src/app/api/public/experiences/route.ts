import { NextRequest } from "next/server";
import { ApiServer } from "@/core/server/http/handler";
import { experienceService } from "@/features/experience/server";
import { ApiResponse } from "@/core/server/http/response";
import { enrichEntitiesWithAltText } from "@/features/media/utils/enrich-entities";

export async function GET(request: NextRequest) {
  return ApiServer.cachedPublic(request, "experiences", async () => {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || undefined;

    const result = await experienceService.getPublished({
      page,
      limit,
      search,
    });

    const enriched = await enrichEntitiesWithAltText("experience", result.data as any[], {
      logo: "logo",
      cardImage: "cardImage",
      ogImage: "ogImage",
    });

    return ApiResponse.paginated(
      enriched,
      {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / result.limit),
      },
      "Experiences retrieved"
    );
  });
}
