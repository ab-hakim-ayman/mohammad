import I18n from "@/shared/components/I18n";
import { NextRequest } from "next/server";
import { ApiServer, validateBody } from "@/core/server/http/handler";
import { getCurrentUser } from "@/core/server/security/auth";
import { ApiResponse } from "@/core/server/http/response";
import { faqService } from "@/features/faq/server";
import { UpdateFaqSchema } from "@/features/faq";
import type { UpdateFaqSchemaType } from "@/features/faq";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return ApiServer.admin(_request, async () => {
    const { id } = await params;
    const faq = await faqService.getById(id);
    return ApiResponse.success(faq, "FAQ retrieved");
  });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return ApiServer.admin(request, async () => {
    const actor = await getCurrentUser(request);
    const body = await validateBody<UpdateFaqSchemaType>(request, UpdateFaqSchema);
    const { id } = await params;
    const faq = await faqService.update(id, body, actor?.id ?? null);
    return ApiResponse.success(faq, "FAQ updated");
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return ApiServer.admin(request, async () => {
    const actor = await getCurrentUser(request);
    const { id } = await params;
    await faqService.delete(id, actor?.id ?? null);
    return ApiResponse.noContent("FAQ deleted");
  });
}
