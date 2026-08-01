import I18n from "@/shared/components/I18n";
import { AppError } from "@/core/server/http/errors";
import { Prisma } from "@prisma/client";
import { uploadFileToCloudinary } from "@/core/server/media";
import { mediaRepository } from "../repositories/media.repository";
import { MediaUploadMetaSchema } from "../schemas/media.schema";
import type {
  MediaAttachmentCreateInput,
  MediaQueryValidated,
  MediaUpdatePayload,
  MediaUploadInput,
} from "../types/media.types";
function buildAttachment(
  index: number,
  input: NonNullable<MediaUploadInput["attachment"]>
): Prisma.MediaAttachmentCreateWithoutMediaInput {
  return {
    entityType: input.entityType as any,
    entityId: input.entityId,
    fieldName: input.fieldName ?? "default",
    usageType: input.usageType,
    sortOrder: input.sortOrder ?? index,
    isPrimary: input.isPrimary ?? index === 0,
    ...(input.altText ? { altText: input.altText } : {}),
  };
}
export const mediaService = {
  async getAll(params: MediaQueryValidated) {
    return mediaRepository.findAll(params);
  },
  async getById(id: string) {
    const media = await mediaRepository.findById(id);
    if (!media) throw AppError.notFound("Media not found");
    return media;
  },
  async upload(input: MediaUploadInput, actorId?: string | null) {
    if (!input.files.length) {
      throw AppError.badRequest("At least one file is required");
    }
    const meta = MediaUploadMetaSchema.parse({
      folder: input.folder,
      altText: input.altText,
      entityType: input.attachment?.entityType,
      entityId: input.attachment?.entityId,
      fieldName: input.attachment?.fieldName,
      usageType: input.attachment?.usageType,
      isPrimary: input.attachment?.isPrimary,
      sortOrder: input.attachment?.sortOrder,
    });
    const uploads = await Promise.all(
      input.files.map((file) =>
        uploadFileToCloudinary(file, {
          folder: meta.folder,
          altText: meta.altText,
        })
      )
    );
    const created = [];
    for (let index = 0; index < uploads.length; index++) {
      const asset = uploads[index];
      const res = await mediaRepository.create({
        provider: asset.provider,
        resourceType: asset.resourceType,
        providerAssetId: asset.providerAssetId,
        url: asset.url,
        originalFilename: asset.originalFilename,
        mimeType: asset.mimeType,
        fileSize: asset.fileSize,
        width: asset.width,
        height: asset.height,
        duration: asset.duration,
        folder: asset.folder,
        altText: meta.altText,
        createdBy: actorId ? { connect: { id: actorId } } : undefined,
        updatedBy: actorId ? { connect: { id: actorId } } : undefined,
        attachments:
          meta.entityType && meta.entityId
            ? {
                create: [
                  buildAttachment(index, {
                    entityType: meta.entityType,
                    entityId: meta.entityId,
                    fieldName: meta.fieldName,
                    usageType: meta.usageType,
                    isPrimary: meta.isPrimary,
                    sortOrder: meta.sortOrder,
                  }),
                ],
              }
            : undefined,
      });
      created.push(res);
    }
    return created;
  },
  async update(id: string, data: MediaUpdatePayload, actorId?: string | null) {
    const existing = await mediaRepository.findById(id);
    if (!existing) throw AppError.notFound("Media not found");
    const result = await mediaRepository.update(id, {
      altText: data.altText,
      folder: data.folder,
      isArchived: data.isArchived,
      archivedAt:
        data.isArchived === true ? new Date() : data.isArchived === false ? null : undefined,
      ...(actorId ? { updatedBy: { connect: { id: actorId } } } : {}),
    });
    return result;
  },
  async delete(id: string, actorId?: string | null) {
    const existing = await mediaRepository.findById(id);
    if (!existing) throw AppError.notFound("Media not found");
    return mediaRepository.delete(id);
  },
  async attach(mediaId: string, data: MediaAttachmentCreateInput) {
    return mediaRepository.attach(mediaId, data);
  },
  async detach(attachmentId: string) {
    return mediaRepository.detach(attachmentId);
  },
};
