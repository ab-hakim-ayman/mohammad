import I18n from "@/shared/components/I18n";
import { NextRequest, NextResponse } from "next/server";
import { ApiServer, validateBody } from "@/core/server/http/handler";
import { getCurrentUser } from "@/core/server/security/auth";
import { ApiResponse } from "@/core/server/http/response";
import { caseStudyService } from "@/features/case-study/server";
import { UpdateCaseStudySchema } from "@/features/case-study";
import type { UpdateCaseStudySchemaType } from "@/features/case-study";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return ApiServer.admin(_request, async () => {
    const { id } = await params;
    const caseStudy = await caseStudyService.getById(id);
    return ApiResponse.success(caseStudy, "Case study retrieved");
  });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return ApiServer.admin(request, async () => {
    const { id } = await params;
    const actor = (await getCurrentUser(request))!;
    const body = await validateBody<UpdateCaseStudySchemaType>(request, UpdateCaseStudySchema);
    const caseStudy = await caseStudyService.update(id, body, actor.id);
    return ApiResponse.success(caseStudy, "Case study updated");
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return ApiServer.admin(request, async () => {
    const { id } = await params;
    const actor = (await getCurrentUser(request))!;
    await caseStudyService.delete(id, actor.id);
    return ApiResponse.noContent("Case study deleted");
  });
}
