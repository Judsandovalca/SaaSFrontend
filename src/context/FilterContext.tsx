import { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { ReactNode } from "react";
import type { FilterState } from "@/types";
import { allMonths } from "@/data/mockData";

interface FilterContextValue {
  filters: FilterState;
  setDateRange: (start: string, end: string) => void;
  setTiers: (tiers: FilterState["selectedTiers"]) => void;
  resetFilters: () => void;
}

const ALL_TIERS: FilterState["selectedTiers"] = ["Free", "Pro", "Enterprise"];

const defaultFilters: FilterState = {
  startMonth: allMonths[0],
  endMonth: allMonths[allMonths.length - 1],
  selectedTiers: ALL_TIERS,
};

function readFiltersFromURL(): FilterState {
  const params = new URLSearchParams(window.location.search);

  const start = params.get("from");
  const end = params.get("to");
  const tiers = params.get("tiers");

  const startMonth =
    start && allMonths.includes(start) ? start : defaultFilters.startMonth;
  const endMonth =
    end && allMonths.includes(end) ? end : defaultFilters.endMonth;

  let selectedTiers = defaultFilters.selectedTiers;
  if (tiers) {
    const parsed = tiers.split(",").filter((t): t is "Free" | "Pro" | "Enterprise" =>
      ALL_TIERS.includes(t as "Free" | "Pro" | "Enterprise")
    );
    if (parsed.length > 0) selectedTiers = parsed;
  }

  return { startMonth, endMonth, selectedTiers };
}

function writeFiltersToURL(filters: FilterState) {
  const params = new URLSearchParams();

  const isDefault =
    filters.startMonth === defaultFilters.startMonth &&
    filters.endMonth === defaultFilters.endMonth &&
    filters.selectedTiers.length === ALL_TIERS.length;

  if (!isDefault) {
    params.set("from", filters.startMonth);
    params.set("to", filters.endMonth);
    if (filters.selectedTiers.length < ALL_TIERS.length) {
      params.set("tiers", filters.selectedTiers.join(","));
    }
  }

  const search = params.toString();
  const url = search ? `${window.location.pathname}?${search}` : window.location.pathname;
  window.history.replaceState(null, "", url);
}

const FilterContext = createContext<FilterContextValue | null>(null);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(readFiltersFromURL);

  useEffect(() => {
    writeFiltersToURL(filters);
  }, [filters]);

  const setDateRange = useCallback((start: string, end: string) => {
    setFilters((prev) => ({ ...prev, startMonth: start, endMonth: end }));
  }, []);

  const setTiers = useCallback((tiers: FilterState["selectedTiers"]) => {
    setFilters((prev) => ({ ...prev, selectedTiers: tiers }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  return (
    <FilterContext.Provider value={{ filters, setDateRange, setTiers, resetFilters }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters(): FilterContextValue {
  const ctx = useContext(FilterContext);
  if (!ctx) {
    throw new Error("useFilters must be used within a FilterProvider");
  }
  return ctx;
}
