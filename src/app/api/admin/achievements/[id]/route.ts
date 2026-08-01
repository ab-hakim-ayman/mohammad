import I18n from "@/shared/components/I18n";
import { NextRequest } from "next/server";
import { ApiServer, validateBody } from "@/core/server/http/handler";
import { getCurrentUser } from "@/core/server/security/auth";
import { ApiResponse } from "@/core/server/http/response";
import { achievementService } from "@/features/achievement/server";
import { UpdateAchievementSchema } from "@/features/achievement";
import type { UpdateAchievementSchemaType } from "@/features/achievement";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return ApiServer.admin(_request, async () => {
    const { id } = await params;
    const achievement = await achievementService.getById(id);
    return ApiResponse.success(achievement, "Achievement retrieved");
  });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return ApiServer.admin(request, async () => {
    const actor = (await getCurrentUser(request))!;
    const body = await validateBody<UpdateAchievementSchemaType>(request, UpdateAchievementSchema);
    const { id } = await params;
    const achievement = await achievementService.update(id, body, actor.id);
    return ApiResponse.success(achievement, "Achievement updated");
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return ApiServer.admin(request, async () => {
    const actor = (await getCurrentUser(request))!;
    const { id } = await params;
    await achievementService.delete(id, actor.id);
    return ApiResponse.noContent("Achievement deleted");
  });
}
