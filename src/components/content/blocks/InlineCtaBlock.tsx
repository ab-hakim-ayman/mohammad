"use client";
import { createReactBlockSpec } from "@blocknote/react";
import { Trash2, Image as ImageIcon } from "lucide-react";
import { MediaUploader } from "@/components/media/MediaUploader";
import { isValidUrl } from "@/lib/content/content-utils";
import I18n from "@/shared/components/I18n";

export const InlineCtaBlock = createReactBlockSpec(
  {
    type: "cta",
    propSchema: {
      title: {
        default: "Ready to Start Your Project?",
      },
      description: {
        default: "",
      },
      buttonText: {
        default: "Contact Us",
      },
      buttonUrl: {
        default: "/contact",
      },
      imageUrl: {
        default: "",
      },
    },
    content: "none",
  },
  {
    render: (props) => {
      const updateProp = (key: string, value: string) => {
        props.editor.updateBlock(props.block, {
          type: "cta",
          props: { [key]: value },
        });
      };

      return (
        <div
          onMouseDown={(e) => e.stopPropagation()}
          className="border-primary/20 bg-primary/5 group hover:border-primary/40 relative my-8 w-full rounded-xl border p-6 shadow-xs transition-all duration-300 hover:shadow-md 3xl:my-10 5xl:my-12 3xl:p-8 5xl:p-10 md:p-8"
        >
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Are you sure you want to delete this block?")) {
                props.editor.removeBlocks([props.block]);
                props.editor.focus();
              }
            }}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 absolute top-4 right-4 cursor-pointer rounded-md p-1.5 opacity-0 transition-all group-hover:opacity-100"
            title="Delete Block"
          >
            <Trash2 className="h-5 w-5" />
          </button>

          <div className="flex flex-col gap-6 md:flex-row">
            <div className="flex-1 space-y-4">
              <div>
                <label className="text-muted-foreground mb-1 block text-xs font-semibold">
                  <I18n>Title</I18n>
                </label>
                <input
                  type="text"
                  value={props.block.props.title}
                  onChange={(e) => updateProp("title", e.target.value)}
                  className="text-foreground placeholder:text-muted-foreground/50 focus:border-primary/30 w-full border-b border-transparent bg-transparent pb-1 text-2xl font-bold tracking-tight outline-hidden transition-colors"
                  placeholder="CTA Title"
                />
              </div>

              <div>
                <label className="text-muted-foreground mb-1 block text-xs font-semibold">
                  <I18n>Description</I18n>
                </label>
                <textarea
                  value={props.block.props.description}
                  onChange={(e) => updateProp("description", e.target.value)}
                  className="text-muted-foreground placeholder:text-muted-foreground/50 focus:border-primary/30 min-h-[80px] w-full resize-none border-b border-transparent bg-transparent text-base outline-hidden transition-colors"
                  placeholder="Describe your CTA..."
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-muted-foreground mb-1 block text-xs font-semibold">
                    <I18n>Button Text</I18n>
                  </label>
                  <input
                    type="text"
                    value={props.block.props.buttonText}
                    onChange={(e) => updateProp("buttonText", e.target.value)}
                    className="border-border bg-background/50 focus:border-primary/50 focus:ring-primary/20 w-full rounded-lg border px-4 py-3 text-sm outline-hidden transition-all focus:ring-1"
                    placeholder="Button text"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-muted-foreground mb-1 block text-xs font-semibold">
                    <I18n>Button URL</I18n>
                  </label>
                  <input
                    type="text"
                    value={props.block.props.buttonUrl}
                    onChange={(e) => updateProp("buttonUrl", e.target.value)}
                     className={`bg-background/50 focus:border-primary/50 focus:ring-primary/20 w-full rounded-lg border px-4 py-3 text-sm outline-hidden transition-all focus:ring-1 ${
                      props.block.props.buttonUrl && !isValidUrl(props.block.props.buttonUrl)
                        ? "border-destructive text-destructive"
                        : "border-border"
                    }`}
                    placeholder="/contact"
                  />
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/3">
              <label className="text-muted-foreground mb-1 block text-xs font-semibold">
                <I18n>Image (Optional)</I18n>
              </label>
              <div className="mt-1" onMouseDown={(e) => e.stopPropagation()}>
                <MediaUploader
                  label=""
                  value={props.block.props.imageUrl || null}
                  onChange={(val) => updateProp("imageUrl", typeof val === "string" ? val : "")}
                  folder="a2icoders/blogs/cta"
                />
              </div>
            </div>
          </div>
        </div>
      );
    },
  }
)();
