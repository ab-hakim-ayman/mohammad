"use client";
import { createReactBlockSpec } from "@blocknote/react";
import { Table, Trash2, Plus, X } from "lucide-react";
import I18n from "@/shared/components/I18n";

export const ComparisonTableBlock = createReactBlockSpec(
  {
    type: "comparisonTable",
    propSchema: {
      leftHeader: { default: "Our Solution" },
      rightHeader: { default: "Alternative" },
      rowsJson: {
        default: "[]",
      },
    },
    content: "none",
  },
  {
    render: (props) => {
      const rows: Array<{ feature: string; leftValue: string; rightValue: string }> = (() => {
        try {
          return JSON.parse(props.block.props.rowsJson);
        } catch {
          return [];
        }
      })();

      const updateRows = (newRows: typeof rows) => {
        props.editor.updateBlock(props.block, {
          type: "comparisonTable",
          props: { rowsJson: JSON.stringify(newRows) },
        });
      };

      const updateProp = (key: "leftHeader" | "rightHeader", val: string) => {
        props.editor.updateBlock(props.block, {
          type: "comparisonTable",
          props: { [key]: val },
        });
      };

      const addRow = () => {
        if (rows.length >= 10) return;
        updateRows([...rows, { feature: "", leftValue: "", rightValue: "" }]);
      };

      const removeRow = (index: number) => {
        updateRows(rows.filter((_, i) => i !== index));
      };

      const updateRow = (
        index: number,
        key: "feature" | "leftValue" | "rightValue",
        val: string
      ) => {
        const newRows = [...rows];
        newRows[index] = { ...newRows[index], [key]: val };
        updateRows(newRows);
      };

      return (
        <div
          onMouseDown={(e) => e.stopPropagation()}
          className="group border-border bg-card relative my-8 w-full overflow-x-auto rounded-xl border p-6 shadow-xs transition-all duration-300 hover:shadow-md 3xl:my-10 5xl:my-12 3xl:p-8 5xl:p-10 md:p-8"
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

          <div className="border-border text-muted-foreground mb-8 flex min-w-[600px] items-center gap-2 border-b pb-3">
            <Table className="h-5 w-5" />
            <span className="text-sm font-semibold">
              <I18n>Comparison Table (Max 10 rows)</I18n>
            </span>
          </div>

          <div className="min-w-[600px]">
            <div className="bg-muted/30 border-border mb-3 grid grid-cols-[2fr_1.5fr_1.5fr_40px] items-center gap-4 rounded-none sm:rounded-xl border p-4 text-sm font-semibold">
              <div className="text-muted-foreground">
                <I18n>Feature / Criterion</I18n>
              </div>
              <input
                type="text"
                value={props.block.props.leftHeader}
                onChange={(e) => updateProp("leftHeader", e.target.value)}
                className="text-primary focus:border-border placeholder:text-primary/50 border-b border-transparent bg-transparent outline-hidden transition-colors"
                placeholder="Left Column Header"
              />
              <input
                type="text"
                value={props.block.props.rightHeader}
                onChange={(e) => updateProp("rightHeader", e.target.value)}
                className="text-muted-foreground focus:border-border placeholder:text-muted-foreground/50 border-b border-transparent bg-transparent outline-hidden transition-colors"
                placeholder="Right Column Header"
              />
              <div></div>
            </div>

            <div className="space-y-2">
              {rows.map((row, idx) => (
                <div
                  key={idx}
                  className="bg-background/50 border-border group/row hover:border-border hover:bg-background grid grid-cols-[2fr_1.5fr_1.5fr_40px] items-center gap-4 rounded-none sm:rounded-xl border p-4 px-4 transition-all duration-200"
                >
                  <input
                    type="text"
                    value={row.feature}
                    onChange={(e) => updateRow(idx, "feature", e.target.value)}
                    className="focus:border-border placeholder:text-muted-foreground/40 w-full border-b border-transparent bg-transparent text-sm font-medium outline-hidden transition-colors"
                    placeholder="e.g. Deployment Time"
                  />
                  <input
                    type="text"
                    value={row.leftValue}
                    onChange={(e) => updateRow(idx, "leftValue", e.target.value)}
                    className="focus:border-border placeholder:text-muted-foreground/40 w-full border-b border-transparent bg-transparent text-sm outline-hidden transition-colors"
                    placeholder="e.g. 2 Days"
                  />
                  <input
                    type="text"
                    value={row.rightValue}
                    onChange={(e) => updateRow(idx, "rightValue", e.target.value)}
                    className="focus:border-border placeholder:text-muted-foreground/40 w-full border-b border-transparent bg-transparent text-sm outline-hidden transition-colors"
                    placeholder="e.g. 3 Weeks"
                  />
                  <button
                    type="button"
                    onClick={() => removeRow(idx)}
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex cursor-pointer items-center justify-center rounded-md p-1.5 opacity-0 transition-all group-hover/row:opacity-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {rows.length < 10 && (
              <button
                type="button"
                onClick={addRow}
                className="border-border text-muted-foreground hover:bg-muted/30 hover:text-foreground hover:border-border mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-none sm:rounded-xl border border-dashed bg-transparent p-4 text-sm font-medium transition-all"
              >
                <Plus className="h-4 w-4" /> <I18n>Add Row</I18n>
              </button>
            )}
          </div>
        </div>
      );
    },
  }
)();
