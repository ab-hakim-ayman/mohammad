import { NextRequest } from "next/server";
import { ApiServer, validateBody, validateQuery } from "@/core/server/http/handler";
import {
  CreateTechnologySchema,
  TechnologyQuerySchema,
} from "@/features/technology";
import { technologyService } from "@/features/technology/server";
import { ApiResponse } from "@/core/server/http/response";
import { getCurrentUser } from "@/core/server/security/auth";
import type {
  CreateTechnologySchemaType,
  TechnologyQuerySchemaType,
} from "@/features/technology";

export async function GET(request: NextRequest) {
  return ApiServer.admin(request, async () => {
    const query = validateQuery<TechnologyQuerySchemaType>(request.nextUrl, TechnologyQuerySchema);
    const result = await technologyService.getAll(query);
    return ApiResponse.paginated(
      result.data,
      {
        page: result.meta.page,
        limit: result.meta.limit,
        total: result.meta.total,
        totalPages: result.meta.totalPages,
      },
      "Technologies retrieved"
    );
  });
}

export async function POST(request: NextRequest) {
  return ApiServer.admin(request, async () => {
    const body = await validateBody<CreateTechnologySchemaType>(request, CreateTechnologySchema);
    const actor = await getCurrentUser(request);
    const technology = await technologyService.create(body, actor?.id ?? null);
    return ApiResponse.created(technology, "Technology created");
  });
}
