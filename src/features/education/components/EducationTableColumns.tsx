import { ColumnConfig } from "@/shared/components/tables/data-table-engine.types";
import { Education } from "../types/education.types";

export const educationTableColumns: ColumnConfig<Education>[] = [
  {
    key: "logo",
    header: "Logo",
    type: "image",
  },
  {
    key: "institution",
    header: "Institution",
    type: "text",
    sortable: true,
  },
  {
    key: "degree",
    header: "Degree",
    type: "text",
    sortable: true,
  },
  {
    key: "fieldOfStudy",
    header: "Field of Study",
    type: "text",
  },
  {
    key: "startDate",
    header: "Start Date",
    type: "datetime",
    sortable: true,
  },
  {
    key: "endDate",
    header: "End Date",
    render: (item) => {
      if (item.isCurrent) return <span className="text-primary font-semibold">Present</span>;
      return item.endDate ? (
        <span>{new Date(item.endDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
  },
  {
    key: "status",
    header: "Status",
    type: "status",
  },
  {
    key: "isFeatured",
    header: "Featured",
    type: "boolean",
  },
  {
    key: "order",
    header: "Order",
    render: (item) => <span className="font-mono">{item.order}</span>,
  },
];
