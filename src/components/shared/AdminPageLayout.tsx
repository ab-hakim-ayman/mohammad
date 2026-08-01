"use client";
import React from "react";
import { Newspaper } from "lucide-react";
import { StateScreen } from "@/shared/components/StateScreen";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AdminPageLayoutProps {
  resourceTag?: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  toolbarActions?: React.ReactNode;
  isLoading?: boolean;
  error?: any;
  loadingTitle?: string;
  errorTitle?: string;
  children: React.ReactNode;
  pagination?: React.ReactNode;
}

export function AdminPageLayout({
  resourceTag = "Admin Resource",
  title,
  description,
  icon,
  toolbarActions,
  isLoading,
  error,
  loadingTitle = "Loading data...",
  errorTitle = "Unable to load resources",
  children,
  pagination,
}: AdminPageLayoutProps) {
  if (isLoading) {
    return <StateScreen state="loading" title={loadingTitle} compact />;
  }
  if (error) {
    return <StateScreen state="error" title={errorTitle} compact />;
  }

  return (
    <div className="ui-admin-page bg-background min-h-screen py-8 md:py-12 lg:py-16 3xl:py-20 5xl:py-24">
      <div className="container-custom mx-auto px-4 md:px-6">
        { }
        <div className="border-border mb-6 flex flex-col gap-4 border-b pb-6 md:mb-8 md:gap-5 lg:mb-10 lg:flex-row lg:items-end lg:justify-between lg:gap-6 3xl:mb-12 3xl:gap-7 5xl:mb-14 5xl:gap-8">
          <div className="flex items-start gap-4">
            <span className="bg-primary/10 text-primary border-primary/20 inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-md border shadow-xs">
              {icon}
            </span>
            <div>
              <p className="text-primary mb-1 text-xs font-bold tracking-[0.2em] uppercase">
                {resourceTag}
              </p>
              <h1 className="text-foreground text-3xl font-extrabold tracking-tight sm:text-4xl">
                {title}
              </h1>
              <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed">
                {description}
              </p>
            </div>
          </div>

          { }
          {toolbarActions && (
            <div className="flex w-full shrink-0 flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 md:gap-5 lg:w-auto lg:gap-6 3xl:gap-7 5xl:gap-8">
              {toolbarActions}
            </div>
          )}
        </div>

        { }
        <div className="transition-all duration-300">{children}</div>

        { }
        {pagination && <div className="mt-6 flex justify-end md:mt-8 3xl:mt-10 5xl:mt-12">{pagination}</div>}
      </div>
    </div>
  );
}
