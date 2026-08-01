import { NextRequest } from "next/server";
import { ApiServer, validateBody, validateQuery } from "@/core/server/http/handler";
import { ApiResponse } from "@/core/server/http/response";
import { clientService } from "@/features/client/server";
import { ClientQuerySchema, CreateClientSchema } from "@/features/client";
import type {
  ClientQuerySchemaType,
  CreateClientSchemaType,
} from "@/features/client";

export async function GET(request: NextRequest) {
  return ApiServer.admin(request, async () => {
    const query = validateQuery<ClientQuerySchemaType>(request.nextUrl, ClientQuerySchema);
    const result = await clientService.getAll(query);
    return ApiResponse.paginated(
      result.data,
      {
        page: result.meta.page,
        limit: result.meta.limit,
        total: result.meta.total,
        totalPages: result.meta.totalPages,
      },
      "Clients retrieved"
    );
  });
}

export async function POST(request: NextRequest) {
  return ApiServer.admin(request, async () => {
    const body = await validateBody<CreateClientSchemaType>(request, CreateClientSchema);
    const client = await clientService.create(body);
    return ApiResponse.created(client, "Client created");
  });
}
