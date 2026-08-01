import { NextRequest } from "next/server";
import { ApiServer, validateQuery, validateBody } from "@/core/server/http/handler";
import { getCurrentUser } from "@/core/server/security/auth";
import { CreateEducationSchema, EducationQuerySchema } from "@/features/education";
import { educationService } from "@/features/education/server";
import { ApiResponse } from "@/core/server/http/response";
import type {
  CreateEducationSchemaType,
  EducationQuerySchemaType,
} from "@/features/education";

export async function GET(request: NextRequest) {
  return ApiServer.admin(request, async () => {
    const query = validateQuery<EducationQuerySchemaType>(request.nextUrl, EducationQuerySchema);
    const result = await educationService.getAll(query);
    return ApiResponse.paginated(
      result.data,
      {
        page: result.meta.page,
        limit: result.meta.limit,
        total: result.meta.total,
        totalPages: result.meta.totalPages,
      },
      "Educations retrieved"
    );
  });
}

export async function POST(request: NextRequest) {
  return ApiServer.admin(request, async () => {
    const actor = (await getCurrentUser(request))!;
    const body = await validateBody<CreateEducationSchemaType>(request, CreateEducationSchema);
    const education = await educationService.create(body, actor.id);
    return ApiResponse.created(education, "Education created");
  });
}
