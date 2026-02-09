import React from "react";
import { ChevronRight, X, Home } from "lucide-react";
import { useFilters } from "@/hooks/useFilters";

interface BreadcrumbsProps {
  filters: ReturnType<typeof useFilters>["filters"];
  clearFilter: ReturnType<typeof useFilters>["clearFilter"];
  clearAll: () => void;
}

export function Breadcrumbs({
  filters,
  clearFilter,
  clearAll,
}: BreadcrumbsProps) {
  const activeFilters = Object.entries(filters).filter(
    ([key, value]) => value !== "All" && !value.startsWith("All "), // Naive check for 'All Regions' etc.
  );

  if (activeFilters.length === 0) return null;

  return (
    <div className="flex items-center gap-2 p-2 bg-muted/40 border-b border-border text-xs overflow-x-auto">
      <button
        onClick={clearAll}
        className="flex items-center text-muted-foreground hover:text-foreground transition-colors p-1 rounded hover:bg-muted"
      >
        <Home size={14} />
      </button>

      {activeFilters.map(([key, value]) => (
        <div
          key={key}
          className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2"
        >
          <ChevronRight size={12} className="text-muted-foreground" />
          <div className="flex items-center gap-1 bg-background border border-border px-2 py-1 rounded-full shadow-sm text-foreground">
            <span className="font-semibold text-[10px] text-muted-foreground uppercase">
              {key}:
            </span>
            <span className="font-bold">{value}</span>
            <button
              onClick={() => clearFilter(key)}
              className="hover:text-destructive ml-1 transition-colors"
            >
              <X size={12} />
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={clearAll}
        className="ml-auto text-[10px] text-primary hover:underline px-2"
      >
        Clear All
      </button>
    </div>
  );
}
