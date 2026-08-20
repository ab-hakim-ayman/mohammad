"use client";

import { useState } from "react";
import { Copy, Check, ArrowRightLeft, Trash2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

import type { Tool } from "../../types/tool.types";

export function Base64Tool({ tool }: { tool?: Tool } = {}) {
  const [mode, setMode] = useState<"ENCODE" | "DECODE">("ENCODE");
  const [input, setInput] = useState("");
  const [urlSafe, setUrlSafe] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  let output = "";
  let currentError = error;

  try {
    if (input.trim() !== "") {
      if (mode === "ENCODE") {
        const encoded = btoa(unescape(encodeURIComponent(input)));
        output = urlSafe
          ? encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
          : encoded;
        if (currentError) setError(null);
      } else {
        let cleanInput = input.trim();
        if (urlSafe) {
          cleanInput = cleanInput.replace(/-/g, "+").replace(/_/g, "/");
          while (cleanInput.length % 4 !== 0) {
            cleanInput += "=";
          }
        }
        output = decodeURIComponent(escape(atob(cleanInput)));
        if (currentError) setError(null);
      }
    }
  } catch (e: any) {
    output = "";
    currentError = mode === "DECODE" ? "Invalid Base64 string" : e.message;
  }

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput("");
    setError(null);
  };

  const toggleMode = () => {
    setMode((prev) => (prev === "ENCODE" ? "DECODE" : "ENCODE"));
    setInput(output);
  };

  return (
    <div className="w-full space-y-6">
      {/* Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Button
            variant={mode === "ENCODE" ? "default" : "outline"}
            size="sm"
            onClick={() => setMode("ENCODE")}
            className="rounded-xl font-medium"
          >
            Encode
          </Button>
          <Button
            variant={mode === "DECODE" ? "default" : "outline"}
            size="sm"
            onClick={() => setMode("DECODE")}
            className="rounded-xl font-medium"
          >
            Decode
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMode}
            className="rounded-xl text-muted-foreground hover:text-foreground"
            title="Swap input and output"
          >
            <ArrowRightLeft className="mr-1.5 h-4 w-4" />
            Swap
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground">
            <input
              type="checkbox"
              checked={urlSafe}
              onChange={(e) => setUrlSafe(e.target.checked)}
              className="rounded border-border text-primary focus:ring-primary"
            />
            URL Safe Base64
          </label>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="rounded-xl text-xs text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="mr-1.5 h-3.5 w-3.5" />
            Clear
          </Button>
        </div>
      </div>

      {/* Input and Output Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Input Block */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <span>Input ({mode.toLowerCase()})</span>
            <span>{input.length} chars</span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === "ENCODE"
                ? "Enter plain text to encode into Base64..."
                : "Enter Base64 string to decode..."
            }
            className="min-h-[260px] w-full resize-y rounded-2xl border border-border/80 bg-background/80 p-4 font-mono text-sm shadow-inner transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Output Block */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <span>Output</span>
            <div className="flex items-center gap-2">
              <span>{output.length} chars</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                disabled={!output}
                className="h-7 rounded-lg px-2.5 text-xs font-medium"
              >
                {copied ? (
                  <>
                    <Check className="mr-1 h-3.5 w-3.5 text-emerald-500" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="mr-1 h-3.5 w-3.5" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>
          <div className="relative min-h-[260px] w-full rounded-2xl border border-border/80 bg-card/40 p-4 font-mono text-sm shadow-inner">
            {currentError ? (
              <div className="flex h-full min-h-[220px] items-center justify-center text-sm font-medium text-destructive">
                {currentError}
              </div>
            ) : output ? (
              <pre className="whitespace-pre-wrap break-all text-foreground">{output}</pre>
            ) : (
              <div className="flex h-full min-h-[220px] items-center justify-center text-sm text-muted-foreground/60">
                Converted output will appear here in real-time...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
