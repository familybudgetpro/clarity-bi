import React from "react";
import { ChartProps } from "@/types/dashboard";

interface DealerTableProps {
  data: any[];
  onClick: (data: any) => void;
  selectedElement: string | null;
}

export function DealerTable({ data, onClick, selectedElement }: ChartProps) {
  return (
    <div className="h-full max-h-64 overflow-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
      <table className="w-full text-xs">
        <thead className="sticky top-0 bg-card z-10 shadow-sm">
          <tr className="border-b border-border">
            <th className="text-left py-2 px-3 font-bold text-muted-foreground bg-muted/20">
              Dealer
            </th>
            <th className="text-left py-2 px-3 font-bold text-muted-foreground bg-muted/20">
              Region
            </th>
            <th className="text-right py-2 px-3 font-bold text-muted-foreground bg-muted/20">
              Premium
            </th>
            <th className="text-right py-2 px-3 font-bold text-muted-foreground bg-muted/20">
              Claims
            </th>
            <th className="text-right py-2 px-3 font-bold text-muted-foreground bg-muted/20">
              Loss Ratio
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {data.map((d) => (
            <tr
              key={d.name}
              className={`hover:bg-accent/50 cursor-pointer transition-colors ${selectedElement === d.name ? "bg-accent text-accent-foreground" : "bg-card text-foreground"}`}
              onClick={() => onClick && onClick({ name: d.name })}
            >
              <td className="py-2.5 px-3 font-semibold">{d.name}</td>
              <td className="py-2.5 px-3">
                <span className="bg-muted px-2 py-0.5 rounded-full text-[10px] text-muted-foreground font-medium border border-border">
                  {d.region}
                </span>
              </td>
              <td className="py-2.5 px-3 text-right font-medium">
                ${((d.premium || 0) / 1000).toFixed(0)}k
              </td>
              <td className="py-2.5 px-3 text-right font-medium">
                ${((d.claims || 0) / 1000).toFixed(0)}k
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
                  {d.lossRatio}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
