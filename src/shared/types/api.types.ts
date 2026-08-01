export interface ApiResponseMeta {
  timestamp: string;
  path?: string;
  duration?: number;
}

export type ApiErrorDetails = unknown;

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  statusCode: number;
  data: T;
  errors?: ApiErrorDetails;
  meta?: ApiResponseMeta;
}

export type ApiResponseData<T = any> = ApiResponse<T>;

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export type PaginatedApiResponse<T = any> = ApiResponse<PaginatedResponse<T>>;
