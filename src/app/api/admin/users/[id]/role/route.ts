import { NextRequest, NextResponse } from "next/server";
import { ApiServer, validateBody } from "@/core/server/http/handler";
import { ApiResponse } from "@/core/server/http/response";
import {
  UpdateUserRoleSchema,
  type UpdateUserRoleSchemaType,
} from "@/features/user";
import { userService } from "@/features/user/server";
import { getCurrentUser, MANAGEMENT_ROLES } from "@/core/server/security/auth";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  return ApiServer.admin(request, async () => {
    const actor = (await getCurrentUser(request))!;
    if (!actor || !MANAGEMENT_ROLES.includes(actor.role)) {
      return NextResponse.json(ApiResponse.forbidden(), { status: 403 });
    }
    const { id } = await context.params;
    const payload = await validateBody<UpdateUserRoleSchemaType>(request, UpdateUserRoleSchema);
    const result = await userService.updateRole(actor, id, payload);
    return NextResponse.json(ApiResponse.success(result, "Role updated"), {
      status: 200,
    });
  });
}
