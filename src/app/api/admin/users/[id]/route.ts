import { NextRequest, NextResponse } from "next/server";
import { ApiServer, validateBody } from "@/core/server/http/handler";
import { ApiResponse } from "@/core/server/http/response";
import { UpdateUserSchema, type UpdateUserSchemaType } from "@/features/user";
import { userService } from "@/features/user/server";
import { getCurrentUser, MANAGEMENT_ROLES } from "@/core/server/security/auth";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  return ApiServer.admin(request, async () => {
    const actor = (await getCurrentUser(request))!;
    if (!actor || !MANAGEMENT_ROLES.includes(actor.role)) {
      return NextResponse.json(ApiResponse.forbidden(), { status: 403 });
    }
    const { id } = await context.params;
    const result = await userService.getById(id);
    return NextResponse.json(ApiResponse.success(result, "User loaded"), {
      status: 200,
    });
  });
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  return ApiServer.admin(request, async () => {
    const actor = (await getCurrentUser(request))!;
    if (!actor || !MANAGEMENT_ROLES.includes(actor.role)) {
      return NextResponse.json(ApiResponse.forbidden(), { status: 403 });
    }
    const { id } = await context.params;
    const payload = await validateBody<UpdateUserSchemaType>(request, UpdateUserSchema);
    const result = await userService.update(actor, id, payload);
    return NextResponse.json(ApiResponse.success(result, "User updated"), {
      status: 200,
    });
  });
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  return ApiServer.admin(request, async () => {
    const actor = (await getCurrentUser(request))!;
    if (!actor || !MANAGEMENT_ROLES.includes(actor.role)) {
      return NextResponse.json(ApiResponse.forbidden(), { status: 403 });
    }
    const { id } = await context.params;
    const result = await userService.delete(actor, id);
    return NextResponse.json(ApiResponse.success(result, "User deleted"), {
      status: 200,
    });
  });
}
