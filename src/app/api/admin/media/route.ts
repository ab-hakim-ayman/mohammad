import I18n from "@/shared/components/I18n";
import { NextRequest, NextResponse } from "next/server";
import { ApiServer, validateQuery } from "@/core/server/http/handler";
import { getCurrentUser } from "@/core/server/security/auth";
import { ApiResponse } from "@/core/server/http/response";
import { MediaQuerySchema } from "@/features/media";
import { mediaService } from "@/features/media/server";
import type { MediaQuerySchemaType } from "@/features/media";
import type { MediaEntityType, MediaUsageType } from "@/shared/types";

export async function GET(request: NextRequest) {
  return ApiServer.authenticated(request, async () => {
    const query = validateQuery<MediaQuerySchemaType>(request.nextUrl, MediaQuerySchema);
    const result = await mediaService.getAll(query);
    return ApiResponse.paginated(
      result.data,
      {
        page: result.meta.page,
        limit: result.meta.limit,
        total: result.meta.total,
        totalPages: result.meta.totalPages,
      },
      "Media retrieved"
    );
  });
}

export async function POST(request: NextRequest) {
  return ApiServer.authenticated(request, async () => {
    const actor = (await getCurrentUser(request))!;

    const formData = await request.formData();
    const files = formData
      .getAll("files")
      .filter((item): item is File => item instanceof File && item.size > 0);

    const media = await mediaService.upload(
      {
        files,
        folder: (formData.get("folder") as string | null) || null,
        altText: (formData.get("altText") as string | null) || null,
        attachment:
          formData.get("entityType") && formData.get("entityId")
            ? {
                entityType: String(formData.get("entityType") || "").trim() as MediaEntityType,
                entityId: String(formData.get("entityId") || "").trim(),
                fieldName: (formData.get("fieldName") as string | null) || "default",
                usageType: String(formData.get("usageType") || "OTHER") as MediaUsageType,
                isPrimary: String(formData.get("isPrimary") || "false") === "true",
                sortOrder: Number(formData.get("sortOrder") || 0),
                altText: (formData.get("altText") as string | null) || null,
              }
            : null,
      },
      actor.id
    );

    return ApiResponse.created(media, "Media uploaded");
  });
}
