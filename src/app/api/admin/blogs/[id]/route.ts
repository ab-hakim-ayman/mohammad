import I18n from "@/shared/components/I18n";

import { NextRequest, NextResponse } from "next/server";
import { ApiServer, validateBody } from "@/core/server/http/handler";
import { getCurrentUser } from "@/core/server/security/auth";
import { UpdateBlogSchema } from "@/features/blog";
import { blogService } from "@/features/blog/server";
import { ApiResponse } from "@/core/server/http/response";
import type { UpdateBlogSchemaType } from "@/features/blog";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return ApiServer.admin(request, async () => {
    const { id } = await params;
    const blog = await blogService.getById(id);
    return ApiResponse.success(blog, "Blog retrieved");
  });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return ApiServer.admin(request, async () => {
    const { id } = await params;
    const actor = (await getCurrentUser(request))!;
    const body = await validateBody<UpdateBlogSchemaType>(request, UpdateBlogSchema);
    const blog = await blogService.update(id, body, actor.id);
    return ApiResponse.success(blog, "Blog updated");
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return ApiServer.admin(request, async () => {
    const { id } = await params;
    const actor = (await getCurrentUser(request))!;
    await blogService.delete(id, actor.id);
    return ApiResponse.noContent("Blog deleted");
  });
}
