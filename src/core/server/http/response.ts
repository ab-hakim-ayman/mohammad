import type { ApiResponseData, ApiResponseMeta, PaginatedResponse } from "@/shared/types";

export class ApiResponse {
  static success<T>(
    data: T,
    message = "Success",
    statusCode = 200,
    meta?: ApiResponseMeta
  ): ApiResponseData<T> {
    return {
      success: true,
      message,
      statusCode,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        ...meta,
      },
    };
  }

  static paginated<T>(
    data: T[],
    pagination:
      | {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        }
      | number,
    message: string | number = "Success",
    statusCode = 200
  ): ApiResponseData<PaginatedResponse<T>> {
    const normalized =
      typeof pagination === "number"
        ? {
            page: pagination,
            limit: typeof message === "number" ? message : 10,
            total: typeof statusCode === "number" ? statusCode : data.length,
            totalPages: Math.ceil(
              (typeof statusCode === "number" ? statusCode : data.length) /
                (typeof message === "number" ? message : 10)
            ),
          }
        : pagination;

    const { page, limit, total, totalPages } = normalized;

    return {
      success: true,
      message: typeof message === "string" ? message : "Success",
      statusCode: typeof pagination === "number" ? 200 : statusCode,
      data: {
        data,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    };
  }

  static error(
    message: string,
    statusCode = 400,
    errors?: unknown,
    meta?: ApiResponseMeta
  ): ApiResponseData<null> {
    return {
      success: false,
      message,
      statusCode,
      data: null,
      errors,
      meta: {
        timestamp: new Date().toISOString(),
        ...meta,
      },
    };
  }

  static created<T>(
    data: T,
    message = "Resource created successfully",
    meta?: ApiResponseMeta
  ): ApiResponseData<T> {
    return this.success(data, message, 201, meta);
  }

  static noContent(message = "Resource deleted successfully"): ApiResponseData<null> {
    return {
      success: true,
      message,
      statusCode: 200,
      data: null,
      meta: {
        timestamp: new Date().toISOString(),
      },
    };
  }

  static badRequest(message = "Bad request", errors?: unknown): ApiResponseData<null> {
    return this.error(message, 400, errors);
  }

  static unauthorized(message = "Unauthorized"): ApiResponseData<null> {
    return this.error(message, 401);
  }

  static forbidden(message = "Forbidden"): ApiResponseData<null> {
    return this.error(message, 403);
  }

  static notFound(message = "Resource not found"): ApiResponseData<null> {
    return this.error(message, 404);
  }

  static conflict(message = "Resource already exists"): ApiResponseData<null> {
    return this.error(message, 409);
  }

  static internal(message = "Internal server error"): ApiResponseData<null> {
    return this.error(message, 500);
  }
}
