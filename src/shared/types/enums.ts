export const Status = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  ARCHIVED: "ARCHIVED",
} as const;
export type Status = (typeof Status)[keyof typeof Status];

export const UserRole = {
  OWNER: "OWNER",
  MODERATOR: "MODERATOR",
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const ContactStatus = {
  NEW: "NEW",
  READ: "READ",
  REPLIED: "REPLIED",
  ARCHIVED: "ARCHIVED",
} as const;
export type ContactStatus = (typeof ContactStatus)[keyof typeof ContactStatus];

export const GalleryType = {
  IMAGE: "IMAGE",
  VIDEO: "VIDEO",
} as const;
export type GalleryType = (typeof GalleryType)[keyof typeof GalleryType];

export const AccountStatus = {
  INVITED: "INVITED",
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  SUSPENDED: "SUSPENDED",
} as const;
export type AccountStatus = (typeof AccountStatus)[keyof typeof AccountStatus];

export const AchievementType = {
  AWARD: "AWARD",
  CERTIFICATION: "CERTIFICATION",
  RECOGNITION: "RECOGNITION",
  MILESTONE: "MILESTONE",
  OTHER: "OTHER",
} as const;
export type AchievementType = (typeof AchievementType)[keyof typeof AchievementType];



export const MediaProvider = {
  CLOUDINARY: "CLOUDINARY",
} as const;
export type MediaProvider = (typeof MediaProvider)[keyof typeof MediaProvider];


export const CategoryScope = {
  BLOG: "BLOG",
  PROJECT: "PROJECT",
  SERVICE: "SERVICE",
  CASE_STUDY: "CASE_STUDY",
  TECHNOLOGY: "TECHNOLOGY",
  SKILL: "SKILL",
  FAQ: "FAQ",
  TOOL: "TOOL",
} as const;
export type CategoryScope = (typeof CategoryScope)[keyof typeof CategoryScope];

export const EmploymentType = {
  FULL_TIME: "FULL_TIME",
  PART_TIME: "PART_TIME",
  CONTRACT: "CONTRACT",
  FREELANCE: "FREELANCE",
  INTERNSHIP: "INTERNSHIP",
} as const;
export type EmploymentType = (typeof EmploymentType)[keyof typeof EmploymentType];

