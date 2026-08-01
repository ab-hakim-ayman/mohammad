"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";

import { BlockNoteView } from "@blocknote/shadcn";
import {
  DefaultReactSuggestionItem,
  getDefaultReactSlashMenuItems,
  SuggestionMenuController,
  SuggestionMenuProps,
  useCreateBlockNote,
} from "@blocknote/react";
import { filterSuggestionItems, type PartialBlock } from "@blocknote/core";
import {
  Activity,
  Columns,
  FileText,
  Grid,
  ImageIcon,
  Info,
  ListOrdered,
  Music,
  Quote,
  Table,
  Target,
  Video,
} from "lucide-react";

import { schema } from "./config";
import type { ContentEditorProps, RichContentDocument } from "./types";
import { getTemplateForVariant } from "./defaults";
import I18n from "@/shared/components/I18n";

type EditorTheme = "light" | "dark";

const EDITOR_META: Record<
  string,
  {
    eyebrow: string;
    title: string;
    description: string;
  }
> = {
  blog: {
    eyebrow: "Editorial content",
    title: "Article editor",
    description:
      "Build a clear, structured article with headings, media, callouts, and thoughtful CTA sections.",
  },
  service: {
    eyebrow: "Service narrative",
    title: "Service content editor",
    description:
      "Explain the problems you solve, your capabilities, delivery approach, and business value.",
  },
  project: {
    eyebrow: "Product story",
    title: "Project content editor",
    description:
      "Present product goals, key features, workflows, architecture, and delivery decisions.",
  },
  caseStudy: {
    eyebrow: "Transformation story",
    title: "Case study editor",
    description:
      "Structure the narrative around context, challenge, approach, solution, implementation, and impact.",
  },
  industry: {
    eyebrow: "Industry expertise",
    title: "Industry content editor",
    description:
      "Share market context, challenges, opportunities, and how your team approaches this sector.",
  },
  event: {
    eyebrow: "Event content",
    title: "Event details editor",
    description:
      "Create an organized event experience with agenda, session details, participation guidance, and media.",
  },
  specialization: {
    eyebrow: "Focused expertise",
    title: "Specialization editor",
    description:
      "Explain your core focus, practical applications, capabilities, and strategic approach.",
  },
};

