import { NextRequest, NextResponse } from "next/server";
import { ApiServer } from "@/core/server/http/handler";
import { ApiResponse } from "@/core/server/http/response";
import { userService } from "@/features/user/server";
import { getCurrentUser, MANAGEMENT_ROLES } from "@/core/server/security/auth";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, context: RouteContext) {
  return ApiServer.admin(request, async () => {
    const actor = (await getCurrentUser(request))!;
    if (!actor || !MANAGEMENT_ROLES.includes(actor.role)) {
      return NextResponse.json(ApiResponse.forbidden(), { status: 403 });
    }
    const { id } = await context.params;
    const result = await userService.resendInvite(actor, id);
    return NextResponse.json(ApiResponse.success(result, "Invitation resent"), {
      status: 200,
    });
  });
}
