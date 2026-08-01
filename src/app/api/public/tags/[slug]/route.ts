import { NextRequest } from "next/server";
import { ApiServer } from "@/core/server/http/handler";
import { tagService } from "@/features/tag/server";
import { ApiResponse } from "@/core/server/http/response";

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return ApiServer.cachedPublic(request, "tags", async () => {
    const tag = await tagService.getPublicBySlug(slug);
    return ApiResponse.success(tag, "Tag retrieved");
  });
}
