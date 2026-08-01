import { z } from "zod";

export const TakeawayItemSchema = z.string();
export const TakeawayListSchema = z.array(TakeawayItemSchema);

export const FaqItemSchema = z.object({
  question: z.string(),
  answer: z.string(),
});
export const FaqListSchema = z.array(FaqItemSchema);

export function parseTakeaways(json: string): string[] {
  try {
    const parsed = JSON.parse(json);
    const result = TakeawayListSchema.safeParse(parsed);
    return result.success ? result.data : [];
  } catch {
    return [];
  }
}

export function parseFaqs(json: string): { question: string; answer: string }[] {
  try {
    const parsed = JSON.parse(json);
    const result = FaqListSchema.safeParse(parsed);
    return result.success ? result.data : [];
  } catch {
    return [];
  }
}

export function getValidTakeaways(json: string): string[] {
  return parseTakeaways(json)
    .map((i) => i.trim())
    .filter((i) => i.length > 0);
}

export function getValidFaqs(json: string): { question: string; answer: string }[] {
  return parseFaqs(json)
    .map((f) => ({ question: f.question.trim(), answer: f.answer.trim() }))
    .filter((f) => f.question.length > 0 && f.answer.length > 0);
}

export function stringifyItems(items: any[]): string {
  return JSON.stringify(items);
}

export function isValidUrl(url: string): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url, "http://localhost");
    return ["http:", "https:"].includes(parsed.protocol);
  } catch {
    return false;
  }
}

export function extractTextFromBlocks(blocks: any[]): string {
  let text = "";
  for (const block of blocks) {
    if (block.content && Array.isArray(block.content)) {
      for (const inline of block.content) {
        if (inline.type === "text") {
          text += inline.text + " ";
        }
      }
    }
    if (block.children) {
      text += extractTextFromBlocks(block.children);
    }
    text += "\n";
  }
  return text;
}
