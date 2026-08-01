import { NextRequest, NextResponse } from "next/server";
import { ApiServer } from "@/core/server/http/handler";
import { ApiResponse } from "@/core/server/http/response";
import { getPublicHealth } from "@/shared/server/site-status/public-health.service";

export async function GET(request: NextRequest) {
  return ApiServer.public(request, async () => {
    const health = await getPublicHealth();
    const response =
      health.status === "ok"
        ? ApiResponse.success(health, "Service is healthy")
        : ApiResponse.error("Service is degraded", 503, health);

    if (health.status === "ok") {
      return NextResponse.json(response, { status: 200 });
    }

    return NextResponse.json(response, { status: 503 });
  });
}
