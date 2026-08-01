import { NextRequest, NextResponse } from "next/server";
import { ApiServer } from "@/core/server/http/handler";
import { ApiResponse } from "@/core/server/http/response";
import { getCurrentUser, MANAGEMENT_ROLES } from "@/core/server/security/auth";
import { auditService } from "@/features/audit/server";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  return ApiServer.admin(request, async () => {
    const actor = (await getCurrentUser(request))!;
    if (!actor || !MANAGEMENT_ROLES.includes(actor.role)) {
      return NextResponse.json(ApiResponse.forbidden("Forbidden"), {
        status: 403,
      });
    }

    const { id } = await context.params;
    const result = await auditService.getById(id);
    return NextResponse.json(ApiResponse.success(result, "Audit log retrieved"), { status: 200 });
  });
}
