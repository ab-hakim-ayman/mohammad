import { ChevronRight, Home } from "lucide-react";
import { Link } from "@/shared/i18n";

export interface DetailBreadcrumbProps {
  items: {
    label: string;
    href?: string;
  }[];
}

export function DetailBreadcrumb({ items }: DetailBreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="text-muted-foreground flex flex-wrap items-center gap-2 text-sm">
        <li>
          <Link
            href="/"
            className="hover:text-foreground flex items-center transition-colors"
            aria-label="Home"
          >
            <Home className="h-4 w-4" />
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center gap-2">
              <ChevronRight className="text-border h-4 w-4 shrink-0" />
              {isLast || !item.href ? (
                <span
                  className="text-foreground font-medium inline-block truncate max-w-[160px] sm:max-w-none align-bottom"
                  aria-current="page"
                  title={item.label}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-foreground transition-colors inline-block truncate max-w-[120px] sm:max-w-none align-bottom"
                  title={item.label}
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}