import { NextRequest, NextResponse } from "next/server";
import { ApiServer } from "@/core/server/http/handler";
import { ApiResponse } from "@/core/server/http/response";
import { profileService } from "@/features/profile/server";

export async function GET(request: NextRequest) {
  return ApiServer.cachedPublic(request, "public:profiles:team", async () => {
    const result = await profileService.getTeamProfiles();
    return NextResponse.json(ApiResponse.success(result, "Team profiles loaded"), { status: 200 });
  });
}
