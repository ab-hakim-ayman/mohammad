"use client";

import { useEffect, useState, useMemo } from "react";
import I18n from "@/shared/components/I18n";
import { cn } from "@/lib/utils";

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export interface StickyTableOfContentsProps {
  items: TocItem[];
  className?: string;
  hideHeader?: boolean;
}

export function StickyTableOfContents({
  items = [],
  className,
  hideHeader = false,
}: StickyTableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const itemIds = useMemo(() => items.map((i) => i.id).join(","), [items]);

  useEffect(() => {
    if (!items.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0% -60% 0%" }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [itemIds]);

  if (!items || items.length === 0) return null;

  return (
    <nav className={cn("relative w-full", className)} aria-label="Table of Contents">
      {!hideHeader && (
        <h4 className="text-muted-foreground mb-3 text-xs font-black tracking-widest uppercase select-none">
          <I18n>On this page</I18n>
        </h4>
      )}
      <ul className="border-border/60 flex flex-col space-y-1.5 border-l">
        {items.map((item) => {
          const isActive = activeId === item.id;
          const indent = item.level > 2 ? `${(item.level - 2) * 0.75}rem` : "0rem";

          return (
            <li key={item.id} style={{ paddingLeft: indent }}>
              <a
                href={`#${item.id}`}
                className={cn(
                  "-ml-px block border-l-2 py-1 pl-3 text-xs leading-relaxed transition-all",
                  isActive
                    ? "border-primary text-primary font-bold"
                    : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
                )}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
                  setActiveId(item.id);
                }}
                aria-current={isActive ? "location" : undefined}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}