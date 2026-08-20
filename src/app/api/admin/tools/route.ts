import { NextRequest } from "next/server";
import { ApiServer, validateBody, validateQuery } from "@/core/server/http/handler";
import { getCurrentUser } from "@/core/server/security/auth";
import { ApiResponse } from "@/core/server/http/response";
import { toolService } from "@/features/tool/server";
import { createToolSchema, toolQuerySchema } from "@/features/tool";
import type {
  CreateToolSchemaType,
  ToolQuerySchemaType,
} from "@/features/tool";

export async function GET(request: NextRequest) {
  return ApiServer.admin(request, async () => {
    const query = validateQuery<ToolQuerySchemaType>(request.nextUrl, toolQuerySchema);
    const result = await toolService.getAll(query);
    return ApiResponse.paginated(
      result.data,
      {
        page: result.meta.page,
        limit: result.meta.limit,
        total: result.meta.total,
        totalPages: result.meta.totalPages,
      },
      "Tools retrieved"
    );
  });
}

export async function POST(request: NextRequest) {
  return ApiServer.admin(request, async () => {
    const actor = (await getCurrentUser(request))!;
    const body = await validateBody<CreateToolSchemaType>(request, createToolSchema);
    const tool = await toolService.create(body, actor.id);
    return ApiResponse.created(tool, "Tool created successfully");
  });
}
