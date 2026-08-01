import { NextRequest } from "next/server";
import { ApiServer, validateBody, validateQuery } from "@/core/server/http/handler";
import { getCurrentUser } from "@/core/server/security/auth";
import { CreateTagSchema, TagQuerySchema } from "@/features/tag";
import { tagService } from "@/features/tag/server";
import { ApiResponse } from "@/core/server/http/response";
import type { CreateTagSchemaType, TagQuerySchemaType } from "@/features/tag";

export async function GET(request: NextRequest) {
  return ApiServer.admin(request, async () => {
    const query = validateQuery<TagQuerySchemaType>(request.nextUrl, TagQuerySchema);
    const result = await tagService.getAll(query);
    return ApiResponse.paginated(
      result.data,
      {
        page: result.meta.page,
        limit: result.meta.limit,
        total: result.meta.total,
        totalPages: result.meta.totalPages,
      },
      "Tags retrieved"
    );
  });
}

export async function POST(request: NextRequest) {
  return ApiServer.admin(request, async () => {
    const actor = await getCurrentUser(request);
    const body = await validateBody<CreateTagSchemaType>(request, CreateTagSchema);
    const tag = await tagService.create(body, actor?.id ?? null);
    return ApiResponse.created(tag, "Tag created");
  });
}
