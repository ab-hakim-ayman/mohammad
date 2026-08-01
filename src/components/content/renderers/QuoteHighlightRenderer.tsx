import React from "react";
import { Quote } from "lucide-react";
import I18n from "@/shared/components/I18n";

export function QuoteHighlightRenderer({ block }: { block: any }) {
  const { quote, author, role } = block.props;
  if (!quote) return null;

  return (
    <figure className="border-border bg-card not-prose my-8 flex flex-col items-center rounded-xl border p-8 text-center shadow-xs transition-all duration-300 hover:shadow-md 3xl:my-12 5xl:my-16 3xl:p-10 5xl:p-12 md:p-12">
      <Quote className="text-primary/40 mb-4 h-8 w-8" />
      <blockquote className="text-foreground mb-6 xl:max-w-5xl text-center text-xl leading-snug font-semibold md:text-2xl 3xl:text-3xl 5xl:text-4xl">
        <I18n>&quot;</I18n>
        {quote}
        <I18n>&quot;</I18n>
      </blockquote>
      {(author || role) && (
        <figcaption className="flex flex-col items-center">
          {author && <div className="text-foreground text-base font-semibold">{author}</div>}
          {role && <div className="text-muted-foreground text-sm">{role}</div>}
        </figcaption>
      )}
    </figure>
  );
}
