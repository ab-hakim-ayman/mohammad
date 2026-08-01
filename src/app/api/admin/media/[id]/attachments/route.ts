import { NextRequest, NextResponse } from "next/server";
import { ApiServer, validateBody } from "@/core/server/http/handler";
import { getCurrentUser } from "@/core/server/security/auth";
import { ApiResponse } from "@/core/server/http/response";
import { MediaAttachmentSchema } from "@/features/media";
import { mediaService } from "@/features/media/server";
import type { MediaAttachmentSchemaType } from "@/features/media";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return ApiServer.admin(request, async () => {
    const { id } = await params;
    const actor = (await getCurrentUser(request))!;
    const body = await validateBody<MediaAttachmentSchemaType>(request, MediaAttachmentSchema);
    const attachment = await mediaService.attach(id, body);
    return ApiResponse.created(attachment, "Media attached");
  });
}
