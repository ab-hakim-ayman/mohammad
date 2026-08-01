export const USER_ROLES = [
  "OWNER",
  "ADMIN",
  "MANAGER",
  "HR",
  "EMPLOYEE",
  "CONTENT_MANAGER",
] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const ACCOUNT_STATUSES = ["INVITED", "ACTIVE", "INACTIVE", "SUSPENDED"] as const;

export type AccountStatus = (typeof ACCOUNT_STATUSES)[number];

export const STAFF_ROLES = ["OWNER", "ADMIN", "MANAGER", "HR", "CONTENT_MANAGER"] as const;

export type StaffRole = (typeof STAFF_ROLES)[number];

export const MANAGEMENT_ROLES = ["OWNER", "ADMIN"] as const;

export type ManagementRole = (typeof MANAGEMENT_ROLES)[number];

