import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/core/server/security/auth";
import { ApiResponse } from "@/core/server/http/response";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) {
    return NextResponse.json(ApiResponse.unauthorized(), { status: 401 });
  }
  return NextResponse.json(ApiResponse.success({ user }, "Authenticated"), {
    status: 200,
  });
}
