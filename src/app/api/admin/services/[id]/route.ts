import I18n from "@/shared/components/I18n";
import { NextRequest } from "next/server";
import { ApiServer, validateBody } from "@/core/server/http/handler";
import { getCurrentUser } from "@/core/server/security/auth";
import { ApiResponse } from "@/core/server/http/response";
import { serviceService } from "@/features/service/server";
import { UpdateServiceSchema } from "@/features/service";
import type { UpdateServiceSchemaType } from "@/features/service";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return ApiServer.admin(_request, async () => {
    const { id } = await params;
    const service = await serviceService.getById(id);
    return ApiResponse.success(service, "Service retrieved");
  });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return ApiServer.admin(request, async () => {
    const { id } = await params;
    const actor = (await getCurrentUser(request))!;
    const body = await validateBody<UpdateServiceSchemaType>(request, UpdateServiceSchema);
    const service = await serviceService.update(id, body, actor.id);
    return ApiResponse.success(service, "Service updated");
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return ApiServer.admin(request, async () => {
    const { id } = await params;
    const actor = (await getCurrentUser(request))!;
    await serviceService.delete(id, actor.id);
    return ApiResponse.noContent("Service deleted");
  });
}
