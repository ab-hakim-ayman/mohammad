import I18n from "@/shared/components/I18n";

import { getValidTakeaways, getValidFaqs, isValidUrl } from "@/lib/content/content-utils";
import type { ContentType } from "@/lib/content/content-types";
import { parseRichContentDocument } from "./validation";
import type { ContentRendererProps } from "./types";
import {
  CalloutRenderer,
  QuoteHighlightRenderer,
  ProcessTimelineRenderer,
  MetricGridRenderer,
  ImageCaptionRenderer,
  FeatureGridRenderer,
  ComparisonTableRenderer,
  TwoColumnRenderer,
  VideoEmbedRenderer,
  CustomVideoRenderer,
  CustomAudioRenderer,
  CustomFileRenderer,
} from "./renderers/CustomBlockRenderer";
import React from "react";

export function extractPlainText(contentJson: any): string {
  const parsed = parseRichContentDocument(contentJson);
  const blocks = parsed ? parsed.blocks : Array.isArray(contentJson) ? contentJson : [];
  if (!blocks || !Array.isArray(blocks)) return "";

  let text = "";
  const traverse = (items: any[]) => {
    for (const block of items) {
      if (Array.isArray(block.content)) {
        for (const inline of block.content) {
          if (inline.type === "text") {
            text += inline.text + " ";
          }
        }
      }
      if (block.children) {
        traverse(block.children);
      }
    }
  };
  traverse(blocks);
  return text.trim();
}

export function extractToc(contentJson: any, contentType: string) {
  if (
    contentType !== "blog" &&
    contentType !== "caseStudy" &&
    contentType !== "BLOG" &&
    contentType !== "CASE_STUDY" &&
    contentType !== "specialization"
  )
    return [];

  const toc: { id: string; text: string; level: number }[] = [];

  const parsed = parseRichContentDocument(contentJson);
  const blocks = parsed ? parsed.blocks : Array.isArray(contentJson) ? contentJson : [];
  if (!blocks || !Array.isArray(blocks)) return toc;

  const traverse = (items: any[]) => {
    for (const block of items) {
      if (block.type === "heading") {
        let text = "";
        if (Array.isArray(block.content)) {
          for (const inline of block.content) {
            if (inline.type === "text") text += inline.text;
          }
        }
        if (text) {
          const id = text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
          toc.push({ id, text, level: block.props?.level || 2 });
        }
      }
      if (block.children) {
        traverse(block.children);
      }
    }
  };
  traverse(blocks);
  return toc;
}

export function extractFaqJsonLd(contentJson: any, contentType: string) {
  if (
    contentType !== "blog" &&
    contentType !== "caseStudy" &&
    contentType !== "BLOG" &&
    contentType !== "CASE_STUDY"
  )
    return null;

  const parsed = parseRichContentDocument(contentJson);
  const blocks = parsed ? parsed.blocks : Array.isArray(contentJson) ? contentJson : [];
  if (!blocks || !Array.isArray(blocks)) return null;

  const faqs: any[] = [];

  const traverse = (items: any[]) => {
    for (const block of items) {
      if (block.type === "faq" && block.props?.itemsJson) {
        const parsedItems = getValidFaqs(block.props.itemsJson);
        for (const item of parsedItems) {
          faqs.push({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          });
        }
      }
      if (block.children) {
        traverse(block.children);
      }
    }
  };

  traverse(blocks);

  if (faqs.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs,
  };
}

