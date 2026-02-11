import { useState, useCallback, useMemo } from "react";

export interface FilterState {
  dealer: string;
  product: string;
  year: string;
  month: string;
  make: string;
  date_from: string;
  date_to: string;
  search: string;
  claim_status: string;
  [key: string]: string;
}

const defaultFilters: FilterState = {
  dealer: "All",
  product: "All",
  year: "All",
  month: "All",
  make: "All",
  date_from: "",
  date_to: "",
  search: "",
  claim_status: "All",
};

export function useFilters(initialFilters: FilterState = defaultFilters) {
  // Staged filters (what user sees while editing)
  const [staged, setStaged] = useState<FilterState>(initialFilters);
  // Applied filters (what actually drives data fetching)
  const [applied, setApplied] = useState<FilterState>(initialFilters);

  const setStagedFilter = useCallback((key: string, value: string) => {
    setStaged((prev) => ({ ...prev, [key]: value }));
  }, []);

  const applyFilters = useCallback(() => {
    setApplied({ ...staged });
  }, [staged]);

  const clearFilter = useCallback((key: string) => {
    const val = defaultFilters[key] || "All";
    setStaged((prev) => ({ ...prev, [key]: val }));
    setApplied((prev) => ({ ...prev, [key]: val }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setStaged(defaultFilters);
    setApplied(defaultFilters);
  }, []);

  // Programmatic filter application (from AI commands)
  const applyFiltersDirectly = useCallback(
    (newFilters: Partial<FilterState>) => {
      const safeFilters: Record<string, string> = {};
      for (const [k, v] of Object.entries(newFilters)) {
        if (v !== undefined) safeFilters[k] = v;
      }
      setStaged((prev) => {
        const merged: FilterState = { ...prev, ...safeFilters };
        setApplied(merged);
        return merged;
      });
    },
    [],
  );

  const stagedFilterCount = useMemo(() => {
    let count = 0;
    Object.keys(staged).forEach((key) => {
      const val = staged[key];
      if (val && val !== defaultFilters[key] && val !== "All" && val !== "")
        count++;
    });
    return count;
  }, [staged]);

  const appliedFilterCount = useMemo(() => {
    let count = 0;
    Object.keys(applied).forEach((key) => {
      const val = applied[key];
      if (val && val !== defaultFilters[key] && val !== "All" && val !== "")
        count++;
    });
    return count;
  }, [applied]);

  const hasUnappliedChanges = useMemo(() => {
    return JSON.stringify(staged) !== JSON.stringify(applied);
  }, [staged, applied]);

  return {
    filters: applied, // for data fetching
    staged, // for filter panel UI
    setStagedFilter,
    applyFilters,
    clearFilter,
    clearAllFilters,
    applyFiltersDirectly,
    stagedFilterCount,
    appliedFilterCount,
    hasUnappliedChanges,
  };
}
