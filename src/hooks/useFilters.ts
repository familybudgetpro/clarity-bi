import { useState, useCallback, useMemo } from "react";

export interface FilterState {
  dateRange: string;
  region: string;
  dealer: string;
  product: string;
  [key: string]: string; // Allow dynamic filters
}

const defaultFilters: FilterState = {
  dateRange: "All Time",
  region: "All Regions",
  dealer: "All Dealers",
  product: "All Products",
};

export function useFilters(initialFilters: FilterState = defaultFilters) {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [globalFilterContext, setGlobalFilterContext] = useState<
    Record<string, string[]>
  >({});

  const setFilter = useCallback((key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const clearFilter = useCallback((key: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: defaultFilters[key] || "All",
    }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters(defaultFilters);
    setGlobalFilterContext({});
  }, []);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    Object.keys(filters).forEach((key) => {
      if (filters[key] !== defaultFilters[key] && filters[key] !== "All") {
        count++;
      }
    });
    return count;
  }, [filters]);

  // For interactive "drill-down" context (e.g. clicking a chart bar)
  const addContextFilter = useCallback(
    (widgetId: string, filterKey: string, value: string) => {
      setGlobalFilterContext((prev) => ({
        ...prev,
        [widgetId]: [filterKey, value],
      }));
      // Also apply to main filters if applicable
      if (Object.keys(defaultFilters).includes(filterKey)) {
        setFilter(filterKey, value);
      }
    },
    [setFilter],
  );

  const removeContextFilter = useCallback((widgetId: string) => {
    setGlobalFilterContext((prev) => {
      const next = { ...prev };
      delete next[widgetId];
      return next;
    });
  }, []);

  return {
    filters,
    setFilter,
    clearFilter,
    clearAllFilters,
    activeFilterCount,
    globalFilterContext,
    addContextFilter,
    removeContextFilter,
  };
}
