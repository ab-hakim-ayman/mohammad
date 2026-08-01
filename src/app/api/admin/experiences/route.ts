import { NextRequest } from "next/server";
import { ApiServer, validateQuery, validateBody } from "@/core/server/http/handler";
import { getCurrentUser } from "@/core/server/security/auth";
import { CreateExperienceSchema, ExperienceQuerySchema } from "@/features/experience";
import { experienceService } from "@/features/experience/server";
import { ApiResponse } from "@/core/server/http/response";
import type {
  CreateExperienceSchemaType,
  ExperienceQuerySchemaType,
} from "@/features/experience";

export async function GET(request: NextRequest) {
  return ApiServer.admin(request, async () => {
    const query = validateQuery<ExperienceQuerySchemaType>(request.nextUrl, ExperienceQuerySchema);
    const result = await experienceService.getAll(query);
    return ApiResponse.paginated(
      result.data,
      {
        page: result.meta.page,
        limit: result.meta.limit,
        total: result.meta.total,
        totalPages: result.meta.totalPages,
      },
      "Experiences retrieved"
    );
  });
}

export async function POST(request: NextRequest) {
  return ApiServer.admin(request, async () => {
    const actor = (await getCurrentUser(request))!;
    const body = await validateBody<CreateExperienceSchemaType>(request, CreateExperienceSchema);
    const experience = await experienceService.create(body, actor.id);
    return ApiResponse.created(experience, "Experience created");
  });
}
