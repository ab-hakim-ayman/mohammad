import { NextRequest } from "next/server";
import { ApiServer, validateBody, validateQuery } from "@/core/server/http/handler";
import { getCurrentUser } from "@/core/server/security/auth";
import { ApiResponse } from "@/core/server/http/response";
import { faqService } from "@/features/faq/server";
import { FaqQuerySchema, CreateFaqSchema } from "@/features/faq";
import type { FaqQuerySchemaType, CreateFaqSchemaType } from "@/features/faq";

export async function GET(request: NextRequest) {
  return ApiServer.admin(request, async () => {
    const query = validateQuery<FaqQuerySchemaType>(request.nextUrl, FaqQuerySchema);
    const result = await faqService.getAll(query);
    return ApiResponse.paginated(
      result.data,
      {
        page: result.meta.page,
        limit: result.meta.limit,
        total: result.meta.total,
        totalPages: result.meta.totalPages,
      },
      "FAQs retrieved"
    );
  });
}

export async function POST(request: NextRequest) {
  return ApiServer.admin(request, async () => {
    const actor = await getCurrentUser(request);
    const body = await validateBody<CreateFaqSchemaType>(request, CreateFaqSchema);
    const faq = await faqService.create(body, actor?.id ?? null);
    return ApiResponse.created(faq, "FAQ created");
  });
}
