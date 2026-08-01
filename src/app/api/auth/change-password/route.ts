import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler, validateBody } from "@/core/server/http/handler";
import { ApiResponse } from "@/core/server/http/response";
import {
  ChangePasswordSchema,
  type ChangePasswordSchemaType,
} from "@/features/auth";
import { authService } from "@/features/auth/server";
import { requireActiveUser } from "@/core/server/security/auth";

export async function POST(request: NextRequest) {
  return withErrorHandler(async () => {
    const user = await requireActiveUser(request);
    const payload = await validateBody<ChangePasswordSchemaType>(request, ChangePasswordSchema);
    const result = await authService.changePassword(user.id, payload);
    return NextResponse.json(ApiResponse.success(result, "Password changed"), {
      status: 200,
    });
  })(request);
}
