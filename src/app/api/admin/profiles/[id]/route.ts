import { NextRequest, NextResponse } from "next/server";
import { ApiServer, validateBody } from "@/core/server/http/handler";
import { ApiResponse } from "@/core/server/http/response";
import { requireActiveUser } from "@/core/server/security/auth";
import { ProfileSchema, type ProfileSchemaType } from "@/features/profile";
import { profileService } from "@/features/profile/server";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  return ApiServer.admin(request, async () => {
    const { id } = await context.params;
    const result = await profileService.getById(id);
    return NextResponse.json(ApiResponse.success(result, "Profile loaded"), {
      status: 200,
    });
  });
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  return ApiServer.admin(request, async () => {
    const actor = await requireActiveUser(request);
    const { id } = await context.params;
    const payload = await validateBody<ProfileSchemaType>(request, ProfileSchema);
    const result = await profileService.updateById(actor, id, payload);
    return NextResponse.json(ApiResponse.success(result, "Profile updated"), {
      status: 200,
    });
  });
}
