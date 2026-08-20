import { NextRequest } from "next/server";
import { ApiServer, validateBody } from "@/core/server/http/handler";
import { getCurrentUser } from "@/core/server/security/auth";
import { ApiResponse } from "@/core/server/http/response";
import { toolService } from "@/features/tool/server";
import { updateToolSchema } from "@/features/tool";
import type { UpdateToolSchemaType } from "@/features/tool";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return ApiServer.admin(request, async () => {
    const { id } = await params;
    const tool = await toolService.getById(id);
    return ApiResponse.success(tool, "Tool retrieved");
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return ApiServer.admin(request, async () => {
    const { id } = await params;
    const actor = (await getCurrentUser(request))!;
    const body = await validateBody<UpdateToolSchemaType>(request, updateToolSchema);
    const updated = await toolService.update(id, body, actor.id);
    return ApiResponse.success(updated, "Tool updated");
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return ApiServer.admin(request, async () => {
    const { id } = await params;
    const actor = (await getCurrentUser(request))!;
    await toolService.delete(id, actor.id);
    return ApiResponse.success({ deleted: true }, "Tool deleted");
  });
}
