import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import type { FilterState } from "@/types";
import { allMonths } from "@/data/mockData";

interface FilterContextValue {
  filters: FilterState;
  setDateRange: (start: string, end: string) => void;
  setTiers: (tiers: FilterState["selectedTiers"]) => void;
  resetFilters: () => void;
}

const defaultFilters: FilterState = {
  startMonth: allMonths[0],
  endMonth: allMonths[allMonths.length - 1],
  selectedTiers: ["Free", "Pro", "Enterprise"],
};

const FilterContext = createContext<FilterContextValue | null>(null);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

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
