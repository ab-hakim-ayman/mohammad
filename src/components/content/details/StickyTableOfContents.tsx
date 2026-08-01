"use client";

import { useEffect, useState } from "react";
import I18n from "@/shared/components/I18n";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface StickyTableOfContentsProps {
  items: TocItem[];
}

export function StickyTableOfContents({ items }: StickyTableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
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
  }, [items]);

  if (!items || items.length === 0) return null;

  return (
    <nav className="sticky top-24 hidden lg:block" aria-label="Table of Contents">
      <h4 className="text-foreground text-sm font-semibold tracking-[0.2em] uppercase">
        <I18n>On this page</I18n>
      </h4>
      <ul className="border-border mt-4 space-y-3 border-l">
        {items.map((item) => (
          <li key={item.id} style={{ paddingLeft: `${(item.level - 2) * 1}rem` }}>
            <a
              href={`#${item.id}`}
              className={`-ml-px block border-l-2 py-1 pl-4 text-sm transition-colors ${
                activeId === item.id
                  ? "border-primary text-primary font-medium"
                  : "text-muted-foreground hover:border-border hover:text-foreground border-transparent"
              }`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
                setActiveId(item.id);
              }}
              aria-current={activeId === item.id ? "location" : undefined}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
