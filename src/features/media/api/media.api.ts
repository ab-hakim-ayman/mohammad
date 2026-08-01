import { apiClient } from "@/shared/lib";
import type {
  MediaQueryValidated,
  MediaRecord,
  MediaUpdatePayload,
  MediaUploadInput,
} from "../types/media.types";
async function uploadMedia(
  input: MediaUploadInput
): Promise<{ data: MediaRecord[]; message?: string }> {
  const formData = new FormData();
  for (const file of input.files) {
    formData.append("files", file, file.name);
  }
  if (input.folder) formData.append("folder", input.folder);
  if (input.altText) formData.append("altText", input.altText);
  if (input.attachment?.entityType) formData.append("entityType", input.attachment.entityType);
  if (input.attachment?.entityId) formData.append("entityId", input.attachment.entityId);
  if (input.attachment?.fieldName) formData.append("fieldName", input.attachment.fieldName);
  if (input.attachment?.usageType) formData.append("usageType", input.attachment.usageType);
  if (input.attachment?.isPrimary !== undefined)
    formData.append("isPrimary", String(input.attachment.isPrimary));
  if (input.attachment?.sortOrder !== undefined)
    formData.append("sortOrder", String(input.attachment.sortOrder));
  if (input.attachment?.altText) formData.append("altText", input.attachment.altText);
  const response = await fetch("/api/admin/media", {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload?.message || `HTTP ${response.status}`);
  }
  return payload;
}
export const mediaApi = {
  getAll: (params?: MediaQueryValidated) =>
    apiClient.paginated<MediaRecord>("/api/admin/media", params as any),

  getById: (id: string) => apiClient.get<MediaRecord>(`/api/admin/media/${id}`),
  upload: uploadMedia,

  update: (id: string, data: MediaUpdatePayload) =>
    apiClient.patch<MediaRecord>(`/api/admin/media/${id}`, data),

  delete: (id: string) => apiClient.delete<{ deleted: boolean }>(`/api/admin/media/${id}`),
  attach: (
    id: string,
    data: {
      entityType: string;
      entityId: string;
      fieldName?: string | null;
      usageType: string;
      sortOrder?: number;
      isPrimary?: boolean;
    }
  ) => apiClient.post(`/api/admin/media/${id}/attachments`, data),
  detach: (attachmentId: string) =>
    apiClient.delete(`/api/admin/media/attachments/${attachmentId}`),
};
