"use client";
import { createReactBlockSpec } from "@blocknote/react";
import { Columns, Trash2 } from "lucide-react";
import I18n from "@/shared/components/I18n";

export const TwoColumnBlock = createReactBlockSpec(
  {
    type: "twoColumn",
    propSchema: {
      leftHeading: { default: "Left Column" },
      leftContent: { default: "" },
      rightHeading: { default: "Right Column" },
      rightContent: { default: "" },
    },
    content: "none",
  },
  {
    render: (props) => {
      const updateProp = (key: string, value: string) => {
        props.editor.updateBlock(props.block, {
          type: "twoColumn",
          props: { [key]: value },
        });
      };

      return (
        <div
          onMouseDown={(e) => e.stopPropagation()}
          className="group border-border bg-card relative my-8 w-full rounded-xl border p-6 shadow-xs transition-all duration-300 hover:shadow-md 3xl:my-10 5xl:my-12 3xl:p-8 5xl:p-10 md:p-8"
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

          <div className="border-border text-muted-foreground mb-8 flex items-center gap-2 border-b pb-3">
            <Columns className="h-5 w-5" />
            <span className="text-sm font-semibold">
              <I18n>Two-Column Layout</I18n>
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-2 3xl:gap-8 5xl:gap-10">
            <div className="bg-background/50 border-border hover:border-border flex flex-col gap-3 rounded-none sm:rounded-xl border p-6 transition-all">
              <input
                type="text"
                value={props.block.props.leftHeading}
                onChange={(e) => updateProp("leftHeading", e.target.value)}
                className="focus:border-border placeholder:text-muted-foreground/50 w-full border-b border-transparent bg-transparent pb-1 text-xl font-bold tracking-tight outline-hidden transition-colors"
                placeholder="Left Heading"
              />
              <textarea
                value={props.block.props.leftContent}
                onChange={(e) => updateProp("leftContent", e.target.value)}
                className="text-muted-foreground focus:border-border placeholder:text-muted-foreground/40 min-h-[140px] w-full resize-none border-b border-transparent bg-transparent text-sm outline-hidden transition-colors"
                placeholder="Enter content for the left column..."
              />
            </div>

            <div className="bg-background/50 border-border hover:border-border flex flex-col gap-3 rounded-none sm:rounded-xl border p-6 transition-all">
              <input
                type="text"
                value={props.block.props.rightHeading}
                onChange={(e) => updateProp("rightHeading", e.target.value)}
                className="focus:border-border placeholder:text-muted-foreground/50 w-full border-b border-transparent bg-transparent pb-1 text-xl font-bold tracking-tight outline-hidden transition-colors"
                placeholder="Right Heading"
              />
              <textarea
                value={props.block.props.rightContent}
                onChange={(e) => updateProp("rightContent", e.target.value)}
                className="text-muted-foreground focus:border-border placeholder:text-muted-foreground/40 min-h-[140px] w-full resize-none border-b border-transparent bg-transparent text-sm outline-hidden transition-colors"
                placeholder="Enter content for the right column..."
              />
            </div>
          </div>
        </div>
      );
    },
  }
)();
