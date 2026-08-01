export enum ErrorCode {
  VALIDATION_ERROR = "VALIDATION_ERROR",
  INVALID_INPUT = "INVALID_INPUT",

  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
  TOKEN_EXPIRED = "TOKEN_EXPIRED",
  TOKEN_INVALID = "TOKEN_INVALID",

  NOT_FOUND = "NOT_FOUND",
  RESOURCE_EXISTS = "RESOURCE_EXISTS",
  RESOURCE_CONFLICT = "RESOURCE_CONFLICT",

  DUPLICATE_ENTRY = "DUPLICATE_ENTRY",
  INSUFFICIENT_PERMISSIONS = "INSUFFICIENT_PERMISSIONS",

  DATABASE_ERROR = "DATABASE_ERROR",
  PRISMA_ERROR = "PRISMA_ERROR",

  EXTERNAL_API_ERROR = "EXTERNAL_API_ERROR",

  INTERNAL_ERROR = "INTERNAL_ERROR",
  RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED",
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: ErrorCode;
  public readonly errors?: unknown;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode = 500,
    errorCode: ErrorCode = ErrorCode.INTERNAL_ERROR,
    errors?: unknown,
    isOperational = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.errors = errors;
    this.isOperational = isOperational;
    this.name = "AppError";

    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string, errors?: unknown): AppError {
    return new AppError(message, 400, ErrorCode.INVALID_INPUT, errors);
  }

  static validation(message: string, errors?: unknown): AppError {
    return new AppError(message, 400, ErrorCode.VALIDATION_ERROR, errors);
  }

  static unauthorized(message = "Unauthorized access"): AppError {
    return new AppError(message, 401, ErrorCode.UNAUTHORIZED);
  }

  static invalidCredentials(message = "Invalid email or password"): AppError {
    return new AppError(message, 401, ErrorCode.INVALID_CREDENTIALS);
  }

  static forbidden(message = "Access forbidden"): AppError {
    return new AppError(message, 403, ErrorCode.FORBIDDEN);
  }

  static notFound(message = "Resource not found"): AppError {
    return new AppError(message, 404, ErrorCode.NOT_FOUND);
  }

  static conflict(
    message = "Resource conflict",
    errorCode = ErrorCode.RESOURCE_CONFLICT
  ): AppError {
    return new AppError(message, 409, errorCode);
  }

  static duplicate(message = "Resource already exists"): AppError {
    return new AppError(message, 409, ErrorCode.DUPLICATE_ENTRY);
  }

  static tooManyRequests(message = "Too many requests"): AppError {
    return new AppError(message, 429, ErrorCode.RATE_LIMIT_EXCEEDED);
  }

  static internal(message = "Internal server error"): AppError {
    return new AppError(message, 500, ErrorCode.INTERNAL_ERROR, null, true);
  }

  static database(message: string, error?: unknown): AppError {
    return new AppError(message, 500, ErrorCode.DATABASE_ERROR, error);
  }

  static externalApi(message: string, error?: unknown): AppError {
    return new AppError(message, 503, ErrorCode.EXTERNAL_API_ERROR, error);
  }

  static fromUnknown(error: unknown, defaultMessage = "An unexpected error occurred"): AppError {
    if (error instanceof AppError) {
      return error;
    }

    if (error instanceof Error) {
      return new AppError(error.message, 500, ErrorCode.INTERNAL_ERROR, error.stack);
    }

    return new AppError(defaultMessage, 500, ErrorCode.INTERNAL_ERROR);
  }

  isClientSafe(): boolean {
    return this.isOperational && this.statusCode < 500;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      errorCode: this.errorCode,
      errors: this.errors,
      ...(process.env.NODE_ENV === "development" && { stack: this.stack }),
    };
  }
}

export class DatabaseError extends AppError {
  constructor(message = "Database operation failed", error?: unknown) {
    super(message, 500, ErrorCode.DATABASE_ERROR, error);
    this.name = "DatabaseError";
  }
}

export class NotFoundError extends AppError {
  constructor(resource = "Resource") {
    super(`${resource} not found`, 404, ErrorCode.NOT_FOUND);
    this.name = "NotFoundError";
  }
}

export class ConflictError extends AppError {
  constructor(field = "resource", value?: string) {
    const message = value
      ? `A record with this ${field} already exists: ${value}`
      : "Resource conflict";
    super(message, 409, ErrorCode.RESOURCE_CONFLICT);
    this.name = "ConflictError";
  }
}
