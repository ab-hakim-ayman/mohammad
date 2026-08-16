import I18n from "@/shared/components/I18n";

import type { ApiResponse, PaginatedApiResponse } from "@/shared/types";

export interface ApiClientConfig {
  baseURL?: string;
  headers?: Record<string, string>;
  timeout?: number;
}

type QueryParamValue = string | number | boolean | null | undefined;

type QueryParams = Record<string, QueryParamValue | QueryParamValue[]>;

type RequestPayload = BodyInit | object | null;

type PaginatedPayload<T> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
};

class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private timeout: number;

  constructor(config: ApiClientConfig = {}) {
    this.baseURL = config.baseURL || "";
    this.defaultHeaders = {
      "Content-Type": "application/json",
      ...config.headers,
    };
    this.timeout = config.timeout || 30000;
  }

  async get<T = any>(path: string, params?: object): Promise<ApiResponse<T>> {
    const url = this.buildURL(path, params as QueryParams | undefined);
    return this.request<T>(url, { method: "GET" });
  }

  async post<T = any>(
    path: string,
    data?: RequestPayload,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.request<T>(path, {
      method: "POST",
      body: this.serializeBody(data),
      ...options,
    });
  }

  async put<T = any>(
    path: string,
    data?: RequestPayload,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.request<T>(path, {
      method: "PUT",
      body: this.serializeBody(data),
      ...options,
    });
  }

  async patch<T = any>(
    path: string,
    data?: RequestPayload,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.request<T>(path, {
      method: "PATCH",
      body: this.serializeBody(data),
      ...options,
    });
  }

  async delete<T = any>(path: string): Promise<ApiResponse<T>> {
    return this.request<T>(path, { method: "DELETE" });
  }

  async paginated<T = any>(path: string, params?: object): Promise<PaginatedApiResponse<T>> {
    return this.get<PaginatedPayload<T>>(path, params);
  }

  private async request<T>(path: string, options: RequestInit): Promise<ApiResponse<T>> {
    const url = this.resolveURL(path);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        cache: "no-store",
        ...options,
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          ...this.defaultHeaders,
          ...options.headers,
        },
        signal: controller.signal,
        credentials: "include",
      });

      clearTimeout(timeoutId);

      const data = (await response.json()) as ApiResponse<T>;

      if (!response.ok) {
        const message = typeof data.message === "string" ? data.message : `HTTP ${response.status}`;
        throw new Error(message);
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new Error("Request timeout");
        }
        throw error;
      }

      throw new Error("Unknown error occurred");
    }
  }

  private buildURL(path: string, params?: QueryParams): string {
    if (!params) return path;

    const searchParams = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
      if (Array.isArray(value)) {
        for (const item of value) {
          if (item !== undefined && item !== null && item !== "") {
            searchParams.append(key, String(item));
          }
        }
      } else if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, String(value));
      }
    }

    const queryString = searchParams.toString();
    return queryString ? `${path}?${queryString}` : path;
  }

  private serializeBody(data?: RequestPayload): BodyInit | undefined {
    if (data == null) {
      return undefined;
    }

    if (
      typeof data === "string" ||
      data instanceof FormData ||
      data instanceof URLSearchParams ||
      data instanceof Blob ||
      data instanceof ArrayBuffer ||
      data instanceof ReadableStream
    ) {
      return data;
    }

    return JSON.stringify(data);
  }

  private resolveURL(path: string): string {
    if (path.startsWith("http")) return path;
    return `${this.baseURL}${path.startsWith("/") ? path : `/${path}`}`;
  }

  setAuthToken(token: string | null): void {
    if (token) {
      this.defaultHeaders["Authorization"] = `Bearer ${token}`;
    } else {
      delete this.defaultHeaders["Authorization"];
    }
  }

  setHeader(key: string, value: string): void {
    this.defaultHeaders[key] = value;
  }

  removeHeader(key: string): void {
    delete this.defaultHeaders[key];
  }
}

export const apiClient = new ApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "",
});

export default apiClient;
