import I18n from "@/shared/components/I18n";
import { z } from "zod";
import { emptyStringToNull } from "@/shared/utils/schema";
const nullableString = z.preprocess(emptyStringToNull, z.string().optional().nullable());
const nullableUrl = z.preprocess(emptyStringToNull, z.string().optional().nullable());
const nullableEmail = z.preprocess(emptyStringToNull, z.string().email().optional().nullable());
export const SiteInfoSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  fullName: z.string().min(1, "Full name is required").max(200),
  tagline: nullableString,
  resumeUrl: nullableUrl,
  shortDesc: nullableString,
  siteUrl: nullableUrl,
  logo: nullableUrl,
  darkLogo: nullableUrl,
  favicon: nullableUrl,
  ogImage: nullableUrl,
  email: nullableEmail,
  phone: nullableString,
  address: nullableString,
  mapEmbedUrl: nullableUrl,
  linkedin: nullableUrl,
  github: nullableUrl,
  behance: nullableUrl,
  leetcode: nullableUrl,
  huggingface: nullableUrl,
  seoTitle: nullableString,
  seoDescription: nullableString,
  seoKeywords: z.array(z.string().min(1)).default([]),
  primaryColor: nullableString,

  logoAlt: z.string().max(500).optional().nullable(),
  darkLogoAlt: z.string().max(500).optional().nullable(),
  faviconAlt: z.string().max(500).optional().nullable(),
  ogImageAlt: z.string().max(500).optional().nullable(),
  secondaryColor: nullableString,
  availability: nullableString,
  careerStartYear: z.preprocess(
    emptyStringToNull,
    z.coerce.number().int().min(1900).max(3000).optional().nullable()
  ),
  copyrightText: nullableString,
  privacyPolicyUrl: nullableUrl,
  termsUrl: nullableUrl,
});
export const UpdateSiteInfoSchema = SiteInfoSchema.partial();
export const SiteInfoQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  sort: z
    .enum([
      "createdAt_desc",
      "createdAt_asc",
      "updatedAt_desc",
      "updatedAt_asc",
      "title_asc",
      "title_desc",
    ])
    .default("updatedAt_desc"),
});
export type SiteInfoSchemaType = z.infer<typeof SiteInfoSchema>;
export type UpdateSiteInfoSchemaType = z.infer<typeof UpdateSiteInfoSchema>;
export type SiteInfoQuerySchemaType = z.infer<typeof SiteInfoQuerySchema>;
