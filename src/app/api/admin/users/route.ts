import { NextRequest, NextResponse } from "next/server";
import { ApiServer, validateBody, validateQuery } from "@/core/server/http/handler";
import { ApiResponse } from "@/core/server/http/response";
import {
  CreateUserSchema,
  type CreateUserSchemaType,
  UserQuerySchema,
  type UserQuerySchemaType,
} from "@/features/user";
import { userService } from "@/features/user/server";
import { getCurrentUser, MANAGEMENT_ROLES } from "@/core/server/security/auth";

export async function GET(request: NextRequest) {
  return ApiServer.admin(request, async () => {
    const actor = (await getCurrentUser(request))!;
    if (!actor || !MANAGEMENT_ROLES.includes(actor.role)) {
      return NextResponse.json(ApiResponse.forbidden(), { status: 403 });
    }
    const query = validateQuery<UserQuerySchemaType>(new URL(request.url), UserQuerySchema);
    const result = await userService.getAll(query);
    return NextResponse.json(ApiResponse.paginated(result.data, result.meta, "Users loaded"), {
      status: 200,
    });
  });
}

export async function POST(request: NextRequest) {
  return ApiServer.admin(request, async () => {
    const actor = (await getCurrentUser(request))!;
    if (!actor || !MANAGEMENT_ROLES.includes(actor.role)) {
      return NextResponse.json(ApiResponse.forbidden(), { status: 403 });
    }
    const payload = await validateBody<CreateUserSchemaType>(request, CreateUserSchema);
    const result = await userService.create(actor, payload);
    return NextResponse.json(ApiResponse.created(result, "User created"), {
      status: 201,
    });
  });
}
