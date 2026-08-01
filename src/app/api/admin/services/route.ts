import { NextRequest } from "next/server";
import { ApiServer, validateBody, validateQuery } from "@/core/server/http/handler";
import { getCurrentUser } from "@/core/server/security/auth";
import { ApiResponse } from "@/core/server/http/response";
import { serviceService } from "@/features/service/server";
import { CreateServiceSchema, ServiceQuerySchema } from "@/features/service";
import type {
  CreateServiceSchemaType,
  ServiceQuerySchemaType,
} from "@/features/service";

export async function GET(request: NextRequest) {
  return ApiServer.admin(request, async () => {
    const query = validateQuery<ServiceQuerySchemaType>(request.nextUrl, ServiceQuerySchema);
    const result = await serviceService.getAll(query);
    return ApiResponse.paginated(
      result.data,
      {
        page: result.meta.page,
        limit: result.meta.limit,
        total: result.meta.total,
        totalPages: result.meta.totalPages,
      },
      "Services retrieved"
    );
  });
}

export async function POST(request: NextRequest) {
  return ApiServer.admin(request, async () => {
    const actor = (await getCurrentUser(request))!;
    const body = await validateBody<CreateServiceSchemaType>(request, CreateServiceSchema);
    const service = await serviceService.create(body, actor.id);
    return ApiResponse.created(service, "Service created");
  });
}
