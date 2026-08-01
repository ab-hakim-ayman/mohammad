import type { AccountStatus, UserRole } from "./user";

export interface AuditUserProfileSummary {
  fullName: string | null;
  headline: string | null;
  avatar: string | null;
  designation: string | null;
}

export interface AuditUserSummary {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  role: UserRole;
  status: AccountStatus;
  profile: AuditUserProfileSummary | null;
}
