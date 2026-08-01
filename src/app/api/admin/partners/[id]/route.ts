import I18n from "@/shared/components/I18n";
import { NextRequest } from "next/server";
import { ApiServer, validateBody } from "@/core/server/http/handler";
import { ApiResponse } from "@/core/server/http/response";
import { getCurrentUser } from "@/core/server/security/auth";
import { partnerService } from "@/features/partner/server";
import { UpdatePartnerSchema } from "@/features/partner";
import type { UpdatePartnerSchemaType } from "@/features/partner";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return ApiServer.admin(_request, async () => {
    const { id } = await params;
    const partner = await partnerService.getById(id);
    return ApiResponse.success(partner, "Partner retrieved");
  });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return ApiServer.admin(request, async () => {
    const body = await validateBody<UpdatePartnerSchemaType>(request, UpdatePartnerSchema);
    const { id } = await params;
    const actor = await getCurrentUser(request);
    const partner = await partnerService.update(id, body, actor?.id ?? null);
    return ApiResponse.success(partner, "Partner updated");
  });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return ApiServer.admin(_request, async () => {
    const { id } = await params;
    const actor = await getCurrentUser(_request);
    await partnerService.delete(id, actor?.id ?? null);
    return ApiResponse.noContent("Partner deleted");
  });
}
