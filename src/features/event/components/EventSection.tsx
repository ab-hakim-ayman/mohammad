"use client";

import { useMemo } from "react";
import { usePublishedEvents } from "../hooks/useEvent";
import { EventCard } from "./EventCard";
import { SectionEngine } from "@/shared/components/sections/SectionEngine";
import { Event } from "../types/event.types";

export function EventSection() {
  const { data, isLoading, error } = usePublishedEvents();

  const events = useMemo<Event[]>(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    const res = data as any;
    return res.data?.data || res.data || [];
  }, [data]);

  const filters = useMemo(() => {
    const formats = new Set<string>();
    const costs = new Set<string>();

    events.forEach((item) => {
      if (item.format) formats.add(item.format);
      costs.add(item.isFree ? "Free" : "Paid");
    });

    const configs = [];

    if (formats.size > 0) {
      configs.push({
        key: "format",
        placeholder: "Format",
        options: Array.from(formats).map((f) => ({ label: f.replace("_", " "), value: f })),
      });
    }

    if (costs.size > 0) {
      configs.push({
        key: "isFree",
        placeholder: "Cost",
        options: [
          { label: "Free", value: "true" },
          { label: "Paid", value: "false" },
        ],
      });
    }

    return configs;
  }, [events]);

  return (
    <SectionEngine<Event>
      data={data}
      isLoading={isLoading}
      error={error}
      searchPlaceholder="Filter events by keyword..."
      searchFields={(item) => [item.title, item.slug, item.shortDesc || "", item.location || ""]}
      filters={filters}
      renderCard={(item) => (
        <EventCard event={item} variant="classic" size="md" className="h-full w-full" />
      )}
    />
  );
}