function useBlockNoteTheme(): EditorTheme {
  const [theme, setTheme] = useState<EditorTheme>("light");

  useEffect(() => {
    const root = document.documentElement;

    const syncTheme = () => {
      const isDark = root.classList.contains("dark") || root.dataset.theme === "dark";

      setTheme(isDark ? "dark" : "light");
    };

    syncTheme();

    const observer = new MutationObserver(syncTheme);

    observer.observe(root, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  return theme;
}

function getBlocksSignature(blocks: unknown[] | null | undefined) {
  return JSON.stringify(blocks ?? []);
}

function PremiumSlashMenu(props: SuggestionMenuProps<DefaultReactSuggestionItem>) {
  return (
    <div
      role="listbox"
      aria-label="Content blocks"
      className="border-border bg-background text-foreground ring-border/50 max-h-[min(30rem,calc(100vh-2rem))] w-88 max-w-[calc(100vw-2rem)] overflow-y-auto rounded-xl border p-1.5 opacity-100 shadow-2xl ring-1"
    >
      {props.items.map((item, index) => {
        const previousItem = props.items[index - 1];
        const isNewGroup = Boolean(item.group) && item.group !== previousItem?.group;
        const isSelected = props.selectedIndex === index;

        return (
          <Fragment key={`${item.group ?? "content"}-${item.title}-${index}`}>
            {isNewGroup ? (
              <p className="text-muted-foreground px-3 pt-2 pb-1 text-xs font-semibold tracking-[0.14em] uppercase first:pt-1">
                {item.group}
              </p>
            ) : null}

            <button
              type="button"
              role="option"
              aria-selected={isSelected}
              onClick={() => props.onItemClick?.(item)}
              className={[
                "flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition-colors duration-150",
                isSelected
                  ? "bg-accent text-accent-foreground"
                  : "text-foreground hover:bg-accent hover:text-accent-foreground",
              ].join(" ")}
            >
              <span
                className={[
                  "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border",
                  isSelected
                    ? "border-primary/20 bg-primary/15 text-primary"
                    : "border-border bg-muted text-primary",
                ].join(" ")}
              >
                {item.icon ?? <FileText className="size-4" />}
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-sm leading-5 font-semibold">{item.title}</span>

                {item.subtext ? (
                  <span className="text-muted-foreground mt-0.5 block text-xs leading-5">
                    {item.subtext}
                  </span>
                ) : null}
              </span>
            </button>
          </Fragment>
        );
      })}
    </div>
  );
}

export default function ContentEditor({
  value,
  onChange,
  variant,
  disabled = false,
  placeholder,
}: ContentEditorProps) {
  const blockNoteTheme = useBlockNoteTheme();
  const lastEmittedSignatureRef = useRef<string | null>(null);

  const [initialContent] = useState<PartialBlock[]>(() =>
    value?.blocks?.length ? (value.blocks as PartialBlock[]) : getTemplateForVariant(variant)
  );

  const editor = useCreateBlockNote({
    schema,
    initialContent,

    uploadFile: async (file: File) => {
      const formData = new FormData();

      formData.append("files", file);
      formData.append("folder", `a2icoders/content/${variant}`);

      const response = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Media upload failed.");
      }

      const payload = await response.json();
      const secureUrl = payload?.data?.[0]?.secureUrl;

      if (!secureUrl) {
        throw new Error("Media upload completed without a valid file URL.");
      }

      return secureUrl;
    },
  });

  const incomingBlocks = useMemo<PartialBlock[] | null>(() => {
    if (!value?.blocks?.length) {
      return null;
    }

    return value.blocks as PartialBlock[];
  }, [value?.blocks]);

  const incomingSignature = useMemo(() => getBlocksSignature(incomingBlocks), [incomingBlocks]);

  useEffect(() => {
    if (!incomingBlocks?.length) {
      return;
    }

    if (lastEmittedSignatureRef.current === incomingSignature) {
      return;
    }

    const currentSignature = getBlocksSignature(editor.document);

    if (currentSignature === incomingSignature) {
      return;
    }

    editor.replaceBlocks(editor.document, incomingBlocks);
  }, [editor, incomingBlocks, incomingSignature]);

  const meta = EDITOR_META[variant] ?? {
    eyebrow: "Rich content",
    title: "Content editor",
    description: "Create structured, high-quality content using reusable blocks.",
  };

  const insertAfterCursor = (blockEditor: typeof editor, block: PartialBlock) => {
    blockEditor.insertBlocks([block], blockEditor.getTextCursorPosition().block, "after");
  };

  const createCustomBlock = (type: string, props?: Record<string, unknown>): PartialBlock =>
    ({
      type,
      ...(props ? { props } : {}),
    }) as PartialBlock;

  const getCustomSlashMenuItems = (blockEditor: typeof editor): DefaultReactSuggestionItem[] => {
    const defaultItems = getDefaultReactSlashMenuItems(blockEditor).filter(
      (item) => !["Image", "Video", "Audio", "File"].includes(item.title)
    );

    return [
      ...defaultItems,

      {
        title: "Image",
        aliases: ["image", "img", "picture"],
        group: "Media",
        icon: <ImageIcon size={18} />,
        subtext: "Upload an image from your media library",
        onItemClick: () => insertAfterCursor(blockEditor, createCustomBlock("customImage")),
      },
      {
        title: "Upload Video",
        aliases: ["video", "mp4", "upload video"],
        group: "Media",
        icon: <Video size={18} />,
        subtext: "Upload a video to your media library",
        onItemClick: () => insertAfterCursor(blockEditor, createCustomBlock("customVideo")),
      },
      {
        title: "Upload Audio",
        aliases: ["audio", "mp3", "music"],
        group: "Media",
        icon: <Music size={18} />,
        subtext: "Upload an audio file to your media library",
        onItemClick: () => insertAfterCursor(blockEditor, createCustomBlock("customAudio")),
      },
      {
        title: "Upload File",
        aliases: ["file", "document", "pdf"],
        group: "Media",
        icon: <FileText size={18} />,
        subtext: "Upload a document or downloadable file",
        onItemClick: () => insertAfterCursor(blockEditor, createCustomBlock("customFile")),
      },

      {
        title: "Callout",
        group: "Content blocks",
        icon: <Info size={18} />,
        subtext: "Highlight an important note or insight",
        onItemClick: () =>
          insertAfterCursor(blockEditor, createCustomBlock("callout", { type: "info" })),
      },
      {
        title: "Video Embed",
        group: "Content blocks",
        icon: <Video size={18} />,
        subtext: "Embed an approved YouTube or Vimeo video",
        onItemClick: () => insertAfterCursor(blockEditor, createCustomBlock("videoEmbed")),
      },
      {
        title: "Quote Highlight",
        group: "Content blocks",
        icon: <Quote size={18} />,
        subtext: "Add a prominent quote or insight",
        onItemClick: () => insertAfterCursor(blockEditor, createCustomBlock("quoteHighlight")),
      },
      {
        title: "Process Timeline",
        group: "Content blocks",
        icon: <ListOrdered size={18} />,
        subtext: "Present a step-by-step process",
        onItemClick: () => insertAfterCursor(blockEditor, createCustomBlock("processTimeline")),
      },
      {
        title: "Metric Grid",
        group: "Content blocks",
        icon: <Activity size={18} />,
        subtext: "Show approved metrics or outcome highlights",
        onItemClick: () => insertAfterCursor(blockEditor, createCustomBlock("metricGrid")),
      },
      {
        title: "Image with Caption",
        group: "Content blocks",
        icon: <ImageIcon size={18} />,
        subtext: "Add a visual with a polished caption",
        onItemClick: () => insertAfterCursor(blockEditor, createCustomBlock("imageCaption")),
      },
      {
        title: "Feature Grid",
        group: "Content blocks",
        icon: <Grid size={18} />,
        subtext: "Display capabilities or key features",
        onItemClick: () => insertAfterCursor(blockEditor, createCustomBlock("featureGrid")),
      },
      {
        title: "Comparison Table",
        group: "Content blocks",
        icon: <Table size={18} />,
        subtext: "Compare options, approaches, or outcomes",
        onItemClick: () => insertAfterCursor(blockEditor, createCustomBlock("comparisonTable")),
      },
      {
        title: "Two-Column Layout",
        group: "Content blocks",
        icon: <Columns size={18} />,
        subtext: "Create a balanced side-by-side content section",
        onItemClick: () => insertAfterCursor(blockEditor, createCustomBlock("twoColumn")),
      },
      {
        title: "Inline CTA Banner",
        group: "Content blocks",
        icon: <Target size={18} />,
        subtext: "Add a focused call-to-action section",
        onItemClick: () => insertAfterCursor(blockEditor, createCustomBlock("cta")),
      },
      {
        title: "Key Takeaways",
        group: "Content blocks",
        icon: <ListOrdered size={18} />,
        subtext: "Summarize the most important points",
        onItemClick: () => insertAfterCursor(blockEditor, createCustomBlock("takeaways")),
      },
      {
        title: "FAQ Block",
        group: "Content blocks",
        icon: <Info size={18} />,
        subtext: "Add questions and answers inside the content",
        onItemClick: () => insertAfterCursor(blockEditor, createCustomBlock("faq")),
      },
    ];
  };

  const handleChange = () => {
    const blocks = editor.document as unknown as RichContentDocument["blocks"];

    lastEmittedSignatureRef.current = getBlocksSignature(blocks);

    onChange({
      version: 1,
      editor: "blocknote",
      blocks,
    });
  };

  return (
    <section
      data-content-editor
      aria-label={`${meta.title} for ${variant}`}
      aria-disabled={disabled}
      className={[
        "border-border shadow-soft flex flex-col rounded-xl border bg-transparent",
        "transition-[border-color,box-shadow] duration-200",
        "focus-within:border-primary/50 focus-within:ring-primary/10 focus-within:ring-4",
        disabled ? "pointer-events-none opacity-60" : "",
      ].join(" ")}
    >
      <header className="border-border flex flex-col gap-4 rounded-t-[18px] border-b bg-transparent px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex min-w-0 items-start gap-3">
          <div className="border-primary/15 bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-none sm:rounded-xl border">
            <FileText className="size-5" />
          </div>

          <div className="min-w-0">
            <p className="text-primary text-xs font-semibold tracking-[0.16em] uppercase">
              {meta.eyebrow}
            </p>

            <h3 className="text-foreground mt-1 text-sm font-semibold tracking-tight sm:text-base">
              {meta.title}
            </h3>

            <p className="text-muted-foreground mt-1 max-w-2xl text-xs leading-5 sm:text-sm">
              {placeholder ?? meta.description}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span className="border-border bg-background text-muted-foreground inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium">
            <I18n>Block editor</I18n>
          </span>

          <span className="bg-muted text-muted-foreground hidden items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium sm:inline-flex">
            <I18n>Type</I18n>
            <kbd className="border-border bg-background text-foreground rounded border px-1.5 py-0.5 font-mono text-xs">
              /
            </kbd>
            <I18n>for blocks</I18n>
          </span>
        </div>
      </header>

      <div className="flex-1 rounded-b-[18px] bg-transparent">
        <div className="relative max-h-[760px] min-h-[460px] overflow-y-auto px-2 sm:px-6 [&_.bn-block-content]:w-full! [&_.bn-block-content>div]:w-full! [&_.bn-container]:bg-transparent! [&_.bn-editor]:max-w-full! [&_.bn-editor]:bg-transparent!">
          <BlockNoteView
            editor={editor}
            theme={blockNoteTheme}
            slashMenu={false}
            onChange={handleChange}
          >
            <SuggestionMenuController
              triggerCharacter="/"
              suggestionMenuComponent={PremiumSlashMenu}
              getItems={async (query) =>
                filterSuggestionItems(getCustomSlashMenuItems(editor), query)
              }
            />
          </BlockNoteView>
        </div>
      </div>
    </section>
  );
}
