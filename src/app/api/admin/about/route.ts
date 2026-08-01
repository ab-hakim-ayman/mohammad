import { NextRequest } from "next/server";
import { ApiServer, validateBody } from "@/core/server/http/handler";
import { getCurrentUser } from "@/core/server/security/auth";
import { ApiResponse } from "@/core/server/http/response";
import {
  CreateAboutSchema,
  type CreateAboutSchemaType,
} from "@/features/about";
import { aboutService } from "@/features/about/server";

export async function GET(request: NextRequest) {
  return ApiServer.admin(request, async () => {
    const about = await aboutService.getCurrent();
    return ApiResponse.success(about, "About section retrieved");
  });
}

export async function PUT(request: NextRequest) {
  return ApiServer.admin(request, async () => {
    const actor = (await getCurrentUser(request))!;
    const body = await validateBody<CreateAboutSchemaType>(request, CreateAboutSchema);
    const about = await aboutService.save(body, actor.id);
    return ApiResponse.success(about, "About section saved");
  });
}

export async function PATCH(request: NextRequest) {
  return PUT(request);
}
