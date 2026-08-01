"use client";
import { createReactBlockSpec } from "@blocknote/react";
import { Quote, Trash2 } from "lucide-react";

export const QuoteHighlightBlock = createReactBlockSpec(
  {
    type: "quoteHighlight",
    propSchema: {
      quote: {
        default: "",
      },
      author: {
        default: "",
      },
      role: {
        default: "",
      },
    },
    content: "none",
  },
  {
    render: (props) => {
      const updateProp = (key: string, value: string) => {
        props.editor.updateBlock(props.block, {
          type: "quoteHighlight",
          props: { [key]: value },
        });
      };

      return (
        <div
          onMouseDown={(e) => e.stopPropagation()}
          className="group border-border bg-card relative my-8 flex w-full flex-col items-center rounded-xl border p-10 text-center shadow-xs transition-all duration-300 hover:shadow-md 3xl:my-12 5xl:my-16 3xl:p-12 5xl:p-16 md:p-12"
        >
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Are you sure you want to delete this block?")) {
                props.editor.removeBlocks([props.block]);
                props.editor.focus();
              }
            }}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 absolute top-6 right-6 z-10 cursor-pointer rounded-md p-1.5 opacity-0 transition-all group-hover:opacity-100"
            title="Delete Block"
          >
            <Trash2 className="h-5 w-5" />
          </button>

          <Quote className="text-primary/30 mb-6 h-10 w-10" />

          <textarea
            value={props.block.props.quote}
            onChange={(e) => updateProp("quote", e.target.value)}
            className="text-foreground focus:border-border placeholder:text-muted-foreground/30 mb-8 min-h-[100px] w-full max-w-4xl resize-none border-b border-transparent bg-transparent text-center text-2xl font-bold tracking-tight outline-hidden transition-colors md:text-3xl"
            placeholder="Enter an impactful quote here..."
          />

          <div className="flex flex-col items-center gap-1">
            <input
              type="text"
              value={props.block.props.author}
              onChange={(e) => updateProp("author", e.target.value)}
              className="text-foreground focus:border-border placeholder:text-muted-foreground/40 border-b border-transparent bg-transparent pb-1 text-center text-lg font-semibold outline-hidden transition-colors"
              placeholder="Author Name"
            />
            <input
              type="text"
              value={props.block.props.role}
              onChange={(e) => updateProp("role", e.target.value)}
              className="text-muted-foreground focus:border-border placeholder:text-muted-foreground/40 border-b border-transparent bg-transparent text-center text-sm font-medium outline-hidden transition-colors"
              placeholder="Author Role / Company"
            />
          </div>
        </div>
      );
    },
  }
)();
