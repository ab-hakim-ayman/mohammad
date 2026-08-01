import I18n from "@/shared/components/I18n";
import { NextRequest } from "next/server";
import { ApiServer } from "@/core/server/http/handler";
import { ApiResponse } from "@/core/server/http/response";
import { serviceService } from "@/features/service/server";

export async function GET(request: NextRequest) {
  return ApiServer.cachedPublic(request, "services", async () => {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || undefined;
    const result = await serviceService.getPublished({ page, limit, search });
    return ApiResponse.paginated(
      result.data,
      {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / result.limit),
      },
      "Services retrieved"
    );
  });
}
