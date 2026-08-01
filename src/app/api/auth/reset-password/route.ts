import { NextRequest, NextResponse } from "next/server";
import { ApiServer, validateBody } from "@/core/server/http/handler";
import { ApiResponse } from "@/core/server/http/response";
import {
  ResetPasswordSchema,
  type ResetPasswordSchemaType,
} from "@/features/auth";
import { authService } from "@/features/auth/server";

export async function POST(request: NextRequest) {
  return ApiServer.public(request, async () => {
    const payload = await validateBody<ResetPasswordSchemaType>(request, ResetPasswordSchema);
    const result = await authService.resetPassword(payload);
    return NextResponse.json(ApiResponse.success(result, "Password updated"), {
      status: 200,
    });
  });
}
