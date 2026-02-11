import React from "react";
import { ChartProps } from "@/types/dashboard";

interface DealerTableProps {
  data: any[];
  onClick: (data: any) => void;
  selectedElement: string | null;
}

export function DealerTable({ data, onClick, selectedElement }: ChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">
        No dealer data available
      </div>
    );
  }

  const fmt = (n: number) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return n.toLocaleString();
  };

  // Use "dealer" or "name" key
  const nameKey = data[0] && "dealer" in data[0] ? "dealer" : "name";
  const hasClaims =
    data[0] && ("claims" in data[0] || "claimsCount" in data[0]);

  return (
    <div className="h-full max-h-64 overflow-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
      <table className="w-full text-xs">
        <thead className="sticky top-0 bg-card z-10 shadow-sm">
          <tr className="border-b border-border">
            <th className="text-left py-2 px-3 font-bold text-muted-foreground bg-muted/20">
              Dealer
            </th>
            <th className="text-right py-2 px-3 font-bold text-muted-foreground bg-muted/20">
              Premium
            </th>
            <th className="text-right py-2 px-3 font-bold text-muted-foreground bg-muted/20">
              Policies
            </th>
            {hasClaims && (
              <>
                <th className="text-right py-2 px-3 font-bold text-muted-foreground bg-muted/20">
                  Claims
                </th>
                <th className="text-right py-2 px-3 font-bold text-muted-foreground bg-muted/20">
                  Loss Ratio
                </th>
              </>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {data.map((d, i) => {
            const name = String(d[nameKey] || d.name || `Row ${i}`);
            const claims = d.claimsCount || d.claims || 0;
            return (
              <tr
                key={i}
                className={`hover:bg-accent/50 cursor-pointer transition-colors ${selectedElement === name ? "bg-accent text-accent-foreground" : "bg-card text-foreground"}`}
                onClick={() => onClick && onClick({ name, [nameKey]: name })}
              >
                <td className="py-2.5 px-3 font-semibold">{name}</td>
                <td className="py-2.5 px-3 text-right font-medium font-mono">
                  {fmt(d.premium || 0)}
                </td>
                <td className="py-2.5 px-3 text-right">
                  {(d.policies || d.count || 0).toLocaleString()}
                </td>
                {hasClaims && (
                  <>
                    <td className="py-2.5 px-3 text-right font-medium">
                      {typeof claims === "number"
                        ? claims.toLocaleString()
                        : fmt(Number(claims) || 0)}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          (d.lossRatio || 0) > 55
                            ? "bg-destructive/10 text-destructive"
                            : (d.lossRatio || 0) > 50
                              ? "bg-yellow-500/10 text-yellow-600"
                              : "bg-green-500/10 text-green-600"
                        }`}
                      >
                        {(d.lossRatio || 0).toFixed(1)}%
                      </span>
                    </td>
                  </>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
