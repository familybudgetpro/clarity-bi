import React from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { DashboardDataPoint } from "@/types/dashboard";

// Hardcoded chart colors for SVG compatibility
const CHART_COLORS = {
  blue: "#3b82f6",
  emerald: "#10b981",
  amber: "#f59e0b",
  violet: "#8b5cf6",
  pink: "#ec4899",
};

export function TrendChart({
  data,
  onClick,
  selectedElement,
}: {
  data: DashboardDataPoint[];
  onClick?: (data: any) => void;
  selectedElement?: string | null;
}) {
  return (
    <div className="h-full w-full" style={{ minHeight: 250 }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          onClick={(e: any) =>
            e && e.activePayload && onClick?.(e.activePayload[0].payload)
          }
          style={{ cursor: onClick ? "pointer" : "default" }}
        >
          <defs>
            <linearGradient id="premiumGrad" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={CHART_COLORS.blue}
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor={CHART_COLORS.blue}
                stopOpacity={0.1}
              />
            </linearGradient>
            <linearGradient id="claimsGrad" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={CHART_COLORS.amber}
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor={CHART_COLORS.amber}
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e2e8f0"
            vertical={false}
          />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "#64748b" }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "#64748b" }}
            tickFormatter={(v) => `$${v / 1000}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              borderColor: "#e2e8f0",
              borderRadius: "0.5rem",
              color: "#0f172a",
            }}
            itemStyle={{ color: "#0f172a" }}
            labelStyle={{ color: "#0f172a", fontWeight: "bold" }}
          />
          <Legend wrapperStyle={{ fontSize: 11, color: "#0f172a" }} />
          <Area
            type="monotone"
            dataKey="premium"
            name="Premium"
            fill="url(#premiumGrad)"
            stroke={CHART_COLORS.blue}
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="claims"
            name="Claims"
            fill="url(#claimsGrad)"
            stroke={CHART_COLORS.amber}
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="policies"
            name="Policies"
            stroke={CHART_COLORS.violet}
            strokeWidth={2}
            dot={{ r: 3, fill: CHART_COLORS.violet }}
            yAxisId={0}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
