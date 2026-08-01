"use client";

import { useMemo } from "react";
import { usePublishedSpecializations } from "../hooks/useSpecialization";
import { SpecializationCard } from "./SpecializationCard";
import { SectionEngine } from "@/shared/components/sections/SectionEngine";
import { Specialization } from "../types/specialization.types";

export function SpecializationSection() {
  const { data, isLoading, error } = usePublishedSpecializations();

  const specializations = useMemo<Specialization[]>(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    const res = data as any;
    return res.data?.data || res.data || [];
  }, [data]);

  const filters = useMemo(() => {
    const list = new Set<string>();
    specializations.forEach((item) => {
      item.services?.forEach((service) => {
        if (service.title) list.add(service.title);
      });
    });

    if (list.size === 0) return [];

    return [
      {
        key: "services",
        placeholder: "Service",
        options: Array.from(list).map((svc) => ({ label: svc, value: svc })),
      },
    ];
  }, [specializations]);

  return (
    <SectionEngine<Specialization>
      data={data}
      isLoading={isLoading}
      error={error}
      searchKey="title"
      searchPlaceholder="Search specializations..."
      filters={filters}
      renderCard={(item) => (
        <SpecializationCard
          specialization={item}
          variant="classic"
          size="md"
          className="h-full w-full"
        />
      )}
    />
  );
}
