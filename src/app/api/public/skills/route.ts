import I18n from "@/shared/components/I18n";

import { NextRequest } from "next/server";
import { ApiServer } from "@/core/server/http/handler";
import { skillService } from "@/features/skill/server";
import { ApiResponse } from "@/core/server/http/response";

export async function GET(request: NextRequest) {
  return ApiServer.cachedPublic(request, "skills", async () => {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category") || undefined;
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined;
    const skills = await skillService.getPublished(category, limit);
    return ApiResponse.success(skills, "Skills retrieved");
  });
}
