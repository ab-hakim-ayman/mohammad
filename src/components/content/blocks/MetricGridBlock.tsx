"use client";
import { createReactBlockSpec } from "@blocknote/react";
import { Activity, Trash2, Plus, X } from "lucide-react";
import I18n from "@/shared/components/I18n";

export const MetricGridBlock = createReactBlockSpec(
  {
    type: "metricGrid",
    propSchema: {
      metricsJson: {
        default: "[]",
      },
    },
    content: "none",
  },
  {
    render: (props) => {
      const metrics: Array<{ value: string; label: string; description: string }> = (() => {
        try {
          return JSON.parse(props.block.props.metricsJson);
        } catch {
          return [];
        }
      })();

      const updateMetrics = (newMetrics: typeof metrics) => {
        props.editor.updateBlock(props.block, {
          type: "metricGrid",
          props: { metricsJson: JSON.stringify(newMetrics) },
        });
      };

      const addMetric = () => {
        if (metrics.length >= 4) return;
        updateMetrics([...metrics, { value: "", label: "", description: "" }]);
      };

      const removeMetric = (index: number) => {
        updateMetrics(metrics.filter((_, i) => i !== index));
      };

      const updateMetric = (index: number, key: "value" | "label" | "description", val: string) => {
        const newMetrics = [...metrics];
        newMetrics[index] = { ...newMetrics[index], [key]: val };
        updateMetrics(newMetrics);
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
            <Activity className="h-5 w-5" />
            <span className="text-sm font-semibold">
              <I18n>Metric Grid (Max 4)</I18n>
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 3xl:grid-cols-5">
            {metrics.map((metric, idx) => (
              <div
                key={idx}
                className="group/metric border-border bg-muted/10 hover:border-border hover:bg-muted/30 relative flex flex-col gap-3 rounded-none sm:rounded-xl border p-6 transition-all duration-300 hover:shadow-xs"
              >
                <input
                  type="text"
                  value={metric.value}
                  onChange={(e) => updateMetric(idx, "value", e.target.value)}
                  className="text-primary focus:border-border placeholder:text-primary/30 w-full border-b border-transparent bg-transparent pb-1 text-3xl font-bold tracking-tight outline-hidden transition-colors"
                  placeholder="e.g. 99%"
                />
                <input
                  type="text"
                  value={metric.label}
                  onChange={(e) => updateMetric(idx, "label", e.target.value)}
                  className="text-foreground focus:border-border placeholder:text-muted-foreground/50 w-full border-b border-transparent bg-transparent text-sm font-semibold outline-hidden transition-colors"
                  placeholder="Metric Label"
                />
                <input
                  type="text"
                  value={metric.description}
                  onChange={(e) => updateMetric(idx, "description", e.target.value)}
                  className="text-muted-foreground focus:border-border placeholder:text-muted-foreground/40 w-full border-b border-transparent bg-transparent text-sm outline-hidden transition-colors"
                  placeholder="Short description..."
                />

                <button
                  type="button"
                  onClick={() => removeMetric(idx)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90 absolute -top-2 -right-2 cursor-pointer rounded-full p-1.5 opacity-0 shadow-md transition-all group-hover/metric:opacity-100"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}

            {metrics.length < 4 && (
              <button
                type="button"
                onClick={addMetric}
                className="border-border text-muted-foreground hover:bg-muted/30 hover:border-border hover:text-foreground flex h-full min-h-[140px] cursor-pointer flex-col items-center justify-center gap-2 rounded-none sm:rounded-xl border border-dashed bg-transparent p-4 text-sm font-medium transition-all"
              >
                <Plus className="h-6 w-6" /> <I18n>Add Metric</I18n>
              </button>
            )}
          </div>
        </div>
      );
    },
  }
)();
