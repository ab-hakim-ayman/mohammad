import { NextRequest } from "next/server";
import { ApiServer, validateBody, validateQuery } from "@/core/server/http/handler";
import { getCurrentUser } from "@/core/server/security/auth";
import { CreateSkillSchema, SkillQuerySchema } from "@/features/skill";
import { skillService } from "@/features/skill/server";
import { ApiResponse } from "@/core/server/http/response";
import type {
  CreateSkillSchemaType,
  SkillQuerySchemaType,
} from "@/features/skill";

export async function GET(request: NextRequest) {
  return ApiServer.admin(request, async () => {
    const query = validateQuery<SkillQuerySchemaType>(request.nextUrl, SkillQuerySchema);
    const result = await skillService.getAll(query);
    return ApiResponse.paginated(
      result.data,
      {
        page: result.meta.page,
        limit: result.meta.limit,
        total: result.meta.total,
        totalPages: result.meta.totalPages,
      },
      "Skills retrieved"
    );
  });
}

export async function POST(request: NextRequest) {
  return ApiServer.admin(request, async () => {
    const actor = await getCurrentUser(request);
    const body = await validateBody<CreateSkillSchemaType>(request, CreateSkillSchema);
    const skill = await skillService.create(body, actor?.id ?? null);
    return ApiResponse.created(skill, "Skill created");
  });
}
