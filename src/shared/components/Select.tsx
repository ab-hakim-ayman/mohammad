"use client";

import {
  Select as BaseSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type SelectOption = {
  label: string;
  value: string;
};

interface SelectProps {
  ariaLabel?: string;
  className?: string;
  defaultValue?: string;
  disabled?: boolean;
  name?: string;
  onValueChange?: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  value?: string;
}

export function Select({
  ariaLabel,
  className,
  defaultValue,
  disabled = false,
  name,
  onValueChange,
  options,
  placeholder = "Select an option",
  required = false,
  value,
}: SelectProps) {
  const selectedOpt = options.find((opt) => opt.value === value);

  return (
    <BaseSelect
      name={name}
      value={value}
      defaultValue={defaultValue}
      onValueChange={(val) => {
        if (onValueChange) {
          onValueChange(val || "");
        }
      }}
      disabled={disabled}
      required={required}
    >
      <SelectTrigger
        aria-label={ariaLabel}
        className={cn(
          "box-border flex h-10 w-full items-center justify-between gap-2.5 rounded-xl border border-border/80 bg-card/60 px-3.5 py-2 text-left text-xs font-medium text-foreground shadow-2xs backdrop-blur-md transition-all duration-200 select-none",
          "hover:border-border hover:bg-card/90",
          "focus:border-primary/50 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/10",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
      >
        <SelectValue placeholder={placeholder}>
          {selectedOpt ? selectedOpt.label : undefined}
        </SelectValue>
      </SelectTrigger>

      {/* 🟢 Select Content List */}
      <SelectContent
        className={cn(
          "z-50 max-h-64 w-[var(--radix-select-trigger-width)] overflow-y-auto rounded-2xl border border-border/80 bg-popover/95 p-1 text-popover-foreground shadow-xl backdrop-blur-xl",
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
                "relative flex w-full cursor-pointer items-center rounded-xl px-3 py-2 text-xs font-semibold text-foreground/90 transition-colors select-none outline-none",
                "hover:bg-muted/80 hover:text-foreground",
                "focus:bg-muted/80 focus:text-foreground",
                "data-[selected]:bg-primary/10 data-[selected]:text-primary"
              )}
            >
              {option.label}
            </SelectItem>
          ))}
        </div>
      </SelectContent>
    </BaseSelect>
  );
}