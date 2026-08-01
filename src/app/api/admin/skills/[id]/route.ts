import I18n from "@/shared/components/I18n";

import { NextRequest } from "next/server";
import { ApiServer, validateBody } from "@/core/server/http/handler";
import { getCurrentUser } from "@/core/server/security/auth";
import { UpdateSkillSchema } from "@/features/skill";
import { skillService } from "@/features/skill/server";
import { ApiResponse } from "@/core/server/http/response";
import type { UpdateSkillSchemaType } from "@/features/skill";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return ApiServer.admin(request, async () => {
    const { id } = await params;
    const skill = await skillService.getById(id);
    return ApiResponse.success(skill, "Skill retrieved");
  });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return ApiServer.admin(request, async () => {
    const { id } = await params;
    const actor = await getCurrentUser(request);
    const body = await validateBody<UpdateSkillSchemaType>(request, UpdateSkillSchema);
    const skill = await skillService.update(id, body, actor?.id ?? null);
    return ApiResponse.success(skill, "Skill updated");
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return ApiServer.admin(request, async () => {
    const { id } = await params;
    const actor = await getCurrentUser(request);
    await skillService.delete(id, actor?.id ?? null);
    return ApiResponse.noContent("Skill deleted");
  });
}
