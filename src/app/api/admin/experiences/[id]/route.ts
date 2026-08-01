import { NextRequest } from "next/server";
import { ApiServer, validateBody } from "@/core/server/http/handler";
import { getCurrentUser } from "@/core/server/security/auth";
import { UpdateExperienceSchema } from "@/features/experience";
import { experienceService } from "@/features/experience/server";
import { ApiResponse } from "@/core/server/http/response";
import type { UpdateExperienceSchemaType } from "@/features/experience";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return ApiServer.admin(request, async () => {
    const { id } = await params;
    const experience = await experienceService.getById(id);
    return ApiResponse.success(experience, "Experience retrieved");
  });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return ApiServer.admin(request, async () => {
    const { id } = await params;
    const actor = (await getCurrentUser(request))!;
    const body = await validateBody<UpdateExperienceSchemaType>(request, UpdateExperienceSchema);
    const experience = await experienceService.update(id, body, actor.id);
    return ApiResponse.success(experience, "Experience updated");
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return ApiServer.admin(request, async () => {
    const { id } = await params;
    const actor = (await getCurrentUser(request))!;
    await experienceService.delete(id, actor.id);
    return ApiResponse.noContent("Experience deleted");
  });
}
