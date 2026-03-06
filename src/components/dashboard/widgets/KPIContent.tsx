import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface KPIContentProps {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  color: string;
}

export function KPIContent({
  label,
  value,
  change,
  trend,
  color,
}: KPIContentProps) {
  return (
    <div className="flex flex-col h-full justify-center px-1">
      <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">
        {label}
      </p>
      <h2 className="text-lg font-bold mt-0.5 text-foreground tracking-tight">
        {value}
      </h2>
      <div className="flex items-center gap-1 mt-1.5">
        <span
          className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 ${trend === "up" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
        >
          {trend === "up" ? (
            <ArrowUpRight size={9} />
          ) : (
            <ArrowDownRight size={9} />
          )}
          {change}
        </span>
        <span className="text-[9px] text-muted-foreground">vs last month</span>
      </div>
      {/* Sparkline decoration */}
      <div className="mt-auto h-0.5 w-full rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: "65%", backgroundColor: color }}
        />
      </div>
    </div>
  );
}
