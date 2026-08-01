import I18n from "@/shared/components/I18n";

import { NextRequest } from "next/server";
import { ApiServer, validateBody } from "@/core/server/http/handler";
import { getCurrentUser } from "@/core/server/security/auth";
import { UpdateTagSchema } from "@/features/tag";
import { tagService } from "@/features/tag/server";
import { ApiResponse } from "@/core/server/http/response";
import type { UpdateTagSchemaType } from "@/features/tag";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return ApiServer.admin(request, async () => {
    const { id } = await params;
    const tag = await tagService.getById(id);
    return ApiResponse.success(tag, "Tag retrieved");
  });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return ApiServer.admin(request, async () => {
    const { id } = await params;
    const actor = await getCurrentUser(request);
    const body = await validateBody<UpdateTagSchemaType>(request, UpdateTagSchema);
    const tag = await tagService.update(id, body, actor?.id ?? null);
    return ApiResponse.success(tag, "Tag updated");
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return ApiServer.admin(request, async () => {
    const { id } = await params;
    const actor = await getCurrentUser(request);
    await tagService.delete(id, actor?.id ?? null);
    return ApiResponse.noContent("Tag deleted");
  });
}
