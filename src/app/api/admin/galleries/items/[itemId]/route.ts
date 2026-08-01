import I18n from "@/shared/components/I18n";
import { NextRequest } from "next/server";
import { ApiServer, validateBody } from "@/core/server/http/handler";
import { ApiResponse } from "@/core/server/http/response";
import { galleryService } from "@/features/gallery/server";
import { UpdateGalleryItemSchema } from "@/features/gallery";
import type { UpdateGalleryItemSchemaType } from "@/features/gallery";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  return ApiServer.admin(_request, async () => {
    const { itemId } = await params;
    const item = await galleryService.getItemById(itemId);
    return ApiResponse.success(item, "Gallery item retrieved");
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  return ApiServer.admin(request, async () => {
    const body = await validateBody<UpdateGalleryItemSchemaType>(request, UpdateGalleryItemSchema);
    const { itemId } = await params;
    const item = await galleryService.updateItem(itemId, body);
    return ApiResponse.success(item, "Gallery item updated");
  });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  return ApiServer.admin(_request, async () => {
    const { itemId } = await params;
    await galleryService.deleteItem(itemId);
    return ApiResponse.noContent("Gallery item deleted");
  });
}
