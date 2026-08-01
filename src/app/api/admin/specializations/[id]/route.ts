import I18n from "@/shared/components/I18n";

import { NextRequest } from "next/server";
import { ApiServer, validateBody } from "@/core/server/http/handler";
import { getCurrentUser } from "@/core/server/security/auth";
import { UpdateSpecializationSchema } from "@/features/specialization";
import { specializationService } from "@/features/specialization/server";
import { ApiResponse } from "@/core/server/http/response";
import type { UpdateSpecializationSchemaType } from "@/features/specialization";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return ApiServer.admin(request, async () => {
    const { id } = await params;
    const specialization = await specializationService.getById(id);
    return ApiResponse.success(specialization, "Specialization retrieved");
  });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return ApiServer.admin(request, async () => {
    const { id } = await params;
    const actor = (await getCurrentUser(request))!;
    const body = await validateBody<UpdateSpecializationSchemaType>(
      request,
      UpdateSpecializationSchema
    );
    const specialization = await specializationService.update(id, body, actor.id);
    return ApiResponse.success(specialization, "Specialization updated");
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return ApiServer.admin(request, async () => {
    const { id } = await params;
    const actor = (await getCurrentUser(request))!;
    await specializationService.delete(id, actor.id);
    return ApiResponse.noContent("Specialization deleted");
  });
}
