import I18n from "@/shared/components/I18n";
import { NextRequest } from "next/server";
import { ApiServer, validateBody } from "@/core/server/http/handler";
import { getCurrentUser } from "@/core/server/security/auth";
import { ApiResponse } from "@/core/server/http/response";
import { galleryService } from "@/features/gallery/server";
import { UpdateGallerySchema } from "@/features/gallery";
import type { UpdateGallerySchemaType } from "@/features/gallery";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return ApiServer.admin(_request, async () => {
    const { id } = await params;
    const gallery = await galleryService.getById(id);
    return ApiResponse.success(gallery, "Gallery retrieved");
  });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return ApiServer.admin(request, async () => {
    const actor = await getCurrentUser(request);
    const body = await validateBody<UpdateGallerySchemaType>(request, UpdateGallerySchema);
    const { id } = await params;
    const gallery = await galleryService.update(id, body, actor?.id ?? null);
    return ApiResponse.success(gallery, "Gallery updated");
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return ApiServer.admin(request, async () => {
    const actor = await getCurrentUser(request);
    const { id } = await params;
    await galleryService.delete(id, actor?.id ?? null);
    return ApiResponse.noContent("Gallery deleted");
  });
}
