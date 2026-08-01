import { NextRequest, NextResponse } from "next/server";
import { ApiServer, validateBody } from "@/core/server/http/handler";
import { ApiResponse } from "@/core/server/http/response";
import {
  AcceptInviteSchema,
  type AcceptInviteSchemaType,
} from "@/features/auth";
import { authService } from "@/features/auth/server";

export async function POST(request: NextRequest) {
  return ApiServer.public(request, async () => {
    const payload = await validateBody<AcceptInviteSchemaType>(request, AcceptInviteSchema);
    const result = await authService.acceptInvite(payload);
    const response = NextResponse.json(
      ApiResponse.success({ user: result.user }, "Invitation accepted"),
      { status: 200 }
    );

    response.cookies.set({
      name: "auth_token",
      value: result.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  });
}
