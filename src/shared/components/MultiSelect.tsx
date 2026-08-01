"use client";

import * as React from "react";
import { X, ChevronDown, Check } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import I18n from "@/shared/components/I18n";

type MultiSelectOption = {
  label: string;
  value: string;
};

interface MultiSelectProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  maxCount?: number;
}

export function MultiSelect({
  options,
  value = [],
  onChange,
  placeholder = "Select options...",
  className,
  disabled = false,
  maxCount = 3,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) return;
      if (e.key === "Backspace" && value.length > 0) {
        onChange(value.slice(0, -1));
      }
    },
    [value, onChange, disabled]
  );

  const toggleOption = React.useCallback(
    (optionValue: string) => {
      const newValue = value.includes(optionValue)
        ? value.filter((v) => v !== optionValue)
        : [...value, optionValue];
      onChange(newValue);
    },
    [value, onChange]
  );

  const removeOption = React.useCallback(
    (optionValue: string, e: React.MouseEvent | React.KeyboardEvent) => {
      e.stopPropagation();
      onChange(value.filter((v) => v !== optionValue));
    },
    [value, onChange]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* 🟢 Vercel Style Trigger Input Container */}
      <PopoverTrigger
        disabled={disabled}
        onKeyDown={handleKeyDown}
        className={cn(
          "box-border flex min-h-10 w-full items-center justify-between gap-2 rounded-xl border border-border/80 bg-card/60 px-3 py-1.5 text-left text-xs sm:text-sm font-medium text-foreground shadow-2xs backdrop-blur-md transition-all duration-200 select-none cursor-pointer",
          "hover:border-border hover:bg-card/90",
          "focus-visible:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/10",
          open && "border-primary/50 ring-2 ring-primary/10 bg-background",
          disabled && "pointer-events-none opacity-50 cursor-not-allowed",
          className
        )}
      >
        <div className="flex flex-1 flex-wrap items-center gap-1.5 overflow-hidden">
          {value.length === 0 ? (
            <span className="text-muted-foreground/70 px-1 text-xs sm:text-sm font-normal">
              {placeholder}
            </span>
          ) : (
            <>
              {options
                .filter((opt) => value.includes(opt.value))
                .slice(0, maxCount)
                .map((opt) => (
                  <Badge
                    key={opt.value}
                    variant="secondary"
                    className="bg-muted/80 text-foreground flex shrink-0 items-center gap-1.5 rounded-lg border border-border/60 px-2 py-0.5 text-[11px] font-semibold transition-colors hover:bg-muted"
                  >
                    <span className="max-w-[110px] truncate">{opt.label}</span>
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => removeOption(opt.value, e)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          removeOption(opt.value, e);
                        }
                      }}
                      className="text-muted-foreground hover:text-foreground inline-flex cursor-pointer rounded-sm p-0.5 hover:bg-background/60 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </span>
                  </Badge>
                ))}

              {value.length > maxCount && (
                <Badge
                  variant="secondary"
                  className="bg-muted/80 text-muted-foreground shrink-0 rounded-lg border border-border/60 px-2 py-0.5 text-[11px] font-semibold"
                >
                  +{value.length - maxCount}
                </Badge>
              )}
            </>
          )}
        </div>

        {/* Action Controls Right Side */}
        <div className="flex shrink-0 items-center gap-1">
          {value.length > 0 && (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                onChange([]);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onChange([]);
                }
              }}
              className="text-muted-foreground/70 hover:text-foreground inline-flex cursor-pointer rounded-full p-1 hover:bg-muted/60 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </span>
          )}
          <ChevronDown
            className={cn(
              "text-muted-foreground/70 h-4 w-4 transition-transform duration-200",
              open && "rotate-180"
            )}
          />
        </div>
      </PopoverTrigger>

      {/* 🟢 Stripe Style Command Popover Content */}
      <PopoverContent
        className={cn(
          "z-50 w-[var(--radix-popover-trigger-width)] overflow-hidden rounded-xl border border-border/80 bg-popover/90 p-0 text-popover-foreground shadow-xl backdrop-blur-xl",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
        )}
        align="start"
        sideOffset={4}
      >
        <Command className="bg-transparent">
          <div className="px-3 pt-2">
            <CommandInput
              placeholder="Search options..."
              className="placeholder:text-muted-foreground/50 flex h-9 w-full border-0 bg-transparent text-xs sm:text-sm outline-none focus:ring-0"
            />
          </div>

          <div className="bg-border/60 mx-2 my-1.5 h-px" />

          <CommandList className="max-h-60 overflow-y-auto p-1 pt-0">
            <CommandEmpty className="text-muted-foreground/70 py-6 text-center text-xs font-medium">
              <I18n>No results found.</I18n>
            </CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = value.includes(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => toggleOption(option.value)}
                    className={cn(
                      "flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-2 text-xs sm:text-sm font-medium transition-colors select-none",
                      isSelected
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-foreground/90 hover:bg-muted/80 hover:text-foreground"
                    )}
                  >
                    <span className="truncate">{option.label}</span>
                    {isSelected && (
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center">
                        <Check className="text-primary h-3.5 w-3.5" />
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}