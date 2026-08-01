"use client";
import { createReactBlockSpec } from "@blocknote/react";
import { FileText, UploadCloud, Trash2, Download } from "lucide-react";
import { MediaUploader } from "@/components/media/MediaUploader";
import I18n from "@/shared/components/I18n";

export const CustomFileBlock = createReactBlockSpec(
  {
    type: "customFile",
    propSchema: {
      url: { default: "" },
      filename: { default: "" },
    },
    content: "none",
  },
  {
    render: (props) => {
      const updateProp = (key: string, value: string) => {
        props.editor.updateBlock(props.block, {
          type: "customFile",
          props: { [key]: value },
        });
      };

      if (!props.block.props.url) {
        return (
          <div className="my-4 w-full" onMouseDown={(e) => e.stopPropagation()}>
            <MediaUploader
              label="Block File"
              value={null}
              accept="*"
              onChange={(val) => {
                if (typeof val === "string" && val) {
                  updateProp("url", val);

                  try {
                    const parsedUrl = new URL(val);
                    const pathParts = parsedUrl.pathname.split("/");
                    const name = pathParts[pathParts.length - 1];
                    updateProp("filename", decodeURIComponent(name) || "Download File");
                  } catch {
                    updateProp("filename", "Download File");
                  }
                }
              }}
              folder="a2icoders/blogs/files"
              helperText="Upload a document or file"
            />
          </div>
        );
      }

      return (
        <div
          onMouseDown={(e) => e.stopPropagation()}
          className="group bg-card border-border not-prose relative my-8 flex w-full items-center justify-between rounded-xl border p-6 shadow-xs transition-all duration-300 hover:shadow-md 3xl:my-10 5xl:my-12 3xl:p-6 5xl:p-8 md:p-6"
        >
          <div className="flex items-center gap-4 overflow-hidden">
            <div className="bg-primary/10 flex h-12 w-12 shrink-0 items-center justify-center rounded-lg">
              <FileText className="text-primary h-6 w-6" />
            </div>
            <div className="flex min-w-0 flex-col">
              <input
                type="text"
                value={props.block.props.filename}
                onChange={(e) => updateProp("filename", e.target.value)}
                className="text-foreground focus:border-border -ml-1 truncate border-b border-transparent bg-transparent px-1 text-base font-semibold tracking-tight outline-hidden transition-colors md:text-lg"
                placeholder="File name"
              />
              <span className="text-muted-foreground truncate text-xs">
                <I18n>File Document</I18n>
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 pl-4">
            <a
              href={props.block.props.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary/10 text-primary hover:bg-primary hover:text-on-primary flex items-center gap-1 rounded-full p-2 px-4 text-xs font-semibold transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">
                <I18n>Download</I18n>
              </span>
            </a>
          </div>

          {}
          <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 opacity-0 transition-all duration-200 group-hover:opacity-100">
            <div className="bg-background/90 border-border flex items-center gap-1 rounded-none sm:rounded-lg border p-1.5 shadow-md backdrop-blur-md">
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Are you sure you want to replace this file?")) {
                    updateProp("url", "");
                    updateProp("filename", "");
                  }
                }}
                className="text-muted-foreground hover:text-foreground hover:bg-muted/50 cursor-pointer rounded-md p-1.5 transition-colors"
                title="Replace File"
              >
                <UploadCloud className="h-4 w-4" />
              </button>

              <div className="bg-border mx-0.5 h-4 w-px" />

              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Are you sure you want to remove this file block?")) {
                    props.editor.removeBlocks([props.block]);
                    props.editor.focus();
                  }
                }}
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer rounded-md p-1.5 transition-colors"
                title="Delete File"
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
