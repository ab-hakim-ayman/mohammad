"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Search,
  ArrowUpDown,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  ExternalLink,
  Calendar,
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  RotateCcw,
} from "lucide-react";

import I18n from "@/shared/components/I18n";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Select } from "@/shared/components/Select";
import { DataTableEngineProps } from "./data-table-engine.types";

export function DataTableEngine<TData extends Record<string, any>>({
  data,
  columns: columnConfigs,
  searchKey,
  searchPlaceholder = "Filter records...",
  filters = [],
  onView,
  onEdit,
  onDelete,
  bulkActions = [],
  pageCount = 1,
  currentPage = 1,
  onPageChange,
  isLoading = false,
  headerActions,
  enableExport = true,
  // 👉 সার্ভার-সাইড কন্ট্রোলের জন্য প্রপসগুলো রিসিভ করা হলো
  searchValue = "",
  onSearchChange,
  filterValues = {},
  onFilterChange,
}: DataTableEngineProps<TData> & {
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  filterValues?: Record<string, string>;
  onFilterChange?: (vals: Record<string, string>) => void;
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = React.useState({});

  const hasActiveFilters = searchValue.trim() !== "" || Object.keys(filterValues).length > 0;

  const handleResetFilters = () => {
    if (onSearchChange) onSearchChange("");
    if (onFilterChange) onFilterChange({});
  };

  const getNestedValue = (obj: any, path: string) => {
    if (!path) return undefined;
    return path.split(".").reduce((acc, part) => acc && acc[part], obj);
  };

  const tableColumns = useMemo<ColumnDef<TData, any>[]>(() => {
    const cols: ColumnDef<TData, any>[] = [];

    // 1. Checkbox Column
    cols.push({
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || table.getIsSomePageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="border-border/80 rounded-md"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="border-border/80 rounded-md"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    });

    // 2. Dynamic Columns
    columnConfigs.forEach((col) => {
      cols.push({
        accessorKey: col.key,
        header: ({ column }) => {
          if (col.sortable) {
            return (
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground -ml-3 h-8 text-[11px] font-bold tracking-wider uppercase hover:bg-transparent"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                <I18n>{col.header}</I18n>
                <ArrowUpDown className="ml-1.5 h-3 w-3" />
              </Button>
            );
          }
          return (
            <span className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
              <I18n>{col.header}</I18n>
            </span>
          );
        },
        cell: ({ row }) => {
          const item = row.original;
          const val = getNestedValue(item, col.key);

          if (col.render) return col.render(item);

          switch (col.type) {
            case "status":
            case "badge":
              return val ? (
                <Badge
                  variant={val === "PUBLISHED" || val === "ACTIVE" ? "default" : "secondary"}
                  className="rounded-md text-[10px] font-bold tracking-wider uppercase"
                >
                  {String(val)}
                </Badge>
              ) : (
                <span className="text-muted-foreground/40">—</span>
              );

            case "boolean":
              return (
                <Badge
                  variant={val ? "default" : "outline"}
                  className="rounded-md text-[10px] font-bold tracking-wider uppercase"
                >
                  {val ? "Yes" : "No"}
                </Badge>
              );

            case "image":
              return val ? (
                <div className="bg-muted/20 border-border/80 relative h-8 w-8 overflow-hidden rounded-xl border">
                  <Image src={String(val)} alt="" fill unoptimized className="object-cover" />
                </div>
              ) : (
                <span className="text-muted-foreground/40">—</span>
              );

            case "date":
            case "datetime":
              return val ? (
                <span className="text-foreground/90 inline-flex items-center gap-1 font-mono text-xs">
                  <Calendar className="text-muted-foreground h-3 w-3" />
                  {new Date(val).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              ) : (
                <span className="text-muted-foreground/40">—</span>
              );

            case "link":
              return val ? (
                <a
                  href={String(val)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary inline-flex max-w-[150px] items-center gap-1 truncate font-mono text-xs hover:underline"
                >
                  {String(val)}
                  <ExternalLink className="h-2.5 w-2.5 shrink-0" />
                </a>
              ) : (
                <span className="text-muted-foreground/40">—</span>
              );

            case "relation": {
              const relItems = Array.isArray(val) ? val : val ? [val] : [];
              if (relItems.length === 0) {
                return <span className="text-muted-foreground/40">—</span>;
              }

              if (relItems.length === 1) {
                const r = relItems[0];
                return (
                  <Link href={`/admin/${col.hrefPrefix || "items"}/${r.id}`}>
                    <Badge
                      variant="outline"
                      className="hover:border-primary/50 border-border/60 cursor-pointer rounded-lg text-[10px] font-semibold transition-colors"
                    >
                      {r.title || r.name}
                    </Badge>
                  </Link>
                );
              }

              const firstItem = relItems[0];
              const remainingCount = relItems.length - 1;

              return (
                <div className="flex items-center gap-1.5">
                  <Link href={`/admin/${col.hrefPrefix || "items"}/${firstItem.id}`}>
                    <Badge
                      variant="outline"
                      className="hover:border-primary/50 border-border/60 cursor-pointer rounded-lg text-[10px] font-semibold transition-colors"
                    >
                      {firstItem.title || firstItem.name}
                    </Badge>
                  </Link>

                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <button className="border-border/80 bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground inline-flex h-5 cursor-pointer items-center gap-1 rounded-md border px-1.5 text-[10px] font-bold tracking-wider transition-all outline-none select-none" />
                      }
                    >
                      <span>+{remainingCount} more</span>
                      <ChevronDown className="h-2.5 w-2.5 opacity-70" />
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      align="start"
                      className="border-border/80 bg-popover/95 animate-in fade-in-80 zoom-in-95 z-50 min-w-36 space-y-1 rounded-xl border p-1.5 shadow-xl backdrop-blur-xl"
                    >
                      <div className="text-muted-foreground border-border/40 border-b px-2 py-1 text-[9px] font-bold tracking-widest uppercase">
                        All {col.header} ({relItems.length})
                      </div>
                      <div className="max-h-40 space-y-0.5 overflow-y-auto">
                        {relItems.map((r: any, idx: number) => (
                          <DropdownMenuItem
                            key={idx}
                            render={
                              <Link
                                href={`/admin/${col.hrefPrefix || "items"}/${r.id}`}
                                className="hover:bg-muted/60 flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-xs font-medium transition-colors"
                              />
                            }
                          >
                            <span>{r.title || r.name}</span>
                            <ExternalLink className="text-muted-foreground h-2.5 w-2.5" />
                          </DropdownMenuItem>
                        ))}
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              );
            }

            default:
              return (
                <span className="text-foreground/90 block max-w-[220px] truncate text-xs font-semibold">
                  {val ?? <span className="text-muted-foreground/40">—</span>}
                </span>
              );
          }
        },
      });
    });

    // 3. Actions Dropdown Column
    if (onView || onEdit || onDelete) {
      cols.push({
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <button className="hover:bg-card border-border/80 bg-background/60 flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl border p-0 shadow-2xs backdrop-blur-md transition-all outline-none" />
                  }
                >
                  <MoreHorizontal className="text-muted-foreground h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="border-border/80 bg-popover/95 animate-in fade-in-80 zoom-in-95 w-40 space-y-0.5 rounded-2xl border p-1.5 shadow-xl backdrop-blur-xl"
                >
                  {onView && (
                    <DropdownMenuItem
                      onClick={() => onView(item)}
                      className="hover:bg-muted/80 cursor-pointer rounded-xl px-2.5 py-1.5 text-xs font-semibold transition-all"
                    >
                      <Eye className="text-muted-foreground mr-2 h-3.5 w-3.5" />
                      <I18n>View Details</I18n>
                    </DropdownMenuItem>
                  )}
                  {onEdit && (
                    <DropdownMenuItem
                      onClick={() => onEdit(item)}
                      className="hover:bg-muted/80 cursor-pointer rounded-xl px-2.5 py-1.5 text-xs font-semibold transition-all"
                    >
                      <Pencil className="text-success mr-2 h-3.5 w-3.5" />
                      <I18n>Edit</I18n>
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <DropdownMenuItem
                      onClick={() => onDelete(item)}
                      className="text-destructive focus:bg-destructive/10 hover:bg-destructive/10 cursor-pointer rounded-xl px-2.5 py-1.5 text-xs font-bold transition-colors"
                    >
                      <Trash2 className="mr-2 h-3.5 w-3.5" />
                      <I18n>Delete</I18n>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      });
    }

    return cols;
  }, [columnConfigs, onView, onEdit, onDelete]);

  const table = useReactTable({
    data: data, // সরাসরি ব্যাকএন্ড ডেটা পাস করা হলো
    columns: tableColumns,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const selectedRows = table.getSelectedRowModel().rows.map((r) => r.original);

  const handleExportCSV = () => {
    if (!data.length) return;
    const headers = columnConfigs.map((c) => c.header).join(",");
    const rows = data.map((row) =>
      columnConfigs.map((c) => `"${getNestedValue(row, c.key) ?? ""}"`).join(",")
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full space-y-4 select-none">
      {/* Table Control Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          {searchKey && (
            <div className="relative w-full sm:w-64">
              <Search className="text-muted-foreground/60 absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2" />
              <Input
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => {
                  if (onSearchChange) onSearchChange(e.target.value);
                }}
                className="bg-background/60 border-border/80 focus-visible:ring-primary/25 h-10 rounded-full pl-9 text-xs backdrop-blur-md transition-all focus-visible:ring-2"
              />
            </div>
          )}

          {filters.map((filter) => {
            const allOption = { label: `All ${filter.placeholder}`, value: "All" };
            const mergedOptions = [allOption, ...filter.options];

            return (
              <div key={filter.key} className="w-36">
                <Select
                  options={mergedOptions}
                  value={filterValues[filter.key] || "All"}
                  onValueChange={(val) => {
                    if (onFilterChange) {
                      const next = { ...filterValues };
                      if (val === "All" || !val) {
                        delete next[filter.key];
                      } else {
                        next[filter.key] = val;
                      }
                      onFilterChange(next);
                    }
                  }}
                  className="bg-background/60 border-border/80 rounded-full text-xs backdrop-blur-md"
                />
              </div>
            );
          })}

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="text-muted-foreground hover:text-foreground h-9 gap-1.5 rounded-xl px-3 text-xs font-bold transition-all"
            >
              <RotateCcw className="h-3 w-3" />
              <I18n>Reset Filters</I18n>
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {selectedRows.length > 0 && bulkActions.length > 0 && (
            <div className="animate-in fade-in border-border/60 flex items-center gap-2 border-r pr-2">
              <span className="text-muted-foreground text-xs font-semibold">
                {selectedRows.length} selected
              </span>
              {bulkActions.map((action, i) => (
                <Button
                  key={i}
                  size="sm"
                  variant={action.variant || "outline"}
                  onClick={() => action.onClick(selectedRows)}
                  className="h-9 rounded-xl px-3 text-xs font-bold shadow-2xs"
                >
                  {action.icon && <span className="mr-1.5">{action.icon}</span>}
                  <I18n>{action.label}</I18n>
                </Button>
              ))}
            </div>
          )}

          {enableExport && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              className="border-border/80 bg-background/60 h-9 rounded-xl px-3 text-xs font-semibold shadow-2xs backdrop-blur-md"
            >
              <Download className="text-muted-foreground mr-1.5 h-3.5 w-3.5" />
              <I18n>Export</I18n>
            </Button>
          )}

          {headerActions}
        </div>
      </div>

      {/* Table Glass Shell */}
      <div className="border-border/80 bg-card/60 w-full overflow-hidden rounded-2xl border shadow-2xs backdrop-blur-md">
        <Table>
          <TableHeader className="bg-muted/30 border-border/60 border-b">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-none hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-muted-foreground h-9 px-4 align-middle text-[11px] font-bold tracking-widest uppercase"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={tableColumns.length}
                  className="text-muted-foreground h-32 text-center text-xs font-semibold"
                >
                  <I18n>Loading data...</I18n>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-border/60 hover:bg-muted/30 data-[state=selected]:bg-muted/40 border-b transition-colors last:border-b-0"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="text-foreground px-4 py-2.5 align-middle text-xs tracking-tight"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={tableColumns.length}
                  className="text-muted-foreground h-32 text-center text-xs font-semibold"
                >
                  <I18n>No results found.</I18n>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {pageCount > 1 && onPageChange && (
        <div className="border-border/60 flex items-center justify-between border-t pt-3">
          <div className="text-muted-foreground text-xs font-semibold">
            <I18n>Page</I18n> <span className="text-foreground font-bold">{currentPage}</span>{" "}
            <I18n>of</I18n> {pageCount}
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="border-border/80 h-8 rounded-xl px-2.5 text-xs font-bold shadow-2xs"
            >
              <ChevronLeft className="mr-1 h-3.5 w-3.5" />
              <I18n>Prev</I18n>
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= pageCount}
              onClick={() => onPageChange(currentPage + 1)}
              className="border-border/80 h-8 rounded-xl px-2.5 text-xs font-bold shadow-2xs"
            >
              <I18n>Next</I18n>
              <ChevronRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}