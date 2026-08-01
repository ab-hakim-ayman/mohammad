"use client";

import Image from "next/image";
import { Building2 } from "lucide-react";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { PreviewSectionHeader } from "@/shared/components";
import { ScrollReveal } from "@/shared/components/ScrollReveal";
import { Link } from "@/shared/i18n";
import { usePublishedClients } from "../hooks/useClient";
import { Client } from "../types/client.types"; // 👈 আপনার প্রজেক্টের Client টাইপ অনুযায়ী নিশ্চিত করুন

interface ClientPreviewSectionProps {
  limit?: number;

  // 🟢 ১. যেকোনো Details Page থেকে ম্যানুয়ালি ক্লায়েন্ট অ্যারে পাস করার ব্যবস্থা
  items?: Client[];

  // 🟢 ২. কাস্টম হেডার কনফিগারেশন প্রপস
  eyebrow?: string;
  title?: string;
  description?: string;
  href?: string;
  ctaLabel?: string;
  hideHeader?: boolean;
}

export function ClientPreviewSection({
  limit = 14,
  items: externalItems,
  eyebrow = "Client roster",
  title = "Trusted by ambitious teams and growing businesses",
  description = "A selection of organizations we are proud to support through meaningful digital work.",
  href = "/clients",
  ctaLabel = "View all clients",
  hideHeader = false,
}: ClientPreviewSectionProps) {
  const requestedLimit = Math.max(limit, 1);

  // 🎯 যদি বাইর থেকে items না আসে, কেবল তখনই API ফেচ হবে
  const shouldFetch = !externalItems;

  const { data, isLoading: isApiLoading } = usePublishedClients(
    shouldFetch ? { limit: requestedLimit } : undefined
  );

  const visibleClients = useMemo(() => {
    // 🎯 বাইর থেকে সরাসরি items পাস করলে সেটি প্রাধান্য পাবে
    if (externalItems) {
      return [...externalItems]
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .slice(0, requestedLimit);
    }

    const rawData = data?.data || (Array.isArray(data) ? data : []);
    return [...rawData].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).slice(0, requestedLimit);
  }, [externalItems, data, requestedLimit]);

  const isLoading = shouldFetch && isApiLoading;

  // 🟢 স্কেলেটন লেআউট
  if (isLoading) {
    return (
      <section className="bg-background 3xl:py-24 relative isolate w-full overflow-hidden py-12 sm:py-16 lg:py-20">
        <div className="container-custom">
          {!hideHeader && (
            <div className="mb-8 space-y-2">
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-10 w-72 rounded" />
              <Skeleton className="h-5 w-96 rounded" />
            </div>
          )}

          <div className="flex w-full flex-wrap items-stretch justify-center gap-3">
            {Array.from({ length: requestedLimit }).map((_, i) => (
              <Card
                key={i}
                className="border-border bg-card/50 flex min-h-[118px] w-[calc(50%-0.5rem)] max-w-[200px] flex-col items-center justify-center gap-3 border p-4 sm:w-[calc(33.333%-0.85rem)] md:w-[calc(25%-0.95rem)] lg:w-[calc(20%-1rem)] xl:w-[calc(16.666%-1.05rem)]"
              >
                <Skeleton className="h-12 w-12 rounded-md" />
                <Skeleton className="h-3 w-16" />
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // 🎯 ডাটা না থাকলে পুরো সেকশনটি অটোমেটিক হাইড থাকবে
  if (!visibleClients.length) return null;

  return (
    <section className="bg-background 3xl:py-24 relative isolate w-full overflow-hidden py-12 sm:py-16 lg:py-20">
      <div className="bg-primary/10 pointer-events-none absolute top-0 left-0 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" />
      <div className="bg-primary/5 pointer-events-none absolute right-0 bottom-0 h-80 w-80 translate-x-1/3 translate-y-1/3 rounded-full blur-3xl" />

      <div className="container-custom relative">
        {/* 🎯 hideHeader = false হলেই কেবল হেডার দেখাবে */}
        {!hideHeader && (
          <ScrollReveal className="mb-10">
            <PreviewSectionHeader
              eyebrow={eyebrow}
              title={title}
              description={description}
              href={href}
              ctaLabel={ctaLabel}
            />
          </ScrollReveal>
        )}

        {/* 🔧 EXACT SAME CARD GRID MATRIX */}
        <div className="flex w-full flex-wrap items-stretch justify-center gap-3">
          {visibleClients.map((client, index) => (
            <ScrollReveal
              key={client.id}
              delay={(index % 7) * 40}
              className="flex w-[calc(50%-0.5rem)] max-w-[200px] shrink-0 flex-col sm:w-[calc(33.333%-0.85rem)] md:w-[calc(25%-0.95rem)] lg:w-[calc(20%-1rem)] xl:w-[calc(16.666%-1.05rem)]"
            >
              <Card className="group border-border bg-card hover:border-primary/40 hover:bg-primary-subtle flex h-full min-h-[118px] w-full cursor-pointer flex-col items-center justify-center gap-3 border p-4 text-center transition-all duration-300 ease-out hover:-translate-y-1">
                <Link
                  href={`/clients/${client.id}`}
                  className="flex w-full flex-col items-center gap-3"
                >
                  <span className="sr-only">{client.title}</span>
                  <div className="relative h-12 w-12 shrink-0 transition-transform duration-300 group-hover:scale-105">
                    {client.logo ? (
                      <Image
                        src={client.logo}
                        alt={`${client.title} logo`}
                        fill
                        sizes="48px"
                        unoptimized
                        className="object-contain"
                      />
                    ) : (
                      <span className="text-muted-foreground flex h-full w-full items-center justify-center">
                        <Building2 className="h-7 w-7" />
                      </span>
                    )}
                  </div>

                  <p className="text-foreground group-hover:text-primary line-clamp-2 text-xs leading-snug font-semibold transition-colors duration-300 sm:text-sm">
                    {client.title}
                  </p>
                </Link>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
