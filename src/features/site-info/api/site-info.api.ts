import { apiClient } from "@/shared/lib";
import { CreateSiteInfoPayload, SiteInfoRecord } from "../types/site-info.types";

export const siteInfoApi = {
  getPublic: () => apiClient.get<SiteInfoRecord | null>("/api/public/site-info"),
  getAdmin: () => apiClient.get<SiteInfoRecord | null>("/api/admin/site-info"),
  save: (data: CreateSiteInfoPayload) =>
    apiClient.put<SiteInfoRecord>("/api/admin/site-info", data),
};
