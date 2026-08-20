"use client";

import { useState } from "react";
import { Copy, Check, RefreshCw, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";

import type { Tool } from "../../types/tool.types";

export function UuidGeneratorTool({ tool }: { tool?: Tool } = {}) {
  const [count, setCount] = useState(5);
  const [uppercase, setUppercase] = useState(false);
  const [noHyphens, setNoHyphens] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generateUuidV4 = () => {
    let uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });

    if (noHyphens) uuid = uuid.replace(/-/g, "");
    if (uppercase) uuid = uuid.toUpperCase();
    return uuid;
  };

  const [uuids, setUuids] = useState<string[]>(() =>
    Array.from({ length: 5 }, () => generateUuidV4())
  );

  const handleRegenerate = () => {
    setUuids(Array.from({ length: count }, () => generateUuidV4()));
  };

  const handleCopyAll = () => {
    if (!uuids.length) return;
    navigator.clipboard.writeText(uuids.join("\n"));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleCopySingle = (val: string, index: number) => {
    navigator.clipboard.writeText(val);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="w-full space-y-6">
      {/* Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground">Quantity:</span>
            <select
              value={count}
              onChange={(e) => {
                const newCount = Number(e.target.value);
                setCount(newCount);
                setUuids(Array.from({ length: newCount }, () => generateUuidV4()));
              }}
              className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {[1, 5, 10, 20, 50].map((num) => (
                <option key={num} value={num}>
                  {num} UUIDs
                </option>
              ))}
            </select>
          </div>

          <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) => {
                setUppercase(e.target.checked);
                setUuids((prev) =>
                  prev.map((u) => (e.target.checked ? u.toUpperCase() : u.toLowerCase()))
                );
              }}
              className="rounded border-border text-primary focus:ring-primary"
            />
            Uppercase
          </label>

          <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground">
            <input
              type="checkbox"
              checked={noHyphens}
              onChange={(e) => {
                setNoHyphens(e.target.checked);
                setUuids((prev) =>
                  prev.map((u) => (e.target.checked ? u.replace(/-/g, "") : u))
                );
              }}
              className="rounded border-border text-primary focus:ring-primary"
            />
            Remove Hyphens
          </label>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={handleRegenerate}
            className="rounded-xl font-medium"
          >
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
            Regenerate
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyAll}
            className="rounded-xl font-medium"
          >
            {copiedAll ? (
              <>
                <Check className="mr-1.5 h-3.5 w-3.5 text-emerald-500" />
                Copied All
              </>
            ) : (
              <>
                <Copy className="mr-1.5 h-3.5 w-3.5" />
                Copy All
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Generated List */}
      <div className="space-y-3">
        {uuids.map((uuid, idx) => (
          <div
            key={idx}
            className="group flex items-center justify-between rounded-2xl border border-border/70 bg-card/40 px-5 py-3.5 font-mono text-sm shadow-sm transition hover:border-primary/50 hover:bg-card/80"
          >
            <span className="select-all font-semibold tracking-wide text-foreground">{uuid}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopySingle(uuid, idx)}
              className="h-8 rounded-lg px-2.5 text-xs text-muted-foreground opacity-90 transition group-hover:opacity-100"
            >
              {copiedIndex === idx ? (
                <span className="flex items-center text-emerald-500 font-medium">
                  <Check className="mr-1 h-3.5 w-3.5" /> Copied
                </span>
              ) : (
                <span className="flex items-center">
                  <Copy className="mr-1 h-3.5 w-3.5" /> Copy
                </span>
              )}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
