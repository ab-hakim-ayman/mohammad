import I18n from "@/shared/components/I18n";

import type { PartialBlock } from "@blocknote/core";
import type { ContentModelVariant, RichContentDocument } from "./types";

export const createEmptyDocument = (): RichContentDocument => ({
  version: 1,
  editor: "blocknote",
  blocks: [],
});

const heading = (text: string, level: 2 | 3 = 2): PartialBlock => ({
  type: "heading",
  props: { level },
  content: text,
});

const paragraph = (text = ""): PartialBlock => ({
  type: "paragraph",
  content: text,
});

const bulletList = (count = 3): PartialBlock[] =>
  Array.from({ length: count }, () => ({
    type: "bulletListItem",
    content: "",
  }));

const numberedList = (count = 3): PartialBlock[] =>
  Array.from({ length: count }, () => ({
    type: "numberedListItem",
    content: "",
  }));

const divider = (): PartialBlock => ({
  type: "divider",
});

const section = (
  title: string,
  contentType: "paragraph" | "bullets" | "numbered" = "paragraph"
): PartialBlock[] => {
  const body =
    contentType === "bullets"
      ? bulletList()
      : contentType === "numbered"
        ? numberedList()
        : [paragraph()];

  return [heading(title), ...body];
};

const customBlock = (type: string, props: Record<string, unknown> = {}): PartialBlock =>
  ({
    type,
    props,
  }) as PartialBlock;

export const getTemplateForVariant = (variant: ContentModelVariant): PartialBlock[] => {
  switch (variant) {
    case "blog":
      return [
        ...section("Introduction"),
        ...section("Key Takeaways", "bullets"),
        divider(),
        ...section("The Core Perspective"),
        ...section("Practical Implications", "bullets"),
        ...section("Final Thoughts"),
      ];

    case "service":
      return [
        ...section("Service Overview"),
        ...section("Business Challenges We Solve", "bullets"),
        divider(),
        ...section("How We Help"),
        ...section("Core Capabilities", "bullets"),
        ...section("Our Delivery Approach", "numbered"),
        ...section("What Makes This Approach Effective"),
        customBlock("cta"),
      ];

    case "project":
      return [
        ...section("Project Overview"),
        ...section("Product Goals", "bullets"),
        divider(),
        ...section("What We Built"),
        ...section("Key Features", "bullets"),
        ...section("Modules and Workflows"),
        ...section("Architecture and Integrations"),
        ...section("Delivery Approach"),
      ];

    case "caseStudy":
      return [
        ...section("Project Context"),
        ...section("The Challenge"),
        divider(),
        ...section("Our Strategic Approach"),
        ...section("The Solution"),
        ...section("Implementation Journey", "numbered"),
        ...section("The Impact"),
        customBlock("cta"),
      ];

    case "industry":
      return [
        ...section("Industry Context"),
        ...section("Common Challenges", "bullets"),
        divider(),
        ...section("Digital Opportunities"),
        ...section("How We Help"),
        ...section("Strategic Priorities", "bullets"),
        customBlock("cta"),
      ];

    case "event":
      return [
        ...section("Event Overview"),
        ...section("What You Will Learn", "bullets"),
        divider(),
        ...section("Agenda", "numbered"),
        ...section("Session Details"),
        ...section("Speaker Information"),
        ...section("Participation Guide", "bullets"),
        customBlock("cta"),
      ];

    case "specialization":
      return [
        ...section("Specialization Overview"),
        ...section("Core Focus Areas", "bullets"),
        divider(),
        ...section("Typical Use Cases", "bullets"),
        ...section("Core Capabilities"),
        ...section("Our Delivery Approach", "numbered"),
        ...section("Why This Expertise Matters"),
        customBlock("cta"),
      ];

    default:
      return [paragraph()];
  }
};
