import { Quote } from "lucide-react";
import Image from "next/image";
import { Separator } from "@base-ui/react/separator";
import I18n from "@/shared/components/I18n";

export interface TestimonialItem {
  id: string;
  authorName: string;
  message: string;
  authorPosition?: string | null;
  company?: string | null;
  authorImage?: string | null;
}

interface TestimonialCardProps {
  testimonial: TestimonialItem;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className="group border-border bg-card hover:border-primary/20 hover:shadow-soft-hover relative flex h-full flex-col justify-between overflow-hidden rounded-none sm:rounded-lg border p-8 shadow-xs transition-all hover:-translate-y-1 3xl:p-10 5xl:p-12 sm:p-10">
      <div className="text-primary/5 group-hover:text-primary/10 absolute -top-6 -right-6 transition-transform duration-500 group-hover:scale-110">
        <Quote className="h-40 w-40 rotate-12" />
      </div>

      <div className="relative z-10">
        <Quote className="text-primary/40 h-8 w-8" />
        <p className="text-foreground mt-6 text-lg leading-relaxed italic sm:text-xl">
          <I18n>&quot;</I18n>
          {testimonial.message}
          <I18n>&quot;</I18n>
        </p>
      </div>

      <div className="relative z-10 mt-10 flex flex-col gap-6 pt-6">
        <Separator className="bg-border h-px w-full" />
        <div className="flex items-center gap-4">
          {testimonial.authorImage ? (
            <div className="border-border relative h-12 w-12 shrink-0 overflow-hidden rounded-full border">
              <Image
                src={testimonial.authorImage}
                alt={testimonial.authorName}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="bg-primary/10 text-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-xl font-bold">
              {testimonial.authorName.charAt(0)}
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-foreground font-semibold">{testimonial.authorName}</span>
            {(testimonial.authorPosition || testimonial.company) && (
              <span className="text-muted-foreground text-sm">
                {testimonial.authorPosition}
                {testimonial.authorPosition && testimonial.company && " at "}
                {testimonial.company && (
                  <span className="text-foreground/80 font-medium">{testimonial.company}</span>
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
