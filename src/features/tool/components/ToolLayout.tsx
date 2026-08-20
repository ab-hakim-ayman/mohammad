"use client";

import { useState } from "react";
import { Copy, Check, RotateCcw, ShieldCheck, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ToolLayoutProps {
  title: string;
  description?: string;
  category: string;
  inputLabel?: string;
  outputLabel?: string;
  inputValue: string;
  outputValue: string;
  onInputChange: (val: string) => void;
  onReset?: () => void;
  onLoadSample?: () => void;
  controls?: React.ReactNode;
  isError?: boolean;
  errorMessage?: string;
  readOnlyOutput?: boolean;
  children?: React.ReactNode;
}

export function ToolLayout({
  title,
  description,
  category,
  inputLabel = "Input",
  outputLabel = "Output",
  inputValue,
  outputValue,
  onInputChange,
  onReset,
  onLoadSample,
  controls,
  isError = false,
  errorMessage,
  children,
}: ToolLayoutProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!outputValue) return;
    navigator.clipboard.writeText(outputValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 py-4">
      {/* Header & Privacy Badge */}
      <div className="space-y-3 text-center sm:text-left">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
          <span className="text-[11px] font-bold tracking-widest text-lime-600 uppercase dark:text-lime-400">
            {category}
          </span>
          <span className="text-muted-foreground/40">•</span>
          <div className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-lime-500" />
            Runs 100% in browser (Private)
          </div>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      {/* Custom Component or Children */}
      {children ? (
        children
      ) : (
        /* Standard 2-Column Layout */
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/80 bg-card/40 p-2.5 backdrop-blur-xs">
            <div className="flex items-center gap-2">{controls}</div>
            <div className="flex items-center gap-2">
              {onLoadSample && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLoadSample}
                  className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  <FileText className="h-3.5 w-3.5" />
                  Sample
                </Button>
              )}
              {onReset && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onReset}
                  className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Input & Output Workspace */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Input Box */}
            <div className="space-y-2">
              <label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                {inputLabel}
              </label>
              <textarea
                value={inputValue}
                onChange={(e) => onInputChange(e.target.value)}
                placeholder="Paste or type here..."
                rows={14}
                className="w-full resize-y rounded-xl border border-border/80 bg-card/60 p-4 font-mono text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-lime-500/50 focus:outline-hidden focus:ring-1 focus:ring-lime-500/30"
              />
            </div>

            {/* Output Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  {outputLabel}
                </label>
                {outputValue && !isError && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    className="h-6 gap-1 text-[11px] text-muted-foreground hover:text-lime-600 dark:hover:text-lime-400"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3 w-3 text-lime-500" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" /> Copy
                      </>
                    )}
                  </Button>
                )}
              </div>
              <div className="relative">
                <textarea
                  readOnly
                  value={isError ? errorMessage : outputValue}
                  placeholder="Output will appear here automatically..."
                  rows={14}
                  className={`w-full resize-y rounded-xl border p-4 font-mono text-xs focus:outline-hidden ${
                    isError
                      ? "border-red-500/30 bg-red-500/5 text-red-600 dark:text-red-400"
                      : "border-border/80 bg-muted/30 text-foreground"
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
