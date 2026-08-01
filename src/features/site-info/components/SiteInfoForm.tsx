"use client";

import { useMemo } from "react";
import { FormEngine } from "@/shared/components/forms/FormEngine";
import { FormEngineConfig } from "@/shared/components/forms/form-engine.types";
import { SiteInfoSchema } from "../schemas/site-info.schema";
import { SiteInfoRecord, SiteInfoPayload } from "../types/site-info.types";

interface SiteInfoFormProps {
  initialData?: SiteInfoRecord | null;
  onSubmit: (data: SiteInfoPayload) => Promise<void> | void;
  isSubmitting?: boolean;
  [key: string]: any;
}

export function SiteInfoForm({
  initialData,
  onSubmit,
  isSubmitting = false,
}: SiteInfoFormProps) {
  const config: FormEngineConfig<SiteInfoPayload> = {
    sections: [
      {
        title: "Basic Details",
        fields: [
          { name: "siteTitle", label: "Site Title", type: "text", required: true, gridSpan: 6 },
          { name: "companyTitle", label: "Company Title", type: "text", required: true, gridSpan: 6 },
          { name: "tagline", label: "Tagline", type: "text", gridSpan: 12 },
          { name: "shortDesc", label: "Short Description", type: "textarea", gridSpan: 12 },
          { name: "siteUrl", label: "Site URL", type: "text", gridSpan: 12 },
        ],
      },
      {
        title: "Logos & Branding Assets",
        fields: [
          { name: "logo", label: "Logo", type: "media", mediaFolder: "site-info/logo", altTextField: "logoAlt" as any, gridSpan: 6 },
          { name: "darkLogo", label: "Dark Logo", type: "media", mediaFolder: "site-info/logo-dark", altTextField: "darkLogoAlt" as any, gridSpan: 6 },
          { name: "favicon", label: "Favicon", type: "media", mediaFolder: "site-info/favicon", altTextField: "faviconAlt" as any, gridSpan: 6 },
          { name: "ogImage", label: "OG Image", type: "media", mediaFolder: "site-info/og", altTextField: "ogImageAlt" as any, gridSpan: 6 },
        ],
      },
      {
        title: "Contact Information",
        fields: [
          { name: "email", label: "Email", type: "text", placeholder: "email@example.com", gridSpan: 6 },
          { name: "phone", label: "Phone", type: "text", gridSpan: 6 },
          { name: "officeHours", label: "Office Hours", type: "text", gridSpan: 12 },
          { name: "address", label: "Address", type: "textarea", gridSpan: 12 },
          { name: "mapEmbedUrl", label: "Map Embed URL", type: "text", gridSpan: 12 },
        ],
      },
      {
        title: "Social Links",
        fields: [
          { name: "linkedin", label: "LinkedIn", type: "text", gridSpan: 6 },
          { name: "github", label: "GitHub", type: "text", gridSpan: 6 },
          { name: "youtube", label: "YouTube", type: "text", gridSpan: 6 },
          { name: "behance", label: "Behance", type: "text", gridSpan: 6 },
          { name: "facebook", label: "Facebook", type: "text", gridSpan: 12 },
        ],
      },
      {
        title: "SEO Metadata",
        fields: [
          { name: "seoTitle", label: "SEO Title", type: "text", gridSpan: 6 },
          { name: "businessType", label: "Business Type", type: "text", gridSpan: 6 },
          { name: "seoDescription", label: "SEO Description", type: "textarea", gridSpan: 12 },
          { name: "seoKeywords", label: "SEO Keywords", type: "tags", placeholder: "e.g. software, web dev, nextjs", gridSpan: 12 },
        ],
      },
      {
        title: "Other Settings",
        fields: [
          { name: "primaryColor", label: "Primary Color", type: "text", placeholder: "rgb(15 23 42)", gridSpan: 6 },
          { name: "secondaryColor", label: "Secondary Color", type: "text", placeholder: "rgb(37 99 235)", gridSpan: 6 },
          { name: "foundedYear", label: "Founded Year", type: "number", gridSpan: 6 },
          { name: "copyrightText", label: "Copyright Text", type: "text", gridSpan: 6 },
          { name: "privacyPolicyUrl", label: "Privacy Policy URL", type: "text", gridSpan: 6 },
          { name: "termsUrl", label: "Terms URL", type: "text", gridSpan: 6 },
        ],
      },
    ],
  };

  const formattedDefaults = useMemo(() => {
    if (!initialData) return { key: "main" };
    return {
      ...initialData,
      key: initialData.key || "main", // 👉 ডিফল্ট ভ্যালুতে key যুক্ত করা হলো
      tagline: initialData.tagline || "",
      shortDesc: initialData.shortDesc || "",
      siteUrl: initialData.siteUrl || "",
      logo: initialData.logo || null,
      logoAlt: initialData.logoAlt || "",
      darkLogo: initialData.darkLogo || null,
      darkLogoAlt: initialData.darkLogoAlt || "",
      favicon: initialData.favicon || null,
      faviconAlt: initialData.faviconAlt || "",
      ogImage: initialData.ogImage || null,
      ogImageAlt: initialData.ogImageAlt || "",
      email: initialData.email || "",
      phone: initialData.phone || "",
      address: initialData.address || "",
      mapEmbedUrl: initialData.mapEmbedUrl || "",
      officeHours: initialData.officeHours || "",
      linkedin: initialData.linkedin || "",
      github: initialData.github || "",
      youtube: initialData.youtube || "",
      behance: initialData.behance || "",
      facebook: initialData.facebook || "",
      seoTitle: initialData.seoTitle || "",
      seoDescription: initialData.seoDescription || "",
      seoKeywords: initialData.seoKeywords || [],
      primaryColor: initialData.primaryColor || "",
      secondaryColor: initialData.secondaryColor || "",
      businessType: initialData.businessType || "",
      foundedYear: initialData.foundedYear ?? null,
      copyrightText: initialData.copyrightText || "",
      privacyPolicyUrl: initialData.privacyPolicyUrl || "",
      termsUrl: initialData.termsUrl || "",
    };
  }, [initialData]);

  return (
    <FormEngine
      schema={SiteInfoSchema}
      config={config}
      defaultValues={formattedDefaults as any}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      submitText="Save Settings"
      folderPrefix="a2icoders"
    />
  );
}