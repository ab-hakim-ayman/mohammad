import { NextRequest } from "next/server";
import { ApiServer, validateBody, validateQuery } from "@/core/server/http/handler";
import { getCurrentUser } from "@/core/server/security/auth";
import {
  CreateSpecializationSchema,
  SpecializationQuerySchema,
} from "@/features/specialization";
import { specializationService } from "@/features/specialization/server";
import { ApiResponse } from "@/core/server/http/response";
import type {
  CreateSpecializationSchemaType,
  SpecializationQuerySchemaType,
} from "@/features/specialization";

export async function GET(request: NextRequest) {
  return ApiServer.admin(request, async () => {
    const query = validateQuery<SpecializationQuerySchemaType>(
      request.nextUrl,
      SpecializationQuerySchema
    );
    const result = await specializationService.getAll(query);
    return ApiResponse.paginated(
      result.data,
      {
        page: result.meta.page,
        limit: result.meta.limit,
        total: result.meta.total,
        totalPages: result.meta.totalPages,
      },
      "Specializations retrieved"
    );
  });
}

export async function POST(request: NextRequest) {
  return ApiServer.admin(request, async () => {
    const actor = (await getCurrentUser(request))!;
    const body = await validateBody<CreateSpecializationSchemaType>(
      request,
      CreateSpecializationSchema
    );
    const specialization = await specializationService.create(body, actor.id);
    return ApiResponse.created(specialization, "Specialization created");
  });
}
