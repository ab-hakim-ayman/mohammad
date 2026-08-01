import { NextRequest } from "next/server";
import { ApiServer, validateBody, validateQuery } from "@/core/server/http/handler";
import { ApiResponse } from "@/core/server/http/response";
import { eventService } from "@/features/event/server";
import { EventQuerySchema, CreateEventSchema } from "@/features/event";
import { getCurrentUser } from "@/core/server/security/auth";
import type {
  EventQuerySchemaType,
  CreateEventSchemaType,
} from "@/features/event";

export async function GET(request: NextRequest) {
  return ApiServer.admin(request, async () => {
    const query = validateQuery<EventQuerySchemaType>(request.nextUrl, EventQuerySchema);
    const result = await eventService.getAll(query);
    return ApiResponse.paginated(
      result.data,
      {
        page: result.meta.page,
        limit: result.meta.limit,
        total: result.meta.total,
        totalPages: result.meta.totalPages,
      },
      "Events retrieved"
    );
  });
}

export async function POST(request: NextRequest) {
  return ApiServer.admin(request, async () => {
    const body = await validateBody<CreateEventSchemaType>(request, CreateEventSchema);
    const actor = await getCurrentUser(request);
    const event = await eventService.create(body, actor?.id);
    return ApiResponse.created(event, "Event created");
  });
}
