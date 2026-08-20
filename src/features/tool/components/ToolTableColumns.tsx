import type { ColumnConfig } from "@/shared/components/tables/data-table-engine.types";
import { Badge } from "@/components/ui/badge";
import { Wrench, Cpu, Star } from "lucide-react";
import type { Tool } from "../types/tool.types";

export const toolTableColumns: ColumnConfig<Tool>[] = [
  {
    key: "title",
    header: "Tool Title",
    sortable: true,
    render: (item) => (
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {item.icon ? (
            <span className="text-sm">{item.icon}</span>
          ) : item.engineType === "CUSTOM" ? (
            <Cpu className="h-4 w-4" />
          ) : (
            <Wrench className="h-4 w-4" />
          )}
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-foreground">{item.title}</span>
          <span className="font-mono text-[10px] text-muted-foreground">/{item.slug}</span>
        </div>
      </div>
    ),
  },
  {
    key: "category",
    header: "Category",
    sortable: true,
    render: (item) => (
      <Badge variant="outline" className="rounded-md font-mono text-[10px] uppercase font-bold tracking-wider">
        {item.category}
      </Badge>
    ),
  },
  {
    key: "engineType",
    header: "Engine Mode",
    sortable: true,
    render: (item) => (
      <div className="flex items-center gap-1.5">
        <Badge
          className={`rounded-md text-[10px] font-bold ${
            item.engineType === "CUSTOM"
              ? "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-none"
              : "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-none"
          }`}
        >
          {item.engineType}
        </Badge>
        <span className="font-mono text-[10px] text-muted-foreground truncate max-w-[120px]">
          {item.engineType === "CUSTOM" ? item.componentKey : item.actionKey}
        </span>
      </div>
    ),
  },
  {
    key: "status",
    header: "Status",
    type: "status",
    sortable: true,
  },
  {
    key: "isFeatured",
    header: "Featured",
    render: (item) => (
      item.isFeatured ? (
        <span className="inline-flex items-center text-xs font-semibold text-amber-500">
          <Star className="mr-1 h-3.5 w-3.5 fill-amber-500 text-amber-500" />
          Yes
        </span>
      ) : (
        <span className="text-xs text-muted-foreground">No</span>
      )
    ),
  },
  {
    key: "order",
    header: "Order",
    type: "text",
    sortable: true,
  },
  {
    key: "createdAt",
    header: "Created At",
    type: "datetime",
    sortable: true,
  },
];
