import { NextRequest } from "next/server";
import { ApiServer, validateBody, validateQuery } from "@/core/server/http/handler";
import {
  CreateCategorySchema,
  CategoryQuerySchema,
} from "@/features/category";
import { categoryService } from "@/features/category/server";
import { ApiResponse } from "@/core/server/http/response";
import type {
  CreateCategorySchemaType,
  CategoryQuerySchemaType,
} from "@/features/category";

export async function GET(request: NextRequest) {
  return ApiServer.admin(request, async () => {
    const query = validateQuery<CategoryQuerySchemaType>(request.nextUrl, CategoryQuerySchema);
    const result = await categoryService.getAll(query);
    return ApiResponse.paginated(
      result.data,
      {
        page: result.meta.page,
        limit: result.meta.limit,
        total: result.meta.total,
        totalPages: result.meta.totalPages,
      },
      "Categories retrieved"
    );
  });
}

export async function POST(request: NextRequest) {
  return ApiServer.admin(request, async () => {
    const body = await validateBody<CreateCategorySchemaType>(request, CreateCategorySchema);
    const category = await categoryService.create(body);
    return ApiResponse.created(category, "Category created");
  });
}
