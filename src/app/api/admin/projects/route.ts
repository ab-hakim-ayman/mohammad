import { NextRequest } from "next/server";
import { ApiServer, validateQuery, validateBody } from "@/core/server/http/handler";
import { getCurrentUser } from "@/core/server/security/auth";
import { ProjectQuerySchema, CreateProjectSchema } from "@/features/project";
import { projectService } from "@/features/project/server";
import { ApiResponse } from "@/core/server/http/response";
import type {
  ProjectQuerySchemaType,
  CreateProjectSchemaType,
} from "@/features/project";

export async function GET(request: NextRequest) {
  return ApiServer.admin(request, async () => {
    const query = validateQuery<ProjectQuerySchemaType>(request.nextUrl, ProjectQuerySchema);
    const result = await projectService.getAll(query);
    return ApiResponse.paginated(
      result.data,
      {
        page: result.meta.page,
        limit: result.meta.limit,
        total: result.meta.total,
        totalPages: result.meta.totalPages,
      },
      "Projects retrieved"
    );
  });
}

export async function POST(request: NextRequest) {
  return ApiServer.admin(request, async () => {
    const actor = (await getCurrentUser(request))!;
    const body = await validateBody<CreateProjectSchemaType>(request, CreateProjectSchema);
    const project = await projectService.create(body, actor.id);
    return ApiResponse.created(project, "Project created");
  });
}
