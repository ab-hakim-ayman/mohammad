import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { AppError } from "./errors";
import { ApiResponse } from "./response";
import { readPublicCache, writePublicCache } from "../cache";
import { logger } from "../../logger/logger";

export type ApiHandler<T = unknown, C = unknown> = (request: Request, context?: C) => Promise<T>;

export type RouteHandler<C = unknown> = (request: Request, context?: C) => Promise<NextResponse>;

export function withErrorHandler<T = unknown, C = unknown>(
  handler: ApiHandler<T, C>
): RouteHandler<C> {
  return async (request: Request, context?: C) => {
    try {
      const result = await handler(request, context);

      if (result instanceof NextResponse) {
        return result;
      }

      const statusCode =
        typeof result === "object" &&
          result !== null &&
          "statusCode" in result &&
          typeof result.statusCode === "number"
          ? result.statusCode
          : 200;

      return NextResponse.json(result, { status: statusCode });
    } catch (error) {
      const appError = error instanceof AppError ? error : AppError.fromUnknown(error);

      if (appError.isOperational) {
        logger.warn("API Error:", {
          message: appError.message,
          statusCode: appError.statusCode,
          errorCode: appError.errorCode,
          errors: appError.errors,
        });
      } else {
        logger.error("API Error:", error);
      }

      const errorResponse = ApiResponse.error(
        appError.message,
        appError.statusCode,
        appError.errors
      );

      return NextResponse.json(errorResponse, {
        status: appError.statusCode,
      });
    }
  };
}

function getZodIssues(error: z.ZodError): z.ZodIssue[] {
  return "issues" in error ? error.issues : [];
}

export async function validateBody<T>(request: Request, schema: z.ZodType<T>): Promise<T> {
  const body = await request.json();
  const result = schema.safeParse(body);

  if (!result.success) {
    const zodIssues = getZodIssues(result.error);
    console.error("ZOD VALIDATION FAILED:", JSON.stringify(zodIssues, null, 2));
    throw AppError.validation("Invalid request body", zodIssues);
  }

  return result.data;
}

export function validateQuery<T>(url: URL, schema: z.ZodType<T>): T {
  const params = Object.fromEntries(url.searchParams);
  const result = schema.safeParse(params);

  if (!result.success) {
    const zodIssues = getZodIssues(result.error);
    throw AppError.validation("Invalid query parameters", zodIssues);
  }

  return result.data;
}

export function getPaginationParams(request: Request): {
  page: number;
  limit: number;
  search?: string;
  sort?: string;
} {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "10");
  const search = url.searchParams.get("search") || undefined;
  const sort = url.searchParams.get("sort") || undefined;

  return {
    page: isNaN(page) ? 1 : Math.max(1, page),
    limit: isNaN(limit) ? 10 : Math.min(100, Math.max(1, limit)),
    search,
    sort,
  };
}

export function paginatedResponse<T>(data: T[], total: number, page: number, limit: number) {
  return ApiResponse.paginated(data, {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  });
}

export function getRequestIP(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  const realIP = request.headers.get("x-real-ip");
  if (realIP) {
    return realIP;
  }

  return "unknown";
}

export function getUserAgent(request: Request): string {
  return request.headers.get("user-agent") || "unknown";
}

export async function requireAuth(request: Request): Promise<boolean> {
  const { requireAuth: serverAuth } = await import("../security/auth");
  await serverAuth(request as NextRequest);
  return true;
}

export async function requireAdmin(request: Request): Promise<boolean> {
  const { requireRole, STAFF_ROLES } = await import("../security/auth");
  await requireRole(request as NextRequest, STAFF_ROLES);
  return true;
}

export class ApiServer {
  static public(request: Request, handler: () => Promise<unknown>): Promise<NextResponse> {
    const url = new URL(request.url);
    logger.info(`${request.method} ${url.pathname}`, {
      scope: "public",
      path: url.pathname,
    });

    return withErrorHandler(async () => handler())(request);
  }

  static admin(request: Request, handler: () => Promise<unknown>): Promise<NextResponse> {
    const url = new URL(request.url);
    logger.info(`${request.method} ${url.pathname}`, {
      scope: "admin",
      path: url.pathname,
    });

    return withErrorHandler(async () => {
      await requireAdmin(request);
      return handler();
    })(request);
  }

  static authenticated(request: Request, handler: () => Promise<unknown>): Promise<NextResponse> {
    const url = new URL(request.url);
    logger.info(`${request.method} ${url.pathname}`, {
      scope: "authenticated",
      path: url.pathname,
    });

    return withErrorHandler(async () => {
      await requireAuth(request);
      return handler();
    })(request);
  }

  static cachedPublic(
    request: Request,
    namespace: string,
    handler: () => Promise<unknown>,
    ttlSeconds = 300
  ): Promise<NextResponse> {
    const url = new URL(request.url);
    logger.info(`${request.method} ${url.pathname}`, {
      scope: "public",
      cacheNamespace: namespace,
      path: url.pathname,
    });

    return withErrorHandler(async () => {
      const cached = await readPublicCache<unknown>(namespace, request.url);
      if (cached !== null) {
        logger.debug("Public cache hit", {
          namespace,
          path: url.pathname,
          search: url.search,
        });
        return NextResponse.json(cached);
      }

      logger.debug("Public cache miss", {
        namespace,
        path: url.pathname,
        search: url.search,
      });

      const result = await handler();
      if (result instanceof NextResponse) {
        return result;
      }

      await writePublicCache(namespace, request.url, result, ttlSeconds);
      return result;
    })(request);
  }
}