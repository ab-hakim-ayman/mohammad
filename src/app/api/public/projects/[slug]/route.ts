import { NextRequest } from "next/server";
import { ApiServer } from "@/core/server/http/handler";
import { projectService } from "@/features/project/server";
import { ApiResponse } from "@/core/server/http/response";
import { enrichEntitiesWithAltText  } from "@/features/media/utils/enrich-entities";

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return ApiServer.cachedPublic(request, "projects", async () => {
    const project = await projectService.getPublicBySlug(slug);
    if (!project) return ApiResponse.success(null, "Project not found");
    const [enriched] = await enrichEntitiesWithAltText("project", [project] as any[], {
      cardImage: "cardImage",
      heroImage: "heroImage",
      ogImage: "ogImage",
    });
    return ApiResponse.success(enriched, "Project retrieved");
  });
}
