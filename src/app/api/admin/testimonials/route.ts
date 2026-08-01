import { NextRequest } from "next/server";
import { ApiServer, validateBody, validateQuery } from "@/core/server/http/handler";
import {
  CreateTestimonialSchema,
  TestimonialQuerySchema,
} from "@/features/testimonial";
import { testimonialService } from "@/features/testimonial/server";
import { ApiResponse } from "@/core/server/http/response";
import type {
  CreateTestimonialSchemaType,
  TestimonialQuerySchemaType,
} from "@/features/testimonial";

export async function GET(request: NextRequest) {
  return ApiServer.admin(request, async () => {
    const query = validateQuery<TestimonialQuerySchemaType>(
      request.nextUrl,
      TestimonialQuerySchema
    );
    const result = await testimonialService.getAll(query);
    return ApiResponse.paginated(
      result.data,
      {
        page: result.meta.page,
        limit: result.meta.limit,
        total: result.meta.total,
        totalPages: result.meta.totalPages,
      },
      "Testimonials retrieved"
    );
  });
}

export async function POST(request: NextRequest) {
  return ApiServer.admin(request, async () => {
    const body = await validateBody<CreateTestimonialSchemaType>(request, CreateTestimonialSchema);
    const testimonial = await testimonialService.create(body);
    return ApiResponse.created(testimonial, "Testimonial created");
  });
}
