import I18n from "@/shared/components/I18n";
import crypto from "node:crypto";
import dns from "node:dns";
import { logger } from "@/core/logger/logger";
import { AppError } from "./http/errors";
import type { MediaResourceType } from "@/shared/types";

const origLookup = dns.lookup;
(dns as any).lookup = function (hostname: string, options: any, callback: any) {
  if (typeof options === "function") {
    return origLookup(hostname, { family: 4 }, options);
  }
  return origLookup(hostname, { ...options, family: 4 }, callback);
};

export interface CloudinaryUploadResult {
  provider: "CLOUDINARY";
  resourceType: MediaResourceType;
  providerAssetId: string;
  url: string;
  originalFilename: string | null;
  mimeType: string | null;
  fileSize: number | null;
  width: number | null;
  height: number | null;
  duration: number | null;
  folder: string | null;
}

export interface CloudinaryUploadOptions {
  folder?: string | null;
  providerAssetId?: string | null;
  altText?: string | null;
}

export interface CloudinaryDeleteResult {
  provider: "CLOUDINARY";
  deleted: boolean;
  publicId: string;
}

const CLOUDINARY_UPLOAD_TIMEOUT_MS = Number(
  process.env.CLOUDINARY_UPLOAD_TIMEOUT_MS?.trim() || "30000"
);

function getCloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();

  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();

  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

  const defaultFolder = process.env.CLOUDINARY_UPLOAD_FOLDER?.trim() || "mohammad/media";

  if (!cloudName || !apiKey || !apiSecret) {
    throw AppError.internal("Cloudinary is not configured");
  }

  return { cloudName, apiKey, apiSecret, defaultFolder };
}

export function isCloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME?.trim() &&
    process.env.CLOUDINARY_API_KEY?.trim() &&
    process.env.CLOUDINARY_API_SECRET?.trim()
  );
}

export function detectMediaResourceType(file: File): MediaResourceType {
  const mimeType = file.type.toLowerCase();

  if (mimeType.startsWith("video/")) return "VIDEO";
  if (mimeType.startsWith("image/")) return "IMAGE";

  return "DOCUMENT";
}

function toCloudinaryResourceType(resourceType: MediaResourceType): "image" | "video" | "raw" {
  if (resourceType === "VIDEO") return "video";
  if (resourceType === "IMAGE") return "image";

  return "raw";
}

function signPayload(params: Record<string, string>, apiSecret: string) {
  const payload = Object.entries(params)
    .filter(([, value]) => value !== "")
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return crypto.createHash("sha1").update(`${payload}${apiSecret}`).digest("hex");
}

function buildPublicId(file: File) {
  const baseName = file.name.replace(/\.[^.]+$/, "");

  const slug = baseName
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

  const suffix = crypto.randomBytes(4).toString("hex");

  return `${slug || "asset"}-${suffix}`;
}

function buildContext(options: CloudinaryUploadOptions) {
  const contextParts: string[] = [];

  if (options.altText?.trim()) {
    contextParts.push(`alt=${options.altText.trim()}`);
  }

  return contextParts.length > 0 ? contextParts.join("|") : "";
}

export async function uploadFileToCloudinary(
  file: File,
  options: CloudinaryUploadOptions = {}
): Promise<CloudinaryUploadResult> {
  const { cloudName, apiKey, apiSecret, defaultFolder } = getCloudinaryConfig();

  const resourceType = detectMediaResourceType(file);
  const cloudinaryResourceType = toCloudinaryResourceType(resourceType);

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const folder = options.folder?.trim() || defaultFolder;
  const publicId = options.providerAssetId?.trim() || buildPublicId(file);
  const context = buildContext(options);

  const signatureParams: Record<string, string> = {
    folder,
    public_id: publicId,
    timestamp,
  };

  if (context) {
    signatureParams.context = context;
  }

  const signature = signPayload(signatureParams, apiSecret);

  const formData = new FormData();

  formData.append("file", file, file.name);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp);
  formData.append("signature", signature);
  formData.append("folder", folder);
  formData.append("public_id", publicId);

  if (context) {
    formData.append("context", context);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), CLOUDINARY_UPLOAD_TIMEOUT_MS);

  let response: Response;

  try {
    response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/${cloudinaryResourceType}/upload`,
      {
        method: "POST",
        body: formData,
        signal: controller.signal,
      }
    );
  } catch (error) {
    clearTimeout(timeoutId);

    const err = error as Error & {
      cause?: {
        code?: string;
        errno?: string;
        syscall?: string;
        hostname?: string;
        message?: string;
      };
    };

    const isAbort = err.name === "AbortError";

    logger.warn("Cloudinary upload unavailable", {
      resourceType,
      fileName: file.name,
      folder,
      timeoutMs: CLOUDINARY_UPLOAD_TIMEOUT_MS,
      reason: isAbort ? "timeout" : "network_error",
      errorName: err.name,
      errorMessage: err.message,
      cause: err.cause,
    });

    throw AppError.externalApi(
      isAbort
        ? `Cloudinary upload timed out after ${CLOUDINARY_UPLOAD_TIMEOUT_MS}ms`
        : `Cloudinary upload failed: ${err.cause?.message || err.message || "network error"}`,
      {
        timeout: isAbort,
        folder,
        fileName: file.name,
        cause: err.cause,
      }
    );
  } finally {
    clearTimeout(timeoutId);
  }

  const payload = (await response.json().catch(() => null)) as any;

  if (!response.ok) {
    const message =
      payload?.error?.message || `Cloudinary upload failed with status ${response.status}`;

    logger.warn("Cloudinary upload rejected", {
      resourceType,
      fileName: file.name,
      status: response.status,
      error: payload?.error,
    });

    throw AppError.externalApi(message, payload);
  }

  return {
    provider: "CLOUDINARY",
    resourceType,
    providerAssetId: payload.public_id,
    url: payload.secure_url,
    originalFilename: payload.original_filename ?? file.name,
    mimeType: file.type || payload.format || null,
    fileSize:
      typeof payload.bytes === "number"
        ? payload.bytes
        : typeof file.size === "number"
          ? file.size
          : null,
    width: typeof payload.width === "number" ? payload.width : null,
    height: typeof payload.height === "number" ? payload.height : null,
    duration: typeof payload.duration === "number" ? payload.duration : null,
    folder: payload.folder || folder,
  };
}

export async function deleteCloudinaryAsset(
  providerAssetId: string,
  resourceType: MediaResourceType = "IMAGE"
): Promise<CloudinaryDeleteResult> {
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const cloudinaryResourceType = toCloudinaryResourceType(resourceType);

  const signature = signPayload(
    {
      public_id: providerAssetId,
      timestamp,
    },
    apiSecret
  );

  const formData = new FormData();

  formData.append("public_id", providerAssetId);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp);
  formData.append("signature", signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/${cloudinaryResourceType}/destroy`,
    {
      method: "POST",
      body: formData,
    }
  );

  const payload = (await response.json().catch(() => null)) as any;

  if (!response.ok) {
    const message =
      payload?.error?.message || `Cloudinary delete failed with status ${response.status}`;

    logger.warn("Cloudinary delete rejected", {
      publicId: providerAssetId,
      resourceType,
      status: response.status,
      error: payload?.error,
    });

    throw AppError.externalApi(message, payload);
  }

  return {
    provider: "CLOUDINARY",
    deleted: payload?.result === "ok" || payload?.result === "deleted",
    publicId: providerAssetId,
  };
}
