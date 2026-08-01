import I18n from "@/shared/components/I18n";
import { NextRequest } from "next/server";
import { ApiServer } from "@/core/server/http/handler";
import { ApiResponse } from "@/core/server/http/response";
import { eventService } from "@/features/event/server";
import { enrichEntitiesWithAltText  } from "@/features/media/utils/enrich-entities";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug_or_id: string }> }
) {
  const { slug_or_id } = await params;

  return ApiServer.cachedPublic(_request, `events:${slug_or_id}`, async () => {
    let event;

    try {
      if (slug_or_id.length === 25 && slug_or_id.startsWith("c")) {
        const adminData = await eventService.getById(slug_or_id);
        event = await eventService.getPublicBySlug(adminData.slug);
      } else {
        event = await eventService.getPublicBySlug(slug_or_id);
      }
    } catch {
      return ApiResponse.success(null, "Event not found");
    }

    if (!event) {
      return ApiResponse.success(null, "Event not found");
    }

    const [enriched] = await enrichEntitiesWithAltText("event", [event] as any[], {
      cardImage: "cardImage",
      heroImage: "heroImage",
      ogImage: "ogImage",
    });
    return ApiResponse.success(enriched, "Event retrieved");
  });
}
