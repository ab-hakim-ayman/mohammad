import { NextRequest } from "next/server";
import { ApiServer, validateBody, validateQuery } from "@/core/server/http/handler";
import { ApiResponse } from "@/core/server/http/response";
import { getCurrentUser } from "@/core/server/security/auth";
import { partnerService } from "@/features/partner/server";
import { PartnerQuerySchema, CreatePartnerSchema } from "@/features/partner";
import type {
  PartnerQuerySchemaType,
  CreatePartnerSchemaType,
} from "@/features/partner";

export async function GET(request: NextRequest) {
  return ApiServer.admin(request, async () => {
    const query = validateQuery<PartnerQuerySchemaType>(request.nextUrl, PartnerQuerySchema);
    const result = await partnerService.getAll(query);
    return ApiResponse.paginated(
      result.data,
      {
        page: result.meta.page,
        limit: result.meta.limit,
        total: result.meta.total,
        totalPages: result.meta.totalPages,
      },
      "Partners retrieved"
    );
  });
}

export async function POST(request: NextRequest) {
  return ApiServer.admin(request, async () => {
    const body = await validateBody<CreatePartnerSchemaType>(request, CreatePartnerSchema);
    const actor = await getCurrentUser(request);
    const partner = await partnerService.create(body, actor?.id ?? null);
    return ApiResponse.created(partner, "Partner created");
  });
}
