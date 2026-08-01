"use server";

import React from "react";
import { ContentRenderer } from "./ContentRenderer";
import type { ContentModelVariant } from "./types";

export async function getRenderedPreview(content: any, variant: ContentModelVariant) {
  return <ContentRenderer content={content} variant={variant} />;
}
