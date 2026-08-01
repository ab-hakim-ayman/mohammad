"use client";
import { createReactBlockSpec } from "@blocknote/react";
import { Video, UploadCloud, Trash2 } from "lucide-react";
import { MediaUploader } from "@/components/media/MediaUploader";

export const CustomVideoBlock = createReactBlockSpec(
  {
    type: "customVideo",
    propSchema: {
      url: { default: "" },
    },
    content: "none",
  },
  {
    render: (props) => {
      const updateProp = (key: string, value: string) => {
        props.editor.updateBlock(props.block, {
          type: "customVideo",
          props: { [key]: value },
        });
      };

      if (!props.block.props.url) {
        return (
          <div className="my-4 w-full" onMouseDown={(e) => e.stopPropagation()}>
            <MediaUploader
              label="Block Video"
              value={null}
              accept="video/*"
              onChange={(val) => {
                if (typeof val === "string" && val) {
                  updateProp("url", val);
                }
              }}
              folder="a2icoders/blogs/videos"
              helperText="Upload a new video or choose from your media library"
            />
          </div>
        );
      }

      return (
        <div
          onMouseDown={(e) => e.stopPropagation()}
          className="group not-prose relative my-8 flex w-full flex-col items-center transition-all duration-300"
        >
          <video
            src={props.block.props.url}
            controls
            className="border-border bg-muted max-h-[500px] w-full rounded-lg border shadow-xs"
          />

          {}
          <div className="absolute top-4 right-4 z-10 flex -translate-y-2 flex-col gap-2 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
            <div className="bg-background/90 border-border flex items-center gap-1 rounded-none sm:rounded-lg border p-1.5 shadow-lg backdrop-blur-md">
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Are you sure you want to replace this video?")) {
                    updateProp("url", "");
                  }
                }}
                className="text-muted-foreground hover:text-foreground hover:bg-muted/50 cursor-pointer rounded-md p-1.5 transition-colors"
                title="Replace Video"
              >
                <UploadCloud className="h-4 w-4" />
              </button>

              <div className="bg-border mx-1 h-5 w-px" />

              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Are you sure you want to remove this video?")) {
                    props.editor.removeBlocks([props.block]);
                    props.editor.focus();
                  }
                }}
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer rounded-md p-1.5 transition-colors"
                title="Delete Video"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      );
    },
  }
)();
