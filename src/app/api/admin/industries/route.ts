import { NextRequest } from "next/server";
import { ApiServer, validateBody, validateQuery } from "@/core/server/http/handler";
import { getCurrentUser } from "@/core/server/security/auth";
import { ApiResponse } from "@/core/server/http/response";
import { industryService } from "@/features/industry/server";
import {
  IndustryQuerySchema,
  CreateIndustrySchema,
} from "@/features/industry";
import type {
  IndustryQuerySchemaType,
  CreateIndustrySchemaType,
} from "@/features/industry";

export async function GET(request: NextRequest) {
  return ApiServer.admin(request, async () => {
    const query = validateQuery<IndustryQuerySchemaType>(request.nextUrl, IndustryQuerySchema);
    const result = await industryService.getAll(query);
    return ApiResponse.paginated(
      result.data,
      {
        page: result.meta.page,
        limit: result.meta.limit,
        total: result.meta.total,
        totalPages: result.meta.totalPages,
      },
      "Industries retrieved"
    );
  });
}

export async function POST(request: NextRequest) {
  return ApiServer.admin(request, async () => {
    const actor = await getCurrentUser(request);
    const body = await validateBody<CreateIndustrySchemaType>(request, CreateIndustrySchema);
    const industry = await industryService.create(body, actor?.id ?? null);
    return ApiResponse.created(industry, "Industry created");
  });
}
