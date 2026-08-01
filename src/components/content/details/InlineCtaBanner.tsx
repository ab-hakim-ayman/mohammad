import { ArrowUpRight } from "lucide-react";
import { Link } from "@/shared/i18n";
import { ScrollReveal } from "@/shared/components/ScrollReveal";

interface InlineCtaBannerProps {
  title: string;
  description?: string;
  primaryCta?: {
    label: string;
    href: string;
  };
}

export function InlineCtaBanner({ title, description, primaryCta }: InlineCtaBannerProps) {
  if (!title) return null;

  return (
    <section className="bg-muted py-16 sm:py-24">
      <div className="container-custom">
        <ScrollReveal className="bg-card shadow-soft relative overflow-hidden rounded-xl px-6 py-16 text-center sm:px-12 sm:py-20 lg:px-20">
          <div className="relative z-10 mx-auto max-w-3xl">
            <h2 className="text-foreground text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              {title}
            </h2>
            {description && <p className="text-muted-foreground mt-6 text-lg">{description}</p>}
            {primaryCta && (
              <div className="mt-10">
                <Link
                  href={primaryCta.href}
                  className="bg-primary text-primary-foreground shadow-brand hover:bg-primary-hover hover:shadow-brand-hover inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-semibold transition-all hover:-translate-y-1"
                >
                  {primaryCta.label}
                  <ArrowUpRight className="h-5 w-5" />
                </Link>
              </div>
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
