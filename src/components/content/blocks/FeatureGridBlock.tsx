"use client";
import { createReactBlockSpec } from "@blocknote/react";
import { Grid, Trash2, Plus, X } from "lucide-react";
import { MediaUploader } from "@/components/media/MediaUploader";
import I18n from "@/shared/components/I18n";

export const FeatureGridBlock = createReactBlockSpec(
  {
    type: "featureGrid",
    propSchema: {
      featuresJson: {
        default: "[]",
      },
    },
    content: "none",
  },
  {
    render: (props) => {
      const features: Array<{
        title: string;
        description: string;
        icon: string;
        imageUrl: string;
      }> = (() => {
        try {
          return JSON.parse(props.block.props.featuresJson);
        } catch {
          return [];
        }
      })();

      const updateFeatures = (newFeatures: typeof features) => {
        props.editor.updateBlock(props.block, {
          type: "featureGrid",
          props: { featuresJson: JSON.stringify(newFeatures) },
        });
      };

      const addFeature = () => {
        if (features.length >= 6) return;
        updateFeatures([...features, { title: "", description: "", icon: "", imageUrl: "" }]);
      };

      const removeFeature = (index: number) => {
        updateFeatures(features.filter((_, i) => i !== index));
      };

      const updateFeature = (
        index: number,
        key: "title" | "description" | "icon" | "imageUrl",
        val: string
      ) => {
        const newFeatures = [...features];
        newFeatures[index] = { ...newFeatures[index], [key]: val };
        updateFeatures(newFeatures);
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
            <Grid className="h-5 w-5" />
            <span className="text-sm font-semibold">
              <I18n>Feature Grid (Max 6)</I18n>
            </span>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="group/feature border-border bg-background/50 hover:border-border hover:bg-background relative flex flex-col gap-4 rounded-none sm:rounded-lg border p-6 transition-all duration-300 hover:shadow-xs md:p-6"
              >
                <div className="mb-2 w-full" onMouseDown={(e) => e.stopPropagation()}>
                  <MediaUploader
                    label="Feature Icon/Image"
                    value={feature.imageUrl || null}
                    onChange={(val) =>
                      updateFeature(idx, "imageUrl", typeof val === "string" ? val : "")
                    }
                    folder="a2icoders/content/features"
                  />
                </div>

                <input
                  type="text"
                  value={feature.title}
                  onChange={(e) => updateFeature(idx, "title", e.target.value)}
                  className="text-foreground focus:border-border placeholder:text-muted-foreground/50 w-full border-b border-transparent bg-transparent pb-1 text-lg font-bold tracking-tight outline-hidden transition-colors"
                  placeholder="Feature Title"
                />

                <textarea
                  value={feature.description}
                  onChange={(e) => updateFeature(idx, "description", e.target.value)}
                  className="text-muted-foreground focus:border-border placeholder:text-muted-foreground/40 min-h-[80px] w-full resize-none border-b border-transparent bg-transparent text-sm outline-hidden transition-colors"
                  placeholder="Describe this feature..."
                />

                <button
                  type="button"
                  onClick={() => removeFeature(idx)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90 absolute -top-2 -right-2 z-10 cursor-pointer rounded-full p-1.5 opacity-0 shadow-md transition-all group-hover/feature:opacity-100"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}

            {features.length < 6 && (
              <button
                type="button"
                onClick={addFeature}
                className="border-border text-muted-foreground hover:bg-muted/30 hover:border-border hover:text-foreground flex h-full min-h-[220px] cursor-pointer flex-col items-center justify-center gap-3 rounded-none sm:rounded-xl border border-dashed bg-transparent p-4 text-sm font-medium transition-all"
              >
                <Plus className="h-6 w-6" /> <I18n>Add Feature</I18n>
              </button>
            )}
          </div>
        </div>
      );
    },
  }
)();
