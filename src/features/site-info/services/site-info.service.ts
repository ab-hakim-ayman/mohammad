import I18n from "@/shared/components/I18n";
import { cache } from "react";
import { bumpPublicCacheVersion } from "@/core/server/cache";
import { AppError } from "@/core/server/http/errors";
import { syncMediaAttachments  } from "@/features/media/utils/media-attachment-sync";
import { enrichEntitiesWithAltText } from "@/features/media/utils/enrich-entities";
import { Prisma } from "@prisma/client";
import { siteInfoRepository } from "../repositories/site-info.repository";
import { CreateSiteInfoPayload, SiteInfoQueryValidated, UpdateSiteInfoPayload } from "../types/site-info.types";

export const siteInfoService = {
  async getCurrent() {
    const siteInfo = await siteInfoRepository.findCurrent();
    if (!siteInfo) return null;
    const enriched = await enrichEntitiesWithAltText("site-info", [siteInfo], {
      logo: "logo",
      darkLogo: "darkLogo",
      favicon: "favicon",
      ogImage: "ogImage",
    });
    return enriched[0];
  },
  async create(data: CreateSiteInfoPayload, actorId?: string | null) {
    const { logoAlt, darkLogoAlt, faviconAlt, ogImageAlt, ...payloadFields } = data;
    const payload: Prisma.SiteInfoCreateInput = {
      ...payloadFields,
    };
    if (actorId) {
      payload.createdBy = { connect: { id: actorId } };
      payload.updatedBy = { connect: { id: actorId } };
    }
    const result = await siteInfoRepository.create(payload);
    await syncMediaAttachments(
      "site-info",
      result.id,
      [
        {
          fieldName: "logo",
          value: result.logo,
          usageType: "LOGO",
          altText: data.logoAlt,
          isNewUpload: true,
        },
        {
          fieldName: "darkLogo",
          value: result.darkLogo,
          usageType: "LOGO",
          altText: data.darkLogoAlt,
          isNewUpload: true,
        },
        {
          fieldName: "favicon",
          value: result.favicon,
          usageType: "THUMBNAIL",
          altText: data.faviconAlt,
          isNewUpload: true,
        },
        {
          fieldName: "ogImage",
          value: result.ogImage,
          usageType: "BANNER",
          altText: data.ogImageAlt,
          isNewUpload: true,
        },
      ],
      actorId
    );
    await bumpPublicCacheVersion("site-info");
    return result;
  },
  async update(id: string, data: UpdateSiteInfoPayload, actorId?: string | null) {
    const existing = await siteInfoRepository.findById(id);
    if (!existing) throw AppError.notFound("Site info not found");
    const { logoAlt, darkLogoAlt, faviconAlt, ogImageAlt, ...payloadFields } = data;
    const payload: Prisma.SiteInfoUpdateInput = { ...payloadFields };
    if (actorId) {
      payload.updatedBy = { connect: { id: actorId } };
    }
    const result = await siteInfoRepository.update(id, payload);
    await syncMediaAttachments(
      "site-info",
      result.id,
      [
        {
          fieldName: "logo",
          value: result.logo,
          usageType: "LOGO",
          altText: data.logoAlt,
          isNewUpload: false,
        },
        {
          fieldName: "darkLogo",
          value: result.darkLogo,
          usageType: "LOGO",
          altText: data.darkLogoAlt,
          isNewUpload: false,
        },
        {
          fieldName: "favicon",
          value: result.favicon,
          usageType: "THUMBNAIL",
          altText: data.faviconAlt,
          isNewUpload: false,
        },
        {
          fieldName: "ogImage",
          value: result.ogImage,
          usageType: "BANNER",
          altText: data.ogImageAlt,
          isNewUpload: false,
        },
      ],
      actorId
    );
    await bumpPublicCacheVersion("site-info");
    return result;
  },
  async save(data: CreateSiteInfoPayload, actorId?: string | null) {
    const existing = await siteInfoRepository.findCurrent();
    if (existing) {
      return this.update(existing.id, data, actorId);
    }
    return this.create(data, actorId);
  },
};
export const getCachedCurrentSiteInfo = cache(async () => {
  return siteInfoService.getCurrent();
});
