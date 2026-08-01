import { NextRequest, NextResponse } from "next/server";
import { ApiServer } from "@/core/server/http/handler";
import { getCurrentUser } from "@/core/server/security/auth";
import { recordAuditEvent  } from "@/features/audit/utils/audit.helper";
import { ApiResponse } from "@/core/server/http/response";

export async function POST(request: NextRequest) {
  return ApiServer.public(request, async () => {
    const actor = await getCurrentUser(request);
    if (actor) {
      await recordAuditEvent({
        actor: { id: actor.id },
        request,
        action: "LOGOUT",
        entityType: "auth",
        entityId: actor.id,
      });
    }

    const response = ApiResponse.success(null, "Logged out");
    const nextResponse = NextResponse.json(response, { status: 200 });

    nextResponse.cookies.set({
      name: "auth_token",
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 0,
      expires: new Date(0),
    });

    return nextResponse;
  });
}
