import I18n from "@/shared/components/I18n";

import { NextRequest, NextResponse } from "next/server";
import { ApiServer, validateBody } from "@/core/server/http/handler";
import { getCurrentUser } from "@/core/server/security/auth";
import { UpdateHeroSchema } from "@/features/hero";
import { heroService } from "@/features/hero/server";
import { ApiResponse } from "@/core/server/http/response";
import type { UpdateHeroSchemaType } from "@/features/hero";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return ApiServer.admin(request, async () => {
    const { id } = await params;
    const hero = await heroService.getById(id);
    return ApiResponse.success(hero, "Hero retrieved");
  });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return ApiServer.admin(request, async () => {
    const { id } = await params;
    const actor = (await getCurrentUser(request))!;
    const body = await validateBody<UpdateHeroSchemaType>(request, UpdateHeroSchema);
    const hero = await heroService.update(id, body, actor.id);
    return ApiResponse.success(hero, "Hero updated");
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return ApiServer.admin(request, async () => {
    const { id } = await params;
    const actor = (await getCurrentUser(request))!;
    await heroService.delete(id, actor.id);
    return ApiResponse.noContent("Hero deleted");
  });
}
