"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  ExternalLink,
  Calendar,
  Sparkles,
  Check,
  X,
  User as UserIcon,
  ArrowUpRight,
} from "lucide-react";
import I18n from "@/shared/components/I18n";
import { ContentRenderer } from "@/components/content/ContentRenderer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DetailEngineProps,
  DetailFieldConfig,
  DetailSectionConfig,
  RelatedSectionConfig,
} from "./detail-engine.types";

export function DetailEngine<T extends Record<string, any>>({
  data,
  config,
}: DetailEngineProps<T>) {
  if (!data) return null;

  const getNestedValue = (obj: any, path: string) => {
    if (!path) return undefined;
    return path.split(".").reduce((acc, part) => acc && acc[part], obj);
  };

  const renderFieldValue = (field: DetailFieldConfig<T>) => {
    if (field.render) return field.render(data);

    const val = getNestedValue(data, field.key as string);

    switch (field.type) {
      case "text":
        return (
          <span className="text-foreground text-xs font-semibold break-words">
            {val ?? <span className="text-muted-foreground/40">—</span>}
          </span>
        );

      case "boolean":
        return (
          <div className="flex items-center gap-1.5">
            {val ? (
              <Badge className="bg-success/10 text-success border-success/20 text-[10px] font-bold tracking-wider uppercase">
                <Check className="mr-1 h-3 w-3" />
                Yes
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase"
              >
                <X className="mr-1 h-3 w-3" />
                No
              </Badge>
            )}
          </div>
        );

      case "badge":
      case "status":
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

      case "date":
      case "datetime":
        return val ? (
          <span className="text-foreground inline-flex items-center gap-1.5 font-mono text-xs">
            <Calendar className="text-muted-foreground h-3.5 w-3.5" />
            {new Date(val).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              ...(field.type === "datetime" ? { hour: "2-digit", minute: "2-digit" } : {}),
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
            className="text-primary inline-flex max-w-full items-center gap-1 truncate font-mono text-xs hover:underline"
          >
            {String(val)}
            <ExternalLink className="h-3 w-3 shrink-0" />
          </a>
        ) : (
          <span className="text-muted-foreground/40">N/A</span>
        );

      case "user":
        return val ? (
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 text-primary flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold">
              <UserIcon className="h-3 w-3" />
            </div>
            <span className="text-foreground text-xs font-semibold">{String(val)}</span>
          </div>
        ) : (
          <span className="text-muted-foreground/40">—</span>
        );

      case "media":
        return val ? (
          /* 🟢 Fixed: Subtle border by default, highlights cleanly on hover */
          <div className="border-border/60 bg-muted/20 group relative aspect-video w-full overflow-hidden rounded-xl border transition-all duration-300 hover:border-primary/50">
            <Image
              src={String(val)}
              alt=""
              fill
              unoptimized
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="border-border/60 bg-muted/10 text-muted-foreground flex h-20 w-full items-center justify-center rounded-xl border border-dashed text-xs">
            <I18n>No Media</I18n>
          </div>
        );

      case "media-gallery": {
        const gallery = Array.isArray(val) ? val : [];
        return gallery.length > 0 ? (
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {gallery.map((imgUrl: string, idx: number) => (
              /* 🟢 Fixed: Subtle border by default, highlights cleanly on hover */
              <div
                key={idx}
                className="border-border/60 bg-muted/20 group relative aspect-square overflow-hidden rounded-xl border transition-all duration-300 hover:border-primary/50"
              >
                <Image
                  src={imgUrl}
                  alt=""
                  fill
                  unoptimized
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        ) : (
          <span className="text-muted-foreground/40 text-xs">No gallery images available</span>
        );
      }

      case "editor":
        return val ? (
          <div className="border-border/60 bg-background/30 mt-1 rounded-xl border p-3">
            <ContentRenderer content={val} variant={(field.editorVariant as any) || "blog"} />
          </div>
        ) : (
          <span className="text-muted-foreground/40 text-xs italic">No content available</span>
        );

      default:
        return String(val ?? "—");
    }
  };

  const renderSection = (section: DetailSectionConfig<T>, index: number) => (
    <Card
      key={index}
      className="border-border/80 bg-card/60 space-y-4 rounded-2xl p-5 shadow-2xs backdrop-blur-md"
    >
      {section.title && (
        <div className="border-border/60 border-b pb-3">
          <h3 className="text-foreground text-xs font-bold tracking-widest uppercase">
            <I18n>{section.title}</I18n>
          </h3>
          {section.description && (
            <p className="text-muted-foreground mt-0.5 text-xs">{section.description}</p>
          )}
        </div>
      )}
      <dl className="grid grid-cols-12 gap-x-6 gap-y-4">
        {section.fields.map((field, fIdx) => (
          <div
            key={fIdx}
            className={`col-span-12 ${field.gridSpan ? `md:col-span-${field.gridSpan}` : "md:col-span-12"
              } space-y-1`}
          >
            <dt className="text-muted-foreground block text-[10px] font-bold tracking-widest uppercase">
              <I18n>{field.label}</I18n>
            </dt>
            <dd className="mt-0.5">{renderFieldValue(field)}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );

  const renderRelated = (rel: RelatedSectionConfig<T>, index: number) => {
    const records = rel.getRecords(data);
    if (!records || records.length === 0) return null;

    return (
      <Card
        key={index}
        className="border-border/80 bg-card/60 space-y-3 rounded-2xl p-5 shadow-2xs backdrop-blur-md"
      >
        <div className="border-border/60 flex items-center justify-between border-b pb-3">
          <h3 className="text-foreground text-xs font-bold tracking-widest uppercase">
            <I18n>{rel.title}</I18n>
          </h3>
          <Badge variant="secondary" className="text-[10px] font-bold">
            {records.length}
          </Badge>
        </div>

        {rel.variant === "badges" ? (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {records.map((rec) => (
              <Link key={rec.id} href={`/admin/${rel.hrefPrefix}/${rec.id}`}>
                <Badge
                  variant="outline"
                  className="hover:border-primary/50 flex cursor-pointer items-center gap-1 rounded-lg px-2.5 py-1 text-xs transition-colors"
                >
                  {rec.title}
                  <ArrowUpRight className="text-muted-foreground h-3 w-3" />
                </Badge>
              </Link>
            ))}
          </div>
        ) : (
          <div className="space-y-1.5 pt-1">
            {records.map((rec) => (
              <Link
                key={rec.id}
                href={`/admin/${rel.hrefPrefix}/${rec.id}`}
                className="border-border/40 bg-muted/20 hover:bg-muted/40 hover:border-border flex items-center justify-between rounded-xl border p-2.5 transition-all"
              >
                <div className="min-w-0">
                  <p className="text-foreground truncate text-xs font-bold">{rec.title}</p>
                  {rec.subtitle && (
                    <p className="text-muted-foreground truncate text-[11px]">{rec.subtitle}</p>
                  )}
                </div>
                <ArrowUpRight className="text-muted-foreground h-3.5 w-3.5 shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </Card>
    );
  };

  const titleVal = getNestedValue(data, config.titleKey as string);
  const subtitleVal = config.subtitleKey
    ? getNestedValue(data, config.subtitleKey as string)
    : null;
  const statusVal = config.statusKey ? getNestedValue(data, config.statusKey as string) : null;
  const isFeaturedVal = config.isFeaturedKey
    ? getNestedValue(data, config.isFeaturedKey as string)
    : false;
  const HeaderIcon = config.headerIcon;

  return (
    <div className="w-full space-y-6 select-none">
      {/* Header Banner */}
      <div className="border-border/80 bg-card/60 flex flex-col gap-4 rounded-2xl border p-5 shadow-2xs backdrop-blur-md sm:flex-row sm:items-start sm:justify-between md:p-6">
        <div className="flex items-start gap-3.5">
          {HeaderIcon && (
            <div className="bg-primary/10 border-primary/20 text-primary shrink-0 rounded-xl border p-2.5">
              <HeaderIcon className="h-5 w-5" />
            </div>
          )}
          <div className="space-y-1">
            {config.eyebrow && (
              <p className="text-primary text-[10px] font-bold tracking-widest uppercase">
                <I18n>{config.eyebrow}</I18n>
              </p>
            )}
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
                {titleVal}
              </h1>
              {statusVal && (
                <Badge
                  variant={
                    statusVal === "PUBLISHED" || statusVal === "ACTIVE" ? "default" : "secondary"
                  }
                  className="rounded-md text-[10px] font-bold tracking-widest uppercase"
                >
                  {statusVal}
                </Badge>
              )}
              {isFeaturedVal && (
                <Badge className="border-warning/20 bg-warning/10 text-warning text-[10px] font-bold tracking-wider uppercase">
                  <Sparkles className="mr-1 h-3 w-3" />
                  Featured
                </Badge>
              )}
            </div>
            {subtitleVal && (
              <p className="text-muted-foreground max-w-2xl text-xs">{subtitleVal}</p>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {config.actions?.backHref && (
            <Link href={config.actions.backHref}>
              <Button
                variant="outline"
                size="sm"
                className="border-border/80 h-9 rounded-xl px-3 text-xs font-semibold"
              >
                <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                <I18n>Back</I18n>
              </Button>
            </Link>
          )}

          {config.actions?.editHref && (
            <Link href={config.actions.editHref}>
              <Button
                size="sm"
                className="bg-primary text-primary-foreground h-9 rounded-xl px-4 text-xs font-bold shadow-2xs"
              >
                <Pencil className="mr-1.5 h-3.5 w-3.5" />
                <I18n>Edit</I18n>
              </Button>
            </Link>
          )}

          {config.actions?.onDelete && (
            <Button
              variant="destructive"
              size="sm"
              onClick={config.actions.onDelete}
              disabled={config.actions.isDeleting}
              className="h-9 rounded-xl px-3 text-xs font-bold"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>

      {/* Grid Structure */}
      <div className="grid grid-cols-12 items-start gap-6">
        {/* Main Content Area */}
        <div className="col-span-12 space-y-6 lg:col-span-8">
          {config.mainSections.map((sec, i) => renderSection(sec, i))}
        </div>

        {/* Sidebar Area */}
        <div className="col-span-12 space-y-6 lg:col-span-4">
          {config.sidebarSections.map((sec, i) => renderSection(sec, i))}
          {config.relatedSections?.map((rel, i) => renderRelated(rel, i))}
        </div>
      </div>
    </div>
  );
}