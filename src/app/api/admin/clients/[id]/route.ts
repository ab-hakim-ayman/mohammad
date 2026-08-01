import I18n from "@/shared/components/I18n";
import { NextRequest } from "next/server";
import { ApiServer, validateBody } from "@/core/server/http/handler";
import { ApiResponse } from "@/core/server/http/response";
import { clientService } from "@/features/client/server";
import { UpdateClientSchema } from "@/features/client";
import type { UpdateClientSchemaType } from "@/features/client";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return ApiServer.admin(_request, async () => {
    const { id } = await params;
    const client = await clientService.getById(id);
    return ApiResponse.success(client, "Client retrieved");
  });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return ApiServer.admin(request, async () => {
    const body = await validateBody<UpdateClientSchemaType>(request, UpdateClientSchema);
    const { id } = await params;
    const client = await clientService.update(id, body);
    return ApiResponse.success(client, "Client updated");
  });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return ApiServer.admin(_request, async () => {
    const { id } = await params;
    await clientService.delete(id);
    return ApiResponse.noContent("Client deleted");
  });
}
