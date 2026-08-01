import I18n from "@/shared/components/I18n";
import { NextRequest } from "next/server";
import { ApiServer, validateBody } from "@/core/server/http/handler";
import { getCurrentUser } from "@/core/server/security/auth";
import { ApiResponse } from "@/core/server/http/response";
import { industryService } from "@/features/industry/server";
import { UpdateIndustrySchema } from "@/features/industry";
import type { UpdateIndustrySchemaType } from "@/features/industry";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return ApiServer.admin(_request, async () => {
    const { id } = await params;
    const industry = await industryService.getById(id);
    return ApiResponse.success(industry, "Industry retrieved");
  });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return ApiServer.admin(request, async () => {
    const actor = await getCurrentUser(request);
    const body = await validateBody<UpdateIndustrySchemaType>(request, UpdateIndustrySchema);
    const { id } = await params;
    const industry = await industryService.update(id, body, actor?.id ?? null);
    return ApiResponse.success(industry, "Industry updated");
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return ApiServer.admin(request, async () => {
    const actor = await getCurrentUser(request);
    const { id } = await params;
    await industryService.delete(id, actor?.id ?? null);
    return ApiResponse.noContent("Industry deleted");
  });
}
