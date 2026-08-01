import I18n from "@/shared/components/I18n";
import { AppError } from "@/core/server/http/errors";
import { bumpPublicCacheVersion } from "@/core/server/cache";
import { syncMediaAttachments } from "@/features/media/utils/media-attachment-sync";
import { CreateEventSchema, UpdateEventSchema } from "../schemas/event.schema";
import { eventRepository } from "../repositories/event.repository";
import { CreateEventPayload, UpdateEventPayload, EventQueryValidated } from "../types/event.types";

export const eventService = {
  async getAll(params: EventQueryValidated) {
    const result = await eventRepository.findAll(params);
    return result;
  },

  async getById(id: string) {
    const event = await eventRepository.findById(id);
    if (!event) throw AppError.notFound("Event not found");
    return event;
  },

  async getBySlug(slug: string) {
    const event = await eventRepository.findBySlug(slug);
    if (!event) throw AppError.notFound("Event not found");
    return event;
  },

  async getPublicBySlug(slug: string) {
    const event = await eventRepository.findPublicBySlug(slug);
    if (!event) throw AppError.notFound("Event not found");
    return event;
  },

  async getPublished(params: {
    page?: number;
    limit?: number;
    search?: string;
    format?: string;
    isUpcoming?: boolean;
  }) {
    const result = await eventRepository.findPublished(params);
    return result;
  },

  async create(data: CreateEventPayload, actorId?: string | null) {
    const validated = CreateEventSchema.parse(data);

    const existing = await eventRepository.findBySlug(validated.slug);
    if (existing && existing.status !== "ARCHIVED") {
      throw AppError.conflict('Event with slug"' + validated.slug + '" already exists');
    }

    const createData: any = {
      title: validated.title,
      slug: validated.slug,
      shortDesc: validated.shortDesc || null,
      contentJson: validated.contentJson || null,
      startsAt: validated.startsAt,
      endsAt: validated.endsAt || null,
      timeZone: validated.timeZone,
      format: validated.format,
      location: validated.location || null,
      meetingUrl: validated.meetingUrl || null,
      isFeatured: validated.isFeatured ?? false,
      order: validated.order ?? 0,
      cardImage: validated.cardImage || null,
      heroImage: validated.heroImage || null,
      heroVideoUrl: validated.heroVideoUrl || null,
      demoVideoUrl: validated.demoVideoUrl || null,
      galleryImages: validated.galleryImages || [],
      registrationDeadline: validated.registrationDeadline || null,
      registrationUrl: validated.registrationUrl || null,
      isFree: validated.isFree,
      capacity: validated.capacity || null,
      seoTitle: validated.seoTitle || null,
      seoDescription: validated.seoDescription || null,
      ogImage: validated.ogImage || null,
      status: validated.status,
      publishedAt: validated.status === "PUBLISHED" ? new Date() : null,
      archivedAt: validated.status === "ARCHIVED" ? new Date() : null,

      faqs: { connect: validated.faqIds?.map((id) => ({ id })) || [] },
    };

    if (actorId) {
      createData.createdBy = { connect: { id: actorId } };
      createData.updatedBy = { connect: { id: actorId } };
    }

    const result = await eventRepository.create(createData);

    await syncMediaAttachments(
      "event",
      result.id,
      [
        {
          fieldName: "cardImage",
          value: result.cardImage,
          usageType: "GALLERY",
          altText: validated.cardImageAlt,
          isNewUpload: true,
        },
        {
          fieldName: "heroImage",
          value: result.heroImage,
          usageType: "THUMBNAIL",
          altText: validated.heroImageAlt,
          isNewUpload: true,
        },
        {
          fieldName: "ogImage",
          value: result.ogImage,
          usageType: "OTHER",
          altText: validated.ogImageAlt,
          isNewUpload: true,
        },
        {
          fieldName: "galleryImages",
          value: result.galleryImages,
          usageType: "GALLERY",
          altTexts: validated.galleryImagesAltTexts ?? undefined,
          isNewUpload: true,
        },
        {
          fieldName: "heroVideoUrl",
          value: result.heroVideoUrl,
          usageType: "VIDEO",
          isNewUpload: true,
        },
        {
          fieldName: "demoVideoUrl",
          value: result.demoVideoUrl,
          usageType: "VIDEO",
          isNewUpload: true,
        },
      ],
      actorId
    );
    await bumpPublicCacheVersion("events");

    return result;
  },

  async update(id: string, data: UpdateEventPayload, actorId?: string | null) {
    const validated = UpdateEventSchema.parse(data);

    const existing = await eventRepository.findById(id);
    if (!existing) throw AppError.notFound("Event not found");

    if (validated.slug && validated.slug !== existing.slug) {
      const slugExists = await eventRepository.findBySlug(validated.slug);
      if (slugExists && slugExists.status !== "ARCHIVED") {
        throw AppError.conflict('Event with slug"' + validated.slug + '" already exists');
      }
    }

    const updateData: any = {
      title: validated.title,
      slug: validated.slug,
      shortDesc: validated.shortDesc,
      contentJson: validated.contentJson,
      startsAt: validated.startsAt,
      endsAt: validated.endsAt,
      timeZone: validated.timeZone,
      format: validated.format,
      location: validated.location,
      meetingUrl: validated.meetingUrl,
      isFeatured: validated.isFeatured,
      order: validated.order,
      cardImage: validated.cardImage,
      heroImage: validated.heroImage,
      heroVideoUrl: validated.heroVideoUrl,
      demoVideoUrl: validated.demoVideoUrl,
      galleryImages: validated.galleryImages,
      registrationDeadline: validated.registrationDeadline,
      registrationUrl: validated.registrationUrl,
      isFree: validated.isFree,
      capacity: validated.capacity,
      seoTitle: validated.seoTitle,
      seoDescription: validated.seoDescription,
      ogImage: validated.ogImage,
      status: validated.status,
    };

    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined) delete updateData[key];
    });

    if (actorId) {
      updateData.updatedBy = { connect: { id: actorId } };
    }

    if (validated.status === "PUBLISHED" && existing.status !== "PUBLISHED") {
      updateData.publishedAt = new Date();
    }
    if (validated.status === "ARCHIVED" && existing.status !== "ARCHIVED") {
      updateData.archivedAt = new Date();
    }
    if (validated.status !== "ARCHIVED" && existing.status === "ARCHIVED") {
      updateData.archivedAt = null;
    }

    if (validated.faqIds) {
      updateData.faqs = { set: validated.faqIds.map((id) => ({ id })) };
    }

    const result = await eventRepository.update(id, updateData);

    await syncMediaAttachments(
      "event",
      result.id,
      [
        {
          fieldName: "cardImage",
          value: result.cardImage,
          usageType: "GALLERY",
          altText: validated.cardImageAlt,
          isNewUpload: validated.cardImageAlt != null,
        },
        {
          fieldName: "heroImage",
          value: result.heroImage,
          usageType: "THUMBNAIL",
          altText: validated.heroImageAlt,
          isNewUpload: validated.heroImageAlt != null,
        },
        {
          fieldName: "ogImage",
          value: result.ogImage,
          usageType: "OTHER",
          altText: validated.ogImageAlt,
          isNewUpload: validated.ogImageAlt != null,
        },
        {
          fieldName: "galleryImages",
          value: result.galleryImages,
          usageType: "GALLERY",
          altTexts: validated.galleryImagesAltTexts ?? undefined,
          isNewUpload: validated.galleryImagesAltTexts != null,
        },
        {
          fieldName: "heroVideoUrl",
          value: result.heroVideoUrl,
          usageType: "VIDEO",
          isNewUpload: false,
        },
        {
          fieldName: "demoVideoUrl",
          value: result.demoVideoUrl,
          usageType: "VIDEO",
          isNewUpload: false,
        },
      ],
      actorId
    );
    await bumpPublicCacheVersion("events");

    return result;
  },

  async delete(id: string, actorId?: string | null) {
    const existing = await eventRepository.findById(id);
    if (!existing) throw AppError.notFound("Event not found");
    const result = await eventRepository.hardDelete(id);
    await bumpPublicCacheVersion("events");
    return result;
  },
};
