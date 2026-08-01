import { NextRequest, NextResponse } from "next/server";
import { ApiServer, validateBody, validateQuery } from "@/core/server/http/handler";
import { getCurrentUser } from "@/core/server/security/auth";
import { ApiResponse } from "@/core/server/http/response";
import { caseStudyService } from "@/features/case-study/server";
import {
  CaseStudyQuerySchema,
  CreateCaseStudySchema,
} from "@/features/case-study";
import type {
  CaseStudyQuerySchemaType,
  CreateCaseStudySchemaType,
} from "@/features/case-study";

export async function GET(request: NextRequest) {
  return ApiServer.admin(request, async () => {
    const query = validateQuery<CaseStudyQuerySchemaType>(request.nextUrl, CaseStudyQuerySchema);
    const result = await caseStudyService.getAll(query);
    return ApiResponse.paginated(
      result.data,
      {
        page: result.meta.page,
        limit: result.meta.limit,
        total: result.meta.total,
        totalPages: result.meta.totalPages,
      },
      "Case studies retrieved"
    );
  });
}

export async function POST(request: NextRequest) {
  return ApiServer.admin(request, async () => {
    const actor = (await getCurrentUser(request))!;
    const body = await validateBody<CreateCaseStudySchemaType>(request, CreateCaseStudySchema);
    const caseStudy = await caseStudyService.create(body, actor.id);
    return ApiResponse.created(caseStudy, "Case study created");
  });
}
