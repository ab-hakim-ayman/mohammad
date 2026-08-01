import { NextRequest, NextResponse } from "next/server";
import { ApiServer, validateBody, validateQuery } from "@/core/server/http/handler";
import { getCurrentUser } from "@/core/server/security/auth";
import { CreateHeroSchema, HeroQuerySchema } from "@/features/hero";
import { heroService } from "@/features/hero/server";
import { ApiResponse } from "@/core/server/http/response";
import type {
  CreateHeroSchemaType,
  HeroQuerySchemaType,
} from "@/features/hero";

export async function GET(request: NextRequest) {
  return ApiServer.admin(request, async () => {
    const query = validateQuery<HeroQuerySchemaType>(request.nextUrl, HeroQuerySchema);
    const result = await heroService.getAll(query);
    return ApiResponse.paginated(
      result.data,
      {
        page: result.meta.page,
        limit: result.meta.limit,
        total: result.meta.total,
        totalPages: result.meta.totalPages,
      },
      "Heroes retrieved"
    );
  });
}

export async function POST(request: NextRequest) {
  return ApiServer.admin(request, async () => {
    const actor = (await getCurrentUser(request))!;
    const body = await validateBody<CreateHeroSchemaType>(request, CreateHeroSchema);
    const hero = await heroService.create(body, actor.id);
    return ApiResponse.created(hero, "Hero created");
  });
}
