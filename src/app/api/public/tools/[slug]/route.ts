import { NextRequest } from "next/server";
import { ApiServer } from "@/core/server/http/handler";
import { ApiResponse } from "@/core/server/http/response";
import { toolService } from "@/features/tool/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  return ApiServer.cachedPublic(request, "tools", async () => {
    const { slug } = await params;
    const tool = await toolService.getBySlug(slug);
    return ApiResponse.success(tool, "Tool retrieved by slug");
  });
}
