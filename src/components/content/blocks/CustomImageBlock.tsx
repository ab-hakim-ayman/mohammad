"use client";
import { createReactBlockSpec } from "@blocknote/react";
import { useState, useRef } from "react";
import { Image as ImageIcon, UploadCloud, Trash2, Edit3, Check } from "lucide-react";
import { MediaUploader } from "@/components/media/MediaUploader";
import Image from "next/image";
import I18n from "@/shared/components/I18n";

export const CustomImageBlock = createReactBlockSpec(
  {
    type: "customImage",
    propSchema: {
      url: { default: "" },
      alt: { default: "" },
      caption: { default: "" },
    },
    content: "none",
  },
  {
    render: (props) => {
      const [showToolbar, setShowToolbar] = useState(false);

      const [isEditingMeta, setIsEditingMeta] = useState(false);

      const updateProp = (key: string, value: string) => {
        props.editor.updateBlock(props.block, {
          type: "customImage",
          props: { [key]: value },
        });
      };

      if (!props.block.props.url) {
        return (
          <div className="my-4 w-full" onMouseDown={(e) => e.stopPropagation()}>
            <MediaUploader
              label="Block Image"
              value={null}
              onChange={(val) => {
                if (typeof val === "string" && val) {
                  updateProp("url", val);
                }
              }}
              folder="a2icoders/blogs/images"
              helperText="Upload a new image or choose from your media library"
            />
          </div>
        );
      }

      return (
        <div
          className="group not-prose relative my-8 flex w-full flex-col items-center transition-all duration-300"
          onMouseDown={(e) => e.stopPropagation()}
          onMouseEnter={() => setShowToolbar(true)}
          onMouseLeave={() => {
            setShowToolbar(false);
            setIsEditingMeta(false);
          }}
        >
          {}
          <img
            src={props.block.props.url}
            alt={props.block.props.alt || ""}
            className="bg-muted border-border max-h-[700px] w-full rounded-xl border object-contain shadow-xs transition-all duration-300 group-hover:shadow-md"
          />

          {props.block.props.caption && !isEditingMeta && (
            <p className="text-muted-foreground mt-3 text-center text-sm italic">
              {props.block.props.caption}
            </p>
          )}

          {}
          <div
            className={`absolute top-4 right-4 z-10 flex flex-col gap-2 transition-all duration-200 ${showToolbar ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"}`}
          >
            <div className="bg-background/90 border-border flex items-center gap-1 rounded-none sm:rounded-lg border p-1.5 shadow-lg backdrop-blur-md">
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Are you sure you want to replace this image?")) {
                    updateProp("url", "");
                  }
                }}
                className="text-muted-foreground hover:text-foreground hover:bg-muted/50 cursor-pointer rounded-md p-1.5 transition-colors"
                title="Replace Image"
              >
                <UploadCloud className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsEditingMeta(!isEditingMeta)}
                className={`cursor-pointer rounded-md p-1.5 transition-colors ${isEditingMeta ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}
                title="Edit Alt & Caption"
              >
                <Edit3 className="h-4 w-4" />
              </button>

              <div className="bg-border mx-1 h-5 w-px" />

              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Are you sure you want to remove this image?")) {
                    props.editor.removeBlocks([props.block]);
                    props.editor.focus();
                  }
                }}
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer rounded-md p-1.5 transition-colors"
                title="Delete Image"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            {}
            {isEditingMeta && (
              <div           className="bg-background/90 border-border flex w-80 flex-col gap-4 rounded-none sm:rounded-lg border p-6 shadow-xl backdrop-blur-md">
                <div>
                  <label className="text-muted-foreground mb-1 block text-xs font-semibold">
                    <I18n>Alt Text (SEO)</I18n>
                  </label>
                  <input
                    type="text"
                    value={props.block.props.alt}
                    onChange={(e) => updateProp("alt", e.target.value)}
                    className="border-border bg-background/50 focus:border-primary/50 focus:ring-primary/20 w-full rounded-lg border px-4 py-3 text-sm outline-hidden transition-all focus:ring-1"
                    placeholder="Describe the image..."
                  />
                </div>
                <div>
                  <label className="text-muted-foreground mb-1 block text-xs font-semibold">
                    <I18n>Caption</I18n>
                  </label>
                  <textarea
                    value={props.block.props.caption}
                    onChange={(e) => updateProp("caption", e.target.value)}
                    className="border-border bg-background/50 focus:border-primary/50 focus:ring-primary/20 min-h-[80px] w-full resize-none rounded-lg border px-4 py-3 text-sm outline-hidden transition-all focus:ring-1"
                    placeholder="Visible caption below image..."
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsEditingMeta(false)}
                    className="bg-primary text-on-primary hover:bg-primary/90 inline-flex cursor-pointer items-center gap-1 rounded-md px-3 py-2 text-xs font-medium transition-colors"
                  >
                    <Check className="h-3 w-3" /> <I18n>Done</I18n>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    },
  }
)();
