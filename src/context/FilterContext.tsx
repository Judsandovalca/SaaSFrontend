import { createContext, useContext, useReducer, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import type { FilterState } from "@/types";
import { allMonths } from "@/data/mockData";

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------
type FilterAction =
  | { type: "SET_DATE_RANGE"; start: string; end: string }
  | { type: "SET_TIERS"; tiers: FilterState["selectedTiers"] }
  | { type: "TOGGLE_COMPARE" }
  | { type: "RESET" };

// ---------------------------------------------------------------------------
// Defaults
// ---------------------------------------------------------------------------
const ALL_TIERS: FilterState["selectedTiers"] = ["Free", "Pro", "Enterprise"];

const defaultFilters: FilterState = {
  startMonth: allMonths[0],
  endMonth: allMonths[allMonths.length - 1],
  selectedTiers: ALL_TIERS,
  compareMode: false,
};

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------
function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case "SET_DATE_RANGE":
      return { ...state, startMonth: action.start, endMonth: action.end };
    case "SET_TIERS":
      return { ...state, selectedTiers: action.tiers };
    case "TOGGLE_COMPARE":
      return { ...state, compareMode: !state.compareMode };
    case "RESET":
      return defaultFilters;
  }
}

// ---------------------------------------------------------------------------
// URL persistence
// ---------------------------------------------------------------------------
function readFiltersFromURL(): FilterState {
  const params = new URLSearchParams(window.location.search);

  const start = params.get("from");
  const end = params.get("to");
  const tiers = params.get("tiers");
  const compare = params.get("compare");

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

  return { startMonth, endMonth, selectedTiers, compareMode: compare === "1" };
}

function writeFiltersToURL(filters: FilterState) {
  const params = new URLSearchParams();

  const isDefault =
    filters.startMonth === defaultFilters.startMonth &&
    filters.endMonth === defaultFilters.endMonth &&
    filters.selectedTiers.length === ALL_TIERS.length &&
    !filters.compareMode;

  if (!isDefault) {
    params.set("from", filters.startMonth);
    params.set("to", filters.endMonth);
    if (filters.selectedTiers.length < ALL_TIERS.length) {
      params.set("tiers", filters.selectedTiers.join(","));
    }
    if (filters.compareMode) {
      params.set("compare", "1");
    }
  }

  const search = params.toString();
  const url = search ? `${window.location.pathname}?${search}` : window.location.pathname;
  window.history.replaceState(null, "", url);
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------
interface FilterContextValue {
  filters: FilterState;
  setDateRange: (start: string, end: string) => void;
  setTiers: (tiers: FilterState["selectedTiers"]) => void;
  toggleCompare: () => void;
  resetFilters: () => void;
}

const FilterContext = createContext<FilterContextValue | null>(null);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, dispatch] = useReducer(filterReducer, undefined, readFiltersFromURL);

  useEffect(() => {
    writeFiltersToURL(filters);
  }, [filters]);

  const setDateRange = useCallback((start: string, end: string) => {
    dispatch({ type: "SET_DATE_RANGE", start, end });
  }, []);

  const setTiers = useCallback((tiers: FilterState["selectedTiers"]) => {
    dispatch({ type: "SET_TIERS", tiers });
  }, []);

  const toggleCompare = useCallback(() => {
    dispatch({ type: "TOGGLE_COMPARE" });
  }, []);

  const resetFilters = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  return (
    <FilterContext.Provider value={{ filters, setDateRange, setTiers, toggleCompare, resetFilters }}>
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
