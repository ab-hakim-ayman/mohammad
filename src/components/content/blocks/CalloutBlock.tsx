"use client";
import { createReactBlockSpec } from "@blocknote/react";
import { Info, AlertTriangle, CheckCircle, Trash2 } from "lucide-react";
import { Select } from "@/shared/components";

export const CalloutBlock = createReactBlockSpec(
  {
    type: "callout",
    propSchema: {
      type: {
        default: "info",
        values: ["info", "warning", "success"],
      },
      title: {
        default: "Important Note",
      },
      text: {
        default: "",
      },
    },
    content: "none",
  },
  {
    render: (props) => {
      const updateProp = (key: string, value: string) => {
        props.editor.updateBlock(props.block, {
          type: "callout",
          props: { [key]: value },
        });
      };

      const type = props.block.props.type as "info" | "warning" | "success";

      const styles = {
        info: "bg-info-subtle border-info/20 text-info ",
        warning: "bg-warning/10 border-warning/20 text-warning",
        success: "bg-success/10 border-success/20 text-success",
      };

      const Icon = type === "info" ? Info : type === "warning" ? AlertTriangle : CheckCircle;

      return (
        <div
          onMouseDown={(e) => e.stopPropagation()}
          className={`group relative my-8 flex w-full gap-4 rounded-xl border p-6 shadow-xs transition-all duration-300 hover:shadow-md 3xl:my-10 5xl:my-12 3xl:p-6 5xl:p-8 ${styles[type]}`}
        >
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Are you sure you want to delete this block?")) {
                props.editor.removeBlocks([props.block]);
                props.editor.focus();
              }
            }}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 absolute top-3 right-3 cursor-pointer rounded-md p-1.5 opacity-0 transition-all group-hover:opacity-100"
            title="Delete Block"
          >
            <Trash2 className="h-4 w-4" />
          </button>

          <Icon className="mt-1 h-5 w-5 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="flex gap-2">
              <Select
                value={type}
                onValueChange={(val) => updateProp("type", val || "info")}
                options={[
                  { label: "Info", value: "info" },
                  { label: "Warning", value: "warning" },
                  { label: "Success", value: "success" },
                ]}
              />
              <input
                type="text"
                value={props.block.props.title}
                onChange={(e) => updateProp("title", e.target.value)}
                className="flex-1 border-b border-transparent bg-transparent font-semibold outline-hidden transition-colors placeholder:text-current/50 focus:border-current/50"
                placeholder="Callout Title"
              />
            </div>
            <textarea
              value={props.block.props.text}
              onChange={(e) => updateProp("text", e.target.value)}
              className="min-h-[40px] w-full resize-none border-b border-transparent bg-transparent text-sm outline-hidden transition-colors placeholder:text-current/50 focus:border-current/50"
              placeholder="Enter callout text..."
            />
          </div>
        </div>
      );
    },
  }
)();
