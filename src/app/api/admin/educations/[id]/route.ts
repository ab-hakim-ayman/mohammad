import { NextRequest } from "next/server";
import { ApiServer, validateBody } from "@/core/server/http/handler";
import { getCurrentUser } from "@/core/server/security/auth";
import { UpdateEducationSchema } from "@/features/education";
import { educationService } from "@/features/education/server";
import { ApiResponse } from "@/core/server/http/response";
import type { UpdateEducationSchemaType } from "@/features/education";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return ApiServer.admin(request, async () => {
    const { id } = await params;
    const education = await educationService.getById(id);
    return ApiResponse.success(education, "Education retrieved");
  });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return ApiServer.admin(request, async () => {
    const { id } = await params;
    const actor = (await getCurrentUser(request))!;
    const body = await validateBody<UpdateEducationSchemaType>(request, UpdateEducationSchema);
    const education = await educationService.update(id, body, actor.id);
    return ApiResponse.success(education, "Education updated");
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return ApiServer.admin(request, async () => {
    const { id } = await params;
    const actor = (await getCurrentUser(request))!;
    await educationService.delete(id, actor.id);
    return ApiResponse.noContent("Education deleted");
  });
}
