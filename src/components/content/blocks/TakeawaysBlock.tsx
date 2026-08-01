"use client";
import { createReactBlockSpec } from "@blocknote/react";
import { parseTakeaways, stringifyItems } from "@/lib/content/content-utils";
import { Trash2, Plus, GripVertical } from "lucide-react";
import I18n from "@/shared/components/I18n";

export const TakeawaysBlock = createReactBlockSpec(
  {
    type: "takeaways",
    propSchema: {
      title: {
        default: "Key Takeaways",
      },
      itemsJson: {
        default: "[]",
      },
    },
    content: "none",
  },
  {
    render: (props) => {
      const items = parseTakeaways(props.block.props.itemsJson);

      const updateItems = (newItems: string[]) => {
        props.editor.updateBlock(props.block, {
          type: "takeaways",
          props: { itemsJson: stringifyItems(newItems) },
        });
      };

      const handleAdd = () => {
        updateItems([...items, ""]);
      };

      const handleRemove = (index: number) => {
        updateItems(items.filter((_, i) => i !== index));
      };

      const handleChange = (index: number, value: string) => {
        const newItems = [...items];
        newItems[index] = value;
        updateItems(newItems);
      };

      const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.editor.updateBlock(props.block, {
          type: "takeaways",
          props: { title: e.target.value },
        });
      };

      return (
        <div
          onMouseDown={(e) => e.stopPropagation()}
          className="border-border bg-card my-8 w-full rounded-xl border p-6 shadow-xs transition-all duration-300 hover:shadow-md 3xl:my-10 5xl:my-12 3xl:p-8 5xl:p-10 md:p-8"
        >
          <div className="mb-4 flex items-center justify-between">
            <input
              type="text"
              value={props.block.props.title}
              onChange={handleTitleChange}
              className="text-foreground placeholder:text-muted-foreground/50 focus:border-border w-full border-b border-transparent bg-transparent pb-1 text-xl font-bold tracking-tight outline-hidden transition-colors"
              placeholder="Title"
            />
            <button
              type="button"
              onClick={() => {
                if (window.confirm("Are you sure you want to delete this block?")) {
                  props.editor.removeBlocks([props.block]);
                  props.editor.focus();
                }
              }}
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer rounded-md p-1.5 transition-all"
              title="Delete Block"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-3">
            {items.map((item, index) => (
              <div
                key={index}
                className="group bg-background/50 border-border hover:border-border hover:bg-background flex items-center gap-3 rounded-none sm:rounded-lg border p-2 transition-all duration-300 md:p-4"
              >
                <div className="text-muted-foreground mt-2 cursor-grab">
                  <GripVertical className="h-4 w-4" />
                </div>
                <input
                  value={item}
                  onChange={(e) => handleChange(index, e.target.value)}
                  className="focus:border-border placeholder:text-muted-foreground/40 flex-1 border-b border-transparent bg-transparent px-2 py-1 text-sm font-medium outline-hidden transition-colors"
                  placeholder={`Takeaway ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 mt-1 cursor-pointer rounded-md p-1.5 opacity-0 transition-all group-hover:opacity-100"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className="border-border text-muted-foreground hover:bg-muted/30 hover:text-foreground hover:border-border mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-none sm:rounded-xl border border-dashed bg-transparent p-4 text-sm font-medium transition-all"
          >
            <Plus className="h-4 w-4" /> <I18n>Add Takeaway</I18n>
          </button>
        </div>
      );
    },
  }
)();
