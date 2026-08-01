"use client";

import { useMemo } from "react";
import { usePublishedClients } from "../hooks/useClient";
import { ClientCard } from "./ClientCard";
import { SectionEngine } from "@/shared/components/sections/SectionEngine";
import { Client } from "../types/client.types";

export function ClientSection() {
  const { data, isLoading, error } = usePublishedClients();

  const clients = useMemo<Client[]>(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    const res = data as any;
    return res.data?.data || res.data || [];
  }, [data]);

  const filters = useMemo(() => {
    const list = new Set<boolean>();
    clients.forEach((item) => {
      list.add(item.isFeatured);
    });

    if (list.size === 0) return [];

    return [
      {
        key: "isFeatured",
        placeholder: "Type",
        options: [
          { label: "Featured Clients", value: "true" },
          { label: "Regular Clients", value: "false" },
        ],
      },
    ];
  }, [clients]);

  return (
    <SectionEngine<Client>
      data={data}
      isLoading={isLoading}
      error={error}
      searchKey="title"
      searchPlaceholder="Search clients..."
      filters={filters}
      renderCard={(item) => <ClientCard client={item} className="h-full w-full" />}
    />
  );
}
