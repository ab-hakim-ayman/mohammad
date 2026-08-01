import { NextRequest, NextResponse } from "next/server";
import { ApiServer, validateQuery, validateBody } from "@/core/server/http/handler";
import { getCurrentUser } from "@/core/server/security/auth";
import { CreateBlogSchema, BlogQuerySchema } from "@/features/blog";
import { blogService } from "@/features/blog/server";
import { ApiResponse } from "@/core/server/http/response";
import type {
  CreateBlogSchemaType,
  BlogQuerySchemaType,
} from "@/features/blog";

export async function GET(request: NextRequest) {
  return ApiServer.admin(request, async () => {
    const query = validateQuery<BlogQuerySchemaType>(request.nextUrl, BlogQuerySchema);
    const result = await blogService.getAll(query);
    return ApiResponse.paginated(
      result.data,
      {
        page: result.meta.page,
        limit: result.meta.limit,
        total: result.meta.total,
        totalPages: result.meta.totalPages,
      },
      "Blogs retrieved"
    );
  });
}

export async function POST(request: NextRequest) {
  return ApiServer.admin(request, async () => {
    const actor = (await getCurrentUser(request))!;
    const body = await validateBody<CreateBlogSchemaType>(request, CreateBlogSchema);
    const blog = await blogService.create(body, actor.id);
    return ApiResponse.created(blog, "Blog created");
  });
}