function TakeawaysRenderer({ block }: { block: any }) {
  const items = getValidTakeaways(block.props.itemsJson);
  if (items.length === 0) return null;

  return (
    <section className="bg-primary/5 border-border not-prose my-8 rounded-none sm:rounded-xl border p-6">
      <h3 className="text-foreground mb-4 text-xl font-bold">{block.props.title}</h3>
      <ul className="text-muted-foreground list-disc space-y-2 pl-5">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

function FaqRenderer({ block }: { block: any }) {
  const items = getValidFaqs(block.props.itemsJson);
  if (items.length === 0) return null;

  return (
    <section className="not-prose my-8">
      <h3 className="text-foreground mb-6 text-2xl font-bold">{block.props.title}</h3>
      <div className="space-y-4">
        {items.map((item, i) => (
          <details
            key={i}
            className="group border-border bg-card rounded-lg border px-6 py-4 [&_summary::-webkit-details-marker]:hidden"
          >
            <summary className="text-foreground flex cursor-pointer items-center justify-between font-semibold">
              {item.question}
              <span className="text-muted-foreground transition-transform group-open:rotate-180">
                <svg
                  fill="none"
                  height="24"
                  shapeRendering="geometricPrecision"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  width="24"
                >
                  <path d="M6 9l6 6 6-6"></path>
                </svg>
              </span>
            </summary>
            <p className="text-muted-foreground mt-4 leading-relaxed">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function InlineCtaRenderer({ block }: { block: any }) {
  const { title, description, buttonText, buttonUrl, imageUrl } = block.props;
  const validUrl = isValidUrl(buttonUrl);

  return (
    <section className="bg-primary text-on-primary not-prose my-10 flex flex-col items-stretch overflow-hidden rounded-xl shadow-lg md:flex-row">
      <div className="flex flex-1 flex-col justify-center p-8 md:p-12">
        <h3 className="mb-4 text-2xl font-bold md:text-3xl">{title}</h3>
        {description && <p className="text-primary-foreground/80 mb-8 text-lg">{description}</p>}
        {validUrl && (
          <div>
            <a
              href={buttonUrl}
              target={buttonUrl.startsWith("http") ? "_blank" : undefined}
              rel={buttonUrl.startsWith("http") ? "noopener noreferrer" : undefined}
              className="bg-background text-foreground hover:bg-background/90 inline-flex h-12 items-center justify-center rounded-full px-8 text-sm font-medium transition-colors"
            >
              {buttonText}
            </a>
          </div>
        )}
      </div>
      {imageUrl && (
        <div
          className="relative h-64 min-h-[250px] w-full overflow-hidden md:h-auto md:w-2/5 aspect-video"
        >
          {}
          <img
            src={imageUrl}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      )}
    </section>
  );
}

function CustomImageRenderer({ block }: { block: any }) {
  const { url, alt, caption } = block.props;
  if (!url) return null;

  return (
    <figure className="not-prose my-8 flex flex-col items-center">
      <div
        className="bg-muted/30 border-border relative w-full overflow-hidden rounded-none sm:rounded-xl border shadow-xs aspect-video"
      >
        {}
        <img
          src={url}
          alt={alt || caption || ""}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-contain"
        />
      </div>
      {caption && (
        <figcaption className="text-muted-foreground mt-3 text-center text-sm italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

function renderInlineContent(content: any[]): React.ReactNode {
  if (!content || !Array.isArray(content)) return null;
  return content.map((c, i) => {
    if (c.type === "text") {
      let text: React.ReactNode = c.text;
      if (c.styles) {
        if (c.styles.bold) text = <strong key={i}>{text}</strong>;
        if (c.styles.italic) text = <em key={i}>{text}</em>;
        if (c.styles.underline) text = <u key={i}>{text}</u>;
        if (c.styles.strike) text = <s key={i}>{text}</s>;
        if (c.styles.code)
          text = (
            <code key={i} className="bg-muted rounded-md px-1.5 py-0.5 font-mono text-sm">
              {text}
            </code>
          );
        if (c.styles.textColor)
          text = (
            <span style={{ color: c.styles.textColor }} key={i}>
              {text}
            </span>
          );
        if (c.styles.backgroundColor)
          text = (
            <span style={{ backgroundColor: c.styles.backgroundColor }} key={i}>
              {text}
            </span>
          );
      }
      return <React.Fragment key={i}>{text}</React.Fragment>;
    } else if (c.type === "link") {
      return (
        <a key={i} href={c.href} target="_blank" rel="noopener noreferrer">
          {renderInlineContent(c.content)}
        </a>
      );
    }
    return null;
  });
}

function renderStandardBlocks(blocks: any[]): React.ReactNode {
  const elements: React.ReactNode[] = [];
  let listGroup: any[] = [];
  let listType = "";

  const flushList = () => {
    if (listGroup.length > 0) {
      if (listType === "bulletListItem") {
        elements.push(
          <ul key={`ul-${elements.length}`} className="my-4 list-disc pl-5">
            {listGroup.map(({ block, idx }, i) => (
              <React.Fragment key={block.id || `frag-${idx}-${i}`}>
                {renderBlock(block, idx)}
              </React.Fragment>
            ))}
          </ul>
        );
      } else if (listType === "numberedListItem") {
        elements.push(
          <ol key={`ol-${elements.length}`} className="my-4 list-decimal pl-5">
            {listGroup.map(({ block, idx }, i) => (
              <React.Fragment key={block.id || `frag-${idx}-${i}`}>
                {renderBlock(block, idx)}
              </React.Fragment>
            ))}
          </ol>
        );
      }
      listGroup = [];
      listType = "";
    }
  };

  const renderBlock = (block: any, blockIndex: string | number): React.ReactNode => {
    const inline = renderInlineContent(block.content);
    const children =
      block.children && block.children.length > 0 ? renderStandardBlocks(block.children) : null;
    const key = block.id || `block-${blockIndex}`;

    switch (block.type) {
      case "paragraph":
        return (
          <p
            key={key}
            className={
              block.props?.textAlignment === "center"
                ? "text-center"
                : block.props?.textAlignment === "right"
                  ? "text-right"
                  : "my-4"
            }
          >
            {inline}
            {children}
          </p>
        );
      case "heading": {
        const level = block.props?.level || 2;
        const HeadingTag = `h${level}` as React.ElementType;
        let rawText = "";
        if (Array.isArray(block.content)) {
          block.content.forEach((c: any) => {
            if (c.type === "text") rawText += c.text;
          });
        }
        const id = rawText
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
        return (
          <HeadingTag
            key={key}
            id={id || undefined}
            className={
              block.props?.textAlignment === "center"
                ? "text-center"
                : block.props?.textAlignment === "right"
                  ? "text-right"
                  : "my-4 font-semibold"
            }
          >
            {inline}
            {children}
          </HeadingTag>
        );
      }
      case "bulletListItem":
      case "numberedListItem":
        return (
          <li
            key={key}
            className={
              block.props?.textAlignment === "center"
                ? "text-center"
                : block.props?.textAlignment === "right"
                  ? "text-right"
                  : "my-1"
            }
          >
            {inline}
            {children}
          </li>
        );
      case "image":
        return (
          <figure
            key={key}
            className="bg-muted/30 border-border not-prose relative my-8 w-full overflow-hidden rounded-xl border shadow-xs aspect-video"
          >
            {}
            <img
              src={block.props?.url}
              alt={block.props?.caption || ""}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-contain"
            />
            {block.props?.caption && (
              <figcaption className="text-foreground bg-background/80 absolute right-0 bottom-4 left-0 p-2 text-center text-sm italic">
                {block.props.caption}
              </figcaption>
            )}
          </figure>
        );
      default:
        return (
          <div key={key}>
            {inline}
            {children}
          </div>
        );
    }
  };

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    if (block.type === "bulletListItem" || block.type === "numberedListItem") {
      if (listType !== block.type) {
        flushList();
        listType = block.type;
      }
      listGroup.push({ block, idx: i });
    } else {
      flushList();
      elements.push(renderBlock(block, i));
    }
  }
  flushList();

  return <>{elements}</>;
}

export async function ContentRenderer({
  content,
  variant,
  className,
  legacyContent,
}: ContentRendererProps) {
  let blocks: any[] = [];
  if (
    content &&
    typeof content === "object" &&
    "blocks" in content &&
    Array.isArray(content.blocks)
  ) {
    blocks = content.blocks;
  } else if (Array.isArray(content)) {
    blocks = content;
  }

  if (blocks.length > 0) {
    const renderedElements: React.ReactNode[] = [];
    const currentGroup: any[] = [];

    const flushGroup = () => {
      if (currentGroup.length > 0) {
        renderedElements.push(
          <div key={`group-${renderedElements.length}`}>{renderStandardBlocks(currentGroup)}</div>
        );
        currentGroup.length = 0;
      }
    };

    for (const block of blocks) {
      const customRenderers: Record<string, React.ElementType> = {
        takeaways: TakeawaysRenderer,
        faq: FaqRenderer,
        cta: InlineCtaRenderer,
        customImage: CustomImageRenderer,
        callout: CalloutRenderer,
        quoteHighlight: QuoteHighlightRenderer,
        processTimeline: ProcessTimelineRenderer,
        metricGrid: MetricGridRenderer,
        imageCaption: ImageCaptionRenderer,
        featureGrid: FeatureGridRenderer,
        comparisonTable: ComparisonTableRenderer,
        twoColumn: TwoColumnRenderer,
        videoEmbed: VideoEmbedRenderer,
        customVideo: CustomVideoRenderer,
        customAudio: CustomAudioRenderer,
        customFile: CustomFileRenderer,
      };

      if (customRenderers[block.type]) {
        flushGroup();
        const RendererComponent = customRenderers[block.type];
        renderedElements.push(
          <RendererComponent
            key={block.id || `${block.type}-${renderedElements.length}`}
            block={block}
          />
        );
      } else {
        currentGroup.push(block);
      }
    }
    flushGroup();

    return (
      <div
        className={`prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert prose-headings:font-semibold prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary marker:text-muted-foreground mx-auto w-full max-w-none ${className || ""}`}
      >
        {renderedElements}
      </div>
    );
  }

  if (legacyContent) {
    return (
      <div
        className={`prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert prose-headings:font-semibold prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary marker:text-muted-foreground mx-auto w-full max-w-none ${className || ""}`}
        dangerouslySetInnerHTML={{ __html: legacyContent }}
      />
    );
  }

  return null;
}
