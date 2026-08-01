import { NextRequest, NextResponse } from "next/server";
import { ApiServer } from "@/core/server/http/handler";
import { getCurrentUser } from "@/core/server/security/auth";
import { ApiResponse } from "@/core/server/http/response";
import { mediaService } from "@/features/media/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ attachmentId: string }> }
) {
  return ApiServer.admin(request, async () => {
    const { attachmentId } = await params;
    const actor = (await getCurrentUser(request))!;
    const result = await mediaService.detach(attachmentId);
    return ApiResponse.success(result, "Media attachment removed");
  });
}
