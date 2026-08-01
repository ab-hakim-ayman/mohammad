import I18n from "@/shared/components/I18n";

import { NextRequest } from "next/server";
import { ApiServer, validateBody } from "@/core/server/http/handler";
import { UpdateTestimonialSchema } from "@/features/testimonial";
import { testimonialService } from "@/features/testimonial/server";
import { ApiResponse } from "@/core/server/http/response";
import type { UpdateTestimonialSchemaType } from "@/features/testimonial";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return ApiServer.admin(request, async () => {
    const { id } = await params;
    const testimonial = await testimonialService.getById(id);
    return ApiResponse.success(testimonial, "Testimonial retrieved");
  });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return ApiServer.admin(request, async () => {
    const { id } = await params;
    const body = await validateBody<UpdateTestimonialSchemaType>(request, UpdateTestimonialSchema);
    const testimonial = await testimonialService.update(id, body);
    return ApiResponse.success(testimonial, "Testimonial updated");
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return ApiServer.admin(request, async () => {
    const { id } = await params;
    await testimonialService.delete(id);
    return ApiResponse.noContent("Testimonial deleted");
  });
}
