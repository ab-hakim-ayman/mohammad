import { NextRequest } from "next/server";
import { ApiServer, validateBody, validateQuery } from "@/core/server/http/handler";
import { getCurrentUser } from "@/core/server/security/auth";
import { ApiResponse } from "@/core/server/http/response";
import { galleryService } from "@/features/gallery/server";
import { GalleryQuerySchema, CreateGallerySchema } from "@/features/gallery";
import type {
  GalleryQuerySchemaType,
  CreateGallerySchemaType,
} from "@/features/gallery";

export async function GET(request: NextRequest) {
  return ApiServer.admin(request, async () => {
    const query = validateQuery<GalleryQuerySchemaType>(request.nextUrl, GalleryQuerySchema);
    const result = await galleryService.getAll(query);
    return ApiResponse.paginated(
      result.data,
      {
        page: result.meta.page,
        limit: result.meta.limit,
        total: result.meta.total,
        totalPages: result.meta.totalPages,
      },
      "Galleries retrieved"
    );
  });
}

export async function POST(request: NextRequest) {
  return ApiServer.admin(request, async () => {
    const actor = await getCurrentUser(request);
    const body = await validateBody<CreateGallerySchemaType>(request, CreateGallerySchema);
    const gallery = await galleryService.create(body, actor?.id ?? null);
    return ApiResponse.created(gallery, "Gallery created");
  });
}
