import { NextRequest } from "next/server";
import { ApiServer } from "@/core/server/http/handler";
import { siteInfoService } from "@/features/site-info/server";
import { ApiResponse } from "@/core/server/http/response";

export async function GET(request: NextRequest) {
  return ApiServer.cachedPublic(request, "site-info", async () => {
    const siteInfo = await siteInfoService.getCurrent();
    return ApiResponse.success(siteInfo, "Site info retrieved");
  });
}
