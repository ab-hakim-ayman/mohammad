"use client";

import { Accordion } from "@base-ui/react";
import { Plus } from "lucide-react";

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
  allowMultiple?: boolean;
}

export function FaqAccordion({ items, allowMultiple = false }: FaqAccordionProps) {
  if (!items || items.length === 0) return null;

  return (
    <Accordion.Root multiple={allowMultiple} className="mx-auto w-full container-custom space-y-4">
      {items.map((item) => (
        <Accordion.Item
          key={item.id}
          value={item.id}
          className="group border-border bg-card hover:bg-muted/50 data-[state=open]:bg-muted data-open:bg-muted overflow-hidden rounded-xl border transition-colors duration-300 data-[state=open]:shadow-xs data-open:shadow-xs"
        >
          <Accordion.Header className="flex">
            <Accordion.Trigger className="group/trigger flex w-full items-center justify-between gap-4 p-6 text-left focus:outline-hidden">
              <h4 className="text-foreground pr-8 text-lg font-semibold">{item.question}</h4>
              <div className="border-border bg-background text-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-transform duration-300 ease-in-out group-data-[state=open]:rotate-45 group-aria-expanded/trigger:rotate-45">
                <Plus className="h-5 w-5" />
              </div>
            </Accordion.Trigger>
          </Accordion.Header>

          <Accordion.Panel className="grid transition-all duration-300 ease-in-out data-closed:grid-rows-[0fr] data-closed:opacity-0 data-open:grid-rows-[1fr] data-open:opacity-100">
            <div className="overflow-hidden">
              <div className="text-muted-foreground px-6 pt-2 pb-6 leading-relaxed">
                {item.answer}
              </div>
            </div>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
