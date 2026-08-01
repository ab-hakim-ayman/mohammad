import { NextRequest, NextResponse } from "next/server";
import { ApiServer, validateQuery } from "@/core/server/http/handler";
import { ApiResponse } from "@/core/server/http/response";
import {
  ProfileQuerySchema,
  type ProfileQuerySchemaType,
} from "@/features/profile";
import { profileService } from "@/features/profile/server";

export async function GET(request: NextRequest) {
  return ApiServer.admin(request, async () => {
    const query = validateQuery<ProfileQuerySchemaType>(request.nextUrl, ProfileQuerySchema);
    const result = await profileService.getAll(query);
    return NextResponse.json(ApiResponse.success(result, "Profiles loaded"), {
      status: 200,
    });
  });
}
