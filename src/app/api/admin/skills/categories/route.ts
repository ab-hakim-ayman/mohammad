import { NextRequest } from "next/server";
import { ApiServer } from "@/core/server/http/handler";
import { skillService } from "@/features/skill/server";
import { ApiResponse } from "@/core/server/http/response";

export async function GET(request: NextRequest) {
  return ApiServer.admin(request, async () => {
    const categories = await skillService.getCategories();
    return ApiResponse.success(categories, "Categories retrieved");
  });
}
