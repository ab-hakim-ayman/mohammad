import { NextRequest, NextResponse } from "next/server";
import { ApiServer, validateBody } from "@/core/server/http/handler";
import { enforceRequestRateLimit } from "@/core/server/rate-limiter";
import { recordAuditEvent  } from "@/features/audit/utils/audit.helper";
import { LoginSchema, LoginSchemaType } from "@/features/auth";
import { authService } from "@/features/auth/server";
import { ApiResponse } from "@/core/server/http/response";

export async function POST(request: NextRequest) {
  return ApiServer.public(request, async () => {
    await enforceRequestRateLimit(
      request,
      "auth:login",
      15 * 60 * 1000,
      5,
      "Too many login attempts. Please try again later."
    );

    const credentials = await validateBody<LoginSchemaType>(request, LoginSchema);
    const { token, user } = await authService.login(credentials);

    await recordAuditEvent({
      actor: { id: user.id },
      request,
      action: "LOGIN",
      entityType: "auth",
      entityId: user.id,
      newValues: { email: user.email, role: user.role, status: user.status },
    });

    const response = ApiResponse.success({ user }, "Login successful");
    const nextResponse = NextResponse.json(response, { status: 200 });

    nextResponse.cookies.set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return nextResponse;
  });
}
