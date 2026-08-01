import { NextRequest } from "next/server";
import { ApiServer, validateQuery } from "@/core/server/http/handler";
import { ContactQuerySchema } from "@/features/contact";
import { contactService } from "@/features/contact/server";
import { ApiResponse } from "@/core/server/http/response";
import type { ContactQuerySchemaType } from "@/features/contact";

export async function GET(request: NextRequest) {
  return ApiServer.admin(request, async () => {
    const query = validateQuery<ContactQuerySchemaType>(request.nextUrl, ContactQuerySchema);
    const result = await contactService.getAll(query);
    return ApiResponse.paginated(
      result.data,
      {
        page: result.meta.page,
        limit: result.meta.limit,
        total: result.meta.total,
        totalPages: result.meta.totalPages,
      },
      "Contacts retrieved"
    );
  });
}
