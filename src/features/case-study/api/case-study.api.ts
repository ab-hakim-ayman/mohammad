import { apiClient } from "@/shared/lib";
import { CaseStudy, CreateCaseStudyPayload, UpdateCaseStudyPayload, CaseStudyApiQueryParams, PublicCaseStudyQueryParams } from "../types/case-study.types";

export const caseStudyApi = {
  getPublished: (params?: PublicCaseStudyQueryParams) =>
    apiClient.paginated<CaseStudy>("/api/public/case-studies", params),

  getBySlug: (slug: string) => apiClient.get<CaseStudy>("/api/public/case-studies/" + slug),

  getAll: (params?: CaseStudyApiQueryParams) =>
    apiClient.paginated<CaseStudy>("/api/admin/case-studies", params),

  getById: (id: string) => apiClient.get<CaseStudy>("/api/admin/case-studies/" + id),

  create: (data: CreateCaseStudyPayload) =>
    apiClient.post<CaseStudy>("/api/admin/case-studies", data),

  update: (id: string, data: UpdateCaseStudyPayload) =>
    apiClient.patch<CaseStudy>("/api/admin/case-studies/" + id, data),

  delete: (id: string) => apiClient.delete<{ deleted: boolean }>("/api/admin/case-studies/" + id),
};
