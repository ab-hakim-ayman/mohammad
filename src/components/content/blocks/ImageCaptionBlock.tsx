"use client";
import { createReactBlockSpec } from "@blocknote/react";
import { ImageIcon, Trash2, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { MediaUploader } from "@/components/media/MediaUploader";
import I18n from "@/shared/components/I18n";

export const ImageCaptionBlock = createReactBlockSpec(
  {
    type: "imageCaption",
    propSchema: {
      imageUrl: {
        default: "",
      },
      alt: {
        default: "",
      },
      caption: {
        default: "",
      },
      alignment: {
        default: "center",
        values: ["left", "center", "right"],
      },
    },
    content: "none",
  },
  {
    render: (props) => {
      const updateProp = (key: string, value: string) => {
        props.editor.updateBlock(props.block, {
          type: "imageCaption",
          props: { [key]: value },
        });
      };

      const alignClasses = {
        left: "mr-auto text-left",
        center: "mx-auto text-center",
        right: "ml-auto text-right",
      };

      return (
        <div
          onMouseDown={(e) => e.stopPropagation()}
          className="group border-border bg-card relative my-8 w-full rounded-xl border p-6 shadow-xs transition-all duration-300 hover:shadow-md md:p-6"
        >
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Are you sure you want to delete this block?")) {
                props.editor.removeBlocks([props.block]);
                props.editor.focus();
              }
            }}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 absolute top-4 right-4 z-10 cursor-pointer rounded-md p-1.5 opacity-0 transition-all group-hover:opacity-100"
            title="Delete Block"
          >
            <Trash2 className="h-5 w-5" />
          </button>

          <div className="border-border text-muted-foreground mb-6 flex items-center justify-between gap-2 border-b pb-3">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              <span className="text-sm font-semibold">
                <I18n>Image with Caption</I18n>
              </span>
            </div>
            <div className="bg-muted/50 border-border flex items-center gap-1 rounded-none sm:rounded-lg border p-1">
              <button
                type="button"
                onClick={() => updateProp("alignment", "left")}
                className={`cursor-pointer rounded-md p-1.5 transition-all ${props.block.props.alignment === "left" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}
              >
                <AlignLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => updateProp("alignment", "center")}
                className={`cursor-pointer rounded-md p-1.5 transition-all ${props.block.props.alignment === "center" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}
              >
                <AlignCenter className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => updateProp("alignment", "right")}
                className={`cursor-pointer rounded-md p-1.5 transition-all ${props.block.props.alignment === "right" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}
              >
                <AlignRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div
            className={`flex flex-col gap-3 sm:max-w-3xl ${alignClasses[props.block.props.alignment as keyof typeof alignClasses]}`}
          >
            <div className="w-full" onMouseDown={(e) => e.stopPropagation()}>
              <MediaUploader
                label=""
                value={props.block.props.imageUrl || null}
                onChange={(val) => updateProp("imageUrl", typeof val === "string" ? val : "")}
                folder="a2icoders/content/images"
              />
            </div>

            {props.block.props.imageUrl && (
              <div className="mt-2 space-y-2">
                <input
                  type="text"
                  value={props.block.props.caption}
                  onChange={(e) => updateProp("caption", e.target.value)}
                  className={`text-foreground focus:border-border placeholder:text-muted-foreground/40 w-full border-b border-transparent bg-transparent text-sm font-medium outline-hidden transition-colors ${props.block.props.alignment === "center" ? "text-center" : props.block.props.alignment === "right" ? "text-right" : "text-left"}`}
                  placeholder="Write a caption (optional)..."
                />
                <input
                  type="text"
                  value={props.block.props.alt}
                  onChange={(e) => updateProp("alt", e.target.value)}
                  className={`text-muted-foreground focus:border-border placeholder:text-muted-foreground/30 w-full border-b border-transparent bg-transparent text-xs outline-hidden transition-colors ${props.block.props.alignment === "center" ? "text-center" : props.block.props.alignment === "right" ? "text-right" : "text-left"}`}
                  placeholder="Alt text for screen readers..."
                />
              </div>
            )}
          </div>
        </div>
      );
    },
  }
)();
