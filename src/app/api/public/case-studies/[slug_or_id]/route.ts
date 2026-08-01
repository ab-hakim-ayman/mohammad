import I18n from "@/shared/components/I18n";
import { NextRequest } from "next/server";
import { ApiServer } from "@/core/server/http/handler";
import { ApiResponse } from "@/core/server/http/response";
import { caseStudyService } from "@/features/case-study/server";
import { enrichEntitiesWithAltText  } from "@/features/media/utils/enrich-entities";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug_or_id: string }> }
) {
  const { slug_or_id } = await params;
  return ApiServer.cachedPublic(_request, `case-studies:${slug_or_id}`, async () => {
    let caseStudy;

    try {
      if (slug_or_id.length === 25 && slug_or_id.startsWith("c")) {
        const adminData = await caseStudyService.getById(slug_or_id);
        caseStudy = await caseStudyService.getPublicBySlug(adminData.slug);
      } else {
        caseStudy = await caseStudyService.getPublicBySlug(slug_or_id);
      }
    } catch {
      return ApiResponse.success(null, "Case study not found");
    }

    if (!caseStudy) {
      return ApiResponse.success(null, "Case study not found");
    }

    const [enriched] = await enrichEntitiesWithAltText("case-study", [caseStudy] as any[], {
      cardImage: "cardImage",
      heroImage: "heroImage",
      ogImage: "ogImage",
    });
    return ApiResponse.success(enriched, "Case study retrieved");
  });
}
