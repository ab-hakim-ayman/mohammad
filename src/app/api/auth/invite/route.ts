import { NextRequest, NextResponse } from "next/server";
import { ApiServer, validateBody } from "@/core/server/http/handler";
import { ApiResponse } from "@/core/server/http/response";
import { InviteUserSchema, type InviteUserSchemaType } from "@/features/auth";
import { getCurrentUser } from "@/core/server/security/auth";
import { userService } from "@/features/user/server";

export async function POST(request: NextRequest) {
  return ApiServer.admin(request, async () => {
    const actor = await getCurrentUser(request);
    if (!actor) {
      return NextResponse.json(ApiResponse.unauthorized(), { status: 401 });
    }
    const payload = await validateBody<InviteUserSchemaType>(request, InviteUserSchema);
    const result = await userService.invite(actor, payload);
    return NextResponse.json(ApiResponse.created(result, "Invitation created"), { status: 201 });
  });
}
