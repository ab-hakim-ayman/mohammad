import I18n from "@/shared/components/I18n";

import { NextRequest } from "next/server";
import { ApiServer } from "@/core/server/http/handler";
import { categoryService } from "@/features/category/server";
import { ApiResponse } from "@/core/server/http/response";

export async function GET(request: NextRequest) {
  return ApiServer.cachedPublic(request, "categories", async () => {
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined;
    const categories = await categoryService.getPublished(limit);
    return ApiResponse.success(categories, "Categories retrieved");
  });
}
