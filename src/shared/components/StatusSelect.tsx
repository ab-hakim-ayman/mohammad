"use client";

import {
  Select as BaseSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type StatusValue =
  "DRAFT" | "PUBLISHED" | "ARCHIVED" | "PENDING" | "ACTIVE" | "INACTIVE" | string;

export type StatusOption = {
  label: string;
  value: StatusValue;
  dotColor?: string;
};

const defaultStatusOptions: StatusOption[] = [
  { label: "Published", value: "PUBLISHED", dotColor: "bg-success" },
  { label: "Draft", value: "DRAFT", dotColor: "bg-muted-foreground/60" },
  { label: "Archived", value: "ARCHIVED", dotColor: "bg-muted-foreground/60" },
];

export type StatusSelectProps = {
  value?: string;
  onChange?: (value: string) => void;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  options?: StatusOption[];
};

export function StatusSelect({
  value,
  onChange,
  name,
  required,
  disabled,
  className,
  placeholder = "Select status",
  options = defaultStatusOptions,
}: StatusSelectProps) {
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <BaseSelect
      name={name}
      value={value}
      onValueChange={(val) => onChange?.(val || "")}
      disabled={disabled}
      required={required}
    >
      {/* 🟢 Vercel Style Select Trigger */}
      <SelectTrigger
        className={cn(
          "border-border/80 bg-card/60 text-foreground box-border flex h-10 w-full items-center justify-between gap-2.5 rounded-xl border px-3.5 py-2 text-left text-xs font-semibold shadow-2xs backdrop-blur-md transition-all duration-200 select-none sm:text-sm",
          "hover:border-border hover:bg-card/90",
          "focus:border-primary/50 focus:bg-background focus:ring-primary/10 focus:ring-2 focus:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "[&>svg]:text-muted-foreground/80 [&>svg]:size-4 [&>svg]:transition-transform data-[state=open]:[&>svg]:rotate-180",
          className
        )}
      >
        <div className="flex items-center gap-2 truncate">
          {selectedOption?.dotColor && (
            <span className={cn("h-2 w-2 shrink-0 rounded-full", selectedOption.dotColor)} />
          )}
          <SelectValue placeholder={placeholder} />
        </div>
      </SelectTrigger>

      {/* 🟢 Floating Menu List */}
      <SelectContent
        className={cn(
          "border-border/80 bg-popover/90 text-popover-foreground z-50 max-h-60 w-[var(--radix-select-trigger-width)] overflow-y-auto rounded-xl border p-1 shadow-xl backdrop-blur-xl",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
        )}
      >
        <div className="grid w-full gap-0.5">
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className={cn(
                "text-foreground/90 relative flex w-full cursor-pointer items-center rounded-lg px-3 py-2 text-xs font-medium transition-colors outline-none select-none sm:text-sm",
                "hover:bg-muted/80 hover:text-foreground",
                "focus:bg-muted/80 focus:text-foreground",
                "data-[selected]:bg-primary/10 data-[selected]:text-primary data-[selected]:font-semibold"
              )}
            >
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "h-2 w-2 shrink-0 rounded-full",
                    option.dotColor || "bg-muted-foreground/50"
                  )}
                />
                <span>{option.label}</span>
              </div>
            </SelectItem>
          ))}
        </div>
      </SelectContent>
    </BaseSelect>
  );
}
