import I18n from "@/shared/components/I18n";
import { NextRequest } from "next/server";
import { ApiServer, validateBody } from "@/core/server/http/handler";
import { getCurrentUser } from "@/core/server/security/auth";
import { ApiResponse } from "@/core/server/http/response";
import { eventService } from "@/features/event/server";
import { UpdateEventSchema } from "@/features/event";
import type { UpdateEventSchemaType } from "@/features/event";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return ApiServer.admin(_request, async () => {
    const { id } = await params;
    const event = await eventService.getById(id);
    return ApiResponse.success(event, "Event retrieved");
  });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return ApiServer.admin(request, async () => {
    const body = await validateBody<UpdateEventSchemaType>(request, UpdateEventSchema);
    const { id } = await params;
    const actor = await getCurrentUser(request);
    const event = await eventService.update(id, body, actor?.id);
    return ApiResponse.success(event, "Event updated");
  });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return ApiServer.admin(_request, async () => {
    const { id } = await params;
    const actor = await getCurrentUser(_request);
    await eventService.delete(id, actor?.id);
    return ApiResponse.noContent("Event deleted");
  });
}
