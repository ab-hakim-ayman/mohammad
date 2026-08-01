import I18n from "@/shared/components/I18n";

import { NextRequest } from "next/server";
import { ApiServer, validateBody } from "@/core/server/http/handler";
import { getCurrentUser } from "@/core/server/security/auth";
import {
  UpdateProjectSchema,
  UpdateProjectSchemaType,
} from "@/features/project";
import { projectService } from "@/features/project/server";
import { ApiResponse } from "@/core/server/http/response";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return ApiServer.admin(request, async () => {
    const { id } = await params;
    const project = await projectService.getById(id);
    return ApiResponse.success(project, "Project retrieved");
  });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return ApiServer.admin(request, async () => {
    const { id } = await params;
    const actor = (await getCurrentUser(request))!;
    const body = await validateBody<UpdateProjectSchemaType>(request, UpdateProjectSchema);
    const project = await projectService.update(id, body, actor.id);
    return ApiResponse.success(project, "Project updated");
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return ApiServer.admin(request, async () => {
    const { id } = await params;
    const actor = (await getCurrentUser(request))!;
    await projectService.delete(id, actor.id);
    return ApiResponse.noContent("Project deleted");
  });
}
