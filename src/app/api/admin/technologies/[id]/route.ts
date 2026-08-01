import I18n from "@/shared/components/I18n";

import { NextRequest } from "next/server";
import { ApiServer, validateBody } from "@/core/server/http/handler";
import { UpdateTechnologySchema } from "@/features/technology";
import { technologyService } from "@/features/technology/server";
import { ApiResponse } from "@/core/server/http/response";
import { getCurrentUser } from "@/core/server/security/auth";
import type { UpdateTechnologySchemaType } from "@/features/technology";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return ApiServer.admin(request, async () => {
    const { id } = await params;
    const technology = await technologyService.getById(id);
    return ApiResponse.success(technology, "Technology retrieved");
  });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return ApiServer.admin(request, async () => {
    const { id } = await params;
    const body = await validateBody<UpdateTechnologySchemaType>(request, UpdateTechnologySchema);
    const actor = await getCurrentUser(request);
    const technology = await technologyService.update(id, body, actor?.id ?? null);
    return ApiResponse.success(technology, "Technology updated");
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return ApiServer.admin(request, async () => {
    const { id } = await params;
    const actor = await getCurrentUser(request);
    await technologyService.delete(id, actor?.id ?? null);
    return ApiResponse.noContent("Technology deleted");
  });
}
