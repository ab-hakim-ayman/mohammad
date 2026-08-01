import I18n from "@/shared/components/I18n";

import { NextRequest } from "next/server";
import { ApiServer } from "@/core/server/http/handler";
import { categoryService } from "@/features/category/server";
import { ApiResponse } from "@/core/server/http/response";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug_or_id: string }> }
) {
  const { slug_or_id } = await params;

  return ApiServer.cachedPublic(request, `categories:${slug_or_id}`, async () => {
    let category;

    try {
      if (slug_or_id.length === 25 && slug_or_id.startsWith("c")) {
        const adminData = await categoryService.getById(slug_or_id);
        category = await categoryService.getBySlug(adminData.slug);
      } else {
        category = await categoryService.getBySlug(slug_or_id);
      }
    } catch {
      return ApiResponse.success(null, "Category not found");
    }

    if (!category) {
      return ApiResponse.success(null, "Category not found");
    }

    return ApiResponse.success(category, "Category retrieved");
  });
}
