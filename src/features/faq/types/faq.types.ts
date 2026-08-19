import { Status } from "@/shared/types/enums";
import type { z } from "zod";
import type { AuditUserSummary } from "@/shared/types";
import type {
  CreateFaqSchema,
  UpdateFaqSchema,
  FaqQuerySchema,
} from "../schemas/faq.schema";

// 🟢 Zod Schema থেকে ইনফার করা টাইপস
export type CreateFaqPayload = z.infer<typeof CreateFaqSchema>;
export type UpdateFaqPayload = z.infer<typeof UpdateFaqSchema>;
export type FaqQueryValidated = z.infer<typeof FaqQuerySchema>;

// 🟢 কুয়েরি প্যারামিটারস টাইপ
export interface FaqQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  status?: Status;
  isFeatured?: boolean;
  categoryId?: string;
}

export type PublicFaqQueryParams = {
  limit?: number;
  category?: string;
  search?: string;
};

// 🟢 রিলেশনাল অবজেক্ট রেফারেন্স টাইপ
export interface FaqRelationItem {
  id: string;
  title: string;
  slug: string;
}

// 🟢 ডাটাবেজ / অ্যাডমিন প্যানেলের পূর্ণাঙ্গ Faq টাইপ
export interface Faq {
  id: string;
  question: string;
  answer: string;
  order: number;
  isFeatured: boolean;
  status: Status;
  publishedAt: Date | string | null;
  archivedAt: Date | string | null;
  createdById: string | null;
  updatedById: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  categories?: FaqRelationItem[];
  events?: FaqRelationItem[];
  services?: FaqRelationItem[];
  createdBy?: AuditUserSummary | null;
  updatedBy?: AuditUserSummary | null;
}

// 🟢 পাবলিক UI এবং ক্লায়েন্ট সেকশনের জন্য সিম্প্লিফাইড টাইপ
export interface PublicFaqItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
  categories?: FaqRelationItem[];
  order?: number;
  isFeatured?: boolean;
}