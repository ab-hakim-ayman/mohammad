import { NextRequest, NextResponse } from "next/server";
import { ApiServer, validateBody } from "@/core/server/http/handler";
import { ApiResponse } from "@/core/server/http/response";
import { VerifyTokenSchema, type VerifyTokenSchemaType } from "@/features/auth";
import { authService } from "@/features/auth/server";

export async function POST(request: NextRequest) {
  return ApiServer.public(request, async () => {
    const payload = await validateBody<VerifyTokenSchemaType>(request, VerifyTokenSchema);
    const result = await authService.verifyToken(payload);
    return NextResponse.json(ApiResponse.success(result, "Token verified"), {
      status: 200,
    });
  });
}
