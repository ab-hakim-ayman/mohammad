import { Link } from "@/shared/i18n";

interface BadgeItem {
  id: string;
  name?: string;
  title?: string;
  slug?: string;
}

interface BadgeListProps {
  items: BadgeItem[];
  hrefPrefix?: string;
}

export function BadgeList({ items, hrefPrefix }: BadgeListProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-3">
      {items.map((item) => {
        const content = item.name || item.title;
        const className =
          "inline-flex items-center rounded-full border border-border bg-muted px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-background hover:text-primary";

        if (hrefPrefix) {
          const isQueryParam = hrefPrefix.endsWith("=");
          const key = item.slug || item.id;
          const href = isQueryParam ? `${hrefPrefix}${key}` : `${hrefPrefix}/${key}`;
          return (
            <Link key={item.id} href={href} className={className}>
              {content}
            </Link>
          );
        }

        return (
          <span
            key={item.id}
            className="border-border bg-card text-foreground inline-flex items-center rounded-full border px-5 py-3 text-sm font-semibold"
          >
            {content}
          </span>
        );
      })}
    </div>
  );
}
