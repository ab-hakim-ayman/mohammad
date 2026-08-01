import I18n from "@/shared/components/I18n";

import { NextRequest } from "next/server";
import { ApiServer } from "@/core/server/http/handler";
import { blogService } from "@/features/blog/server";
import { ApiResponse } from "@/core/server/http/response";
import { enrichEntitiesWithAltText  } from "@/features/media/utils/enrich-entities";

export async function GET(request: NextRequest) {
  return ApiServer.cachedPublic(request, "blogs", async () => {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const category = searchParams.get("category") || undefined;
    const tag = searchParams.get("tag") || undefined;
    const search = searchParams.get("search") || undefined;
    const result = await blogService.getPublished({
      page,
      limit,
      category,
      tag,
      search,
    });
    const enriched = await enrichEntitiesWithAltText("blog", result.data as any[], {
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
      "Blogs retrieved"
    );
  });
}
