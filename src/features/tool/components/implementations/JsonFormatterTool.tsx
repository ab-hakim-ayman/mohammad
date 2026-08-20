"use client";

import { useState } from "react";
import { Copy, Check, Trash2, Code2, Minimize2, FileCode } from "lucide-react";
import { Button } from "@/components/ui/button";

const SAMPLE_JSON = `{
  "title": "A2ICoders Modern Portfolio",
  "version": "2.0.0",
  "features": ["Next.js App Router", "Tailwind CSS v4", "Prisma ORM", "TypeScript"],
  "metrics": {
    "speedIndex": 99,
    "uptime": "99.99%",
    "activeUsers": 50000
  },
  "isProduction": true
}`;

import type { Tool } from "../../types/tool.types";

export function JsonFormatterTool({ tool }: { tool?: Tool } = {}) {
  const [input, setInput] = useState("");
  const [indent, setIndent] = useState<number>(2);
  const [copied, setCopied] = useState(false);
  const [formattedOutput, setFormattedOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleFormat = (spaces: number) => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setFormattedOutput(JSON.stringify(parsed, null, spaces));
      setError(null);
    } catch (e: any) {
      setError(e.message || "Invalid JSON format");
      setFormattedOutput("");
    }
  };

  const handleMinify = () => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setFormattedOutput(JSON.stringify(parsed));
      setError(null);
    } catch (e: any) {
      setError(e.message || "Invalid JSON format");
      setFormattedOutput("");
    }
  };

  const handleCopy = () => {
    if (!formattedOutput) return;
    navigator.clipboard.writeText(formattedOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput("");
    setFormattedOutput("");
    setError(null);
  };

  const handleLoadSample = () => {
    setInput(SAMPLE_JSON);
    try {
      const parsed = JSON.parse(SAMPLE_JSON);
      setFormattedOutput(JSON.stringify(parsed, null, indent));
      setError(null);
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={() => handleFormat(indent)}
            className="rounded-xl font-medium"
          >
            <Code2 className="mr-1.5 h-4 w-4" />
            Format / Beautify
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleMinify}
            className="rounded-xl font-medium"
          >
            <Minimize2 className="mr-1.5 h-4 w-4" />
            Minify
          </Button>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground ml-2">
            <span>Indent:</span>
            {[2, 4].map((sp) => (
              <button
                key={sp}
                onClick={() => {
                  setIndent(sp);
                  if (input) handleFormat(sp);
                }}
                className={`rounded-lg px-2 py-1 text-xs font-semibold transition ${
                  indent === sp
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {sp} spaces
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleLoadSample}
            className="rounded-xl text-xs font-medium"
          >
            <FileCode className="mr-1.5 h-3.5 w-3.5" />
            Load Sample
          </Button>
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
            <span>Input JSON</span>
            <span>{input.length} chars</span>
          </div>
          <textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (e.target.value.trim()) {
                try {
                  const parsed = JSON.parse(e.target.value);
                  setFormattedOutput(JSON.stringify(parsed, null, indent));
                  setError(null);
                } catch (err: any) {
                  setError(err.message);
                  setFormattedOutput("");
                }
              } else {
                setFormattedOutput("");
                setError(null);
              }
            }}
            placeholder="Paste raw or unformatted JSON here..."
            className="min-h-[320px] w-full resize-y rounded-2xl border border-border/80 bg-background/80 p-4 font-mono text-sm shadow-inner transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Output Block */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <span>Formatted Output</span>
            <div className="flex items-center gap-2">
              <span>{formattedOutput.length} chars</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                disabled={!formattedOutput}
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
          <div className="relative min-h-[320px] w-full overflow-auto rounded-2xl border border-border/80 bg-card/40 p-4 font-mono text-sm shadow-inner">
            {error ? (
              <div className="flex h-full min-h-[280px] flex-col items-center justify-center space-y-2 text-center text-destructive">
                <span className="font-semibold">JSON Syntax Error</span>
                <span className="max-w-md text-xs opacity-90">{error}</span>
              </div>
            ) : formattedOutput ? (
              <pre className="whitespace-pre text-foreground">{formattedOutput}</pre>
            ) : (
              <div className="flex h-full min-h-[280px] items-center justify-center text-sm text-muted-foreground/60">
                Formatted JSON will appear here...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
