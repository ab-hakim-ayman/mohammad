"use client";

import { useMemo } from "react";
import { usePublishedPartners } from "../hooks/usePartner";
import { PartnerCard } from "./PartnerCard";
import { SectionEngine } from "@/shared/components/sections/SectionEngine";
import { Partner } from "../types/partner.types";

export function PartnerSection() {
  const { data, isLoading, error } = usePublishedPartners();

  const partners = useMemo<Partner[]>(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    const res = data as any;
    return res.data?.data || res.data || [];
  }, [data]);

  const filters = useMemo(() => {
    const types = new Set<string>();

    partners.forEach((item) => {
      if (item.type) types.add(item.type);
    });

    const configs = [];

    if (types.size > 0) {
      configs.push({
        key: "type",
        placeholder: "Type",
        options: Array.from(types).map((t) => ({ label: t.replace("_", " "), value: t })),
      });
    }

    return configs;
  }, [partners]);

  return (
    <SectionEngine<Partner>
      data={data}
      isLoading={isLoading}
      error={error}
      searchPlaceholder="Search partners..."
      searchFields={(item) => [
        item.title,
        item.shortDesc || "",
        item.website || "",
        item.type || "",
      ]}
      filters={filters}
      renderCard={(item) => (
        <PartnerCard partner={item} variant="classic" size="md" className="h-full w-full" />
      )}
    />
  );
}
