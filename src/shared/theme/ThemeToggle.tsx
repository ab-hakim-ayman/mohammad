"use client";

import * as React from "react";
import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { cn } from "@/lib/utils";
import { Toggle } from "@base-ui/react";

function useMounted() {
  return useSyncExternalStore(
    () => () => { },
    () => true,
    () => false
  );
}

export default function ThemeToggle() {
  const mounted = useMounted();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  // 🛡️ Pre-hydration Vercel Style SSR Skeleton
  if (!mounted) {
    return (
      <div
        aria-hidden="true"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-muted/30 opacity-60 backdrop-blur-md"
      >
        <div className="h-4 w-4 rounded-full bg-muted-foreground/30 animate-pulse" />
      </div>
    );
  }

  return (
    <Toggle
      pressed={isDark}
      onPressedChange={toggleTheme}
      aria-label="Toggle dark mode"
      className={cn(
        "group relative inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-border/80 bg-card/60 text-muted-foreground backdrop-blur-md transition-all duration-200 outline-none select-none shadow-2xs",
        "hover:border-border hover:bg-card hover:text-foreground hover:shadow-xs",
        "focus-visible:ring-2 focus-visible:ring-primary/20",
        isDark && "border-primary/20 bg-primary/10 text-primary hover:bg-primary/20"
      )}
    >
      {/* ☀️ Sun Icon */}
      <Sun
        className={cn(
          "absolute h-4 w-4 transition-all duration-300 transform-gpu",
          isDark
            ? "rotate-90 scale-0 opacity-0"
            : "rotate-0 scale-100 opacity-100"
        )}
      />

      {/* 🌙 Moon Icon */}
      <Moon
        className={cn(
          "absolute h-4 w-4 transition-all duration-300 transform-gpu",
          isDark
            ? "rotate-0 scale-100 opacity-100"
            : "-rotate-90 scale-0 opacity-0"
        )}
      />
    </Toggle>
  );
}