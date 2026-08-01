import I18n from "@/shared/components/I18n";
import { NextRequest, NextResponse } from "next/server";
import { ApiServer, validateBody } from "@/core/server/http/handler";
import { getCurrentUser } from "@/core/server/security/auth";
import { ApiResponse } from "@/core/server/http/response";
import { MediaUpdateSchema } from "@/features/media";
import { mediaService } from "@/features/media/server";
import type { MediaUpdateSchemaType } from "@/features/media";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return ApiServer.authenticated(request, async () => {
    const { id } = await params;
    const media = await mediaService.getById(id);
    return ApiResponse.success(media, "Media retrieved");
  });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return ApiServer.authenticated(request, async () => {
    const { id } = await params;
    const actor = (await getCurrentUser(request))!;
    const body = await validateBody<MediaUpdateSchemaType>(request, MediaUpdateSchema);
    const media = await mediaService.update(id, body, actor.id);
    return ApiResponse.success(media, "Media updated");
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return ApiServer.authenticated(request, async () => {
    const { id } = await params;
    const actor = (await getCurrentUser(request))!;
    await mediaService.delete(id, actor.id);
    return ApiResponse.noContent("Media deleted");
  });
}
