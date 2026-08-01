"use client";
import { createReactBlockSpec } from "@blocknote/react";
import { Music, UploadCloud, Trash2 } from "lucide-react";
import { MediaUploader } from "@/components/media/MediaUploader";
import I18n from "@/shared/components/I18n";

export const CustomAudioBlock = createReactBlockSpec(
  {
    type: "customAudio",
    propSchema: {
      url: { default: "" },
    },
    content: "none",
  },
  {
    render: (props) => {
      const updateProp = (key: string, value: string) => {
        props.editor.updateBlock(props.block, {
          type: "customAudio",
          props: { [key]: value },
        });
      };

      if (!props.block.props.url) {
        return (
          <div className="my-4 w-full" onMouseDown={(e) => e.stopPropagation()}>
            <MediaUploader
              label="Block Audio"
              value={null}
              accept="audio/*"
              onChange={(val) => {
                if (typeof val === "string" && val) {
                  updateProp("url", val);
                }
              }}
              folder="a2icoders/blogs/audio"
              helperText="Upload a new audio file or choose from your media library"
            />
          </div>
        );
      }

      return (
        <div
          onMouseDown={(e) => e.stopPropagation()}
          className="group bg-card border-border not-prose relative my-8 flex w-full flex-col items-center rounded-xl border p-6 shadow-xs transition-all duration-300 hover:shadow-md 3xl:my-10 5xl:my-12 3xl:p-8 5xl:p-10 md:p-8"
        >
          <div className="text-foreground mb-4 flex w-full items-center gap-2">
            <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
              <Music className="text-primary h-5 w-5" />
            </div>
            <span className="truncate text-sm font-semibold">
              <I18n>Audio Player</I18n>
            </span>
          </div>

          <audio src={props.block.props.url} controls className="h-12 w-full" />

          {}
          <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 transition-all duration-200 group-hover:opacity-100">
            <div className="bg-background/90 border-border flex items-center gap-1 rounded-none sm:rounded-lg border p-1.5 shadow-md backdrop-blur-md">
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Are you sure you want to replace this audio?")) {
                    updateProp("url", "");
                  }
                }}
                className="text-muted-foreground hover:text-foreground hover:bg-muted/50 cursor-pointer rounded-md p-1.5 transition-colors"
                title="Replace Audio"
              >
                <UploadCloud className="h-4 w-4" />
              </button>

              <div className="bg-border mx-0.5 h-4 w-px" />

              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Are you sure you want to remove this audio block?")) {
                    props.editor.removeBlocks([props.block]);
                    props.editor.focus();
                  }
                }}
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer rounded-md p-1.5 transition-colors"
                title="Delete Audio"
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
