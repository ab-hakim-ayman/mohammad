import I18n from "@/shared/components/I18n";

import { NextRequest } from "next/server";
import { ApiServer, validateBody } from "@/core/server/http/handler";
import { UpdateCategorySchema } from "@/features/category";
import { categoryService } from "@/features/category/server";
import { ApiResponse } from "@/core/server/http/response";
import type { UpdateCategorySchemaType } from "@/features/category";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return ApiServer.admin(request, async () => {
    const { id } = await params;
    const category = await categoryService.getById(id);
    return ApiResponse.success(category, "Category retrieved");
  });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return ApiServer.admin(request, async () => {
    const { id } = await params;
    const body = await validateBody<UpdateCategorySchemaType>(request, UpdateCategorySchema);
    const category = await categoryService.update(id, body);
    return ApiResponse.success(category, "Category updated");
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return ApiServer.admin(request, async () => {
    const { id } = await params;
    await categoryService.delete(id);
    return ApiResponse.noContent("Category deleted");
  });
}
