import { NextRequest, NextResponse } from "next/server";
import { ApiServer, validateQuery } from "@/core/server/http/handler";
import { ApiResponse } from "@/core/server/http/response";
import { getCurrentUser, MANAGEMENT_ROLES } from "@/core/server/security/auth";
import { auditService } from "@/features/audit/server";
import {
  AuditLogQuerySchema,
  type AuditLogQuerySchemaType,
} from "@/features/audit";

export async function GET(request: NextRequest) {
  return ApiServer.admin(request, async () => {
    const actor = (await getCurrentUser(request))!;
    if (!actor || !MANAGEMENT_ROLES.includes(actor.role)) {
      return NextResponse.json(ApiResponse.forbidden("Forbidden"), {
        status: 403,
      });
    }

    const query = validateQuery<AuditLogQuerySchemaType>(request.nextUrl, AuditLogQuerySchema);
    const result = await auditService.getAll(query);
    return NextResponse.json(
      ApiResponse.paginated(result.data, result.meta, "Audit logs retrieved"),
      { status: 200 }
    );
  });
}
