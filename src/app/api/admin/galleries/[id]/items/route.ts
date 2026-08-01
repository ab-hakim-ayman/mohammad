import { NextRequest } from "next/server";
import { ApiServer, validateBody } from "@/core/server/http/handler";
import { ApiResponse } from "@/core/server/http/response";
import { getCurrentUser } from "@/core/server/security/auth";
import { galleryService } from "@/features/gallery/server";
import { CreateGalleryItemSchema } from "@/features/gallery";
import type { CreateGalleryItemSchemaType } from "@/features/gallery";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return ApiServer.admin(request, async () => {
    const body = await validateBody<CreateGalleryItemSchemaType>(request, CreateGalleryItemSchema);
    const { id } = await params;
    const actor = await getCurrentUser(request);
    const item = await galleryService.addItem(id, body, actor?.id ?? null);
    return ApiResponse.created(item, "Gallery item created successfully");
  });
}
