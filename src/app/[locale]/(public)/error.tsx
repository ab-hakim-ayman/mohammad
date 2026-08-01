"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RotateCcw, Home } from "lucide-react";
import I18n from "@/shared/components/I18n";
import { Link } from "@/shared/i18n";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Public area routing boundary error caught:", error);
  }, [error]);

  return (
    <div className="container-custom mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[50vh] text-center space-y-6">
      <div className="bg-destructive/10 text-destructive border border-destructive/20 p-4 rounded-full">
        <AlertCircle className="h-10 w-10" />
      </div>

      <div className="max-w-md space-y-2">
        <h2 className="text-foreground text-2xl font-bold tracking-tight">
          <I18n>Something went wrong!</I18n>
        </h2>
        <p className="text-muted-foreground text-sm">
          <I18n>An error occurred while loading this section of the portal. Our telemetry has logged the event.</I18n>
        </p>
      </div>

      <div className="flex items-center gap-4 pt-2">
        <Button
          onClick={() => reset()}
          className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-6 py-2.5 text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
        >
          <RotateCcw className="h-4 w-4" />
          <I18n>Retry</I18n>
        </Button>
        <Link
          href="/"
          className="bg-surface-elevated border border-border hover:bg-card text-foreground inline-flex items-center gap-2 rounded-lg px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition-all"
        >
          <Home className="h-4 w-4 text-primary" />
          <I18n>Go Home</I18n>
        </Link>
      </div>
    </div>
  );
}
