import I18n from "@/shared/components/I18n";
import { NextRequest } from "next/server";
import { ApiServer } from "@/core/server/http/handler";
import { ApiResponse } from "@/core/server/http/response";
import { clientService } from "@/features/client/server";
import { enrichEntitiesWithAltText  } from "@/features/media/utils/enrich-entities";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams.toString();
  return ApiServer.cachedPublic(request, `clients:${searchParams}`, async () => {
    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "0");
    const result = await clientService.getPublished(limit || undefined);
    const enriched = await enrichEntitiesWithAltText("client", result, {
      logo: "logo",
      heroImage: "heroImage",
      ogImage: "ogImage",
    });
    return ApiResponse.success(enriched, "Clients retrieved");
  });
}
