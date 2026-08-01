import { ScrollReveal } from "@/shared/components/ScrollReveal";
import { Quote } from "lucide-react";
import I18n from "@/shared/components/I18n";

interface QuoteBlockProps {
  quote: string;
  authorName?: string;
  authorRole?: string;
}

export function QuoteBlock({ quote, authorName, authorRole }: QuoteBlockProps) {
  if (!quote) return null;

  return (
    <ScrollReveal className="border-border bg-muted my-8 rounded-xl border p-8 shadow-xs 3xl:my-10 5xl:my-12 3xl:p-10 5xl:p-12 sm:p-12">
      <Quote className="text-primary/40 h-10 w-10" />
      <p className="text-foreground mt-6 text-xl leading-relaxed italic md:text-2xl">
        <I18n>&quot;</I18n>
        {quote}
        <I18n>&quot;</I18n>
      </p>
      {(authorName || authorRole) && (
        <div className="mt-8">
          {authorName && <p className="text-foreground font-semibold">{authorName}</p>}
          {authorRole && <p className="text-muted-foreground text-sm">{authorRole}</p>}
        </div>
      )}
    </ScrollReveal>
  );
}
