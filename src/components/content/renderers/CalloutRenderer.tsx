import React from "react";
import { Info, AlertTriangle, CheckCircle } from "lucide-react";
export function CalloutRenderer({ block }: { block: any }) {
  const { type, title, text } = block.props;
  const styles = {
    info: "bg-info-subtle border-info/30 text-info ",
    warning: "bg-warning/10 border-warning/30 text-warning",
    success: "bg-success/10 border-success/30 text-success",
  };
  const Icon = type === "info" ? Info : type === "warning" ? AlertTriangle : CheckCircle;
  const style = styles[type as keyof typeof styles] || styles.info;

  return (
    <div
      className={`not-prose my-8 flex gap-4 rounded-xl border p-6 ${style} bg-card shadow-xs transition-all duration-300 hover:shadow-md 3xl:my-10 5xl:my-12 3xl:p-8 5xl:p-10`}
    >
      <Icon className="mt-1 h-5 w-5 shrink-0" />
      <div className="flex-1 space-y-1">
        {title && <h4 className="font-semibold text-current">{title}</h4>}
        {text && (
          <p className="text-sm leading-relaxed whitespace-pre-wrap text-current/90">{text}</p>
        )}
      </div>
    </div>
  );
}
