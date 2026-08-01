import { NextRequest, NextResponse } from "next/server";
import { ApiServer, validateBody } from "@/core/server/http/handler";
import { ApiResponse } from "@/core/server/http/response";
import { requireActiveUser } from "@/core/server/security/auth";
import {
  ProfileVisibilitySchema,
  type ProfileVisibilitySchemaType,
} from "@/features/profile";
import { profileService } from "@/features/profile/server";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  return ApiServer.admin(request, async () => {
    const actor = await requireActiveUser(request);
    const { id } = await context.params;
    const payload = await validateBody<ProfileVisibilitySchemaType>(
      request,
      ProfileVisibilitySchema
    );
    const result = await profileService.updateVisibility(actor, id, payload);
    return NextResponse.json(ApiResponse.success(result, "Visibility updated"), { status: 200 });
  });
}
