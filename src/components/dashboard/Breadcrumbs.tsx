import React from "react";
import { ChevronRight, X, Home } from "lucide-react";
import { useFilters } from "@/hooks/useFilters";

interface BreadcrumbsProps {
  filters: ReturnType<typeof useFilters>["filters"];
  clearFilter: ReturnType<typeof useFilters>["clearFilter"];
  clearAll: () => void;
}

/** Format ISO date string to readable "Jan 1, 2021" */
function formatFilterValue(key: string, value: string): string {
  if ((key === "date_from" || key === "date_to") && /^\d{4}-\d{2}-\d{2}/.test(value)) {
    try {
      return new Date(value + "T00:00:00").toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return value;
    }
  }
  return value;
}

/** Human-readable label for filter keys */
function filterLabel(key: string): string {
  const labels: Record<string, string> = {
    date_from: "From",
    date_to: "To",
    dealer: "Dealer",
    product: "Product",
    year: "Year",
    month: "Month",
    make: "Make",
    search: "Search",
    claim_status: "Status",
  };
  return labels[key] ?? key;
}

export function Breadcrumbs({
  filters,
  clearFilter,
  clearAll,
}: BreadcrumbsProps) {
  const activeFilters = Object.entries(filters).filter(
    ([, value]) =>
      value !== undefined &&
      value !== "" &&
      value !== "All" &&
      !value.startsWith("All "),
  );

  if (activeFilters.length === 0) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/40 border-b border-border text-xs overflow-x-auto">
      <button
        onClick={clearAll}
        className="flex items-center text-muted-foreground hover:text-foreground transition-colors p-1 rounded hover:bg-muted shrink-0"
        title="Clear all filters"
      >
        <Home size={13} />
      </button>

      {activeFilters.map(([key, value]) => (
        <div
          key={key}
          className="flex items-center gap-1.5 animate-in fade-in slide-in-from-left-2 shrink-0"
        >
          <ChevronRight size={11} className="text-muted-foreground shrink-0" />
          <div className="flex items-center gap-1 bg-background border border-border px-2 py-0.5 rounded-full shadow-sm text-foreground">
            <span className="font-semibold text-[10px] text-muted-foreground uppercase tracking-wide">
              {filterLabel(key)}:
            </span>
            <span className="font-bold text-[11px]">
              {formatFilterValue(key, value!)}
            </span>
            <button
              onClick={() => clearFilter(key)}
              className="hover:text-destructive ml-0.5 transition-colors"
              title={`Remove ${filterLabel(key)} filter`}
            >
              <X size={11} />
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={clearAll}
        className="ml-auto text-[10px] text-primary hover:underline px-2 shrink-0"
      >
        Clear All
      </button>
    </div>
  );
}
