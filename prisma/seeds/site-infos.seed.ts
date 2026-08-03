import { PrismaClient } from "@prisma/client";

const SITE_INFO_NAMES = [
  ["A2ICoders Studio", "A2ICoders"],
  ["Nimbus Commerce", "Nimbus Commerce Ltd."],
  ["Northstar Labs", "Northstar Labs"],
  ["PixelForge Works", "PixelForge Works"],
  ["BlueGrid Systems", "BlueGrid Systems"],
  ["LaunchDock Digital", "LaunchDock Digital"],
  ["VertexFlow Agency", "VertexFlow Agency"],
  ["BrightLayer Tech", "BrightLayer Tech"],
  ["OrbitScale Solutions", "OrbitScale Solutions"],
  ["CraftSignal Studio", "CraftSignal Studio"],
  ["AtlasSpring Media", "AtlasSpring Media"],
  ["Codeloom Ventures", "Codeloom Ventures"],
  ["PulseFrame Creative", "PulseFrame Creative"],
  ["CloudHarbor Systems", "CloudHarbor Systems"],
  ["NovaStack Collective", "NovaStack Collective"],
] as const;

const BUSINESS_TYPES = [
  "Software Agency",
  "SaaS Platform",
  "Product Studio",
  "Digital Consultancy",
  "Design & Engineering Studio",
] as const;

const PRIMARY_COLORS = ["#0F172A", "#1D4ED8", "#0F766E", "#7C3AED", "#C2410C"] as const;
const SECONDARY_COLORS = ["#38BDF8", "#22C55E", "#F59E0B", "#EC4899", "#6366F1"] as const;

export function createSiteInfoSeedData(options?: {
  createdByIds?: string[];
  updatedByIds?: string[];
}) {
  return SITE_INFO_NAMES.map(([title, fullName], index) => ({
    key: index === 0 ? "main" : `site-${String(index + 1).padStart(2, "0")}`,
    title,
    fullName,
    tagline: `High-trust digital systems for ${fullName.toLowerCase()}.`,
    resumeUrl: `/seed/site-info/resume-${String(index + 1).padStart(2, "0")}.pdf`,
    shortDesc: `${fullName} delivers reliable software, brand systems, and growth-ready web experiences for modern teams.`,
    siteUrl: `https://${title.toLowerCase().replace(/\s+/g, "-")}.example.com`,
    logo: `/seed/site-info/logo-${String(index + 1).padStart(2, "0")}.svg`,
    darkLogo: `/seed/site-info/logo-dark-${String(index + 1).padStart(2, "0")}.svg`,
    favicon: `/seed/site-info/favicon-${String(index + 1).padStart(2, "0")}.png`,
    ogImage: `/seed/site-info/og-${String(index + 1).padStart(2, "0")}.jpg`,
    email: `hello${String(index + 1).padStart(2, "0")}@example.com`,
    phone: `+8801700${String(index + 1).padStart(4, "0")}`,
    address: `${20 + index}, Business Avenue, Dhaka, Bangladesh`,
    mapEmbedUrl: `https://maps.example.com/embed/location-${index + 1}`,
    linkedin: `https://linkedin.com/company/${title.toLowerCase().replace(/\s+/g, "-")}`,
    github:
      index % 2 === 0 ? `https://github.com/${title.toLowerCase().replace(/\s+/g, "-")}` : null,
    behance:
      index % 5 === 0 ? `https://behance.net/${title.toLowerCase().replace(/\s+/g, "")}` : null,
    leetcode: `https://leetcode.com/${title.toLowerCase().replace(/\s+/g, "")}`,
    huggingface: `https://huggingface.co/${title.toLowerCase().replace(/\s+/g, "")}`,
    seoTitle: `${fullName} | Software, design, and digital growth`,
    seoDescription: `${fullName} builds thoughtful websites, scalable software products, and polished digital experiences for growing organizations.`,
    seoKeywords: [
      fullName,
      "software agency",
      "web development",
      "digital product",
      "brand systems",
    ],
    primaryColor: PRIMARY_COLORS[index % PRIMARY_COLORS.length],
    secondaryColor: SECONDARY_COLORS[index % SECONDARY_COLORS.length],
    availability: index % 2 === 0 ? "Available for freelance" : "Unavailable",
    careerStartYear: 2010 + index,
    copyrightText: `© ${2026 + index} ${fullName}. All rights reserved.`,
    privacyPolicyUrl: `/policies/${title.toLowerCase().replace(/\s+/g, "-")}/privacy`,
    termsUrl: `/policies/${title.toLowerCase().replace(/\s+/g, "-")}/terms`,
    createdById: options?.createdByIds?.[index % (options.createdByIds?.length || 1)] ?? null,
    updatedById: options?.updatedByIds?.[index % (options.updatedByIds?.length || 1)] ?? null,
  }));
}

export default async function seedSiteInfos(prisma: PrismaClient) {
  console.log("🏢 Seeding site infos...");

  await prisma.siteInfo.deleteMany();
  await prisma.siteInfo.createMany({
    data: createSiteInfoSeedData(),
  });

  console.log("✅ Created 15 site infos");
}
