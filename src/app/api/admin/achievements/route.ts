import { NextRequest } from "next/server";
import { ApiServer, validateBody, validateQuery } from "@/core/server/http/handler";
import { getCurrentUser } from "@/core/server/security/auth";
import { ApiResponse } from "@/core/server/http/response";
import { achievementService } from "@/features/achievement/server";
import {
  AchievementQuerySchema,
  CreateAchievementSchema,
} from "@/features/achievement";
import type {
  AchievementQuerySchemaType,
  CreateAchievementSchemaType,
} from "@/features/achievement";

export async function GET(request: NextRequest) {
  return ApiServer.admin(request, async () => {
    const query = validateQuery<AchievementQuerySchemaType>(
      request.nextUrl,
      AchievementQuerySchema
    );
    const result = await achievementService.getAll(query);
    return ApiResponse.paginated(
      result.data,
      {
        page: result.meta.page,
        limit: result.meta.limit,
        total: result.meta.total,
        totalPages: result.meta.totalPages,
      },
      "Achievements retrieved"
    );
  });
}

export async function POST(request: NextRequest) {
  return ApiServer.admin(request, async () => {
    const actor = (await getCurrentUser(request))!;
    const body = await validateBody<CreateAchievementSchemaType>(request, CreateAchievementSchema);
    const achievement = await achievementService.create(body, actor.id);
    return ApiResponse.created(achievement, "Achievement created");
  });
}
