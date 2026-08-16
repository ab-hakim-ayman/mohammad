import I18n from "@/shared/components/I18n";

import { NextRequest } from "next/server";
import { ApiServer } from "@/core/server/http/handler";
import { projectService } from "@/features/project/server";
import { ApiResponse } from "@/core/server/http/response";
import { enrichEntitiesWithAltText  } from "@/features/media/utils/enrich-entities";

export async function GET(request: NextRequest) {
  return ApiServer.cachedPublic(request, "projects", async () => {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || undefined;
    const technology = searchParams.get("technology") || undefined;
    const featured = searchParams.has("featured")
      ? searchParams.get("featured") === "true"
      : undefined;

    const result = await projectService.getPublished({
      page,
      limit,
      search,
      technology,
      featured,
    });

    const enriched = await enrichEntitiesWithAltText("project", result.data as any[], {
      cardImage: "cardImage",
      heroImage: "heroImage",
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
      "Projects retrieved"
    );
  });
}
