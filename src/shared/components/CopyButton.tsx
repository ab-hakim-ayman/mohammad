"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import I18n from "@/shared/components/I18n";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  text: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  showIcon?: boolean;
}

export function CopyButton({
  text,
  label,
  copiedLabel = "Copied!",
  className,
  variant = "outline",
  size = "sm",
  showIcon = true,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!text) return;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        textArea.remove();
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <Button
      type="button"
      variant={copied ? "secondary" : variant}
      size={size}
      onClick={handleCopy}
      className={cn(
        "cursor-pointer transition-all duration-200",
        copied && "border-success/30 bg-success/10 text-success hover:bg-success/20",
        className
      )}
      title={copied ? "Copied to clipboard" : "Copy to clipboard"}
    >
      {showIcon &&
        (copied ? (
          <Check className="h-3.5 w-3.5 shrink-0 text-success" />
        ) : (
          <Copy className="h-3.5 w-3.5 shrink-0" />
        ))}
      {(label || copied) && (
        <span className={showIcon ? "ml-1.5" : ""}>
          <I18n>{copied ? copiedLabel : label || "Copy"}</I18n>
        </span>
      )}
    </Button>
  );
}
