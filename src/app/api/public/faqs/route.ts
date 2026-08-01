import I18n from "@/shared/components/I18n";
import { NextRequest } from "next/server";
import { ApiServer } from "@/core/server/http/handler";
import { ApiResponse } from "@/core/server/http/response";
import { faqService } from "@/features/faq/server";

export async function GET(request: NextRequest) {
  return ApiServer.cachedPublic(request, "faqs", async () => {
    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "0");
    const category = request.nextUrl.searchParams.get("category") || undefined;
    const result = await faqService.getPublished(limit || undefined, category);
    return ApiResponse.success(result, "FAQs retrieved");
  });
}
