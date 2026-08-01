import { NextRequest } from "next/server";
import { ApiServer } from "@/core/server/http/handler";
import { ApiResponse } from "@/core/server/http/response";
import { getPublicStats } from "@/shared/server/site-status/public-stats.service";

export async function GET(request: NextRequest) {
  return ApiServer.cachedPublic(
    request,
    "stats",
    async () => {
      const stats = await getPublicStats();
      return ApiResponse.success(stats, "Public stats retrieved");
    },
    300
  );
}
