import I18n from "@/shared/components/I18n";

import { NextRequest } from "next/server";
import { ApiServer } from "@/core/server/http/handler";
import { testimonialService } from "@/features/testimonial/server";
import { ApiResponse } from "@/core/server/http/response";
import { enrichEntitiesWithAltText  } from "@/features/media/utils/enrich-entities";

export async function GET(request: NextRequest) {
  return ApiServer.cachedPublic(request, "testimonials", async () => {
    const searchParams = request.nextUrl.searchParams;
    const featured = searchParams.get("featured") === "true" ? true : undefined;
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined;
    const testimonials = await testimonialService.getPublished({
      featured,
      limit,
    });
    const enriched = await enrichEntitiesWithAltText("testimonial", testimonials as any[], {
      authorImage: "authorImage",
    });
    return ApiResponse.success(enriched, "Testimonials retrieved");
  });
}
