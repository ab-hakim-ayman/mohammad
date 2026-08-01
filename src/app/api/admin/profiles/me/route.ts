import { NextRequest, NextResponse } from "next/server";
import { ApiServer, validateBody } from "@/core/server/http/handler";
import { ApiResponse } from "@/core/server/http/response";
import { requireActiveUser } from "@/core/server/security/auth";
import { ProfileSchema, type ProfileSchemaType } from "@/features/profile";
import { profileService } from "@/features/profile/server";

export async function GET(request: NextRequest) {
  return ApiServer.authenticated(request, async () => {
    const user = await requireActiveUser(request);
    const result = await profileService.getMe(user.id);
    return NextResponse.json(ApiResponse.success(result, "Profile loaded"), {
      status: 200,
    });
  });
}

export async function PATCH(request: NextRequest) {
  return ApiServer.authenticated(request, async () => {
    const user = await requireActiveUser(request);
    const payload = await validateBody<ProfileSchemaType>(request, ProfileSchema);
    const result = await profileService.updateMe(user.id, payload, user.id);
    return NextResponse.json(ApiResponse.success(result, "Profile updated"), {
      status: 200,
    });
  });
}
