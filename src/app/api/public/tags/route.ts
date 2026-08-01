import I18n from "@/shared/components/I18n";

import { NextRequest } from "next/server";
import { ApiServer } from "@/core/server/http/handler";
import { tagService } from "@/features/tag/server";
import { ApiResponse } from "@/core/server/http/response";

export async function GET(request: NextRequest) {
  return ApiServer.cachedPublic(request, "tags", async () => {
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined;
    const tags = await tagService.getPublished(limit);
    return ApiResponse.success(tags, "Tags retrieved");
  });
}
