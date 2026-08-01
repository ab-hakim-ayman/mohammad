import I18n from "@/shared/components/I18n";

import { z } from "zod";
import type { RichContentDocument } from "./types";

export const richContentDocumentSchema: z.ZodType<RichContentDocument> = z.object({
  version: z.literal(1),
  editor: z.literal("blocknote"),
  blocks: z.array(z.record(z.string(), z.unknown())).max(250),
});

export const parseRichContentDocument = (data: unknown): RichContentDocument | null => {
  if (!data || typeof data !== "object") return null;
  const result = richContentDocumentSchema.safeParse(data);
  if (result.success) {
    return result.data;
  }
  return null;
};

export const isValidRichContentDocument = (data: unknown): boolean => {
  return richContentDocumentSchema.safeParse(data).success;
};
