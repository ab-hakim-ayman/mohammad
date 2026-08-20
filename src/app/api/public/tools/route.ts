import { NextRequest } from "next/server";
import { ApiServer } from "@/core/server/http/handler";
import { ApiResponse } from "@/core/server/http/response";
import { toolService } from "@/features/tool/server";

export async function GET(request: NextRequest) {
  return ApiServer.cachedPublic(request, "tools", async () => {
    const searchParams = request.nextUrl.searchParams;
    const categories = searchParams.get("categories") || searchParams.get("category") || undefined;
    const featuredParam = searchParams.get("featured");
    const featured = featuredParam === "true" ? true : featuredParam === "false" ? false : undefined;
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : undefined;
    const search = searchParams.get("search") || undefined;

    const tools = await toolService.getPublished({ categories, featured, limit, search });
    return ApiResponse.success(tools, "Published tools retrieved");
  });
}
