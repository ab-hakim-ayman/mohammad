import { BlockNoteSchema, defaultBlockSpecs } from "@blocknote/core";
import { TakeawaysBlock } from "@/components/content/blocks/TakeawaysBlock";
import { FaqBlock } from "@/components/content/blocks/FaqBlock";
import { InlineCtaBlock } from "@/components/content/blocks/InlineCtaBlock";
import { CustomImageBlock } from "@/components/content/blocks/CustomImageBlock";
import { getDefaultReactSlashMenuItems } from "@blocknote/react";
import { Image as ImageIcon } from "lucide-react";
import React from "react";
import type { ContentType } from "./content-types";

export const schema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    takeaways: TakeawaysBlock,
    faq: FaqBlock,
    cta: InlineCtaBlock,
    customImage: CustomImageBlock,
  },
});

const insertCustomBlock = (editor: typeof schema.BlockNoteEditor, type: any) => {
  const currentBlock = editor.getTextCursorPosition().block;
  if (
    currentBlock.type === "paragraph" &&
    (!currentBlock.content ||
      (Array.isArray(currentBlock.content) && currentBlock.content.length === 0))
  ) {
    editor.updateBlock(currentBlock, { type });
  } else {
    editor.insertBlocks([{ type }], currentBlock, "after");
  }
};

export const getCustomSlashMenuItems = (
  editor: typeof schema.BlockNoteEditor,
  contentType: ContentType
) => {
  const defaultItems = getDefaultReactSlashMenuItems(editor);

  const baseWritingItems = [
    "Paragraph",
    "Heading 2",
    "Heading 3",
    "Heading 4",
    "Bullet List",
    "Numbered List",
    "Quote",
    "Code Block",
    "Divider",
  ];

  let writingItems = [...baseWritingItems];
  if (contentType === "PROJECT" || contentType === "EVENT" || contentType === "CASE_STUDY") {
    writingItems = writingItems.filter((i) => i !== "Code Block");
  }

  const filtered = defaultItems.filter(
    (item) => writingItems.includes(item.title) || item.title === "Table"
  );

  filtered.forEach((item) => {
    if (item.title === "Table") {
      item.group = "Media & Layout";
    } else {
      item.group = "Writing";
    }
  });

  const customItems: any[] = [
    {
      title: "Image",
      onItemClick: () => {
        insertCustomBlock(editor, "customImage");
      },
      aliases: ["image", "img", "picture"],
      group: "Media & Layout",
      subtext: "Insert an image from Media Library or upload a new one.",
      icon: React.createElement(ImageIcon, { size: 18 }),
    },
    {
      title: "CTA Banner",
      onItemClick: () => {
        insertCustomBlock(editor, "cta");
      },
      aliases: ["cta", "call to action", "contact banner"],
      group: "Custom Blocks",
      subtext: "Add a call-to-action banner.",
    },
  ];

  if (contentType === "BLOG" || contentType === "CASE_STUDY" || contentType === "PROJECT") {
    customItems.push({
      title: "Key Takeaways",
      onItemClick: () => {
        insertCustomBlock(editor, "takeaways");
      },
      aliases: ["takeaway", "takeaways", "key points"],
      group: "Custom Blocks",
      subtext: "Add a key takeaways list.",
    });
  }

  if (contentType === "BLOG" || contentType === "CASE_STUDY" || contentType === "EVENT") {
    customItems.push({
      title: "FAQ",
      onItemClick: () => {
        insertCustomBlock(editor, "faq");
      },
      aliases: ["questions", "frequently asked questions", "faq"],
      group: "Custom Blocks",
      subtext: "Add an accordion FAQ section.",
    });
  }

  return [...filtered, ...customItems];
};
