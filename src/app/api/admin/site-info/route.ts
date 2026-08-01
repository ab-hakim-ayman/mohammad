import { NextRequest } from "next/server";
import { ApiServer, validateBody } from "@/core/server/http/handler";
import { getCurrentUser } from "@/core/server/security/auth";
import { ApiResponse } from "@/core/server/http/response";
import {
  SiteInfoSchema,
  type SiteInfoSchemaType,
} from "@/features/site-info";
import { siteInfoService } from "@/features/site-info/server";

export async function GET(request: NextRequest) {
  return ApiServer.admin(request, async () => {
    const siteInfo = await siteInfoService.getCurrent();
    return ApiResponse.success(siteInfo, "Site info retrieved");
  });
}

export async function PUT(request: NextRequest) {
  return ApiServer.admin(request, async () => {
    const actor = (await getCurrentUser(request))!;
    const body = await validateBody<SiteInfoSchemaType>(request, SiteInfoSchema);
    const siteInfo = await siteInfoService.save(body, actor.id);
    return ApiResponse.success(siteInfo, "Site info saved");
  });
}

export async function PATCH(request: NextRequest) {
  return PUT(request);
}
