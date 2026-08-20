import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "@/shared/i18n";
import { verifyToken } from "@/core/server/security/token";

const handleI18nRouting = createMiddleware(routing);

export const config = {
  matcher: ["/", "/(bn|en)/:path*", "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};

const LOCALE_PATTERN = new RegExp(`^/(${routing.locales.join("|")})(?=/|$)`);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const [, extractedLocale] = pathname.match(LOCALE_PATTERN) ?? [];
  const currentLocale = extractedLocale || routing.defaultLocale;

  const normalizedPathname = pathname.replace(LOCALE_PATTERN, "") || "/";

  if (normalizedPathname.startsWith("/admin")) {
    const token = request.cookies.get("auth_token")?.value;
    const loginUrl = new URL(`/${currentLocale}/login`, request.url);

    if (!token) {
      return NextResponse.redirect(loginUrl);
    }

    const payload = await verifyToken(token);
    if (!payload) {
      const redirectResponse = NextResponse.redirect(loginUrl);
      redirectResponse.cookies.delete("auth_token");
      return redirectResponse;
    }
  }

  return handleI18nRouting(request);
}
