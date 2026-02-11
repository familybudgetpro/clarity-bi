import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { ChartProps } from "@/types/dashboard";

// Hardcoded chart colors for SVG compatibility
const CHART_COLORS = {
  blue: "#3b82f6",
  amber: "#f59e0b",
  primary: "#4f46e5",
};

export function RegionChart({ data, onClick, selectedElement }: ChartProps) {
  // This chart displays dealer performance as horizontal bars
  // The data uses "name" or "dealer" as the key label
  const labelKey =
    data[0] && "dealer" in data[0]
      ? "dealer"
      : data[0] && "region" in data[0]
        ? "region"
        : "name";

  if (!data || data.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">
        No data available
      </div>
    );
  }

  return (
    <div className="h-full w-full" style={{ minHeight: 250 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" style={{ cursor: "pointer" }}>
          <CartesianGrid strokeDasharray="3 3" horizontal stroke="#e2e8f0" />
          <XAxis
            type="number"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: "#64748b" }}
            tickFormatter={(v) =>
              v >= 1_000_000
                ? `${(v / 1_000_000).toFixed(1)}M`
                : v >= 1_000
                  ? `${(v / 1_000).toFixed(0)}K`
                  : String(v)
            }
          />
          <YAxis
            type="category"
            dataKey={labelKey}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "#0f172a" }}
            width={90}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              borderColor: "#e2e8f0",
              borderRadius: "0.5rem",
              color: "#0f172a",
            }}
            cursor={{ fill: "#f1f5f9", opacity: 0.5 }}
            formatter={(v: any) => v.toLocaleString()}
          />
          <Bar
            dataKey="premium"
            name="Premium"
            fill={CHART_COLORS.blue}
            radius={[0, 4, 4, 0]}
            onClick={(data) => onClick && onClick(data as any)}
          >
            {data.map((entry, index) => {
              const key = (entry as any)[labelKey];
              return (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    selectedElement === key
                      ? CHART_COLORS.primary
                      : CHART_COLORS.blue
                  }
                  opacity={selectedElement && selectedElement !== key ? 0.3 : 1}
                  className="transition-all duration-300"
                />
              );
            })}
          </Bar>
          <Bar
            dataKey="claims"
            name="Claims"
            fill={CHART_COLORS.amber}
            radius={[0, 4, 4, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
