"use client";

import { useState, useMemo } from "react";
import { ToolLayout } from "../ToolLayout";
import type { Tool } from "../../types/tool.types";
import { Button } from "@/components/ui/button";
import { Copy, Check, KeyRound } from "lucide-react";

const SAMPLE_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
  "eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFobWFkIEFicmFyIiwicm9sZSI6IkFETUlOIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5MTYyMzkwMjJ9." +
  "4S98xQd3bNlA1w2e3r4t5y6u7i8o9p0a1b2c3d4e5f6";

interface JwtDecoderToolProps {
  tool?: Tool;
}

export function JwtDecoderTool({ tool }: JwtDecoderToolProps) {
  const [token, setToken] = useState("");
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const decoded = useMemo(() => {
    if (!token.trim()) return null;
    const parts = token.trim().split(".");
    if (parts.length !== 3) {
      return { error: "Invalid JWT format. Must have 3 dot-separated parts (Header.Payload.Signature)." };
    }

    try {
      const headerStr = atob(parts[0].replace(/-/g, "+").replace(/_/g, "/"));
      const payloadStr = atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"));
      return {
        header: JSON.parse(headerStr),
        payload: JSON.parse(payloadStr),
        signature: parts[2],
        error: null,
      };
    } catch {
      return { error: "Unable to parse Base64 payload inside JWT." };
    }
  }, [token]);

  const handleCopySection = (text: string, sectionName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionName);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const isExpired =
    decoded?.payload && typeof decoded.payload.exp === "number"
      ? decoded.payload.exp * 1000 < Date.now()
      : null;

  return (
    <ToolLayout
      title={tool?.title || "JWT Token Inspector & Decoder"}
      description={tool?.shortDesc || "Decode JSON Web Tokens (JWT) in real-time and inspect header claims and expiration status."}
      category={
        tool?.categories?.length
          ? tool.categories.map((c) => c.title).join(", ")
          : "SECURITY"
      }
      inputValue={token}
      outputValue=""
      onInputChange={setToken}
      onReset={() => setToken("")}
      onLoadSample={() => setToken(SAMPLE_JWT)}
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Encoded JWT Token
            </label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setToken(SAMPLE_JWT)}
              className="h-6 gap-1 text-[11px] text-muted-foreground hover:text-foreground"
            >
              <KeyRound className="h-3 w-3" /> Load Sample
            </Button>
          </div>
          <textarea
            value={token}
            onChange={(e) => setToken(e.target.value)}
            rows={5}
            placeholder="Paste encoded JWT string (eyJhbGci...)..."
            className="w-full resize-none rounded-xl border border-border/80 bg-card/60 p-3.5 font-mono text-xs text-foreground focus:border-lime-500/50 focus:outline-hidden focus:ring-1 focus:ring-lime-500/30"
          />
        </div>

        {decoded?.error ? (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 font-mono text-xs text-red-500">
            {decoded.error}
          </div>
        ) : decoded ? (
          <div className="space-y-4">
            {/* Status Banner */}
            {isExpired !== null && (
              <div
                className={`flex items-center justify-between rounded-xl border p-3.5 text-xs font-semibold ${
                  isExpired
                    ? "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400"
                    : "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                }`}
              >
                <span>{isExpired ? "⚠️ Token Expired" : "✓ Token Valid"}</span>
                {decoded.payload?.exp && (
                  <span className="font-mono text-[11px] font-normal">
                    Expires: {new Date(decoded.payload.exp * 1000).toLocaleString()}
                  </span>
                )}
              </div>
            )}

            {/* Decoded Sections */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-red-500 uppercase">Header</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopySection(JSON.stringify(decoded.header, null, 2), "header")}
                    className="h-6 gap-1 text-[11px] text-muted-foreground hover:text-foreground"
                  >
                    {copiedSection === "header" ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                    Copy
                  </Button>
                </div>
                <pre className="overflow-auto max-h-[300px] rounded-xl border border-border/80 bg-card/50 p-3.5 font-mono text-xs text-foreground">
                  {JSON.stringify(decoded.header, null, 2)}
                </pre>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-500 uppercase">Payload</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopySection(JSON.stringify(decoded.payload, null, 2), "payload")}
                    className="h-6 gap-1 text-[11px] text-muted-foreground hover:text-foreground"
                  >
                    {copiedSection === "payload" ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                    Copy
                  </Button>
                </div>
                <pre className="overflow-auto max-h-[300px] rounded-xl border border-border/80 bg-card/50 p-3.5 font-mono text-xs text-foreground">
                  {JSON.stringify(decoded.payload, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </ToolLayout>
  );
}
