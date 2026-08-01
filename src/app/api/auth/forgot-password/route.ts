import { NextRequest, NextResponse } from "next/server";
import { ApiServer, validateBody } from "@/core/server/http/handler";
import { ApiResponse } from "@/core/server/http/response";
import {
  ForgotPasswordSchema,
  type ForgotPasswordSchemaType,
} from "@/features/auth";
import { authService } from "@/features/auth/server";

export async function POST(request: NextRequest) {
  return ApiServer.public(request, async () => {
    const payload = await validateBody<ForgotPasswordSchemaType>(request, ForgotPasswordSchema);
    await authService.forgotPassword(payload);
    return NextResponse.json(
      ApiResponse.success(null, "If the account exists, a reset email has been sent"),
      { status: 200 }
    );
  });
}
