"use client";
import { createReactBlockSpec } from "@blocknote/react";
import { ListOrdered, Trash2, Plus, X } from "lucide-react";
import I18n from "@/shared/components/I18n";

export const ProcessTimelineBlock = createReactBlockSpec(
  {
    type: "processTimeline",
    propSchema: {
      stepsJson: {
        default: "[]",
      },
    },
    content: "none",
  },
  {
    render: (props) => {
      const steps: Array<{ title: string; description: string }> = (() => {
        try {
          return JSON.parse(props.block.props.stepsJson);
        } catch {
          return [];
        }
      })();

      const updateSteps = (newSteps: typeof steps) => {
        props.editor.updateBlock(props.block, {
          type: "processTimeline",
          props: { stepsJson: JSON.stringify(newSteps) },
        });
      };

      const addStep = () => {
        updateSteps([...steps, { title: "", description: "" }]);
      };

      const removeStep = (index: number) => {
        updateSteps(steps.filter((_, i) => i !== index));
      };

      const updateStep = (index: number, key: "title" | "description", value: string) => {
        const newSteps = [...steps];
        newSteps[index] = { ...newSteps[index], [key]: value };
        updateSteps(newSteps);
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
            <ListOrdered className="h-5 w-5" />
            <span className="text-sm font-semibold">
              <I18n>Process Timeline</I18n>
            </span>
          </div>

          <div className="space-y-4">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="group/step bg-background/50 border-border hover:border-border hover:bg-background relative flex gap-4 rounded-none sm:rounded-xl border p-4 transition-all duration-300 md:gap-5 md:p-6"
              >
                <div className="bg-primary/10 text-primary border-primary/20 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-sm font-bold">
                  {idx + 1}
                </div>
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={step.title}
                    onChange={(e) => updateStep(idx, "title", e.target.value)}
                    className="focus:border-border placeholder:text-muted-foreground/50 w-full border-b border-transparent bg-transparent pb-1 text-lg font-bold tracking-tight outline-hidden transition-colors"
                    placeholder="Step Title"
                  />
                  <textarea
                    value={step.description}
                    onChange={(e) => updateStep(idx, "description", e.target.value)}
                    className="text-muted-foreground focus:border-border placeholder:text-muted-foreground/40 min-h-[60px] w-full resize-none border-b border-transparent bg-transparent text-sm outline-hidden transition-colors"
                    placeholder="Step Description..."
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeStep(idx)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90 absolute -top-2 -right-2 cursor-pointer rounded-full p-1.5 opacity-0 shadow-md transition-all group-hover/step:opacity-100"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addStep}
              className="border-border text-muted-foreground hover:bg-muted/30 hover:text-foreground hover:border-border flex w-full cursor-pointer items-center justify-center gap-2 rounded-none sm:rounded-xl border border-dashed bg-transparent p-4 text-sm font-medium transition-all"
            >
              <Plus className="h-4 w-4" /> <I18n>Add Step</I18n>
            </button>
          </div>
        </div>
      );
    },
  }
)();
