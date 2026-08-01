"use client";
import { createReactBlockSpec } from "@blocknote/react";
import { Video, Trash2 } from "lucide-react";
import { Select } from "@/shared/components";
import I18n from "@/shared/components/I18n";

export const VideoEmbedBlock = createReactBlockSpec(
  {
    type: "videoEmbed",
    propSchema: {
      provider: {
        default: "youtube",
        values: ["youtube", "vimeo"],
      },
      url: {
        default: "",
      },
      title: {
        default: "Video Embed",
      },
    },
    content: "none",
  },
  {
    render: (props) => {
      const updateProp = (key: string, value: string) => {
        props.editor.updateBlock(props.block, {
          type: "videoEmbed",
          props: { [key]: value },
        });
      };

      return (
        <div
          onMouseDown={(e) => e.stopPropagation()}
          className="group border-border bg-card relative my-8 flex w-full flex-col rounded-xl border p-6 shadow-xs transition-all duration-300 hover:shadow-md 3xl:my-10 5xl:my-12 3xl:p-8 5xl:p-10 md:p-8"
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
            <Trash2 className="h-4 w-4" />
          </button>

          <div className="text-muted-foreground border-border mb-6 flex items-center gap-2 border-b pb-3">
            <Video className="h-5 w-5" />
            <span className="text-sm font-semibold">
              <I18n>Video Embed</I18n>
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex gap-4">
              <div className="w-1/3">
                <label className="text-muted-foreground mb-1 block text-xs font-semibold">
                  <I18n>Provider</I18n>
                </label>
                <Select
                  value={props.block.props.provider}
                  onValueChange={(val) => updateProp("provider", val || "youtube")}
                  options={[
                    { label: "YouTube", value: "youtube" },
                    { label: "Vimeo", value: "vimeo" },
                  ]}
                />
              </div>
              <div className="flex-1">
                <label className="text-muted-foreground mb-1 block text-xs font-semibold">
                  <I18n>Video ID or URL</I18n>
                </label>
                <input
                  type="text"
                  value={props.block.props.url}
                  onChange={(e) => updateProp("url", e.target.value)}
                  className="bg-background/50 border-border focus:border-primary/50 focus:ring-primary/20 w-full rounded-xl border px-4 py-3 text-sm outline-hidden transition-all focus:ring-1"
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
            </div>
            <div>
              <label className="text-muted-foreground mb-1 block text-xs font-semibold">
                <I18n>Video Title (for accessibility)</I18n>
              </label>
              <input
                type="text"
                value={props.block.props.title}
                onChange={(e) => updateProp("title", e.target.value)}
                className="bg-background/50 border-border focus:border-primary/50 focus:ring-primary/20 w-full rounded-xl border px-4 py-3 text-sm outline-hidden transition-all focus:ring-1"
                placeholder="Descriptive title"
              />
            </div>
          </div>
        </div>
      );
    },
  }
)();
