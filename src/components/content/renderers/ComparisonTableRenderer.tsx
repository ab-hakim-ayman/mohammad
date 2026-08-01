import React from "react";
import I18n from "@/shared/components/I18n";

export function ComparisonTableRenderer({ block }: { block: any }) {
  let rows: any[] = [];
  try {
    rows = JSON.parse(block.props.rowsJson);
  } catch {
    return null;
  }
  const { leftHeader, rightHeader } = block.props;
  if (!rows.length) return null;

  return (
    <div className="not-prose bg-card border-border my-10 overflow-x-auto rounded-none sm:rounded-lg border p-6 shadow-xs transition-all duration-300 hover:shadow-md 3xl:my-12 5xl:my-16 3xl:p-8 5xl:p-10">
      <table className="border-border w-full min-w-[600px] border-collapse overflow-hidden rounded-xl border text-left shadow-xs">
        <thead>
          <tr className="bg-muted/50 border-border border-b">
            <th className="text-muted-foreground p-4 font-semibold">
              <I18n>Feature</I18n>
            </th>
            <th className="text-primary w-1/3 p-4 font-bold">{leftHeader}</th>
            <th className="text-foreground w-1/3 p-4 font-semibold">{rightHeader}</th>
          </tr>
        </thead>
        <tbody className="bg-card divide-border/50 divide-y">
          {rows.map((row, idx) => (
            <tr key={idx} className="hover:bg-muted/10 transition-colors">
              <td className="text-foreground p-4 text-sm font-medium">{row.feature}</td>
              <td className="text-foreground bg-primary/5 p-4 text-sm">{row.leftValue}</td>
              <td className="text-muted-foreground p-4 text-sm">{row.rightValue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
