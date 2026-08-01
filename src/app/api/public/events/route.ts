import I18n from "@/shared/components/I18n";
import { NextRequest } from "next/server";
import { ApiServer } from "@/core/server/http/handler";
import { ApiResponse } from "@/core/server/http/response";
import { eventService } from "@/features/event/server";
import { enrichEntitiesWithAltText  } from "@/features/media/utils/enrich-entities";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams.toString();
  return ApiServer.cachedPublic(request, `events:${searchParams}`, async () => {
    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "0");
    const search = request.nextUrl.searchParams.get("search") || undefined;
    const format = request.nextUrl.searchParams.get("format") || undefined;
    const isUpcoming = request.nextUrl.searchParams.get("isUpcoming");
    const result = await eventService.getPublished({
      limit: limit || undefined,
      search,
      format,
      isUpcoming: isUpcoming === "true" ? true : isUpcoming === "false" ? false : undefined,
    });
    const enriched = await enrichEntitiesWithAltText("event", result.data as any[], {
      cardImage: "cardImage",
      heroImage: "heroImage",
      ogImage: "ogImage",
    });
    return ApiResponse.success(enriched, "Events retrieved");
  });
}
